import {
  IsString,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsDateString,
  IsEnum,
  IsBoolean,
  IsIn,
  IsInt,
  IsArray,
  IsNumber,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ParcelaTipoProducto } from '../parcela.entity';

export class LatLngDto {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class CreateParcelaDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString()
  @IsOptional()
  fechaRegistro?: string;

  @IsEnum(ParcelaTipoProducto)
  @IsOptional()
  tipoProducto?: ParcelaTipoProducto;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsIn(['TIENE', 'NO TIENE', 'EN PROCESO'])
  @IsOptional()
  tienePpa?: string;

  @IsInt()
  @Min(1)
  productorId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LatLngDto)
  @IsOptional()
  coordenadas?: LatLngDto[];

  

  @IsString() @IsOptional() @MaxLength(200) nombreFinca?: string;
  @IsString() @IsOptional() breveHistoriaInicioProduccion?: string;
  @IsNumber() @IsOptional() @Type(() => Number) areaTotalFinca?: number;
  @IsInt()    @IsOptional() @Type(() => Number) altitud?: number;
  @IsString() @IsOptional() @MaxLength(100) estadoPropiedad?: string;
  @IsInt()    @IsOptional() @Type(() => Number) inicioProduccionAnio?: number;

  

  @IsBoolean() @IsOptional() controlesBiologicos?: boolean;
  @IsBoolean() @IsOptional() usoHerbicidasChala?: boolean;
  @IsString()  @IsOptional() @MaxLength(200) practicaCultivo?: string;
  @IsString()  @IsOptional() @MaxLength(10)  rgazar?: string;
  @IsString()  @IsOptional() metodoFertilizacion?: string;
  @IsString()  @IsOptional() practicasConservacionAmbiental?: string;

  

  @IsBoolean() @IsOptional() tanqueTina?: boolean;
  @IsBoolean() @IsOptional() pozoAguasMieles?: boolean;
  @IsBoolean() @IsOptional() timbosFermentacion?: boolean;
  @IsBoolean() @IsOptional() despulpadora?: boolean;
  @IsBoolean() @IsOptional() secadorSolar?: boolean;
  @IsBoolean() @IsOptional() compostera?: boolean;
  @IsString()  @IsOptional() infraOtros?: string;

  

  @IsNumber() @IsOptional() @Type(() => Number) produccion2023?: number;
  @IsString() @IsOptional() @MaxLength(100) tipoBeneficio?: string;
  @IsString() @IsOptional() @MaxLength(50)  tipoSecado?: string;

  

  @IsNumber() @IsOptional() @Type(() => Number) hectareasTotales?: number;
  @IsNumber() @IsOptional() @Type(() => Number) hectareasCafe?: number;
  @IsString() @IsOptional() @MaxLength(200) variedadesCafe?: string;
  @IsNumber() @IsOptional() @Type(() => Number) hectareasRenovacion?: number;
  @IsNumber() @IsOptional() @Type(() => Number) areaPurma?: number;
  @IsNumber() @IsOptional() @Type(() => Number) areaBosque?: number;
  @IsString() @IsOptional() @MaxLength(200) tipoArbolesBosque?: string;

  

  @IsBoolean() @IsOptional() conoceTipoSuelo?: boolean;
  @IsString()  @IsOptional() estudioSuelos?: string;
  @IsNumber()  @IsOptional() @Type(() => Number) temperaturaPromedio?: number;
  @IsInt()     @IsOptional() @Type(() => Number) tiempoSecadoDias?: number;
  @IsString()  @IsOptional() @MaxLength(100) periodoCosecha?: string;
  @IsString()  @IsOptional() @MaxLength(100) densidadSombra?: string;
  @IsString()  @IsOptional() floraFauna?: string;

  

  @IsString() @IsOptional() cosechaManejo?: string;
  @IsString() @IsOptional() despulpado?: string;
  @IsString() @IsOptional() fermentacion?: string;
  @IsString() @IsOptional() secadoManejo?: string;
  @IsString() @IsOptional() almacenaje?: string;
  @IsString() @IsOptional() bienestarLaboral?: string;
  @IsInt()    @IsOptional() @Type(() => Number) jornalerosPorCampana?: number;
}
