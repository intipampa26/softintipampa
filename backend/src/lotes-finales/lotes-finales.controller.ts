import {
  Controller, Get, Post, Body, Param,
  Query, ParseIntPipe, UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LotesFinalesService } from './lotes-finales.service';
import { FilterLotesFinalesDto } from './dto/filter-lotes-finales.dto';
import { TrillarDto } from './dto/trillar.dto';

@UseGuards(JwtAuthGuard)
@Controller('lotes-finales')
export class LotesFinalesController {
  constructor(private readonly service: LotesFinalesService) {}

  @Get()
  findAll(@Query() filter: FilterLotesFinalesDto) {
    return this.service.findAll(filter);
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
}
