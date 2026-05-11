import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../auth/entities/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { Patient } from '../patients/entities/patient.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { MedicalRecord } from '../medical-records/entities/medical-record.entity';
import { CheckIn } from '../check-ins/entities/check-in.entity';
import { PatientStatus } from './enums/patient-status.enum';
import { ExerciseCategory } from './enums/exercise-category.enum';
import { LgpdPolicy } from './lgpd/lgpd.policy';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepo: Repository<Prescription>,
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepo: Repository<MedicalRecord>,
    @InjectRepository(CheckIn)
    private readonly checkInRepo: Repository<CheckIn>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();

    if (process.env.NODE_ENV === 'production') {
      this.logger.log('ℹ️ Seed de dados demo desabilitado em produção.');
      return;
    }

    if (process.env.SEED_DEMO_DATA === 'true') {
      await this.seedDemoData();
    }
  }

  private async seedAdmin() {
    if (process.env.SEED_ADMIN_DEFAULT !== 'true') {
      this.logger.log('ℹ️ Seed de admin padrão desabilitado.');
      return;
    }

    const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;
    const adminName =
      process.env.SEED_ADMIN_NAME?.trim() || 'Administrador Maya';

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        '⚠️ SEED_ADMIN_DEFAULT=true sem SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD. Seed de admin ignorado.',
      );
      return;
    }

    const existingAdmin = await this.userRepo.findOneBy({ email: adminEmail });

    if (!existingAdmin) {
      this.logger.log('🌱 Criando usuário administrador padrão...');

      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const admin = this.userRepo.create({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
        isActive: true,
      });

      await this.userRepo.save(admin);
      this.logger.log('✅ Usuário administrador criado com sucesso!');
    } else {
      this.logger.log('ℹ️ Usuário administrador já existe.');
    }
  }

  private async seedDemoData() {
    const markerEmail = 'ana.silva.demo@mayarpg.com';
    const existingDemo = await this.patientRepo.findOneBy({
      email: markerEmail,
    });
    if (existingDemo) {
      this.logger.log('ℹ️ Dados demo já existem.');
      return;
    }

    this.logger.log('🌱 Criando dados demo do Projeto Interdisciplinar...');

    const professional = await this.createUserIfMissing(
      'maya.profissional@mayarpg.com',
      'Maya Yoshiko Yamamoto',
      UserRole.PROFESSIONAL,
      'senhaSuperSegura123',
      true,
    );

    const patients = await Promise.all([
      this.createDemoPatient({
        fullName: 'Ana Silva Demo',
        email: markerEmail,
        phone: '(11) 99999-0001',
        cpf: '11122233344',
        birthDate: new Date('1991-04-10'),
        notes: 'Paciente demo com queixa lombar leve.',
        acceptedLgpd: true,
      }),
      this.createDemoPatient({
        fullName: 'Bruno Costa Demo',
        email: 'bruno.costa.demo@mayarpg.com',
        phone: '(11) 99999-0002',
        cpf: '22233344455',
        birthDate: new Date('1987-08-22'),
        notes: 'Paciente demo com tensão cervical.',
        acceptedLgpd: false,
      }),
    ]);

    const exercises = await this.exerciseRepo.save([
      this.exerciseRepo.create({
        title: 'Alongamento axial em pé',
        description: 'Alongamento global com foco em alinhamento axial.',
        category: ExerciseCategory.POSTURE,
        tags: ['rpg', 'postura', 'iniciante'],
        instructions:
          'Fique em pé, cresça o topo da cabeça e mantenha respiração lenta por 40 segundos.',
        imageUrls: ['https://placehold.co/800x600?text=Alongamento+axial'],
      }),
      this.exerciseRepo.create({
        title: 'Respiração diafragmática',
        description: 'Exercício respiratório para reduzir tensão postural.',
        category: ExerciseCategory.BREATHING,
        tags: ['respiração', 'relaxamento'],
        instructions:
          'Inspire pelo nariz expandindo o abdômen e expire lentamente pela boca.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }),
      this.exerciseRepo.create({
        title: 'Mobilidade cervical suave',
        description: 'Sequência leve para controle cervical.',
        category: ExerciseCategory.MOBILITY,
        tags: ['cervical', 'mobilidade'],
        instructions:
          'Incline a cabeça lateralmente sem dor e sustente por 20 segundos cada lado.',
        imageUrls: ['https://placehold.co/800x600?text=Mobilidade+cervical'],
      }),
    ]);

    const prescription = await this.prescriptionRepo.save(
      this.prescriptionRepo.create({
        patientId: patients[0].id,
        professionalId: professional.id,
        title: 'Plano RPG Lombar Inicial',
        description: 'Rotina demo para melhora de postura e dor lombar.',
        startDate: new Date(),
        isActive: true,
        exercises: exercises.map((exercise, index) => ({
          exerciseId: exercise.id,
          sets: 2,
          repetitions: index === 1 ? 8 : undefined,
          holdTimeSeconds: index === 1 ? undefined : 40,
          frequency: '3x por semana',
          notes: 'Interromper se houver dor aguda.',
          order: index + 1,
        })),
      }),
    );

    await this.medicalRecordRepo.save(
      this.medicalRecordRepo.create({
        patientId: patients[0].id,
        professionalId: professional.id,
        date: new Date(),
        chiefComplaint: 'Dor lombar ao permanecer sentada por longos períodos.',
        clinicalNotes:
          'Avaliação funcional demo com encurtamento posterior leve.',
        painLevel: 5,
        mobilityNotes: 'Mobilidade lombar reduzida em flexão.',
        postureAssessment:
          'Anteriorização de cabeça e retroversão pélvica leve.',
        treatmentPlan: 'RPG semanal e exercícios domiciliares 3x por semana.',
      }),
    );

    await this.checkInRepo.save([
      this.checkInRepo.create({
        patientId: patients[0].id,
        prescriptionId: prescription.id,
        exerciseId: exercises[0].id,
        painLevel: 5,
        notes: 'Senti alongar sem dor forte.',
        isCompleted: true,
        executedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      }),
      this.checkInRepo.create({
        patientId: patients[0].id,
        prescriptionId: prescription.id,
        exerciseId: exercises[1].id,
        painLevel: 3,
        notes: 'Respiração ajudou a relaxar.',
        isCompleted: true,
        executedAt: new Date(),
      }),
    ]);

    this.logger.log('✅ Dados demo criados com sucesso.');
  }

  private async createUserIfMissing(
    email: string,
    name: string,
    role: UserRole,
    password: string,
    acceptedLgpd: boolean,
  ) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await this.userRepo.findOneBy({ email: normalizedEmail });
    if (existing) return existing;

    return this.userRepo.save(
      this.userRepo.create({
        name,
        email: normalizedEmail,
        password: await bcrypt.hash(password, 10),
        role,
        isActive: true,
        mustChangePassword: false,
        lgpdAcceptedAt: acceptedLgpd ? new Date() : null,
        lgpdAcceptedVersion: acceptedLgpd ? LgpdPolicy.CURRENT_VERSION : null,
      }),
    );
  }

  private async createDemoPatient(data: {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    birthDate: Date;
    notes: string;
    acceptedLgpd: boolean;
  }) {
    const user = await this.createUserIfMissing(
      data.email,
      data.fullName,
      UserRole.PATIENT,
      data.cpf,
      data.acceptedLgpd,
    );

    const patient = Object.assign(new Patient(), {
      userId: user.id,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      cpf: data.cpf,
      birthDate: data.birthDate,
      status: data.acceptedLgpd ? PatientStatus.ACTIVE : PatientStatus.PENDING,
      notes: data.notes,
      lgpdConsentAt:
        data.acceptedLgpd && user.lgpdAcceptedAt
          ? user.lgpdAcceptedAt
          : undefined,
    });

    return this.patientRepo.save(patient);
  }
}
