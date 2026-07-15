import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Campana } from '../campanas/campana.entity';

export enum ProductorTipoProducto {
  CAFE       = 'cafe',
  CACAO      = 'cacao',
  CAFE_CACAO = 'cafe_cacao',
}

export enum ProductorTipoProductor {
  INDIVIDUAL = 'individual',
  ACOPIADOR  = 'acopiador',
}

@Entity('productores')
export class Productor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  nombre: string;

  @Column({ length: 200, nullable: true })
  apellido: string | null;

  @Column({ type: 'enum', enum: ProductorTipoProductor, nullable: true })
  tipoProductor: ProductorTipoProductor | null;

  @Column({ length: 50, nullable: true })
  nroDocumento: string | null;

  @Column({ length: 20, nullable: true })
  telefono: string | null;

  @Column({ length: 200, nullable: true })
  email: string | null;

  @Column({ type: 'text', nullable: true })
  direccion: string | null;

  @Column({ length: 100, nullable: true })
  departamento: string | null;

  @Column({ length: 100, nullable: true })
  provincia: string | null;

  @Column({ length: 100, nullable: true })
  distrito: string | null;

   
  @Column({ length: 10, nullable: true })
  codigoUbigeo: string | null;

  

   
  @Column({ type: 'date', nullable: true })
  fecha: string | null;

   
  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

   
  @Column({ length: 500, nullable: true })
  fotoUrl: string | null;

   
  @Column({ type: 'enum', enum: ProductorTipoProducto, nullable: true })
  tipoProducto: ProductorTipoProducto | null;

   
  @Column({ default: true })
  esApto: boolean;

  

   
  @Column({ length: 200, nullable: true })
  familiarNombreProductor: string | null;

  @Column({ nullable: true })
  familiarEdadProductor: number | null;

   
  @Column({ length: 50, nullable: true })
  familiarEstadoCivil: string | null;

   
  @Column({ length: 50, nullable: true })
  familiarGradoInstruccion: string | null;

  
  @Column({ length: 200, nullable: true })
  conyugeNombre: string | null;

  @Column({ nullable: true })
  conyugeEdad: number | null;

  @Column({ length: 100, nullable: true })
  conyugeOcupacion: string | null;

  @Column({ length: 50, nullable: true })
  conyugeGradoInstruccion: string | null;

   
  @Column({ type: 'text', nullable: true })
  hijosData: string | null;

  

   
  @Column({ nullable: true })
  tieneEnfermedadEspecial: boolean | null;

   
  @Column({ type: 'text', nullable: true })
  enfermedadesPreexistentes: string | null;

   
  @Column({ length: 50, nullable: true })
  seguroMedico: string | null;

  

  @Column({ nullable: true })
  tieneAgua: boolean | null;

  @Column({ nullable: true })
  tieneDesague: boolean | null;

  @Column({ nullable: true })
  tieneLuz: boolean | null;

  @Column({ nullable: true })
  tieneInternet: boolean | null;

  @Column({ nullable: true })
  tieneBanio: boolean | null;

  @Column({ length: 100, nullable: true })
  empresaTipo: string | null;

  @Column({ length: 200, nullable: true })
  empresaGerenteGeneral: string | null;

  @Column({ nullable: true, length: 10 })
  empresaAnioInicio: string | null;

  @Column({ type: 'text', nullable: true })
  empresaInfoLegal: string | null;

  @Column({ length: 200, nullable: true })
  empresaNombreComercial: string | null;

  @Column({ length: 200, nullable: true })
  empresaAcopiador: string | null;

  @Column({ type: 'text', nullable: true })
  empresaInfoSunat: string | null;

  @Column({ nullable: true, type: 'int' })
  empresaCantTrabajadores: number | null;

  @Column({ nullable: true })
  registradoSunat: boolean | null;

  @Column({ nullable: true })
  activoSunat: boolean | null;

  @Column({ nullable: true })
  declaroImpuestosPrevios: boolean | null;

  @Column({ length: 100, nullable: true })
  certificaciones: string | null;

  @Column({ nullable: true })
  cuentaConPoliticas: boolean | null;

  @Column({ type: 'text', nullable: true })
  cualesPoliticas: string | null;

  @Column({ length: 100, nullable: true })
  registrosGestionDatos: string | null;

  @Column({ nullable: true })
  trabajadoresReglaSunafil: boolean | null;

  @Column({ nullable: true })
  denunciasUsurpacion: boolean | null;

  @Column({ type: 'text', nullable: true })
  cualesUsurpacion: string | null;

  @Column({ nullable: true })
  denunciasCorrupcion: boolean | null;

  @Column({ type: 'text', nullable: true })
  cualesCorrupcion: string | null;

  @Column({ nullable: true })
  incidenciasVisita: boolean | null;

  @Column({ type: 'text', nullable: true })
  cualesIncidencias: string | null;

  @Column({ default: true })
  activo: boolean;

  

   
  @Column({ nullable: true })
  clonedFromId: number | null;

  

  @Index()
  @Column({ nullable: true })
  campanaId: number | null;

  @ManyToOne(() => Campana, { eager: false, onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'campanaId' })
  campana: Campana | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
