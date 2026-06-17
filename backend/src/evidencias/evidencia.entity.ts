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

@Entity('evidencias')
export class Evidencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  productorId: number;

  @ManyToOne(() => Productor, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productorId' })
  productor: Productor;

   
  @Column({ length: 300 })
  nombreArchivo: string;

   
  @Column({ length: 500 })
  filePath: string;

   
  @Column({ length: 300, nullable: true })
  originalFilename: string | null;

  @Column({ length: 200, nullable: true })
  mimeType: string | null;

  @Column({ nullable: true })
  fileSize: number | null;

   
  @Column({ default: 1 })
  version: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
