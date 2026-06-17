import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

 
@Entity('configuracion')
export class Configuracion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300, nullable: true })
  nombreEmpresa: string | null;

  @Column({ length: 20, nullable: true })
  ruc: string | null;

  @Column({ type: 'text', nullable: true })
  direccion: string | null;

  @Column({ length: 50, nullable: true })
  telefono: string | null;

  @Column({ length: 200, nullable: true })
  email: string | null;

  @Column({ length: 500, nullable: true })
  logoUrl: string | null;

   
  @Column({ length: 100, nullable: true })
  pais: string | null;

  @Column({ length: 10, nullable: true, default: 'PEN' })
  moneda: string | null;

  @Column({ type: 'text', nullable: true })
  variedades: string | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
