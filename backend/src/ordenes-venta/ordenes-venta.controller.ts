import {
  Controller, Get, Post, Put, Delete, Patch,
  Body, Param, Query, ParseIntPipe, UseGuards, HttpCode, HttpStatus,
  UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { mkdirSync } from 'fs';
import { JwtAuthGuard }         from '../auth/jwt-auth.guard';
import { OrdenesVentaService }  from './ordenes-venta.service';
import { CreateOrdenVentaDto }  from './dto/create-orden-venta.dto';
import { UpdateOrdenVentaDto }  from './dto/update-orden-venta.dto';
import { FilterOrdenesDto }     from './dto/filter-ordenes.dto';
import { UpdateEtapaDto }       from './dto/update-etapa.dto';
import { UpdatePasoDto }        from './dto/update-paso.dto';
import { UpsertPreventaDto }    from './dto/upsert-preventa.dto';
import { UpsertCotizacionDto }  from './dto/upsert-cotizacion.dto';
import { UpsertAlistadoDto }    from './dto/upsert-alistado.dto';
import { UpsertExportacionDto } from './dto/upsert-exportacion.dto';
import { UpsertPostVentaDto }   from './dto/upsert-post-venta.dto';

@UseGuards(JwtAuthGuard)
@Controller('ordenes-venta')
export class OrdenesVentaController {
  constructor(private readonly service: OrdenesVentaService) {}

  @Get()
  findAll(@Query() filter: FilterOrdenesDto) {
    return this.service.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateOrdenVentaDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrdenVentaDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }

  @Patch(':id/etapa')
  updateEtapa(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEtapaDto,
  ) {
    return this.service.updateEtapa(id, dto);
  }

  @Get(':id/pasos')
  findPasos(@Param('id', ParseIntPipe) id: number) {
    return this.service.findPasos(id);
  }

  @Put(':id/pasos/:indice')
  updatePaso(
    @Param('id', ParseIntPipe)     id: number,
    @Param('indice', ParseIntPipe) indice: number,
    @Body() dto: UpdatePasoDto,
  ) {
    return this.service.updatePaso(id, indice, dto);
  }

  @Get(':id/preventa')
  getPreventa(@Param('id', ParseIntPipe) id: number) {
    return this.service.getPreventa(id);
  }

  @Put(':id/preventa')
  upsertPreventa(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertPreventaDto,
  ) {
    return this.service.upsertPreventa(id, dto);
  }

  @Get(':id/cotizacion')
  getCotizacion(@Param('id', ParseIntPipe) id: number) {
    return this.service.getCotizacion(id);
  }

  @Put(':id/cotizacion')
  upsertCotizacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertCotizacionDto,
  ) {
    return this.service.upsertCotizacion(id, dto);
  }

  @Get(':id/alistado')
  getAlistado(@Param('id', ParseIntPipe) id: number) {
    return this.service.getAlistado(id);
  }

  @Put(':id/alistado')
  upsertAlistado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertAlistadoDto,
  ) {
    return this.service.upsertAlistado(id, dto);
  }

  @Get(':id/exportacion')
  getExportacion(@Param('id', ParseIntPipe) id: number) {
    return this.service.getExportacion(id);
  }

  @Put(':id/exportacion')
  upsertExportacion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertExportacionDto,
  ) {
    return this.service.upsertExportacion(id, dto);
  }

  @Post(':id/exportacion/upload/:tipo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req: any, _file: any, cb: any) => {
          const dir = join(
            process.cwd(),
            'uploads',
            'exportacion',
            req.params.id,
            req.params.tipo,
          );
          mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (_req: any, file: any, cb: any) => {
          const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniquePrefix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  uploadExportacionFile(
    @Param('id', ParseIntPipe) id: number,
    @Param('tipo') tipo: 'documentos' | 'reportes',
    @UploadedFile() file: any,
  ) {
    return this.service.uploadExportacionFile(id, tipo, file);
  }

  @Delete(':id/exportacion/upload/:tipo/:filename')
  deleteExportacionFile(
    @Param('id', ParseIntPipe) id: number,
    @Param('tipo') tipo: 'documentos' | 'reportes',
    @Param('filename') filename: string,
  ) {
    return this.service.deleteExportacionFile(id, tipo, filename);
  }

  @Get(':id/post-venta')
  getPostVenta(@Param('id', ParseIntPipe) id: number) {
    return this.service.getPostVenta(id);
  }

  @Put(':id/post-venta')
  upsertPostVenta(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpsertPostVentaDto,
  ) {
    return this.service.upsertPostVenta(id, dto);
  }
}
