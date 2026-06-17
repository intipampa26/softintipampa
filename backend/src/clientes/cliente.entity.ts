import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

   
  @Index({ unique: true })
  @Column({ length: 50 })
  codigo: string;

   
  @Column({ length: 50, nullable: true })
  nroDocumento: string | null;

   
  @Column({ length: 200 })
  nombre: string;

  @Column({ length: 20, nullable: true })
  telefono: string | null;

  @Column({ type: 'text', nullable: true })
  direccion: string | null;

  @Column({ length: 100, nullable: true })
  pais: string | null;

  @Column({ length: 200, nullable: true })
  email: string | null;

   
  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
