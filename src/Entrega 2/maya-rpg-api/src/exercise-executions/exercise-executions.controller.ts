import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CheckInsService } from '../check-ins/check-ins.service';

@Controller('exercise-executions')
export class ExerciseExecutionsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  @Get('patient/:patientId')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  findByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.checkInsService.findAllByPatientIdPaginated(
      patientId,
      page || 1,
      pageSize || 20,
    );
  }
}
