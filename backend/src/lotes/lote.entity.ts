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
import { TipoProducto } from '../tipos-producto/tipo-producto.entity';

export enum LoteEstado {
  PRE_ADQUISICION = 'PRE_ADQUISICION',
  PRE_ALISTADO    = 'PRE_ALISTADO',
  PREPARADO       = 'PREPARADO',
  EMBARCADO       = 'EMBARCADO',
  EXPORTADO       = 'EXPORTADO',
}

@Entity('lotes')
export class Lote {
  @PrimaryGeneratedColumn()
  id: number;

   
  @Column({ length: 100, unique: true })
  codigo: string;

  @Index()
  @Column()
  tipoProductoId: number;

  @ManyToOne(() => TipoProducto, { eager: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'tipoProductoId' })
  tipoProducto: TipoProducto;

  @Index()
  @Column({ nullable: true })
  campanaId: number | null;

  @ManyToOne(() => Campana, { eager: false, onDelete: 'RESTRICT', nullable: true })
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

   
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidadKg: number;

   
  @Column({ nullable: true })
  cantidadSacos: number | null;

  @Column({ type: 'varchar', length: 30, default: LoteEstado.PRE_ADQUISICION })
  estado: LoteEstado;

  @Column({ type: 'date', nullable: true })
  fechaAdquisicion: string | null;

   
  @Index()
  @Column({ nullable: true })
  lotePadreId: number | null;

  @ManyToOne(() => Lote, { eager: false, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'lotePadreId' })
  lotePadre: Lote;

  @Column({ length: 200, nullable: true })
  variedad: string | null;

  @Column({ length: 200, nullable: true })
  planta: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
