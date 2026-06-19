import {
  Entity, Column, PrimaryGeneratedColumn,
  ManyToOne, JoinColumn, Index,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';
import { OrdenVenta } from './orden-venta.entity';

@Entity('orden_exportacion')
export class OrdenExportacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  ordenVentaId: number;

  @ManyToOne(() => OrdenVenta, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ordenVentaId' })
  ordenVenta: OrdenVenta;

  @Column({ length: 50, nullable: true })
  codExport: string | null;

  @Column({ type: 'date', nullable: true })
  fechaExport: string | null;

  @Column({ length: 100, nullable: true })
  tipoProducto: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cantExport: number | null;

  @Column({ length: 30, nullable: true })
  estadoAvance: string | null;

  @Column({ length: 100, nullable: true })
  nroDua: string | null;

  @Column({ type: 'date', nullable: true })
  fechaDespacho: string | null;

  @Column({ length: 200, nullable: true })
  agente: string | null;

  @Column({ length: 100, nullable: true })
  naviera: string | null;

  @Column({ length: 200, nullable: true })
  almacen: string | null;

  @Column({ length: 150, nullable: true })
  puertoEmbarque: string | null;

  @Column({ length: 150, nullable: true })
  puertoDestino: string | null;

  @Column({ length: 100, nullable: true })
  nroBl: string | null;

  @Column({ length: 100, nullable: true })
  avisoSalida: string | null;

  @Column({ type: 'date', nullable: true })
  fechaSalidaNave: string | null;

  @Column({ type: 'date', nullable: true })
  fechaEmbarque: string | null;

  @Column({ type: 'int', nullable: true })
  cantidadPallets: number | null;

  @Column({ type: 'int', nullable: true })
  cantidadSacos: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  pesoTotal: number | null;

  @Column({ type: 'text', nullable: true })
  evidenciasDespacho: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  costoFob: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  comisionAgente: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  transporteAlmacen: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  costoCertificados: number | null;

  @Column({ length: 100, nullable: true })
  contenedor: string | null;

  @Column({ length: 100, nullable: true })
  nroPrecinto: string | null;

  @Column({ length: 100, nullable: true })
  kardexNro: string | null;

  @Column({ default: false })
  kardexRegistrado: boolean;

  @Column({ type: 'text', nullable: true })
  observAduanero: string | null;

  @Column({ length: 100, nullable: true })
  nroFactura: string | null;

  @Column({ type: 'date', nullable: true })
  fechaFactura: string | null;

  @Column({ type: 'decimal', precision: 14, scale: 2, nullable: true })
  montoFinal: number | null;

  @Column({ length: 5, nullable: true, default: 'USD' })
  monedaCierre: string | null;

  @Column({ type: 'date', nullable: true })
  fechaPagoCierre: string | null;

  @Column({ length: 50, nullable: true })
  estadoPago: string | null;

  @Column({ length: 100, nullable: true })
  banco: string | null;

  @Column({ length: 200, nullable: true })
  nroCuenta: string | null;

  @Column({ type: 'text', nullable: true })
  observCierre: string | null;

  @Column({ type: 'date', nullable: true })
  fechaEnvioDocs: string | null;

  @Column({ length: 100, nullable: true })
  metodoEnvio: string | null;

  @Column({ length: 200, nullable: true })
  contactoCliente: string | null;

  @Column({ type: 'jsonb', nullable: true })
  documentos: Record<string, boolean> | null;

  @Column({ type: 'jsonb', nullable: true })
  certificaciones: Record<string, boolean> | null;

  @Column({ type: 'text', nullable: true })
  observDatos: string | null;

  @Column({ length: 200, nullable: true })
  destinoPlan: string | null;

  @Column({ type: 'jsonb', nullable: true })
  documentosAsociados: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  reportesCalidad: string[] | null;

  @Column({ type: 'jsonb', nullable: true })
  documentacionExportacion: Record<string, unknown> | null;

  @Column({ length: 100, nullable: true })
  campanaPlan: string | null;

  @Column({ length: 300, nullable: true })
  lotesAsociados: string | null;

  @Column({ type: 'date', nullable: true })
  fechaCorte: string | null;

  @Column({ type: 'date', nullable: true })
  fechaZarpe: string | null;

  @Column({ type: 'date', nullable: true })
  fechaEta: string | null;

  @Column({ length: 100, nullable: true })
  navieraPlan: string | null;

  @Column({ length: 150, nullable: true })
  puertoOrigenPlan: string | null;

  @Column({ length: 150, nullable: true })
  puertoDestinoPlan: string | null;

  @Column({ length: 50, nullable: true })
  tipoCont: string | null;

  @Column({ type: 'int', nullable: true })
  cantCont: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  pesoNeto: number | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  pesoBruto: number | null;

  @Column({ type: 'text', nullable: true })
  observPlan: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
