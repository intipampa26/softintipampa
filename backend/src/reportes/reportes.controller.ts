import {
  Controller, Get, Query, Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportesService, ExportFilters } from './reportes.service';

@UseGuards(JwtAuthGuard)
@Controller('reportes')
export class ReportesController {
  constructor(private readonly service: ReportesService) {}

  @Get('resumen')
  getResumen(@Query('campanaId') campanaId?: string) {
    return this.service.getResumen(campanaId ? Number(campanaId) : undefined);
  }

  @Get('filter-options')
  getFilterOptions() {
    return this.service.getFilterOptions();
  }

  @Get('export/productores')
  async exportProductores(
    @Query('campanaId') campanaId: string | undefined,
    @Res() res: Response,
  ) {
    const buffer = await this.service.exportProductores(campanaId ? Number(campanaId) : undefined);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="productores.xlsx"');
    res.send(buffer);
  }

  @Get('export/lotes')
  async exportLotes(
    @Query('campanaId') campanaId: string | undefined,
    @Query('sku')        sku:        string | undefined,
    @Query('fecha')      fecha:      string | undefined,
    @Query('fechaDesde') fechaDesde: string | undefined,
    @Query('fechaHasta') fechaHasta: string | undefined,
    @Query('almacen')    almacen:    string | undefined,
    @Res() res: Response,
  ) {
    const f: ExportFilters = { campanaId: campanaId ? Number(campanaId) : undefined, sku, fecha, fechaDesde, fechaHasta, almacen };
    const buffer = await this.service.exportLotes(f);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="lotes.xlsx"');
    res.send(buffer);
  }

  @Get('export/lotes-finales')
  async exportLotesFinales(
    @Query('campanaId') campanaId: string | undefined,
    @Query('sku')        sku:        string | undefined,
    @Query('fecha')      fecha:      string | undefined,
    @Query('fechaDesde') fechaDesde: string | undefined,
    @Query('fechaHasta') fechaHasta: string | undefined,
    @Res() res: Response,
  ) {
    const f: ExportFilters = { campanaId: campanaId ? Number(campanaId) : undefined, sku, fecha, fechaDesde, fechaHasta };
    const buffer = await this.service.exportLotesFinales(f);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="lotes-finales.xlsx"');
    res.send(buffer);
  }

  @Get('export/muestras')
  async exportMuestras(
    @Query('campanaId') campanaId: string | undefined,
    @Query('sku')        sku:        string | undefined,
    @Query('fecha')      fecha:      string | undefined,
    @Query('fechaDesde') fechaDesde: string | undefined,
    @Query('fechaHasta') fechaHasta: string | undefined,
    @Query('almacen')    almacen:    string | undefined,
    @Res() res: Response,
  ) {
    const f: ExportFilters = { campanaId: campanaId ? Number(campanaId) : undefined, sku, fecha, fechaDesde, fechaHasta, almacen };
    const buffer = await this.service.exportMuestras(f);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="muestras.xlsx"');
    res.send(buffer);
  }

  @Get('export/ventas')
  async exportVentas(
    @Query('campanaId') campanaId: string | undefined,
    @Query('sku')        sku:        string | undefined,
    @Query('fecha')      fecha:      string | undefined,
    @Query('fechaDesde') fechaDesde: string | undefined,
    @Query('fechaHasta') fechaHasta: string | undefined,
    @Res() res: Response,
  ) {
    const f: ExportFilters = { campanaId: campanaId ? Number(campanaId) : undefined, sku, fecha, fechaDesde, fechaHasta };
    const buffer = await this.service.exportVentas(f);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="ventas.xlsx"');
    res.send(buffer);
  }

  @Get('acopio/resumen')
  getAcopioResumen(@Query('campanaId') campanaId?: string) {
    return this.service.getAcopioResumen(campanaId ? Number(campanaId) : undefined);
  }

  @Get('trilla/resumen')
  getTrillaResumen(@Query('campanaId') campanaId?: string) {
    return this.service.getTrillaResumen(campanaId ? Number(campanaId) : undefined);
  }

  @Get('ventas/resumen')
  getVentasResumen(@Query('campanaId') campanaId?: string) {
    return this.service.getVentasResumen(campanaId ? Number(campanaId) : undefined);
  }
}
