import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PromoverLfDto {
   
  @IsString()
  @IsOptional()
  @MaxLength(50)
  codigoLf?: string;
}
