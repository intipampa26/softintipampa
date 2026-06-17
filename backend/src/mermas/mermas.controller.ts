import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MermasService } from './mermas.service';
import { CreateMermaDto } from './dto/create-merma.dto';
import { FilterMermasDto } from './dto/filter-mermas.dto';

@UseGuards(JwtAuthGuard)
@Controller('mermas')
export class MermasController {
  constructor(private readonly service: MermasService) {}

  @Get()
  findAll(@Query() filter: FilterMermasDto) {
    return this.service.findAll(filter);
  }

  @Post()
  create(@Body() dto: CreateMermaDto) {
    return this.service.create(dto);
  }
}
