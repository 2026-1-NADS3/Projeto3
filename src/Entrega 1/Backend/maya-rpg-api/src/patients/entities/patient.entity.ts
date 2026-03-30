import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PatientStatus } from '../../common/enums/patient-status.enum';
import { User } from '../../auth/entities/user.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  birthDate: Date;

  @Column({ unique: true })
  cpf: string;

  @Column({
    type: 'enum',
    enum: PatientStatus,
    default: PatientStatus.PENDING,
  })
  status: PatientStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'timestamp', nullable: true })
  lgpdConsentAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}