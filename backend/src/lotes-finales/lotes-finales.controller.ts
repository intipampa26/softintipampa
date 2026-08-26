import {
  Controller, Get, Post, Patch, Body, Param,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LotesFinalesService } from './lotes-finales.service';
import { FilterLotesFinalesDto } from './dto/filter-lotes-finales.dto';
import { TrillarDto } from './dto/trillar.dto';
import { BatchTrillarDto } from './dto/batch-trillar.dto';
import { AsignarSkuDto } from './dto/asignar-sku.dto';

@UseGuards(JwtAuthGuard)
@Controller('lotes-finales')
export class LotesFinalesController {
  constructor(private readonly service: LotesFinalesService) {}

  @Get()
  findAll(@Query() filter: FilterLotesFinalesDto) {
    return this.service.findAll(filter);
  }

  // Rutas literales primero: deben declararse antes de ':id' para no ser
  // interceptadas por ParseIntPipe.
  @Get('grupos-trilla')
  getGruposTrilla() {
    return this.service.getGruposTrilla();
  }

  @Post('trillar-batch')
  trillarBatch(@Body() dto: BatchTrillarDto) {
    return this.service.trillarBatch(dto);
  }

  @Get(':id')
  findDetalle(@Param('id', ParseIntPipe) id: number) {
    return this.service.findDetalle(id);
  }

  @Get(':id/kardex')
  findKardex(@Param('id', ParseIntPipe) id: number) {
    return this.service.findKardex(id);
  }


  @Post(':id/trillar')
  trillar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TrillarDto,
  ) {
    return this.service.trillar(id, dto);
  }

  @Patch(':id/sku')
  asignarSku(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AsignarSkuDto,
  ) {
    return this.service.asignarSku(id, dto);
  }
}
