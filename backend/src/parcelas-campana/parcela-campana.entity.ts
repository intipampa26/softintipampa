import {
  Entity, Column, PrimaryGeneratedColumn, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn, Index, Unique,
} from 'typeorm';
import { Parcela } from '../parcelas/parcela.entity';
import { Campana } from '../campanas/campana.entity';

 
@Entity('parcelas_campana')
@Unique(['parcelaId', 'campanaId'])
export class ParcelaCampana {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  parcelaId: number;

  @ManyToOne(() => Parcela, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'parcelaId' })
  parcela: Parcela;

  @Index()
  @Column()
  campanaId: number;

  @ManyToOne(() => Campana, { onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'campanaId' })
  campana: Campana;

  

  @Column({ length: 200, nullable: true })
  nombreFinca: string | null;

  @Column({ type: 'text', nullable: true })
  breveHistoriaInicioProduccion: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  areaTotalFinca: number | null;

  @Column({ nullable: true })
  altitud: number | null;

  @Column({ length: 100, nullable: true })
  estadoPropiedad: string | null;

  @Column({ nullable: true })
  inicioProduccionAnio: number | null;

  

  @Column({ nullable: true })
  controlesBiologicos: boolean | null;

  @Column({ nullable: true })
  usoHerbicidasChala: boolean | null;

  @Column({ length: 200, nullable: true })
  practicaCultivo: string | null;

  @Column({ length: 10, nullable: true })
  rgazar: string | null;

  @Column({ type: 'text', nullable: true })
  metodoFertilizacion: string | null;

  @Column({ type: 'text', nullable: true })
  practicasConservacionAmbiental: string | null;

  

  @Column({ nullable: true })
  tanqueTina: boolean | null;

  @Column({ nullable: true })
  pozoAguasMieles: boolean | null;

  @Column({ nullable: true })
  timbosFermentacion: boolean | null;

  @Column({ nullable: true })
  despulpadora: boolean | null;

  @Column({ nullable: true })
  secadorSolar: boolean | null;

  @Column({ nullable: true })
  compostera: boolean | null;

  @Column({ type: 'text', nullable: true })
  infraOtros: string | null;

  

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  produccion: number | null;

  @Column({ length: 100, nullable: true })
  tipoBeneficio: string | null;

  @Column({ length: 50, nullable: true })
  tipoSecado: string | null;

  

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  hectareasTotales: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  hectareasCafe: number | null;

  @Column({ length: 200, nullable: true })
  variedadesCafe: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  hectareasRenovacion: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  areaPurma: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  areaBosque: number | null;

  @Column({ length: 200, nullable: true })
  tipoArbolesBosque: string | null;

  

  @Column({ nullable: true })
  conoceTipoSuelo: boolean | null;

  @Column({ type: 'text', nullable: true })
  estudioSuelos: string | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperaturaPromedio: number | null;

  @Column({ nullable: true })
  tiempoSecadoDias: number | null;

  @Column({ length: 100, nullable: true })
  periodoCosecha: string | null;

  @Column({ length: 100, nullable: true })
  densidadSombra: string | null;

  @Column({ type: 'text', nullable: true })
  floraFauna: string | null;

  

  @Column({ type: 'text', nullable: true })
  cosechaManejo: string | null;

  @Column({ type: 'text', nullable: true })
  despulpado: string | null;

  @Column({ type: 'text', nullable: true })
  fermentacion: string | null;

  @Column({ type: 'text', nullable: true })
  secadoManejo: string | null;

  @Column({ type: 'text', nullable: true })
  almacenaje: string | null;

  @Column({ type: 'text', nullable: true })
  bienestarLaboral: string | null;

  

  @Column({ type: 'text', nullable: true })
  observacionesCampana: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
