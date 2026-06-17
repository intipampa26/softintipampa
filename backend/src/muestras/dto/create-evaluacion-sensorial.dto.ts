import { IsDateString, IsInt, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

 
export class CreateEvaluacionSensorialDto {
   
  @IsString()
  productoTipo: string;

   
  @IsObject()
  camposJson: Record<string, unknown>;

  @IsNumber() @IsOptional() @Type(() => Number) puntajeTotal?: number;
  @IsInt()    @IsOptional() evaluadorId?: number;
  @IsDateString() @IsOptional() fecha?: string;
  @IsString() @IsOptional() observaciones?: string;
}
