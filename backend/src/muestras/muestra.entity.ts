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
import { Campana } from '../campanas/campana.entity';
import { Parcela } from '../parcelas/parcela.entity';
import { LoteFinal } from '../lotes-finales/lote-final.entity';
import { Lote } from '../lotes/lote.entity';

export enum EstadoMuestra {
  PENDIENTE  = 'pendiente',
  EN_PROCESO = 'en_proceso',
  COMPLETADA = 'completada',
  RECHAZADA  = 'rechazada',
}

export enum TipoMuestraProducto {
  PERGAMINO   = 'pergamino',
  ORO         = 'oro',
  GRANO_CACAO = 'grano_cacao',
}

export enum ResultadoMuestra {
  APROBADO   = 'aprobado',
  DESCARTADO = 'descartado',
}

@Entity('muestras')
export class Muestra {
  @PrimaryGeneratedColumn()
  id: number;

   
  @Index({ unique: true })
  @Column({ length: 36, nullable: true })
  clientId: string | null;

   
  @Column({ length: 50, unique: true })
  codigo: string;

  

  @Index()
  @Column({ nullable: true })
  loteFinalId: number | null;

  @ManyToOne(() => LoteFinal, { eager: false, onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'loteFinalId' })
  loteFinal: LoteFinal;

  @Index()
  @Column({ nullable: true })
  loteId: number | null;

  @ManyToOne(() => Lote, { eager: false, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'loteId' })
  lote: Lote;

  @Column({ nullable: true, default: null })
  loteCreado: boolean | null;

  @Index()
  @Column()
  campanaId: number;

  @ManyToOne(() => Campana, { eager: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'campanaId' })
  campana: Campana;

   
  @Index()
  @Column()
  productorId: number;

  @ManyToOne(() => Productor, { eager: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'productorId' })
  productor: Productor;

   
  @Index()
  @Column({ nullable: true })
  parcelaId: number | null;

  @ManyToOne(() => Parcela, { eager: false, onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'parcelaId' })
  parcela: Parcela;

  

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  cantidadKg: number | null;

  @Column({ type: 'date', nullable: true })
  fechaRegistro: string | null;

  @Column({ type: 'enum', enum: TipoMuestraProducto, nullable: true })
  tipoMuestra: TipoMuestraProducto | null;

  @Column({ type: 'enum', enum: ResultadoMuestra, nullable: true })
  resultado: ResultadoMuestra | null;

  @Column({ length: 50, nullable: true })
  estadoLote: string | null;

  @Column({ type: 'decimal', precision: 7, scale: 3, nullable: true })
  rendimiento: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humedad: number | null;

  @Column({ length: 200, nullable: true })
  base: string | null;

  @Column({ type: 'enum', enum: EstadoMuestra, default: EstadoMuestra.PENDIENTE })
  estado: EstadoMuestra;

  @Column({ length: 200, nullable: true })
  variedad: string | null;

  @Column({ length: 200, nullable: true })
  proceso: string | null;

  @Column({ length: 100, nullable: true })
  planta: string | null;

  

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  puntajeFisico: number | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  puntajeSensorial: number | null;

  

  @Column({ length: 200, nullable: true })
  categoriaMuestra: string | null;

  @Column({ type: 'date', nullable: true })
  fechaCata: string | null;

  @Column({ nullable: true })
  añoCosecha: number | null;

  @Column({ length: 100, nullable: true })
  pais: string | null;

  @Column({ length: 200, nullable: true })
  region: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
