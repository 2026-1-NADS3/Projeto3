import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PrescriptionExercise } from '../../prescriptions/entities/prescription.entity';

/**
 * Rotina = template reutilizável de plano de exercícios.
 * Diferente de uma `Prescription`, NÃO está amarrada a um paciente.
 *
 * Profissionais podem criar rotinas (ex.: "RPG cervical básico", "RPG lombar
 * iniciante") e, na hora de prescrever para um paciente específico, instanciar
 * a rotina como uma nova `Prescription` (clone dos exercícios + datas).
 */
@Entity('routines')
export class Routine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', default: '' })
  tags: string[];

  // Mesma estrutura de exercícios usada em Prescription, para reaproveitar o tipo.
  @Column({ type: 'simple-json' })
  exercises: PrescriptionExercise[];

  @Column({ default: true })
  isActive: boolean;

  // Profissional que criou a rotina (audit). Não impede uso por outros.
  @Column({ nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
