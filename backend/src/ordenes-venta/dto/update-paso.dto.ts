import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { EstadoPaso } from '../orden-paso.entity';

export class UpdatePasoDto {
  @IsEnum(EstadoPaso)
  estado: EstadoPaso;

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsString()
  @IsOptional()
  usuario?: string;
}
