import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConfiguracionService } from './configuracion.service';
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto';

@Controller('configuracion')
@UseGuards(JwtAuthGuard)
export class ConfiguracionController {
  constructor(private readonly svc: ConfiguracionService) {}

  @Get()
  get() {
    return this.svc.get();
  }

  @Put()
  update(@Body() dto: UpdateConfiguracionDto) {
    return this.svc.update(dto);
  }
}
