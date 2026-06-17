import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CloneProductorDto {
  @IsInt({ message: 'La campaña destino es requerida' })
  @Min(1)
  @Type(() => Number)
  campanaDestinoId: number;
}
