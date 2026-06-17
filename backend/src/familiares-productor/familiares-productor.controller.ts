
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FamiliaresProductorService } from './familiares-productor.service';
import { CreateFamiliarProductorDto } from './dto/create-familiar-productor.dto';
import { UpdateFamiliarProductorDto } from './dto/update-familiar-productor.dto';

@UseGuards(JwtAuthGuard)
@Controller('productores/:productorId/familiares')
export class FamiliaresProductorController {
  constructor(private readonly service: FamiliaresProductorService) {}

  @Get()
  findAll(@Param('productorId', ParseIntPipe) productorId: number) {
    return this.service.findByProductor(productorId);
  }

  @Get(':id')
  findOne(
    @Param('productorId', ParseIntPipe) productorId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.findOne(id, productorId);
  }

  @Post()
  create(
    @Param('productorId', ParseIntPipe) productorId: number,
    @Body() dto: CreateFamiliarProductorDto,
  ) {
    return this.service.create(productorId, dto);
  }

  @Put(':id')
  update(
    @Param('productorId', ParseIntPipe) productorId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFamiliarProductorDto,
  ) {
    return this.service.update(id, productorId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('productorId', ParseIntPipe) productorId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.service.remove(id, productorId);
  }
}
