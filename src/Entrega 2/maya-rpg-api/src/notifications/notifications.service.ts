import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { Appointment } from '../appointments/entities/appointment.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { Notification, NotificationType } from './entities/notification.entity';
import { clampPagination } from '../common/pagination.util';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepo: Repository<Prescription>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly config: ConfigService,
  ) {}

  async create(
    userId: string,
    title: string,
    body: string,
    type: NotificationType,
    data?: Record<string, unknown>,
  ): Promise<Notification> {
    const notification = this.notificationRepo.create({
      userId,
      title,
      body,
      type,
      data: data || null,
    });
    return this.notificationRepo.save(notification);
  }

  async findByUser(
    userId: string,
    page: number = 1,
    pageSize: number = 20,
  ): Promise<{
    data: Notification[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }> {
    const clamped = clampPagination(page, pageSize);
    const [data, total] = await this.notificationRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
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

  async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { id: notificationId, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada.');
    }

    notification.isRead = true;
    return this.notificationRepo.save(notification);
  }

  async markAllAsRead(userId: string): Promise<{ affected: number }> {
    const result = await this.notificationRepo.update(
      { userId, isRead: false },
      { isRead: true },
    );
    return { affected: result.affected || 0 };
  }

  async getUnreadCount(userId: string): Promise<{ count: number }> {
    const count = await this.notificationRepo.count({
      where: { userId, isRead: false },
    });
    return { count };
  }

  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data: Record<string, unknown> = {},
  ): Promise<boolean> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'fcmToken'],
    });

    if (!user?.fcmToken) {
      this.logger.warn(`Usuário ${userId} não possui token FCM cadastrado.`);
      return false;
    }

    const serverKey =
      this.config.get<string>('FCM_SERVER_KEY') ||
      this.config.get<string>('FIREBASE_SERVER_KEY');

    if (!serverKey) {
      this.logger.warn('Push não enviado: configure FCM_SERVER_KEY.');
      return false;
    }

    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        Authorization: `key=${serverKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user.fcmToken,
        notification: { title, body },
        data: this.normalizeData(data),
      }),
    }).catch((error) => {
      this.logger.error('Falha de rede ao enviar FCM', error);
      return null;
    });

    if (!response) return false;

    if (!response.ok) {
      const details = await response.text().catch(() => '');
      this.logger.error(`Falha ao enviar FCM: ${response.status} ${details}`);
      return false;
    }

    return true;
  }

  async sendPushAndPersist(
    userId: string,
    title: string,
    body: string,
    type: NotificationType,
    data: Record<string, unknown> = {},
  ): Promise<Notification> {
    await this.sendPushNotification(userId, title, body, data);
    return this.create(userId, title, body, type, data);
  }

  async sendPushToRole(
    role: UserRole,
    title: string,
    body: string,
    data: Record<string, unknown> = {},
  ): Promise<number> {
    const users = await this.userRepo.find({
      where: { role, isActive: true },
      select: ['id'],
    });

    let sent = 0;
    for (const user of users) {
      const ok = await this.sendPushNotification(user.id, title, body, data);
      if (ok) sent++;
    }

    return sent;
  }

  async sendDailyReminders(): Promise<void> {
    const activePrescriptions = await this.prescriptionRepo.find({
      where: { isActive: true },
      select: ['patientId'],
    });
    const patientIds = Array.from(
      new Set(
        activePrescriptions.map((prescription) => prescription.patientId),
      ),
    );

    if (patientIds.length === 0) {
      this.logger.log('Nenhum paciente com prescrição ativa para lembrar.');
      return;
    }

    const patients = await this.patientRepo.find({
      where: patientIds.map((id) => ({ id })),
      select: ['id', 'userId', 'fullName'],
    });

    let notified = 0;
    for (const patient of patients) {
      if (!patient.userId) continue;
      await this.sendPushAndPersist(
        patient.userId,
        'Hora do seu RPG',
        'Seu plano de exercícios está esperando por você hoje.',
        NotificationType.EXERCISE_REMINDER,
        { type: 'daily_exercise_reminder', patientId: patient.id },
      );
      notified++;
    }

    this.logger.log(
      `Lembretes diários persistidos: ${notified}/${patients.length}.`,
    );
  }

  private normalizeData(data: Record<string, unknown>) {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, String(value ?? '')]),
    );
  }
}
