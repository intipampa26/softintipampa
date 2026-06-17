import { Controller, Get, Post, Delete, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ParcelasCampanaService } from './parcelas-campana.service';
import { UpsertParcelaCampanaDto } from './dto/upsert-parcela-campana.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('parcelas-campana')
export class ParcelasCampanaController {
  constructor(private readonly service: ParcelasCampanaService) {}

   
  @Get()
  findOne(
    @Query('parcelaId', ParseIntPipe) parcelaId: number,
    @Query('campanaId', ParseIntPipe) campanaId: number,
  ) {
    return this.service.findOne(parcelaId, campanaId);
  }

   
  @Get('historial')
  findHistorial(@Query('parcelaId', ParseIntPipe) parcelaId: number) {
    return this.service.findByParcela(parcelaId);
  }

   
  @Post()
  upsert(@Body() dto: UpsertParcelaCampanaDto) {
    return this.service.upsert(dto);
  }

   
  @Delete()
  remove(
    @Query('parcelaId', ParseIntPipe) parcelaId: number,
    @Query('campanaId', ParseIntPipe) campanaId: number,
  ) {
    return this.service.remove(parcelaId, campanaId);
  }
}
