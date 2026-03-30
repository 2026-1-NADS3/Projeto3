import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientStatus } from '../common/enums/patient-status.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('status') status?: PatientStatus,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.patientsService.findAll(page || 1, pageSize || 10, search, status, sortBy, sortOrder);
  }

  // Rota do paciente logado — deve vir ANTES de :id
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: any) {
    return this.patientsService.findByUserId(req.user.sub || req.user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreatePatientDto, @Req() req: any) {
    const professionalId = req.user?.sub || req.user?.id || null;
    return this.patientsService.create(dto, professionalId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.remove(id);
  }
}