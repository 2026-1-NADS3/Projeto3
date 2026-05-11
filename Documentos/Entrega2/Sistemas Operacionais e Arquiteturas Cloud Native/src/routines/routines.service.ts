import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routine } from './entities/routine.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { InstantiateRoutineDto } from './dto/instantiate-routine.dto';
import { Prescription } from '../prescriptions/entities/prescription.entity';
import { clampPagination } from '../common/pagination.util';

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private readonly routineRepo: Repository<Routine>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepo: Repository<Prescription>,
  ) {}

  async findAll(page = 1, pageSize = 10, search?: string) {
    const clamped = clampPagination(page, pageSize);
    const query = this.routineRepo.createQueryBuilder('routine');

    if (search) {
      query.andWhere(
        '(routine.title ILIKE :s OR routine.description ILIKE :s OR routine.tags ILIKE :s)',
        { s: `%${search}%` },
      );
    }

    query.orderBy('routine.createdAt', 'DESC');

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

  async findOne(id: string): Promise<Routine> {
    const routine = await this.routineRepo.findOneBy({ id });
    if (!routine) throw new NotFoundException('Rotina não encontrada');
    return routine;
  }

  async create(dto: CreateRoutineDto, createdBy: string): Promise<Routine> {
    const routine = this.routineRepo.create({
      ...dto,
      createdBy,
    });
    return this.routineRepo.save(routine);
  }

  async update(id: string, dto: UpdateRoutineDto): Promise<Routine> {
    const routine = await this.findOne(id);
    Object.assign(routine, dto);
    return this.routineRepo.save(routine);
  }

  async remove(id: string): Promise<void> {
    const routine = await this.findOne(id);
    await this.routineRepo.remove(routine);
  }

  /**
   * Cria uma `Prescription` clonando os exercícios da rotina para um paciente.
   * O profissional pode editar a prescrição depois (a rotina permanece intacta).
   */
  async instantiate(
    routineId: string,
    dto: InstantiateRoutineDto,
    professionalId: string,
  ): Promise<Prescription> {
    const routine = await this.findOne(routineId);

    const prescription = this.prescriptionRepo.create({
      patientId: dto.patientId,
      professionalId,
      title: routine.title,
      description: dto.notes
        ? `${routine.description ?? ''}\n\n${dto.notes}`.trim()
        : routine.description,
      // Clona o array para evitar mutação acidental do template
      exercises: routine.exercises.map((e) => ({ ...e })),
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : (null as any),
      isActive: true,
    });

    return this.prescriptionRepo.save(prescription);
  }
}
