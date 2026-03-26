import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { UpdateMedicalRecordDto } from './dto/update-medical-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly recordRepo: Repository<MedicalRecord>,
  ) {}

  async findAll(page = 1, pageSize = 10) {
    const [data, total] = await this.recordRepo.findAndCount({
      relations: ['patient'],
      order: { date: 'DESC' },
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
    const [data, total] = await this.recordRepo.findAndCount({
      where: { patientId },
      order: { date: 'DESC' },
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

  async findOne(id: string): Promise<MedicalRecord> {
    const record = await this.recordRepo.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!record) {
      throw new NotFoundException('Prontuário não encontrado');
    }
    return record;
  }

  async create(dto: CreateMedicalRecordDto, professionalId: string): Promise<MedicalRecord> {
    const record = this.recordRepo.create({
      ...dto,
      professionalId,
    });
    return this.recordRepo.save(record);
  }

  async update(id: string, dto: UpdateMedicalRecordDto): Promise<MedicalRecord> {
    const record = await this.findOne(id);
    Object.assign(record, dto);
    return this.recordRepo.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.recordRepo.remove(record);
  }
}