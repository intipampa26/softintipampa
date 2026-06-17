import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KardexService } from './kardex.service';
import { FilterKardexDto } from './dto/filter-kardex.dto';

@UseGuards(JwtAuthGuard)
@Controller('kardex')
export class KardexController {
  constructor(private readonly service: KardexService) {}

  @Get()
  findAll(@Query() filter: FilterKardexDto) {
    return this.service.findAll(filter);
  }
}