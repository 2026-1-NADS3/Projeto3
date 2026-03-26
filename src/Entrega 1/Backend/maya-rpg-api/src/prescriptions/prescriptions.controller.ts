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
  UseGuards, // 👈 Importado
  Req,       // 👈 Importado
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // 👈 Import do Guard de Autenticação

@UseGuards(JwtAuthGuard) // 👈 Protege todas as rotas de prescrição
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.prescriptionsService.findAll(page || 1, pageSize || 10);
  }

  @Get('patient/:patientId')
  findByPatient(
    @Param('patientId', ParseUUIDPipe) patientId: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.prescriptionsService.findByPatient(patientId, page || 1, pageSize || 10);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.findOne(id);
  }

  // 👇 Método alterado para pegar o ID do Token
  @Post()
  create(@Body() dto: CreatePrescriptionDto, @Req() req: any) {
    const professionalId = req.user.sub || req.user.id; 
    return this.prescriptionsService.create(dto, professionalId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionsService.update(id, dto);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.deactivate(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.prescriptionsService.remove(id);
  }
}