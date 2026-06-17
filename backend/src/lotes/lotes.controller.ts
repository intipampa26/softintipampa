import {
  Controller, Get, Post, Put, Delete, Body,
  Param, Query, ParseIntPipe, UseGuards,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LotesService } from './lotes.service';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';
import { FilterLotesDto } from './dto/filter-lotes.dto';
import { DividirLoteDto } from './dto/dividir-lote.dto';
import { MezclarLotesDto } from './dto/mezclar-lotes.dto';
import { PromoverLfDto } from './dto/promover-lf.dto';

@UseGuards(JwtAuthGuard)
@Controller('lotes')
export class LotesController {
  constructor(private readonly service: LotesService) {}

  

  @Get()
  findAll(@Query() filter: FilterLotesDto) {
    return this.service.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get(':id/lotes-finales')
  findLotesFinalesDeOrigen(@Param('id', ParseIntPipe) id: number) {
    return this.service.findLotesFinalesDeOrigen(id);
  }

  @Post()
  create(@Body() dto: CreateLoteDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLoteDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  

   
  @Post(':id/promover-a-lf')
  promoverALf(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PromoverLfDto,
  ) {
    return this.service.promoverALf(id, dto);
  }

   
  @Post('dividir')
  dividir(@Body() dto: DividirLoteDto) {
    return this.service.dividir(dto);
  }

   
  @Post('mezclar')
  mezclar(@Body() dto: MezclarLotesDto) {
    return this.service.mezclar(dto);
  }
}
