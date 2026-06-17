import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TiposProductoService } from './tipos-producto.service';

@UseGuards(JwtAuthGuard)
@Controller('tipos-producto')
export class TiposProductoController {
  constructor(private readonly service: TiposProductoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
