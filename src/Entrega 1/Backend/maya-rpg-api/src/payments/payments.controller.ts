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
  import { PaymentsService } from './payments.service';
  import { CreatePaymentDto } from './dto/create-payment.dto';
  import { UpdatePaymentDto } from './dto/update-payment.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('payments')
  export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}
  
    @Get()
    findAll(
      @Query('page') page?: number,
      @Query('pageSize') pageSize?: number,
    ) {
      return this.paymentsService.findAll(page || 1, pageSize || 10);
    }
  
    @Get('summary')
    getSummary() {
      return this.paymentsService.getSummary();
    }
  
    @Get('patient/:patientId')
    findByPatient(
      @Param('patientId', ParseUUIDPipe) patientId: string,
      @Query('page') page?: number,
      @Query('pageSize') pageSize?: number,
    ) {
      return this.paymentsService.findByPatient(patientId, page || 1, pageSize || 20);
    }
  
    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
      return this.paymentsService.findOne(id);
    }
  
    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreatePaymentDto, @Req() req: any) {
      const professionalId = req.user?.sub || req.user?.id || null;
      return this.paymentsService.create(dto, professionalId);
    }
  
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    update(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() dto: UpdatePaymentDto,
    ) {
      return this.paymentsService.update(id, dto);
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseUUIDPipe) id: string) {
      return this.paymentsService.remove(id);
    }
  }