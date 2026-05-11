import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { CheckInsService } from './check-ins.service';
import { CreateCheckInDto } from './dto/create-check-in.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('check-ins')
export class CheckInsController {
  constructor(private readonly checkInsService: CheckInsService) {}

  @Post()
  @Roles(UserRole.PATIENT)
  create(
    @Body() createCheckInDto: CreateCheckInDto,
    @CurrentUser() user: User,
  ) {
    return this.checkInsService.create(createCheckInDto, user.id);
  }

  @Post('sync')
  @Roles(UserRole.PATIENT)
  syncBatch(@Body() checkIns: CreateCheckInDto[], @CurrentUser() user: User) {
    return this.checkInsService.syncBatch(checkIns, user.id);
  }

  @Get('my-history')
  @Roles(UserRole.PATIENT)
  findMyHistory(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.checkInsService.findAllByPatientPaginated(
      user.id,
      page || 1,
      pageSize || 20,
    );
  }
}
