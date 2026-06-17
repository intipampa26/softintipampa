
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
import { Productor } from '../productores/productor.entity';

export enum Parentesco {
  CONYUGUE   = 'conyugue',
  HIJO       = 'hijo',
  HIJA       = 'hija',
  PADRE      = 'padre',
  MADRE      = 'madre',
  HERMANO    = 'hermano',
  HERMANA    = 'hermana',
  ABUELO     = 'abuelo',
  ABUELA     = 'abuela',
  NIETO      = 'nieto',
  NIETA      = 'nieta',
  TIO        = 'tio',
  TIA        = 'tia',
  SOBRINO    = 'sobrino',
  SOBRINA    = 'sobrina',
  PRIMO      = 'primo',
  PRIMA      = 'prima',
  SUEGRO     = 'suegro',
  SUEGRA     = 'suegra',
  YERNO      = 'yerno',
  NUERA      = 'nuera',
  OTRO       = 'otro',
}

export enum TipoDocumento {
  DNI       = 'dni',
  CE        = 'ce',
  PASAPORTE = 'pasaporte',
  PARTIDA   = 'partida_nacimiento',
  OTRO      = 'otro',
}

export enum Sexo {
  MASCULINO = 'masculino',
  FEMENINO  = 'femenino',
  OTRO      = 'otro',
}

@Entity('familiares_productor')
export class FamiliarProductor {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  productorId: number;

  @ManyToOne(() => Productor, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productorId' })
  productor: Productor;

  

  @Column({ length: 200 })
  nombres: string;

  @Column({ length: 200 })
  apellidos: string;

  @Column({ type: 'enum', enum: Parentesco, default: Parentesco.OTRO })
  parentesco: Parentesco;

  @Column({ type: 'enum', enum: Sexo, nullable: true })
  sexo: Sexo | null;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: string | null;

  

  @Column({ type: 'enum', enum: TipoDocumento, nullable: true })
  tipoDocumento: TipoDocumento | null;

  @Column({ length: 50, nullable: true })
  nroDocumento: string | null;

  

  @Column({ length: 20, nullable: true })
  telefono: string | null;

  @Column({ length: 200, nullable: true })
  correo: string | null;

  @Column({ type: 'text', nullable: true })
  direccion: string | null;

  

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
