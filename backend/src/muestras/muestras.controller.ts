import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, ParseIntPipe,
  UseGuards, UseInterceptors, UploadedFile,
  HttpCode, HttpStatus, Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/user.entity';
import { MuestrasService } from './muestras.service';
import { CreateMuestraDto } from './dto/create-muestra.dto';
import { UpdateMuestraDto } from './dto/update-muestra.dto';
import { FilterMuestrasDto } from './dto/filter-muestras.dto';
import { BatchSyncDto } from './dto/batch-sync.dto';
import { CreateEvaluacionFisicaDto } from './dto/create-evaluacion-fisica.dto';
import { CreateEvaluacionSensorialDto } from './dto/create-evaluacion-sensorial.dto';

@UseGuards(JwtAuthGuard)
@Controller('muestras')
export class MuestrasController {
  constructor(private readonly service: MuestrasService) {}

  

  @Get()
  findAll(@Query() filter: FilterMuestrasDto) {
    return this.service.findAll(filter);
  }

  @Get('export/preview')
  exportPreview(@Query() filter: FilterMuestrasDto) {
    return this.service.exportPreview(filter);
  }

  @Get('export/excel')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async exportExcel(
    @Query() filter: FilterMuestrasDto,
    @Res({ passthrough: false }) res: Response,
  ) {
    const buffer = await this.service.exportExcel(filter);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="muestras-${new Date().toISOString().slice(0, 10)}.xlsx"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

  @Put('sync')
  batchSync(@Body() dto: BatchSyncDto) {
    return this.service.batchSync(dto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Get(':id/detalle')
  findDetalle(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOneWithEvaluaciones(id);
  }

  @Post('import')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  importHistorico(@UploadedFile() file: { buffer: Buffer }) {
    return this.service.importHistorico(file.buffer);
  }

  

  @Post()
  create(@Body() dto: CreateMuestraDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMuestraDto,
  ) {
    return this.service.update(id, dto);
  }

  @Patch(':id')
  patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMuestraDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  

   
  @Post(':id/evaluacion-fisica')
  upsertEvaluacionFisica(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateEvaluacionFisicaDto,
  ) {
    return this.service.upsertEvaluacionFisica(id, dto);
  }

   
  @Put(':id/evaluacion-fisica/:evalId')
  updateEvaluacionFisica(
    @Param('id',     ParseIntPipe) id:     number,
    @Param('evalId', ParseIntPipe) evalId: number,
    @Body() dto: CreateEvaluacionFisicaDto,
  ) {
    return this.service.updateEvaluacionFisica(id, evalId, dto);
  }

   
  @Post(':id/evaluacion-sensorial')
  upsertEvaluacionSensorial(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateEvaluacionSensorialDto,
  ) {
    return this.service.upsertEvaluacionSensorial(id, dto);
  }

   
  @Put(':id/evaluacion-sensorial/:evalId')
  updateEvaluacionSensorial(
    @Param('id',     ParseIntPipe) id:     number,
    @Param('evalId', ParseIntPipe) evalId: number,
    @Body() dto: CreateEvaluacionSensorialDto,
  ) {
    return this.service.updateEvaluacionSensorial(id, evalId, dto);
  }
}
