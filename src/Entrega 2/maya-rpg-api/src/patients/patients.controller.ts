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
  Req,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientResponseDto } from './dto/patient-response.dto';
import { PatientStatus } from '../common/enums/patient-status.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Get()
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  async findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
    @Query('status') status?: PatientStatus,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    const result = await this.patientsService.findAll(
      page || 1,
      pageSize || 10,
      search,
      status,
      sortBy,
      sortOrder,
    );
    return {
      ...result,
      data: result.data.map((p) => new PatientResponseDto(p)),
    };
  }

  @Get('me')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  async getMe(@Req() req: any) {
    const patient = await this.patientsService.findByUserId(req.user.id);
    return new PatientResponseDto(patient);
  }

  @Patch('me')
  @Roles(UserRole.PATIENT)
  async updateMe(@Req() req: any, @Body() dto: UpdatePatientDto) {
    const patient = await this.patientsService.updateByUserId(req.user.id, dto);
    return new PatientResponseDto(patient);
  }

  @Get(':id')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  async findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    const patient = await this.patientsService.findOneSecure(id, req.user);
    return new PatientResponseDto(patient);
  }

  @Post()
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  async create(@Body() dto: CreatePatientDto) {
    const patient = await this.patientsService.create(dto);
    return new PatientResponseDto(patient);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    const patient = await this.patientsService.update(id, dto);
    return new PatientResponseDto(patient);
  }

  @Post(':id/reminders')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  async sendReminder(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.sendReminder(id, this.notificationsService);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.patientsService.remove(id);
  }
}
