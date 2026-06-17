import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { CampanaTemporada } from '../campana.entity';

export class UpdateCampanaDto {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  nombre?: string;

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
