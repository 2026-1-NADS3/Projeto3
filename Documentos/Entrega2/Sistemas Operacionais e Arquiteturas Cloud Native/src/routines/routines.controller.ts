import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { InstantiateRoutineDto } from './dto/instantiate-routine.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Get()
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('search') search?: string,
  ) {
    return this.routinesService.findAll(page || 1, pageSize || 10, search);
  }

  @Get(':id')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.routinesService.findOne(id);
  }

  @Post()
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  create(@Body() dto: CreateRoutineDto, @Req() req: any) {
    return this.routinesService.create(dto, req.user.id);
  }

  @Patch(':id')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoutineDto,
  ) {
    return this.routinesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.routinesService.remove(id);
  }

  // POST /api/routines/:id/instantiate — instancia a rotina como prescrição para um paciente
  @Post(':id/instantiate')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  instantiate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: InstantiateRoutineDto,
    @Req() req: any,
  ) {
    return this.routinesService.instantiate(id, dto, req.user.id);
  }
}
