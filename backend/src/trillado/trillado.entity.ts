import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { LoteFinal } from '../lotes-finales/lote-final.entity';
import { User } from '../users/user.entity';

 
@Entity('trillados')
export class Trillado {
  @PrimaryGeneratedColumn()
  id: number;

   
  @Index()
  @Column({ unique: true })
  loteFinalId: number;

  @OneToOne(() => LoteFinal, { eager: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'loteFinalId' })
  loteFinal: LoteFinal;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ length: 200, nullable: true })
  planta: string | null;

  @Column({ length: 100, nullable: true })
  malla: string | null;

  @Column({ length: 200, nullable: true })
  tipoSeleccion: string | null;

  @Column({ length: 200, nullable: true })
  encargado: string | null;

  @Column({ nullable: true })
  encargadoUsuarioId: number | null;

  @ManyToOne(() => User, { eager: false, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'encargadoUsuarioId' })
  encargadoUsuario: User;

  

   
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  pesoPfKg: number;

   
  @Column({ type: 'decimal', precision: 8, scale: 3 })
  pesoPorQuintalKg: number;

   
  @Column()
  cantidadQuintales: number;

   
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  kgSueltos: number;

   
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  mermaReutilizableKg: number;

   
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  mermaDesechableKg: number;

   
  @Column({ type: 'decimal', precision: 10, scale: 3 })
  sobranteExportableKg: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
