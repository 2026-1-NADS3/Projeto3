import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientStatus } from '../common/enums/patient-status.enum';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
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

    // Filtro por status
    if (status) {
      query.andWhere('patient.status = :status', { status });
    }

    // Busca por nome, email ou CPF
    if (search) {
      query.andWhere(
        '(patient.fullName ILIKE :search OR patient.email ILIKE :search OR patient.cpf LIKE :searchExact)',
        { search: `%${search}%`, searchExact: `%${search}%` },
      );
    }

    // Ordenação
    const allowedSortFields = ['fullName', 'email', 'createdAt', 'status'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'fullName';
    query.orderBy(`patient.${safeSortBy}`, sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');

    // Paginação
    const total = await query.getCount();
    const data = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepo.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException('Paciente não encontrado');
    }
    return patient;
  }

  async create(dto: CreatePatientDto, professionalId: string): Promise<Patient> {
    const patientData = {
      ...dto,
      professionalId: professionalId,
    };

    const patient = this.patientRepo.create(patientData);
    return this.patientRepo.save(patient);
  }

  async update(id: string, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, dto);
    return this.patientRepo.save(patient);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepo.remove(patient);
  }
}