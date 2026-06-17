import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CampanaTemporada {
  CAFE       = 'cafe',
  CACAO      = 'cacao',
  CAFE_CACAO = 'cafe_cacao',
}

@Entity('campanas')
export class Campana {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: CampanaTemporada,
    default: CampanaTemporada.CAFE,
  })
  temporada: CampanaTemporada;

  @Column({ type: 'date', nullable: true })
  fechaInicio: string;

  @Column({ type: 'date', nullable: true })
  fechaFin: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
