import { IsInt, Min } from 'class-validator';

export class AsignarSkuDto {
  @IsInt()
  @Min(1)
  skuId: number;
}
