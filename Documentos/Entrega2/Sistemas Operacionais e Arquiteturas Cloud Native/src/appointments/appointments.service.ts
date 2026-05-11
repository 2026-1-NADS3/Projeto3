import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In, LessThan, MoreThanOrEqual } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RequestAppointmentDto } from './dto/request-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Patient } from '../patients/entities/patient.entity';
import { User } from '../auth/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { NotificationsService } from '../notifications/notifications.service';
import { clampPagination } from '../common/pagination.util';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async findAll(page = 1, pageSize = 50, startDate?: string, endDate?: string) {
    const clamped = clampPagination(page, pageSize);
    const where =
      startDate && endDate
        ? { dateTime: Between(new Date(startDate), new Date(endDate)) }
        : {};

    const [data, total] = await this.appointmentRepo.findAndCount({
      where,
      relations: ['patient'],
      order: { dateTime: 'ASC' },
      skip: (clamped.page - 1) * clamped.pageSize,
      take: clamped.pageSize,
    });
    return {
      data,
      total,
      page: clamped.page,
      pageSize: clamped.pageSize,
      totalPages: Math.ceil(total / clamped.pageSize),
    };
  }

  async findByPatient(patientId: string) {
    return this.appointmentRepo.find({
      where: { patientId },
      order: { dateTime: 'ASC' },
    });
  }

  async findByPatientPaginated(patientId: string, page = 1, pageSize = 20) {
    const clamped = clampPagination(page, pageSize);
    const [data, total] = await this.appointmentRepo.findAndCount({
      where: { patientId },
      order: { dateTime: 'ASC' },
      skip: (clamped.page - 1) * clamped.pageSize,
      take: clamped.pageSize,
    });

    return {
      data,
      total,
      page: clamped.page,
      pageSize: clamped.pageSize,
      totalPages: Math.ceil(total / clamped.pageSize),
    };
  }

  async findByUser(
    user: User,
    filter: 'upcoming' | 'history' | 'all' = 'all',
    page = 1,
    pageSize = 20,
  ) {
    const patient = await this.patientRepo.findOneBy({ userId: user.id });
    if (!patient)
      throw new NotFoundException('Paciente não encontrado para este usuário');

    const now = new Date();
    const where: any = { patientId: patient.id };
    if (filter === 'upcoming') {
      where.dateTime = MoreThanOrEqual(now);
      where.status = In([
        AppointmentStatus.PENDING,
        AppointmentStatus.CONFIRMED,
      ]);
    }
    if (filter === 'history') {
      where.dateTime = LessThan(now);
    }

    const clamped = clampPagination(page, pageSize);
    const [data, total] = await this.appointmentRepo.findAndCount({
      where,
      order: { dateTime: filter === 'history' ? 'DESC' : 'ASC' },
      skip: (clamped.page - 1) * clamped.pageSize,
      take: clamped.pageSize,
    });

    return {
      data,
      total,
      page: clamped.page,
      pageSize: clamped.pageSize,
      totalPages: Math.ceil(total / clamped.pageSize),
    };
  }

  async findUpcomingByUser(user: User, limit = 3) {
    const patient = await this.patientRepo.findOneBy({ userId: user.id });
    if (!patient)
      throw new NotFoundException('Paciente não encontrado para este usuário');

    return this.appointmentRepo.find({
      where: {
        patientId: patient.id,
        dateTime: MoreThanOrEqual(new Date()),
        status: In([AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]),
      },
      order: { dateTime: 'ASC' },
      take: Math.min(Math.max(Number(limit) || 3, 1), 10),
    });
  }

  async getAvailability(month: string) {
    const { start, end } = this.parseMonthRange(month);
    const appointments = await this.appointmentRepo.find({
      where: {
        dateTime: Between(start, end),
        status: In([AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]),
      },
      order: { dateTime: 'ASC' },
    });

    const reserved = appointments.map((appointment) => ({
      id: appointment.id,
      dateTime: appointment.dateTime,
      status: appointment.status,
    }));

    return {
      month,
      workingHours: [
        '07:50',
        '08:30',
        '10:50',
        '11:30',
        '14:00',
        '15:00',
        '16:30',
        '17:40',
      ],
      reserved,
    };
  }

  private async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!appointment) throw new NotFoundException('Agendamento não encontrado');
    return appointment;
  }

  async findOneSecure(id: string, user: User): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (user.role === UserRole.PATIENT) {
      const patient = await this.patientRepo.findOneBy({ userId: user.id });
      if (!patient || appointment.patientId !== patient.id) {
        throw new ForbiddenException(
          'Sem permissão para acessar este agendamento',
        );
      }
    }

    return appointment;
  }

  async findToday() {
    const today = new Date();
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0,
    );
    const end = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
    );

    return this.appointmentRepo.find({
      where: { dateTime: Between(start, end) },
      relations: ['patient'],
      order: { dateTime: 'ASC' },
    });
  }

  async findNext() {
    const now = new Date();
    const appointments = await this.appointmentRepo.find({
      where: {
        dateTime: MoreThanOrEqual(now),
        status: AppointmentStatus.CONFIRMED,
      },
      relations: ['patient'],
      order: { dateTime: 'ASC' },
      take: 1,
    });
    return appointments[0] || null;
  }

  async getSatisfactionSummary() {
    const completed = await this.appointmentRepo.find({
      where: { status: AppointmentStatus.COMPLETED },
    });

    const withRating = completed.filter((a) => a.satisfactionRating);
    if (withRating.length === 0)
      return { average: null, total: 0, percentage: 0 };

    const positive = withRating.filter(
      (a) =>
        a.satisfactionRating === 'BEM' || a.satisfactionRating === 'SUPER_BEM',
    ).length;

    const percentage = Math.round((positive / withRating.length) * 100);
    const mostCommon = withRating
      .map((a) => a.satisfactionRating)
      .sort(
        (a, b) =>
          withRating.filter((x) => x.satisfactionRating === b).length -
          withRating.filter((x) => x.satisfactionRating === a).length,
      )[0];

    return { mostCommon, total: withRating.length, percentage };
  }

  async create(
    dto: CreateAppointmentDto,
    professionalId: string,
  ): Promise<Appointment> {
    if (!dto.patientId) {
      throw new BadRequestException('patientId é obrigatório');
    }

    const patient = await this.patientRepo.findOneBy({ id: dto.patientId });
    if (!patient) throw new NotFoundException('Paciente não encontrado');

    const appointment = this.appointmentRepo.create({
      ...dto,
      durationMinutes: dto.durationMinutes ?? 50,
      bufferMinutes: dto.bufferMinutes ?? 15,
      professionalId,
    });
    const saved = await this.appointmentRepo.save(appointment);

    if (patient.userId) {
      void this.notificationsService
        .sendPushNotification(
          patient.userId,
          'Consulta agendada',
          `Sua consulta foi agendada para ${saved.dateTime.toLocaleString('pt-BR')}.`,
          { type: 'appointment', appointmentId: saved.id },
        )
        .catch(() => undefined);
    }

    return saved;
  }

  async requestByUser(
    dto: RequestAppointmentDto,
    user: User,
  ): Promise<Appointment> {
    const patient = await this.patientRepo.findOneBy({ userId: user.id });
    if (!patient)
      throw new NotFoundException('Paciente não encontrado para este usuário');

    const appointment = this.appointmentRepo.create({
      patientId: patient.id,
      dateTime: new Date(dto.dateTime),
      durationMinutes: dto.durationMinutes ?? 50,
      bufferMinutes: 15,
      type: dto.type,
      status: AppointmentStatus.PENDING,
      notes: dto.notes,
    });

    const saved = await this.appointmentRepo.save(appointment);

    void this.notificationsService
      .sendPushToRole(
        UserRole.ADMIN,
        'Nova solicitação de sessão',
        `${patient.fullName} solicitou uma sessão para ${saved.dateTime.toLocaleString('pt-BR')}.`,
        { type: 'appointment_request', appointmentId: saved.id },
      )
      .catch(() => undefined);

    return saved;
  }

  async getPendingRequests() {
    const appointments = await this.appointmentRepo.find({
      where: { status: AppointmentStatus.PENDING },
      relations: ['patient'],
      order: { dateTime: 'ASC' },
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      type: 'APPOINTMENT_REQUEST',
      createdAt: appointment.createdAt,
      appointment: {
        id: appointment.id,
        patientId: appointment.patientId,
        patientName: appointment.patient?.fullName || 'Paciente',
        dateTime: appointment.dateTime,
        type: appointment.type,
        status: appointment.status,
      },
    }));
  }

  async getAvailabilityByDate(date: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) {
      throw new BadRequestException('Informe date no formato YYYY-MM-DD');
    }

    const openHour = 8;
    const closeHour = 18;

    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59`);

    const appointments = await this.appointmentRepo.find({
      where: {
        dateTime: Between(start, end),
        status: In([AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING]),
      },
    });

    const occupiedByHour = new Map<number, string | null>();
    for (const appt of appointments) {
      const hour = new Date(appt.dateTime).getHours();
      occupiedByHour.set(hour, appt.id);
    }

    const slots = [];
    let occupiedSlots = 0;

    for (let h = openHour; h < closeHour; h++) {
      const time = `${String(h).padStart(2, '0')}:00`;
      const appointmentId = occupiedByHour.get(h) || null;
      const available = !occupiedByHour.has(h);
      if (!available) occupiedSlots++;
      slots.push({ time, available, appointmentId });
    }

    const totalSlots = closeHour - openHour;
    const availableSlots = totalSlots - occupiedSlots;
    const isFull = occupiedSlots >= totalSlots;

    return {
      date,
      availableSlots,
      occupiedSlots,
      isFull,
      operatingHours: { open: '08:00', close: '18:00' },
      slots,
    };
  }

  async update(id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    Object.assign(appointment, dto);
    return this.appointmentRepo.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepo.remove(appointment);
  }

  private parseMonthRange(month: string) {
    if (!/^\d{4}-\d{2}$/.test(month || '')) {
      throw new BadRequestException('Informe month no formato YYYY-MM');
    }

    const [year, monthIndex] = month.split('-').map(Number);
    const start = new Date(year, monthIndex - 1, 1, 0, 0, 0, 0);
    const end = new Date(year, monthIndex, 0, 23, 59, 59, 999);
    return { start, end };
  }
}
