import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SkusService } from './skus.service';
import { IsOptional, IsString, MaxLength } from 'class-validator';

class CreateSkuDto {
  @IsString() @MaxLength(200) nombre: string;
  @IsString() @IsOptional() descripcion?: string;
}

@UseGuards(JwtAuthGuard)
@Controller('skus')
export class SkusController {
  constructor(private readonly service: SkusService) {}

  @Get()
  findAll() { return this.service.findAll(); }

  @Post()
  create(@Body() dto: CreateSkuDto) {
    return this.service.create(dto.nombre, dto.descripcion);
  }
}
