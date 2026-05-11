import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { Patient } from './entities/patient.entity';
import { User } from '../auth/entities/user.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientStatus } from '../common/enums/patient-status.enum';
import { UserRole } from '../common/enums/user-role.enum';
import { MailService } from '../common/mail/mail.service';
import { NotificationsService } from '../notifications/notifications.service';
import { clampPagination } from '../common/pagination.util';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  private async findUserByEmailInsensitive(email: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .where('LOWER(user.email) = :email', { email: email.toLowerCase() })
      .getOne();
  }

  async findAll(
    page = 1,
    pageSize = 10,
    search?: string,
    status?: PatientStatus,
    sortBy = 'fullName',
    sortOrder: string = 'ASC',
  ) {
    const clamped = clampPagination(page, pageSize);
    const query = this.patientRepo.createQueryBuilder('patient');

    if (status) {
      query.andWhere('patient.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(patient.fullName ILIKE :search OR patient.email ILIKE :search OR patient.cpf LIKE :searchExact)',
        { search: `%${search}%`, searchExact: `%${search}%` },
      );
    }

    const allowedSortFields = ['fullName', 'email', 'createdAt', 'status'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'fullName';
    query.orderBy(
      `patient.${safeSortBy}`,
      sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
    );

    const total = await query.getCount();
    const data = await query
      .skip((clamped.page - 1) * clamped.pageSize)
      .take(clamped.pageSize)
      .getMany();

    return {
      data,
      total,
      page: clamped.page,
      pageSize: clamped.pageSize,
      totalPages: Math.ceil(total / clamped.pageSize),
    };
  }

  private async findOne(
    id: string,
    relations: string[] = [],
  ): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { id },
      relations,
    });
    if (!patient) throw new NotFoundException('Paciente não encontrado');
    return patient;
  }

  async findOneSecure(id: string, requestingUser: User): Promise<Patient> {
    // Busca paciente com prescrições e check-ins usando LEFT JOIN para evitar N+1 queries
    const patient = await this.patientRepo
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.prescriptions', 'prescription')
      .leftJoinAndSelect('patient.checkIns', 'checkIn')
      .where('patient.id = :id', { id })
      .getOne();

    if (!patient) throw new NotFoundException('Paciente não encontrado');

    if (
      requestingUser.role === UserRole.PATIENT &&
      patient.userId !== requestingUser.id
    ) {
      throw new ForbiddenException('Sem permissão para acessar este paciente');
    }

    return patient;
  }

  async findByUserId(userId: string): Promise<Patient> {
    const patient = await this.patientRepo.findOneBy({ userId });
    if (!patient)
      throw new NotFoundException('Paciente não encontrado para este usuário');
    return patient;
  }

  async create(dto: CreatePatientDto): Promise<Patient> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    let user = await this.findUserByEmailInsensitive(normalizedEmail);
    const cleanCpf = dto.cpf.replace(/\D/g, '');

    if (!user) {
      const hashedPassword = await bcrypt.hash(cleanCpf, 10);

      user = this.userRepo.create({
        name: dto.fullName,
        email: normalizedEmail,
        password: hashedPassword,
        role: UserRole.PATIENT,
        mustChangePassword: true,
      });
      user = await this.userRepo.save(user);
      await this.mailService.sendPatientCredentials(
        user.email,
        user.name,
        cleanCpf,
      );
    }

    const patient = this.patientRepo.create({
      ...dto,
      email: normalizedEmail,
      cpf: cleanCpf,
      userId: user.id,
    });

    return this.patientRepo.save(patient);
  }

  async update(id: string, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    const normalizedEmail = dto.email?.trim().toLowerCase();
    const normalizedCpf = dto.cpf?.replace(/\D/g, '');

    if (!patient.userId) {
      const fallbackEmail =
        normalizedEmail ?? patient.email.trim().toLowerCase();
      let user = await this.findUserByEmailInsensitive(fallbackEmail);

      if (!user) {
        const cleanCpf = normalizedCpf ?? patient.cpf.replace(/\D/g, '');
        const hashedPassword = await bcrypt.hash(cleanCpf, 10);
        user = this.userRepo.create({
          name: dto.fullName || patient.fullName,
          email: fallbackEmail,
          password: hashedPassword,
          role: UserRole.PATIENT,
          mustChangePassword: true,
        });
        user = await this.userRepo.save(user);
        await this.mailService.sendPatientCredentials(
          user.email,
          user.name,
          cleanCpf,
        );
      }

      patient.userId = user.id;
    }

    Object.assign(patient, {
      ...dto,
      ...(normalizedEmail ? { email: normalizedEmail } : {}),
      ...(normalizedCpf ? { cpf: normalizedCpf } : {}),
    });
    const saved = await this.patientRepo.save(patient);
    await this.syncUserFromPatient(saved);
    return saved;
  }

  async updateByUserId(
    userId: string,
    dto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.findByUserId(userId);
    const normalizedEmail = dto.email?.trim().toLowerCase();
    const normalizedCpf = dto.cpf?.replace(/\D/g, '');
    const allowed: UpdatePatientDto = {
      fullName: dto.fullName,
      email: normalizedEmail,
      phone: dto.phone,
      birthDate: dto.birthDate,
      cpf: normalizedCpf,
      notes: dto.notes,
    };
    Object.assign(patient, allowed);
    const saved = await this.patientRepo.save(patient);
    await this.syncUserFromPatient(saved);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepo.remove(patient);
  }

  async sendReminder(
    id: string,
    notificationsService: NotificationsService,
  ): Promise<{ sent: boolean; message: string }> {
    const patient = await this.findOne(id);

    if (!patient.userId) {
      this.logger.log(
        `Lembrete solicitado para paciente ${id}, mas sem usuário vinculado.`,
      );
      return {
        sent: false,
        message:
          'Paciente não possui conta de usuário vinculada. Lembrete registrado, mas envio não foi possível.',
      };
    }

    const sent = await notificationsService.sendPushNotification(
      patient.userId,
      'Lembrete da clínica',
      `Olá ${patient.fullName}! Este é um lembrete da Clínica Maya Yamamoto.`,
      { type: 'manual_reminder', patientId: patient.id },
    );

    if (sent) {
      return {
        sent: true,
        message: 'Lembrete enviado com sucesso via notificação push.',
      };
    }

    this.logger.log(
      `Lembrete solicitado para paciente ${id}, mas push falhou (sem token FCM ou configuração).`,
    );
    return {
      sent: false,
      message:
        'Solicitação de lembrete registrada. Envio externo ainda não configurado.',
    };
  }

  private async syncUserFromPatient(patient: Patient) {
    if (!patient.userId) return;
    const user = await this.userRepo.findOneBy({ id: patient.userId });
    if (!user) return;

    user.name = patient.fullName;
    user.email = patient.email.trim().toLowerCase();
    await this.userRepo.save(user);
  }
}
