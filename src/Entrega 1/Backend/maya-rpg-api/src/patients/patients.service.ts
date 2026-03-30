import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Patient } from './entities/patient.entity';
import { User } from '../auth/entities/user.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientStatus } from '../common/enums/patient-status.enum';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(
    page = 1,
    pageSize = 10,
    search?: string,
    status?: PatientStatus,
    sortBy = 'fullName',
    sortOrder: string = 'ASC',
  ) {
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
    query.orderBy(`patient.${safeSortBy}`, sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');

    const total = await query.getCount();
    const data = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepo.findOneBy({ id });
    if (!patient) throw new NotFoundException('Paciente não encontrado');
    return patient;
  }

  async findByUserId(userId: string): Promise<Patient> {
    const patient = await this.patientRepo.findOneBy({ userId });
    if (!patient) throw new NotFoundException('Paciente não encontrado para este usuário');
    return patient;
  }

  async create(dto: CreatePatientDto, professionalId: string): Promise<Patient> {
    // Cria o User para o paciente poder fazer login no app
    let user = await this.userRepo.findOneBy({ email: dto.email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(dto.cpf, 10);
      user = this.userRepo.create({
        name: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        role: UserRole.PATIENT,
      });
      user = await this.userRepo.save(user);
    }

    const patient = this.patientRepo.create({
      ...dto,
      userId: user.id,
      lgpdConsentAt: dto.lgpdConsentAt ?? undefined,
    });

    return this.patientRepo.save(patient);
  }

  async update(id: string, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);

    if (!patient.userId) {
      let user = await this.userRepo.findOneBy({ email: dto.email || patient.email });

      if (!user) {
        const hashedPassword = await bcrypt.hash((dto.cpf || patient.cpf), 10);
        user = this.userRepo.create({
          name: dto.fullName || patient.fullName,
          email: dto.email || patient.email,
          password: hashedPassword,
          role: UserRole.PATIENT,
        });
        user = await this.userRepo.save(user);
      }

      patient.userId = user.id;
    }

    Object.assign(patient, dto);
    return this.patientRepo.save(patient);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepo.remove(patient);
  }
}