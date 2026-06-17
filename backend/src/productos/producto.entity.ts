import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProductoUnidad {
  KG      = 'kg',
  TM      = 'tm',
  LITRO   = 'litro',
  UNIDAD  = 'unidad',
  SACO    = 'saco',
}

export enum ProductoCategoria {
  INSUMO      = 'insumo',
  FERTILIZANTE = 'fertilizante',
  PLAGUICIDA  = 'plaguicida',
  SEMILLA     = 'semilla',
  COSECHA     = 'cosecha',
  OTRO        = 'otro',
}

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: ProductoUnidad,
    default: ProductoUnidad.KG,
  })
  unidad: ProductoUnidad;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  precioBase: number;

  @Column({
    type: 'enum',
    enum: ProductoCategoria,
    default: ProductoCategoria.OTRO,
  })
  categoria: ProductoCategoria;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
