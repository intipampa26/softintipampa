import {
  IsArray, IsEnum, IsISO8601, IsObject,
  IsOptional, IsString, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum OperacionSync {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export class OperacionSyncDto {
   
  @IsString()
  clientId: string;

  @IsEnum(OperacionSync)
  operacion: OperacionSync;

   
  @IsISO8601()
  timestampCliente: string;

   
  @IsObject()
  @IsOptional()
  payload?: Record<string, unknown>;
}

export class BatchSyncDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OperacionSyncDto)
  operaciones: OperacionSyncDto[];
}
