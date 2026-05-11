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
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { RequestAppointmentDto } from './dto/request-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.appointmentsService.findAll(
      page || 1,
      pageSize || 50,
      startDate,
      endDate,
    );
  }

  @Get('today')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  findToday() {
    return this.appointmentsService.findToday();
  }

  @Get('next')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  findNext() {
    return this.appointmentsService.findNext();
  }

  @Get('satisfaction')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  getSatisfactionSummary() {
    return this.appointmentsService.getSatisfactionSummary();
  }

  @Get('pending-requests')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  getPendingRequests() {
    return this.appointmentsService.getPendingRequests();
  }

  @Get('my')
  @Roles(UserRole.PATIENT)
  findMy(
    @Req() req: any,
    @Query('filter') filter?: 'upcoming' | 'history' | 'all',
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.appointmentsService.findByUser(
      req.user,
      filter || 'all',
      page || 1,
      pageSize || 20,
    );
  }

  @Get('me')
  @Roles(UserRole.PATIENT)
  findMe(
    @Req() req: any,
    @Query('filter') filter?: 'upcoming' | 'history' | 'all',
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.appointmentsService.findByUser(
      req.user,
      filter || 'all',
      page || 1,
      pageSize || 20,
    );
  }

  @Get('me/upcoming')
  @Roles(UserRole.PATIENT)
  findMyUpcoming(@Req() req: any, @Query('limit') limit?: number) {
    return this.appointmentsService.findUpcomingByUser(req.user, limit || 3);
  }

  @Get('me/availability')
  @Roles(UserRole.PATIENT)
  findMyAvailability(@Query('month') month: string) {
    return this.appointmentsService.getAvailability(month);
  }

  @Post('me/request')
  @Roles(UserRole.PATIENT)
  requestMyAppointment(@Body() dto: RequestAppointmentDto, @Req() req: any) {
    return this.appointmentsService.requestByUser(dto, req.user);
  }

  @Get('availability')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN, UserRole.PATIENT)
  getAvailability(@Query('date') date: string) {
    return this.appointmentsService.getAvailabilityByDate(date);
  }

  @Get('patient/:patientId')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  findByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.appointmentsService.findByPatientPaginated(
      patientId,
      page || 1,
      pageSize || 20,
    );
  }

  @Get(':id')
  @Roles(UserRole.PATIENT, UserRole.PROFESSIONAL, UserRole.ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: any) {
    return this.appointmentsService.findOneSecure(id, req.user);
  }

  @Post()
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  create(@Body() dto: CreateAppointmentDto, @Req() req: any) {
    return this.appointmentsService.create(dto, req.user.id);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.remove(id);
  }
}
