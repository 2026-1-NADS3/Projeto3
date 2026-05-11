import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Prescription } from '../../prescriptions/entities/prescription.entity';
import { CheckIn } from '../../check-ins/entities/check-in.entity';
import { MedicalRecord } from '../../medical-records/entities/medical-record.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { AuditService } from '../audit/audit.service';
import { UploadService } from '../../upload/upload.service';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { In } from 'typeorm';
// Optional dependency does not ship local TypeScript declarations in this project.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const archiver = require('archiver');

@Injectable()
export class LgpdService {
  private readonly logger = new Logger(LgpdService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepo: Repository<Prescription>,
    @InjectRepository(CheckIn)
    private readonly checkInRepo: Repository<CheckIn>,
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepo: Repository<MedicalRecord>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
    private readonly auditService: AuditService,
    private readonly uploadService: UploadService,
  ) {}

  async exportUserDataToZip(
    userId: string,
    resStream: any,
  ): Promise<{ filename: string }> {
    // Gather data
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const patient = await this.patientRepo.findOne({ where: { userId } });

    const prescriptions = patient
      ? await this.prescriptionRepo.find({ where: { patientId: patient.id } })
      : [];

    const checkIns = patient
      ? await this.checkInRepo.find({ where: { patientId: patient.id } })
      : [];

    const medicalRecords = patient
      ? await this.medicalRecordRepo.find({ where: { patientId: patient.id } })
      : [];

    const appointments = patient
      ? await this.appointmentRepo.find({ where: { patientId: patient.id } })
      : [];

    const exportObj = {
      metadata: {
        userId,
        generatedAt: new Date().toISOString(),
      },
      user,
      patient,
      prescriptions,
      checkIns,
      medicalRecords,
      appointments,
    };

    // Create archive and pipe to response stream
    const archive: any = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err: Error) => {
      this.logger.error('Archive error', err);
      throw err;
    });

    archive.pipe(resStream);

    // Add JSON file
    archive.append(JSON.stringify(exportObj, null, 2), { name: 'export.json' });

    // Attempt to include referenced media (images/videos) from exercises/prescriptions
    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    const mediaFiles = new Set<string>();

    // Collect exercise IDs referenced in prescriptions
    const exerciseIds = new Set<string>();
    for (const pres of prescriptions) {
      try {
        const exercises = JSON.parse((pres as any).exercises || '[]');
        for (const exRef of exercises) {
          if (exRef.exerciseId) exerciseIds.add(exRef.exerciseId);
          // exRef may also inline media URLs
          if (exRef.imageUrls && Array.isArray(exRef.imageUrls)) {
            for (const url of exRef.imageUrls) {
              const fname = this.filenameFromUrl(url);
              if (fname) mediaFiles.add(fname);
            }
          }
          if (exRef.videoUrl) {
            const fname = this.filenameFromUrl(exRef.videoUrl);
            if (fname) mediaFiles.add(fname);
          }
        }
      } catch {
        // ignore if exercises isn't JSON
      }
    }

    // Load exercises from DB to collect their media URLs
    if (exerciseIds.size > 0) {
      const exercisesFromDb = await this.exerciseRepo.find({
        where: { id: In(Array.from(exerciseIds)) },
      });
      for (const ex of exercisesFromDb) {
        if (ex.imageUrls && Array.isArray(ex.imageUrls)) {
          for (const url of ex.imageUrls) {
            const fname = this.filenameFromUrl(url);
            if (fname) mediaFiles.add(fname);
          }
        }
        if (ex.videoUrl) {
          const fname = this.filenameFromUrl(ex.videoUrl);
          if (fname) mediaFiles.add(fname);
        }
      }
    }

    // Add files if exist
    for (const fname of Array.from(mediaFiles)) {
      const full = path.join(uploadsDir, fname);
      if (fs.existsSync(full)) {
        archive.file(full, { name: `media/${fname}` });
      }
    }

    await archive.finalize();

    // Audit log
    await this.auditService.createLog({
      userId,
      action: 'LGPD_EXPORT_CREATED',
      method: 'GET',
      path: '/me/lgpd/export',
      statusCode: 200,
    });

    const filename = `maya-rpg-export-${userId}.zip`;
    return { filename };
  }

  private filenameFromUrl(url: string): string | null {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      return parsed.pathname.split('/').pop() || null;
    } catch {
      // If not a full URL, try to take last segment
      const seg = url.split('/').pop();
      return seg || null;
    }
  }

  async anonymizeUser(
    userId: string,
  ): Promise<{ anonymizedAt: string; fieldsChanged: string[] }> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const patient = await this.patientRepo.findOne({ where: { userId } });

    const fieldsChanged: string[] = [];

    // Anonimize User
    const now = new Date();
    const hash = createHash('sha256')
      .update(userId + now.getTime())
      .digest('hex')
      .slice(0, 12);
    if (user.name) {
      user.name = `ANON_${hash}`;
      fieldsChanged.push('user.name');
    }
    if (user.email) {
      user.email = `anon+${hash}@example.invalid`;
      fieldsChanged.push('user.email');
    }
    user.isAnonymized = true;
    user.anonymizedAt = now;
    await this.userRepo.save(user);

    // Anonimize Patient
    if (patient) {
      if (patient.fullName) {
        patient.fullName = `ANON_${hash}`;
        fieldsChanged.push('patient.fullName');
      }
      if (patient.email) {
        patient.email = `anon+${hash}@example.invalid`;
        fieldsChanged.push('patient.email');
      }
      if (patient.phone) {
        patient.phone = '';
        fieldsChanged.push('patient.phone');
      }
      if (patient.cpf) {
        patient.cpf = `00000000000`;
        fieldsChanged.push('patient.cpf');
      }
      patient.isAnonymized = true;
      patient.anonymizedAt = now;
      await this.patientRepo.save(patient);
    }

    // Audit
    await this.auditService.createLog({
      userId,
      action: 'LGPD_ANONYMIZE',
      method: 'POST',
      path: '/me/lgpd/anonymize',
      statusCode: 200,
    });

    return { anonymizedAt: now.toISOString(), fieldsChanged };
  }
}
