import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { ExerciseCategory } from '../common/enums/exercise-category.enum';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepo: Repository<Exercise>,
  ) {}

  async findAll(
    page = 1,
    pageSize = 10,
    search?: string,
    category?: ExerciseCategory,
    sortBy = 'title',
    sortOrder: string = 'ASC',
  ) {
    const query = this.exerciseRepo.createQueryBuilder('exercise');

    if (category) {
      query.andWhere('exercise.category = :category', { category });
    }

    if (search) {
      query.andWhere(
        '(exercise.title ILIKE :search OR exercise.description ILIKE :search OR exercise.tags ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const allowedSortFields = ['title', 'category', 'createdAt'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'title';
    const safeOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    query.orderBy(`exercise.${safeSortBy}`, safeOrder);

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

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepo.findOneBy({ id });
    if (!exercise) {
      throw new NotFoundException('Exercício não encontrado');
    }
    return exercise;
  }

  async create(dto: CreateExerciseDto): Promise<Exercise> {
    const exercise = this.exerciseRepo.create(dto);
    return this.exerciseRepo.save(exercise);
  }

  async update(id: string, dto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.findOne(id);
    Object.assign(exercise, dto);
    return this.exerciseRepo.save(exercise);
  }

  async remove(id: string): Promise<void> {
    const exercise = await this.findOne(id);
    await this.exerciseRepo.remove(exercise);
  }
}