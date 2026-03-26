import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepo: Repository<Prescription>,
  ) {}

  async findAll(page = 1, pageSize = 10) {
    const [data, total] = await this.prescriptionRepo.findAndCount({
      relations: ['patient'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findByPatient(patientId: string, page = 1, pageSize = 10) {
    const [data, total] = await this.prescriptionRepo.findAndCount({
      where: { patientId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string): Promise<Prescription> {
    const prescription = await this.prescriptionRepo.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!prescription) {
      throw new NotFoundException('Prescrição não encontrada');
    }
    return prescription;
  }

  // 👇 Método alterado para juntar o DTO com o professionalId
  async create(dto: CreatePrescriptionDto, professionalId: string): Promise<Prescription> {
    const prescription = this.prescriptionRepo.create({
      ...dto,
      professionalId,
    });
    return this.prescriptionRepo.save(prescription);
  }

  async update(id: string, dto: UpdatePrescriptionDto): Promise<Prescription> {
    const prescription = await this.findOne(id);
    Object.assign(prescription, dto);
    return this.prescriptionRepo.save(prescription);
  }

  async deactivate(id: string): Promise<void> {
    const prescription = await this.findOne(id);
    prescription.isActive = false;
    await this.prescriptionRepo.save(prescription);
  }

  async remove(id: string): Promise<void> {
    const prescription = await this.findOne(id);
    await this.prescriptionRepo.remove(prescription);
  }
}