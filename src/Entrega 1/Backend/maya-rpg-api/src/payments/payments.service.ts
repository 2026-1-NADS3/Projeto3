import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async findAll(page = 1, pageSize = 10) {
    const [data, total] = await this.paymentRepo.findAndCount({
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

  async findByPatient(patientId: string, page = 1, pageSize = 20) {
    const [data, total] = await this.paymentRepo.findAndCount({
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

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!payment) throw new NotFoundException('Pagamento não encontrado');
    return payment;
  }

  async create(dto: CreatePaymentDto, professionalId: string): Promise<Payment> {
    const payment = this.paymentRepo.create({ ...dto, professionalId });
    return this.paymentRepo.save(payment);
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, dto);
    return this.paymentRepo.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepo.remove(payment);
  }

  async getSummary() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [allThisMonth, pendingCount] = await Promise.all([
      this.paymentRepo.find({
        where: {
          date: Between(firstDay, lastDay) as any,
          status: PaymentStatus.PAID,
        },
      }),
      this.paymentRepo.count({
        where: { status: PaymentStatus.PENDING },
      }),
    ]);

    const totalThisMonth = allThisMonth.reduce(
      (sum, p) => sum + Number(p.amount),
      0,
    );

    return {
      totalThisMonth,
      pendingCount,
    };
  }
}