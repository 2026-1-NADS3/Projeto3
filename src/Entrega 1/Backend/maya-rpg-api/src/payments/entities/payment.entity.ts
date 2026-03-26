import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Patient } from '../../patients/entities/patient.entity';
  
  export enum PaymentMethod {
    PIX = 'PIX',
    CASH = 'CASH',
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    TRANSFER = 'TRANSFER',
  }
  
  export enum PaymentStatus {
    PAID = 'PAID',
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED',
  }
  
  @Entity('payments')
  export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    patientId: string;
  
    @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'patientId' })
    patient: Patient;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;
  
    @Column({ type: 'date' })
    date: Date;
  
    @Column({
      type: 'enum',
      enum: PaymentMethod,
      default: PaymentMethod.PIX,
    })
    method: PaymentMethod;
  
    @Column({
      type: 'enum',
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;
  
    @Column({ type: 'text', nullable: true })
    notes: string;
  
    @Column({ nullable: true })
    professionalId: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }