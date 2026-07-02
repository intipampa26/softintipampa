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
import { TipoProducto } from '../tipos-producto/tipo-producto.entity';
import { Campana } from '../campanas/campana.entity';
import { Sku } from '../skus/sku.entity';

export enum LoteFinalTipoOrigen {
  DIRECTO  = 'DIRECTO',   
  DIVISION = 'DIVISION',  
  MEZCLA   = 'MEZCLA',    
}

export enum LoteFinalEstado {
  PENDIENTE_TRILLADO = 'PENDIENTE_TRILLADO',
  TRILLADO           = 'TRILLADO',
  VENDIDO            = 'VENDIDO',
}

 
@Entity('lotes_finales')
export class LoteFinal {
  @PrimaryGeneratedColumn()
  id: number;

   
  @Column({ length: 50, unique: true })
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

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  cantidadKg: number;

  @Column({ type: 'enum', enum: LoteFinalTipoOrigen })
  tipoOrigen: LoteFinalTipoOrigen;

  @Column({ type: 'enum', enum: LoteFinalEstado, default: LoteFinalEstado.PENDIENTE_TRILLADO })
  estado: LoteFinalEstado;

  @Column({ type: 'date', nullable: true })
  fechaCreacion: string | null;

  @Index()
  @Column({ nullable: true })
  skuId: number | null;

  @ManyToOne(() => Sku, { eager: false, onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'skuId' })
  sku: Sku;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
