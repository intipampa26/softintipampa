import {
  Entity, Column, PrimaryGeneratedColumn,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('skus')
export class Sku {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true, nullable: true })
  codigo: string | null;

  @Column({ length: 200, unique: true })
  nombre: string;

  @Column({ length: 50, nullable: true })
  unidad: string | null;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ length: 20, nullable: true })
  codigoHS: string | null;

  @Column({ default: false })
  requiereFito: boolean;

  @Column({ length: 20, nullable: true })
  codigoFDA: string | null;

  @Column({ type: 'text', nullable: true })
  descripcionFDA: string | null;

  @Column({ length: 100, nullable: true })
  nombreFDA: string | null;

  @Column({ default: false })
  soloOtros: boolean;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
