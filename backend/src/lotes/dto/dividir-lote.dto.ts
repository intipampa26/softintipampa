import {
  IsArray, IsInt, IsNumber, IsString, IsOptional,
  MaxLength, Min,
  ValidateNested, ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DivisionItemDto {
   
  @IsString()
  @IsOptional()
  @MaxLength(50)
  codigoLf?: string;

  @IsNumber()
  @Min(0.001)
  @Type(() => Number)
  cantidadKg: number;
}

export class DividirLoteDto {
  @IsInt()
  @Min(1)
  loteId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DivisionItemDto)
  @ArrayMinSize(2, { message: 'Se necesitan al menos 2 partes para dividir un lote' })
  divisiones: DivisionItemDto[];
}
