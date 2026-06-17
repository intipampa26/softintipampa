import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TipoProductoEnum {
  CAFE  = 'CAFE',
  CACAO = 'CACAO',
}

 
@Entity('tipos_producto')
export class TipoProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TipoProductoEnum, unique: true })
  tipo: TipoProductoEnum;

   
  @Column({ length: 100 })
  subtipoEntrada: string;

   
  @Column({ length: 100 })
  subtipoSalida: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
