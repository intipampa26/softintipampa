import {
  IsArray, IsInt, IsNumber, IsOptional, IsString,
  IsNotEmpty, MaxLength, Min,
  ValidateNested, ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrigenMezclaDto {
  @IsInt()
  @Min(1)
  loteId: number;

   
  @IsNumber()
  @Min(0.001)
  @Type(() => Number)
  cantidadKg: number;
}

export class MezclarLotesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrigenMezclaDto)
  @ArrayMinSize(2, { message: 'Se necesitan al menos 2 lotes para mezclar' })
  origenes: OrigenMezclaDto[];

   
  @IsString()
  @IsOptional()
  @MaxLength(50)
  codigoLf?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  campanaId?: number;
}
