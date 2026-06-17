import {
  Controller, Get, Query, Res, ParseIntPipe,
  UseGuards, Optional,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportesService } from './reportes.service';

@UseGuards(JwtAuthGuard)
@Controller('reportes')
export class ReportesController {
  constructor(private readonly service: ReportesService) {}

  @Get('resumen')
  getResumen(@Query('campanaId') campanaId?: string) {
    return this.service.getResumen(campanaId ? Number(campanaId) : undefined);
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
    @Res() res: Response,
  ) {
    const buffer = await this.service.exportLotes(campanaId ? Number(campanaId) : undefined);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="lotes.xlsx"');
    res.send(buffer);
  }

  @Get('export/lotes-finales')
  async exportLotesFinales(
    @Query('campanaId') campanaId: string | undefined,
    @Res() res: Response,
  ) {
    const buffer = await this.service.exportLotesFinales(campanaId ? Number(campanaId) : undefined);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="lotes-finales.xlsx"');
    res.send(buffer);
  }
}
