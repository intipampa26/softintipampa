import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { CampanaTemporada } from '../campana.entity';

export class CreateCampanaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(CampanaTemporada)
  @IsOptional()
  temporada?: CampanaTemporada;

  @IsDateString()
  @IsOptional()
  fechaInicio?: string;

  @IsDateString()
  @IsOptional()
  fechaFin?: string;
}
