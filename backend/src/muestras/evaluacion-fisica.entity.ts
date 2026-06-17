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
import { Muestra } from './muestra.entity';
import { User } from '../users/user.entity';

 
@Entity('evaluaciones_fisicas')
export class EvaluacionFisica {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ unique: true })
  muestraId: number;

  @OneToOne(() => Muestra, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'muestraId' })
  muestra: Muestra;

   
  @Column({ length: 10 })
  productoTipo: string;

   
  @Column({ type: 'jsonb', default: '{}' })
  camposJson: Record<string, unknown>;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  puntajeTotal: number | null;

  @Column({ nullable: true })
  evaluadorId: number | null;

  @ManyToOne(() => User, { eager: false, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'evaluadorId' })
  evaluador: User;

  @Column({ type: 'date', nullable: true })
  fecha: string | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
