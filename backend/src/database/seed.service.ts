import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { OrdenVenta, EtapaOrden } from '../ordenes-venta/orden-venta.entity';
import { OrdenPaso, EstadoPaso, PASOS_LABELS } from '../ordenes-venta/orden-paso.entity';
import { OrdenPreventa }        from '../ordenes-venta/orden-preventa.entity';
import { OrdenCotizacion }      from '../ordenes-venta/orden-cotizacion.entity';
import { UsersService }         from '../users/users.service';
import { UserRole }             from '../users/user.entity';
import { ClientesService }      from '../clientes/clientes.service';
import { TipoProducto, TipoProductoEnum } from '../tipos-producto/tipo-producto.entity';
import { Campana }              from '../campanas/campana.entity';
import { Productor, ProductorTipoProducto } from '../productores/productor.entity';
import { Parcela, ParcelaTipoProducto }     from '../parcelas/parcela.entity';
import { FamiliarProductor, Parentesco, TipoDocumento, Sexo } from '../familiares-productor/familiar-productor.entity';
import { Lote, LoteEstado }     from '../lotes/lote.entity';
import { LoteFinal, LoteFinalEstado, LoteFinalTipoOrigen } from '../lotes-finales/lote-final.entity';
import { LoteFinalOrigen }      from '../lotes-finales/lote-final-origen.entity';
import { Trillado }             from '../trillado/trillado.entity';
import { MovimientoKardex, TipoMovimientoKardex, ReferenciaTipoKardex } from '../kardex/movimiento-kardex.entity';
import { Muestra, EstadoMuestra, TipoMuestraProducto } from '../muestras/muestra.entity';
import { EvaluacionFisica }     from '../muestras/evaluacion-fisica.entity';
import { EvaluacionSensorial }  from '../muestras/evaluacion-sensorial.entity';
import { Merma, TipoMerma }     from '../mermas/merma.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectDataSource()                                          private readonly ds:             DataSource,
    private readonly usersService:                              UsersService,
    private readonly clientesService:                           ClientesService,
    @InjectRepository(TipoProducto)      private tpRepo:        Repository<TipoProducto>,
    @InjectRepository(Campana)           private campanaRepo:   Repository<Campana>,
    @InjectRepository(Productor)         private productorRepo: Repository<Productor>,
    @InjectRepository(Parcela)           private parcelaRepo:   Repository<Parcela>,
    @InjectRepository(FamiliarProductor) private familiarRepo:  Repository<FamiliarProductor>,
    @InjectRepository(Lote)              private loteRepo:      Repository<Lote>,
    @InjectRepository(LoteFinal)         private lfRepo:        Repository<LoteFinal>,
    @InjectRepository(LoteFinalOrigen)   private lfOrigenRepo:  Repository<LoteFinalOrigen>,
    @InjectRepository(Trillado)          private trilladoRepo:  Repository<Trillado>,
    @InjectRepository(MovimientoKardex)  private kardexRepo:    Repository<MovimientoKardex>,
    @InjectRepository(Muestra)           private muestraRepo:   Repository<Muestra>,
    @InjectRepository(EvaluacionFisica)  private evalFisRepo:   Repository<EvaluacionFisica>,
    @InjectRepository(EvaluacionSensorial) private evalSenRepo: Repository<EvaluacionSensorial>,
    @InjectRepository(OrdenVenta)        private ordenVentaRepo:    Repository<OrdenVenta>,
    @InjectRepository(OrdenPaso)         private ordenPasoRepo:     Repository<OrdenPaso>,
    @InjectRepository(OrdenPreventa)     private preventaRepo:      Repository<OrdenPreventa>,
    @InjectRepository(OrdenCotizacion)   private cotizacionRepo:    Repository<OrdenCotizacion>,
    @InjectRepository(Merma)             private mermaRepo:         Repository<Merma>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const [{ count }] = await this.ds.query(`SELECT COUNT(*)::int AS count FROM users`);
    if (count > 0) {
      await this.ensureTiposProducto();
      return;
    }

    // En producción NUNCA se trunca ni se rellena con datos de demo — eso
    // borraría datos reales si por cualquier motivo la tabla users queda
    // vacía (ej. se elimina el único usuario por error). Solo se garantiza
    // que exista un admin con el que entrar y los tipos de producto base.
    if (process.env.NODE_ENV === 'production') {
      await this.seedAdminUser();
      await this.ensureTiposProducto();
      return;
    }

    await this.truncateAll();
    await this.seedAdminUser();
    await this.seedClientes();
    await this.seedTiposProducto();
    await this.seedDemoData();
  }

  private async ensureTiposProducto(): Promise<void> {
    const existing = await this.tpRepo.count();
    if (existing > 0) return;
    await this.seedTiposProducto();
  }

  private async truncateAll(): Promise<void> {
    this.logger.log('🗑️  Truncating all tables...');
    await this.ds.query(`
      TRUNCATE TABLE
        orden_alistado, orden_exportacion, orden_post_venta,
        orden_preventa, orden_cotizaciones, orden_pasos, ordenes_venta,
        evaluaciones_sensoriales, evaluaciones_fisicas, muestras,
        movimientos_cadex, mermas, trillados,
        lote_final_origenes, lotes_finales, lotes,
        familiares_productor, parcelas, productores,
        campanas, tipos_producto, clientes,
        users
      RESTART IDENTITY CASCADE
    `);
    this.logger.log('✅ All tables truncated');
  }

  private async seedAdminUser(): Promise<void> {
    const hashed = await bcrypt.hash('admin123', 10);
    await this.usersService.create({ username: 'admin', password: hashed, role: UserRole.ADMIN });
    this.logger.log('✅ Admin user seeded');
  }

  private async seedTiposProducto(): Promise<void> {
    await this.tpRepo.save(this.tpRepo.create({ tipo: TipoProductoEnum.CAFE,  subtipoEntrada: 'pergamino',   subtipoSalida: 'oro_verde',    activo: true }));
    await this.tpRepo.save(this.tpRepo.create({ tipo: TipoProductoEnum.CACAO, subtipoEntrada: 'cacao_grano', subtipoSalida: 'cacao_limpio', activo: true }));
    this.logger.log('✅ Tipos de producto seeded');
  }

  private async seedClientes(): Promise<void> {
    const lista = [
      { nombre: 'MATEO SAC',          nroDocumento: '20123456780', telefono: '999111222', direccion: 'Av. Café 100, Miraflores',               pais: 'Perú'          },
      { nombre: 'JUAN SAC',           nroDocumento: '20134567891', telefono: '999222333', direccion: 'Kaffeestraße 22, Hamburgo',              pais: 'Alemania'      },
      { nombre: 'EXPORT PERU S.A.C.', nroDocumento: '20298765432', telefono: '999333444', direccion: 'Jr. Exportación 300, Surco',             pais: 'Perú'          },
      { nombre: 'CACAO PREMIUM SAS',  nroDocumento: '20387654321', telefono: '999444555', direccion: 'Rue de la Chocolaterie 5, Lyon',         pais: 'Francia'       },
      { nombre: 'Volcafe Perú S.A.C.',nroDocumento: '20512347890', telefono: '012345678', direccion: 'Av. El Derby 250, Santiago de Surco',    pais: 'Perú'          },
      { nombre: 'Sucafina S.A.',      nroDocumento: '20587654321', telefono: '900111222', direccion: 'Rue du Rhône 10, Ginebra',               pais: 'Suiza'         },
      { nombre: 'Olam International', nroDocumento: '20612345678', telefono: '900222333', direccion: '9 Temasek Blvd, Singapur',               pais: 'Singapur'      },
      { nombre: 'Nordic Approach AS', nroDocumento: '20698765432', telefono: '900333444', direccion: 'Trondheimsveien 6, Oslo',                pais: 'Noruega'       },
      { nombre: 'Caravela Coffee LLC',nroDocumento: '20723456789', telefono: '900444555', direccion: '1234 Coffee Ave, New York NY',           pais: 'Estados Unidos'},
      { nombre: 'Trabocca B.V.',      nroDocumento: '20787654321', telefono: '900555666', direccion: 'Amstelplein 1, Ámsterdam',               pais: 'Países Bajos'  },
    ];
    for (const d of lista) await this.clientesService.create(d);
    this.logger.log(`✅ ${lista.length} clientes seeded`);
  }

  private async seedDemoData(): Promise<void> {
    this.logger.log('⏳ Seeding full demo data...');

    const [camp2024, camp2025, camp2026] = await this.seedCampanas();
    const tp   = await this.tpRepo.find();
    const cafe  = tp.find(t => t.tipo === TipoProductoEnum.CAFE)!;
    const cacao = tp.find(t => t.tipo === TipoProductoEnum.CACAO)!;

    const productores  = await this.seedProductores(camp2024.id, camp2025.id, camp2026.id);
    await this.seedParcelas(productores);
    await this.seedFamiliares(productores);
    const lotes        = await this.seedLotes(productores, camp2024.id, camp2025.id, camp2026.id, cafe.id, cacao.id);
    const lf           = await this.seedLotesFinales(lotes, camp2024.id, camp2025.id, camp2026.id, cafe.id, cacao.id);
    const trillados    = await this.seedTrillados(lf);
    await this.seedMermas(lf, trillados);
    await this.seedKardex(lf, trillados);
    await this.seedMuestras(productores, lotes, lf, camp2024.id, camp2025.id, camp2026.id);
    const ordenes      = await this.seedOrdenesVenta(lf);
    await this.seedOrdenPasos(ordenes);
    await this.seedPreventaYCotizacion(ordenes);

    this.logger.log('✅ Full demo data seeded successfully');
  }

  private async seedCampanas(): Promise<[Campana, Campana, Campana]> {
    const c2024 = await this.campanaRepo.save(this.campanaRepo.create({
      nombre: 'Campaña Selva Norte 2024', descripcion: 'Temporada cerrada 2024', temporada: 'cafe_cacao' as any,
      fechaInicio: '2024-03-01', fechaFin: '2024-11-30',
    }));
    const c2025 = await this.campanaRepo.save(this.campanaRepo.create({
      nombre: 'Campaña Selva Norte 2025', descripcion: 'Temporada cerrada 2025', temporada: 'cafe_cacao' as any,
      fechaInicio: '2025-03-01', fechaFin: '2025-11-30',
    }));
    const c2026 = await this.campanaRepo.save(this.campanaRepo.create({
      nombre: 'Campaña Selva Norte 2026', descripcion: 'Temporada activa 2026', temporada: 'cafe_cacao' as any,
      fechaInicio: '2026-03-01', fechaFin: '2026-11-30',
    }));
    this.logger.log('✅ 3 campañas seeded');
    return [c2024, c2025, c2026];
  }

  private async seedProductores(camp2024Id: number, camp2025Id: number, camp2026Id: number): Promise<Productor[]> {
    const rows = [
      { nombre: 'Juan Carlos',   apellido: 'Ríos López',        nroDocumento: '47823561', telefono: '946381720', email: 'jrios@gmail.com',       direccion: 'Caserío El Paraíso, Jaén, Cajamarca',               tipoProducto: ProductorTipoProducto.CAFE,       esApto: true,  campanaId: camp2026Id, fecha: '2026-03-15', descripcion: 'Café de altura, Caturra y Bourbon, 12 años de experiencia. Proceso lavado.' },
      { nombre: 'María Elena',   apellido: 'Soto Huanca',       nroDocumento: '29543817', telefono: '952814630', email: 'msoto@hotmail.com',     direccion: 'Comunidad Nuevo Amazonas, Tocache, San Martín',      tipoProducto: ProductorTipoProducto.CACAO,      esApto: true,  campanaId: camp2026Id, fecha: '2026-03-18', descripcion: 'Cacao CCN-51 y clon nativo. Socia fundadora de la cooperativa.' },
      { nombre: 'Carlos Alberto',apellido: 'Mendoza Paredes',   nroDocumento: '38291047', telefono: '963520481', email: 'cmendoza@gmail.com',    direccion: 'Finca San José, Satipo, Junín',                      tipoProducto: ProductorTipoProducto.CAFE,       esApto: true,  campanaId: camp2026Id, fecha: '2026-04-02', descripcion: 'Cafés especiales. Geisha y Pache. Certificación orgánica en proceso.' },
      { nombre: 'Ana Lucía',     apellido: 'Vásquez Torres',    nroDocumento: '45671289', telefono: '971234856', email: 'avasquez@gmail.com',    direccion: 'Caserío La Florida, Oxapampa, Pasco',               tipoProducto: ProductorTipoProducto.CAFE_CACAO,  esApto: true,  campanaId: camp2026Id, fecha: '2026-04-10', descripcion: 'Diversifica producción en distintas altitudes. Café Catimor y cacao.' },
      { nombre: 'Roberto Enrique',apellido: 'Díaz Silva',       nroDocumento: '31782934', telefono: '948762031', email: null,                   direccion: 'Sector Bella Vista, San Ignacio, Cajamarca',         tipoProducto: ProductorTipoProducto.CAFE,       esApto: false, campanaId: camp2026Id, fecha: '2026-04-20', descripcion: 'En observación por deficiencias en post-cosecha.' },
      { nombre: 'Rosa Inés',     apellido: 'Huamán Quispe',     nroDocumento: '26547893', telefono: '935671240', email: 'rhuaman@gmail.com',     direccion: 'Comunidad Tres de Mayo, Juanjuí, San Martín',        tipoProducto: ProductorTipoProducto.CACAO,      esApto: true,  campanaId: camp2025Id, fecha: '2025-04-05', descripcion: 'Cacao fino de aroma. Ganadora concurso regional 2024.' },
      { nombre: 'Pedro Gonzalo', apellido: 'Mamani Cruz',       nroDocumento: '41237856', telefono: '924583761', email: 'pmamani@outlook.com',   direccion: 'Asociación Nueva Unión, Quillabamba, Cusco',         tipoProducto: ProductorTipoProducto.CAFE,       esApto: true,  campanaId: camp2025Id, fecha: '2025-04-12', descripcion: 'Café altura 1900 msnm. Proceso honey y natural.' },
      { nombre: 'Elena Patricia',apellido: 'Condori Flores',    nroDocumento: '35694821', telefono: '968234175', email: 'econdori@gmail.com',    direccion: 'Finca Las Palmas, Puerto Maldonado, Madre de Dios',  tipoProducto: ProductorTipoProducto.CAFE_CACAO,  esApto: true,  campanaId: camp2025Id, fecha: '2025-05-08', descripcion: 'Agroforestería. Café bajo sombra y cacao fino.' },
      { nombre: 'Héctor Manuel', apellido: 'Quispe Arroyo',     nroDocumento: '52387641', telefono: '973621480', email: 'hquispe@gmail.com',     direccion: 'Comunidad El Triunfo, Leoncio Prado, Huánuco',       tipoProducto: ProductorTipoProducto.CAFE,       esApto: true,  campanaId: camp2024Id, fecha: '2024-04-08', descripcion: 'Café Typica y Catimor. Altitud 1200 msnm. Proceso lavado convencional.' },
      { nombre: 'Nora Beatriz',  apellido: 'Lazo Ramos',        nroDocumento: '63849201', telefono: '984720361', email: 'nlazo@gmail.com',       direccion: 'Finca Nueva Esperanza, Rodríguez de Mendoza, Amazonas', tipoProducto: ProductorTipoProducto.CAFE,    esApto: true,  campanaId: camp2024Id, fecha: '2024-03-25', descripcion: 'Café en proceso de certificación USDA Organic. Geisha y Bourbon.' },
    ];
    const result: Productor[] = [];
    for (const d of rows) result.push(await this.productorRepo.save(this.productorRepo.create({ ...d, activo: true })));
    this.logger.log(`✅ ${result.length} productores seeded`);
    return result;
  }

  private async seedParcelas(productores: Productor[]): Promise<void> {
    const defs: Array<Array<Partial<Parcela>>> = [
      [
        { codigo: 'PC-JAE-001', nombre: 'Parcela El Cedro',        tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 3.5, altitud: 1650, variedadesCafe: 'Caturra, Bourbon', periodoCosecha: 'Abril – Agosto',     coordenadas: [{lat:-5.703,lng:-78.813},{lat:-5.702,lng:-78.812},{lat:-5.701,lng:-78.813},{lat:-5.702,lng:-78.814}] as any },
        { codigo: 'PC-JAE-002', nombre: 'Parcela Los Naranjos',    tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 2.0, altitud: 1720, variedadesCafe: 'Typica',            periodoCosecha: 'Mayo – Septiembre', coordenadas: [{lat:-5.706,lng:-78.816},{lat:-5.705,lng:-78.815},{lat:-5.704,lng:-78.816},{lat:-5.705,lng:-78.817}] as any },
        { codigo: 'PC-JAE-003', nombre: 'Parcela Agua Blanca',     tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 1.8, altitud: 1580, variedadesCafe: 'Caturra',           periodoCosecha: 'Abril – Agosto' },
      ],
      [
        { codigo: 'PC-TOC-001', nombre: 'Parcela Huayabamba',      tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 4.2, altitud: 650,  periodoCosecha: 'Todo el año' },
        { codigo: 'PC-TOC-002', nombre: 'Parcela El Aguajal',      tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 2.8, altitud: 590,  periodoCosecha: 'Todo el año' },
      ],
      [
        { codigo: 'PC-SAT-001', nombre: 'Parcela Río Tambo',       tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 5.1, altitud: 1380, variedadesCafe: 'Geisha, Pache',    periodoCosecha: 'Junio – Octubre' },
        { codigo: 'PC-SAT-002', nombre: 'Parcela Alto Camana',     tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 3.3, altitud: 1550, variedadesCafe: 'Caturra',          periodoCosecha: 'Mayo – Septiembre' },
        { codigo: 'PC-SAT-003', nombre: 'Parcela La Rinconada',    tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 1.8, altitud: 1480, variedadesCafe: 'Bourbon' },
      ],
      [
        { codigo: 'PC-OXA-001', nombre: 'Parcela Villa Rica',      tipoProducto: ParcelaTipoProducto.CAFE_CACAO, hectareasTotales: 6.0, altitud: 1050, variedadesCafe: 'Catimor',          periodoCosecha: 'Marzo – Julio' },
        { codigo: 'PC-OXA-002', nombre: 'Parcela El Progreso',     tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 2.5, altitud: 820,  periodoCosecha: 'Todo el año' },
      ],
      [
        { codigo: 'PC-SIG-001', nombre: 'Parcela Bella Vista',     tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 2.2, altitud: 1800, variedadesCafe: 'Typica, Caturra',  periodoCosecha: 'Abril – Agosto' },
      ],
      [
        { codigo: 'PC-JUA-001', nombre: 'Parcela Tres de Mayo',    tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 3.8, altitud: 430,  periodoCosecha: 'Todo el año' },
        { codigo: 'PC-JUA-002', nombre: 'Parcela San Francisco',   tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 2.1, altitud: 480,  periodoCosecha: 'Todo el año' },
      ],
      [
        { codigo: 'PC-QUI-001', nombre: 'Parcela Alto Yanatile',   tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 4.5, altitud: 1900, variedadesCafe: 'Typica, Geisha',   periodoCosecha: 'Mayo – Octubre' },
        { codigo: 'PC-QUI-002', nombre: 'Parcela Maranura',        tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 2.9, altitud: 1750, variedadesCafe: 'Bourbon',          periodoCosecha: 'Junio – Octubre' },
      ],
      [
        { codigo: 'PC-PMA-001', nombre: 'Parcela Los Castaños',    tipoProducto: ParcelaTipoProducto.CAFE_CACAO, hectareasTotales: 7.2, altitud: 260,  periodoCosecha: 'Febrero – Junio' },
        { codigo: 'PC-PMA-002', nombre: 'Parcela El Águila',       tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 3.6, altitud: 290,  periodoCosecha: 'Todo el año' },
      ],
      [
        { codigo: 'PC-HUA-001', nombre: 'Parcela Río Monzón',      tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 3.0, altitud: 1200, variedadesCafe: 'Typica, Catimor',  periodoCosecha: 'Mayo – Agosto' },
        { codigo: 'PC-HUA-002', nombre: 'Parcela Los Laureles',    tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 2.4, altitud: 1100, variedadesCafe: 'Catimor' },
      ],
      [
        { codigo: 'PC-AMZ-001', nombre: 'Parcela Laynabamba',      tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 5.5, altitud: 1850, variedadesCafe: 'Geisha, Bourbon',  periodoCosecha: 'Mayo – Septiembre' },
        { codigo: 'PC-AMZ-002', nombre: 'Parcela Las Moras',       tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 3.1, altitud: 1780, variedadesCafe: 'Typica' },
      ],
    ];

    let cnt = 0;
    for (let i = 0; i < productores.length && i < defs.length; i++) {
      for (const p of defs[i]) {
        await this.parcelaRepo.save(this.parcelaRepo.create({ ...p, productorId: productores[i].id, activo: true, descripcion: null, fechaRegistro: '2026-01-01' }));
        cnt++;
      }
    }
    this.logger.log(`✅ ${cnt} parcelas seeded`);
  }

  private async seedFamiliares(productores: Productor[]): Promise<void> {
    const defs: Array<Array<Partial<FamiliarProductor>>> = [
      [
        { nombres: 'Carmen Rosa',      apellidos: 'Gutiérrez Díaz',  parentesco: Parentesco.CONYUGUE, sexo: Sexo.FEMENINO,  tipoDocumento: TipoDocumento.DNI, nroDocumento: '47823562', telefono: '946381721' },
        { nombres: 'Luis Ángel',       apellidos: 'Ríos Gutiérrez',  parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2005-07-14' },
        { nombres: 'Sofía',            apellidos: 'Ríos Gutiérrez',  parentesco: Parentesco.HIJA,     sexo: Sexo.FEMENINO,  fechaNacimiento: '2009-11-03' },
      ],
      [
        { nombres: 'Marcos Antonio',   apellidos: 'Pérez Soto',      parentesco: Parentesco.CONYUGUE, sexo: Sexo.MASCULINO, tipoDocumento: TipoDocumento.DNI, nroDocumento: '29543818', telefono: '952814631' },
        { nombres: 'Valentina',        apellidos: 'Pérez Soto',      parentesco: Parentesco.HIJA,     sexo: Sexo.FEMENINO,  fechaNacimiento: '2012-04-22' },
      ],
      [
        { nombres: 'Patricia Elena',   apellidos: 'Campos Rivera',   parentesco: Parentesco.CONYUGUE, sexo: Sexo.FEMENINO,  tipoDocumento: TipoDocumento.DNI, nroDocumento: '38291048' },
        { nombres: 'Diego Alonso',     apellidos: 'Mendoza Campos',  parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2003-09-15' },
        { nombres: 'Sebastián',        apellidos: 'Mendoza Campos',  parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2007-01-28' },
      ],
      [
        { nombres: 'Fernando José',    apellidos: 'Luna Rojas',      parentesco: Parentesco.CONYUGUE, sexo: Sexo.MASCULINO, tipoDocumento: TipoDocumento.DNI, nroDocumento: '45671290' },
        { nombres: 'Isabella',         apellidos: 'Luna Vásquez',    parentesco: Parentesco.HIJA,     sexo: Sexo.FEMENINO,  fechaNacimiento: '2015-06-11' },
      ],
      [
        { nombres: 'Lucía Esperanza',  apellidos: 'Quispe Muñoz',   parentesco: Parentesco.CONYUGUE, sexo: Sexo.FEMENINO, tipoDocumento: TipoDocumento.DNI, nroDocumento: '31782935' },
      ],
      [
        { nombres: 'Gilberto',         apellidos: 'Torres Vega',     parentesco: Parentesco.CONYUGUE, sexo: Sexo.MASCULINO, tipoDocumento: TipoDocumento.DNI, nroDocumento: '26547894', telefono: '935671241' },
        { nombres: 'Milagros',         apellidos: 'Torres Huamán',   parentesco: Parentesco.HIJA,     sexo: Sexo.FEMENINO,  fechaNacimiento: '2008-03-30' },
        { nombres: 'Óscar',            apellidos: 'Torres Huamán',   parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2011-10-17' },
      ],
      [
        { nombres: 'Rosario Beatriz',  apellidos: 'Ccoa Quispe',    parentesco: Parentesco.CONYUGUE, sexo: Sexo.FEMENINO,  tipoDocumento: TipoDocumento.DNI, nroDocumento: '41237857' },
        { nombres: 'Alejandro',        apellidos: 'Mamani Ccoa',    parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2001-12-05' },
      ],
      [
        { nombres: 'Hugo Ramiro',      apellidos: 'Flores Apaza',   parentesco: Parentesco.CONYUGUE, sexo: Sexo.MASCULINO, tipoDocumento: TipoDocumento.DNI, nroDocumento: '35694822', telefono: '968234176' },
        { nombres: 'Natalia',          apellidos: 'Flores Condori', parentesco: Parentesco.HIJA,     sexo: Sexo.FEMENINO,  fechaNacimiento: '2006-08-19' },
      ],
      [
        { nombres: 'Gladys Marlene',   apellidos: 'Ramos Huanca',   parentesco: Parentesco.CONYUGUE, sexo: Sexo.FEMENINO, tipoDocumento: TipoDocumento.DNI, nroDocumento: '52387642' },
        { nombres: 'Gino',             apellidos: 'Quispe Ramos',   parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2010-05-20' },
      ],
      [
        { nombres: 'César Augusto',    apellidos: 'Ventura Coral',  parentesco: Parentesco.CONYUGUE, sexo: Sexo.MASCULINO, tipoDocumento: TipoDocumento.DNI, nroDocumento: '63849202' },
        { nombres: 'Mía Valentina',    apellidos: 'Ventura Lazo',   parentesco: Parentesco.HIJA,     sexo: Sexo.FEMENINO,  fechaNacimiento: '2014-09-08' },
        { nombres: 'Renato',           apellidos: 'Ventura Lazo',   parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2017-02-28' },
      ],
    ];

    let cnt = 0;
    for (let i = 0; i < productores.length && i < defs.length; i++) {
      for (const f of defs[i]) {
        await this.familiarRepo.save(this.familiarRepo.create({ ...f, productorId: productores[i].id, activo: true }));
        cnt++;
      }
    }
    this.logger.log(`✅ ${cnt} familiares seeded`);
  }

  private async seedLotes(
    p: Productor[],
    c2024: number, c2025: number, c2026: number,
    cafeId: number, cacaoId: number,
  ): Promise<Lote[]> {
    const batch = [
      { codigo: 'LOT-RIO-2026-001',  tipoProductoId: cafeId,  campanaId: c2026, productorId: p[0].id, cantidadKg: 2800, estado: LoteEstado.PREPARADO,        fechaAdquisicion: '2026-05-10', observaciones: 'Café pergamino seco. Proceso lavado. Calidad exportable.' },
      { codigo: 'LOT-RIO-2026-002',  tipoProductoId: cafeId,  campanaId: c2026, productorId: p[0].id, cantidadKg: 1400, estado: LoteEstado.PRE_ALISTADO, fechaAdquisicion: '2026-06-01', observaciones: 'Segunda entrega. Grano más pequeño, pendiente evaluación.' },
      { codigo: 'LOT-SOT-2026-001',  tipoProductoId: cacaoId, campanaId: c2026, productorId: p[1].id, cantidadKg: 1950, estado: LoteEstado.PREPARADO,        fechaAdquisicion: '2026-05-12', observaciones: 'Cacao grano seco. Fermentación 5 días. Buena calidad organoléptica.' },
      { codigo: 'LOT-SOT-2026-002',  tipoProductoId: cacaoId, campanaId: c2026, productorId: p[1].id, cantidadKg: 1100, estado: LoteEstado.PRE_ADQUISICION,  fechaAdquisicion: '2026-06-15', observaciones: 'Lote en proceso de acopio. Fermentación en curso.' },
      { codigo: 'LOT-MEN-2026-001',  tipoProductoId: cafeId,  campanaId: c2026, productorId: p[2].id, cantidadKg: 3500, estado: LoteEstado.PRE_ALISTADO,     fechaAdquisicion: '2026-05-18', observaciones: 'Lote base dividido en sub-lotes por calidad.' },
      { codigo: 'LOT-MEN-2026-001A', tipoProductoId: cafeId,  campanaId: c2026, productorId: p[2].id, cantidadKg: 1900, estado: LoteEstado.PREPARADO,        fechaAdquisicion: '2026-05-18', observaciones: 'Sub-lote A — grano premium 14/16. Listo para lote final.' },
      { codigo: 'LOT-MEN-2026-001B', tipoProductoId: cafeId,  campanaId: c2026, productorId: p[2].id, cantidadKg: 1550, estado: LoteEstado.PRE_ALISTADO, fechaAdquisicion: '2026-05-18', observaciones: 'Sub-lote B — grano estándar. Pendiente evaluación.' },
      { codigo: 'LOT-VAS-2026-001',  tipoProductoId: cafeId,  campanaId: c2026, productorId: p[3].id, cantidadKg: 1200, estado: LoteEstado.PRE_ALISTADO, fechaAdquisicion: '2026-05-25', observaciones: 'Café zonas mixtas. Perfil frutal y achocolatado.' },
      { codigo: 'LOT-DIA-2026-001',  tipoProductoId: cafeId,  campanaId: c2026, productorId: p[4].id, cantidadKg: 980,  estado: LoteEstado.PRE_ADQUISICION,  fechaAdquisicion: '2026-06-02', observaciones: 'Lote en espera — productor en observación.' },
      { codigo: 'LOT-HUA-2025-001',  tipoProductoId: cacaoId, campanaId: c2025, productorId: p[5].id, cantidadKg: 2350, estado: LoteEstado.PREPARADO,        fechaAdquisicion: '2025-05-20', observaciones: 'Cacao fino de aroma. Fermentación controlada 7 días. Premium.' },
      { codigo: 'LOT-MAM-2025-001',  tipoProductoId: cafeId,  campanaId: c2025, productorId: p[6].id, cantidadKg: 1750, estado: LoteEstado.PRE_ALISTADO, fechaAdquisicion: '2025-06-15', observaciones: 'Café 1900 msnm. Proceso honey. Notas a miel y durazno.' },
      { codigo: 'LOT-CON-2025-001',  tipoProductoId: cafeId,  campanaId: c2025, productorId: p[7].id, cantidadKg: 2100, estado: LoteEstado.PRE_ALISTADO, fechaAdquisicion: '2025-07-08', observaciones: 'Café bajo sombra en sistema agroforestal.' },
      { codigo: 'LOT-QUI-2024-001',  tipoProductoId: cafeId,  campanaId: c2024, productorId: p[8].id, cantidadKg: 3200, estado: LoteEstado.PREPARADO,        fechaAdquisicion: '2024-05-30', observaciones: 'Café Typica. Primer año del productor con la cooperativa.' },
      { codigo: 'LOT-LAZ-2024-001',  tipoProductoId: cafeId,  campanaId: c2024, productorId: p[9].id, cantidadKg: 4100, estado: LoteEstado.PREPARADO,        fechaAdquisicion: '2024-06-10', observaciones: 'Geisha y Bourbon. Alta expectativa de puntaje SCA.' },
    ];

    const lotes: Lote[] = [];
    for (const d of batch) lotes.push(await this.loteRepo.save(this.loteRepo.create({ ...d, activo: true, cantidadSacos: null })));

    await this.loteRepo.update(lotes[5].id, { lotePadreId: lotes[4].id });
    await this.loteRepo.update(lotes[6].id, { lotePadreId: lotes[4].id });

    this.logger.log(`✅ ${lotes.length} lotes seeded`);
    return lotes;
  }

  private async seedLotesFinales(
    lotes: Lote[],
    c2024: number, c2025: number, c2026: number,
    cafeId: number, cacaoId: number,
  ): Promise<LoteFinal[]> {
    const batch = [
      { codigo: 'LF-2026-0001', tipoProductoId: cafeId,  campanaId: c2026, cantidadKg: 2750, tipoOrigen: LoteFinalTipoOrigen.DIRECTO,  estado: LoteFinalEstado.TRILLADO,           fechaCreacion: '2026-05-14', observaciones: 'Café oro verde primera calidad. Taza 87.5 pts SCA.' },
      { codigo: 'LF-2026-0002', tipoProductoId: cacaoId, campanaId: c2026, cantidadKg: 1900, tipoOrigen: LoteFinalTipoOrigen.DIRECTO,  estado: LoteFinalEstado.TRILLADO,           fechaCreacion: '2026-05-16', observaciones: 'Cacao limpio grado 1. Perfil cítrico y floral.' },
      { codigo: 'LF-2026-0003', tipoProductoId: cafeId,  campanaId: c2026, cantidadKg: 1900, tipoOrigen: LoteFinalTipoOrigen.DIVISION, estado: LoteFinalEstado.PENDIENTE_TRILLADO, fechaCreacion: '2026-05-22', observaciones: 'Sub-lote A Mendoza. Pendiente ingreso a trilladora.' },
      { codigo: 'LF-2026-0004', tipoProductoId: cafeId,  campanaId: c2026, cantidadKg: 1380, tipoOrigen: LoteFinalTipoOrigen.DIRECTO,  estado: LoteFinalEstado.PENDIENTE_TRILLADO, fechaCreacion: '2026-06-05', observaciones: 'Lote Ríos segunda entrega. Pendiente trillado.' },
      { codigo: 'LF-2025-0001', tipoProductoId: cacaoId, campanaId: c2025, cantidadKg: 2300, tipoOrigen: LoteFinalTipoOrigen.DIRECTO,  estado: LoteFinalEstado.VENDIDO,            fechaCreacion: '2025-05-25', observaciones: 'Cacao fino vendido a CACAO PREMIUM Francia. FOB Lima.' },
      { codigo: 'LF-2025-0002', tipoProductoId: cafeId,  campanaId: c2025, cantidadKg: 1720, tipoOrigen: LoteFinalTipoOrigen.DIRECTO,  estado: LoteFinalEstado.TRILLADO,           fechaCreacion: '2025-06-18', observaciones: 'Café honey Mamani. Puntaje SCA 90 pts. Mercado de nicho.' },
      { codigo: 'LF-2025-0003', tipoProductoId: cafeId,  campanaId: c2025, cantidadKg: 2060, tipoOrigen: LoteFinalTipoOrigen.DIRECTO,  estado: LoteFinalEstado.TRILLADO,           fechaCreacion: '2025-07-12', observaciones: 'Café Condori. Agroforestal. Mercado europeo.' },
      { codigo: 'LF-2024-0001', tipoProductoId: cafeId,  campanaId: c2024, cantidadKg: 3100, tipoOrigen: LoteFinalTipoOrigen.DIRECTO,  estado: LoteFinalEstado.VENDIDO,            fechaCreacion: '2024-06-05', observaciones: 'Café Quispe. Vendido a Volcafe. Primera exportación.' },
      { codigo: 'LF-2024-0002', tipoProductoId: cafeId,  campanaId: c2024, cantidadKg: 4000, tipoOrigen: LoteFinalTipoOrigen.DIRECTO,  estado: LoteFinalEstado.VENDIDO,            fechaCreacion: '2024-06-15', observaciones: 'Café Lazo. Geisha 88+ pts SCA. Vendido Nordic Approach.' },
    ];

    const lfs: LoteFinal[] = [];
    for (const d of batch) lfs.push(await this.lfRepo.save(this.lfRepo.create({ ...d, activo: true })));

    const origenes = [
      { loteFinalId: lfs[0].id, loteOrigenId: lotes[0].id,  cantidadAportadaKg: 2750 },
      { loteFinalId: lfs[1].id, loteOrigenId: lotes[2].id,  cantidadAportadaKg: 1900 },
      { loteFinalId: lfs[2].id, loteOrigenId: lotes[5].id,  cantidadAportadaKg: 1900 },
      { loteFinalId: lfs[3].id, loteOrigenId: lotes[1].id,  cantidadAportadaKg: 1380 },
      { loteFinalId: lfs[4].id, loteOrigenId: lotes[9].id,  cantidadAportadaKg: 2300 },
      { loteFinalId: lfs[5].id, loteOrigenId: lotes[10].id, cantidadAportadaKg: 1720 },
      { loteFinalId: lfs[6].id, loteOrigenId: lotes[11].id, cantidadAportadaKg: 2060 },
      { loteFinalId: lfs[7].id, loteOrigenId: lotes[12].id, cantidadAportadaKg: 3100 },
      { loteFinalId: lfs[8].id, loteOrigenId: lotes[13].id, cantidadAportadaKg: 4000 },
    ];
    for (const o of origenes) await this.lfOrigenRepo.save(this.lfOrigenRepo.create(o));

    this.logger.log(`✅ ${lfs.length} lotes finales + trazabilidad seeded`);
    return lfs;
  }

  private async seedTrillados(lfs: LoteFinal[]): Promise<Trillado[]> {
    const trillados: Trillado[] = [];
    const rows = [
      { loteFinalId: lfs[0].id, fecha: '2026-05-20', planta: 'CB Jaen',         malla: '14/16', tipoSeleccion: 'Catado electrónico doble pase', encargado: 'Ing. Marco Salazar',    pesoPorQuintalKg: 46, pesoPfKg: 2400, mermaReutilizableKg: 200, mermaDesechableKg: 110, sobranteExportableKg: 40,  observaciones: 'Sin incidentes. Humedad final 10.8%.' },
      { loteFinalId: lfs[1].id, fecha: '2026-05-22', planta: 'Expocafé',        malla: null,    tipoSeleccion: 'Mesa de gravedad',             encargado: 'Ing. Sofía Reyes',      pesoPorQuintalKg: 50, pesoPfKg: 1650, mermaReutilizableKg: 160, mermaDesechableKg:  80, sobranteExportableKg: 10,  observaciones: 'Test de corte: 92% bien fermentado.' },
      { loteFinalId: lfs[4].id, fecha: '2025-06-10', planta: 'Selva Norte',     malla: null,    tipoSeleccion: 'Selección manual + ventilador', encargado: 'Ing. Carlos Vega',     pesoPorQuintalKg: 50, pesoPfKg: 2000, mermaReutilizableKg: 185, mermaDesechableKg:  92, sobranteExportableKg: 23,  observaciones: 'Cacao fino de aroma. Aprobado compradora francesa.' },
      { loteFinalId: lfs[5].id, fecha: '2025-06-25', planta: 'CB Lima',         malla: '15/16', tipoSeleccion: 'Catado electrónico',            encargado: 'Ing. Patricia Rojas',  pesoPorQuintalKg: 46, pesoPfKg: 1580, mermaReutilizableKg: 100, mermaDesechableKg:  35, sobranteExportableKg: 5,   observaciones: 'Café honey premium. Presentación impecable.' },
      { loteFinalId: lfs[6].id, fecha: '2025-07-18', planta: 'Kuska',           malla: '14/15', tipoSeleccion: 'Catado electrónico',            encargado: 'Ing. Marco Salazar',   pesoPorQuintalKg: 46, pesoPfKg: 1890, mermaReutilizableKg: 130, mermaDesechableKg:  50, sobranteExportableKg: 0,   observaciones: 'Agroforestal. Grano irregular por variedad mixta.' },
      { loteFinalId: lfs[7].id, fecha: '2024-06-12', planta: 'Norandino',       malla: '14/16', tipoSeleccion: 'Catado electrónico',            encargado: 'Ing. Luis Guerrero',   pesoPorQuintalKg: 46, pesoPfKg: 2860, mermaReutilizableKg: 165, mermaDesechableKg:  72, sobranteExportableKg: 3,   observaciones: 'Primera exportación Quispe. Buena presentación.' },
      { loteFinalId: lfs[8].id, fecha: '2024-06-20', planta: 'Mego',            malla: '15/16', tipoSeleccion: 'Catado electrónico triple pase', encargado: 'Ing. Patricia Rojas', pesoPorQuintalKg: 46, pesoPfKg: 3700, mermaReutilizableKg: 210, mermaDesechableKg:  82, sobranteExportableKg: 8,   observaciones: 'Geisha 88+ pts. Proceso triple pase para máxima calidad.' },
    ];
    for (const r of rows) {
      const t = await this.trilladoRepo.save(this.trilladoRepo.create({
        ...r,
        cantidadQuintales: Math.floor(r.pesoPfKg / r.pesoPorQuintalKg),
        kgSueltos: r.pesoPfKg - (Math.floor(r.pesoPfKg / r.pesoPorQuintalKg) * r.pesoPorQuintalKg),
      }));
      trillados.push(t);
    }
    this.logger.log(`✅ ${trillados.length} trillados seeded`);
    return trillados;
  }

  private async seedMermas(lfs: LoteFinal[], trillados: Trillado[]): Promise<void> {
    const rows = [
      { codigo: 'MR-2026-LR-001', loteFinalId: lfs[0].id, trilladoId: trillados[0].id, tipoMerma: TipoMerma.REUTILIZABLE, cantidadKg: 200, fecha: '2026-05-20', observaciones: 'Café segunda — apto para exportación estándar' },
      { codigo: 'MR-2026-LD-001', loteFinalId: lfs[0].id, trilladoId: trillados[0].id, tipoMerma: TipoMerma.DESECHABLE,   cantidadKg: 110, fecha: '2026-05-20', observaciones: 'Granos negros, manchados y brozas' },
      { codigo: 'MR-2026-LE-001', loteFinalId: lfs[0].id, trilladoId: trillados[0].id, tipoMerma: TipoMerma.EXPORTABLE,   cantidadKg:  40, fecha: '2026-05-20', observaciones: 'Sobrante exportable mezclado con lote siguiente' },
      { codigo: 'MR-2026-LR-002', loteFinalId: lfs[1].id, trilladoId: trillados[1].id, tipoMerma: TipoMerma.REUTILIZABLE, cantidadKg: 160, fecha: '2026-05-22', observaciones: 'Cacao grado 2 — vendido localmente' },
      { codigo: 'MR-2026-LD-002', loteFinalId: lfs[1].id, trilladoId: trillados[1].id, tipoMerma: TipoMerma.DESECHABLE,   cantidadKg:  80, fecha: '2026-05-22', observaciones: 'Granos germinados, mohosos y pizarrosos' },
      { codigo: 'MR-2025-LR-001', loteFinalId: lfs[4].id, trilladoId: trillados[2].id, tipoMerma: TipoMerma.REUTILIZABLE, cantidadKg: 185, fecha: '2025-06-10', observaciones: 'Cacao grado 2. Vendido en mercado local Juanjuí' },
      { codigo: 'MR-2025-LD-001', loteFinalId: lfs[4].id, trilladoId: trillados[2].id, tipoMerma: TipoMerma.DESECHABLE,   cantidadKg:  92, fecha: '2025-06-10', observaciones: 'Granos defectuosos descartados' },
      { codigo: 'MR-2025-LR-002', loteFinalId: lfs[5].id, trilladoId: trillados[3].id, tipoMerma: TipoMerma.REUTILIZABLE, cantidadKg: 100, fecha: '2025-06-25', observaciones: 'Café segunda honey — mercado nacional' },
      { codigo: 'MR-2025-LD-002', loteFinalId: lfs[5].id, trilladoId: trillados[3].id, tipoMerma: TipoMerma.DESECHABLE,   cantidadKg:  35, fecha: '2025-06-25', observaciones: 'Granos defectuosos proceso honey' },
      { codigo: 'MR-2024-LR-001', loteFinalId: lfs[7].id, trilladoId: trillados[5].id, tipoMerma: TipoMerma.REUTILIZABLE, cantidadKg: 165, fecha: '2024-06-12', observaciones: 'Café segunda Quispe — vendido nacional' },
      { codigo: 'MR-2024-LD-001', loteFinalId: lfs[7].id, trilladoId: trillados[5].id, tipoMerma: TipoMerma.DESECHABLE,   cantidadKg:  72, fecha: '2024-06-12', observaciones: 'Defectos primarios y secundarios' },
      { codigo: 'MR-2024-LR-002', loteFinalId: lfs[8].id, trilladoId: trillados[6].id, tipoMerma: TipoMerma.REUTILIZABLE, cantidadKg: 210, fecha: '2024-06-20', observaciones: 'Café segunda Lazo Geisha — exportación diferenciada' },
      { codigo: 'MR-2024-LD-002', loteFinalId: lfs[8].id, trilladoId: trillados[6].id, tipoMerma: TipoMerma.DESECHABLE,   cantidadKg:  82, fecha: '2024-06-20', observaciones: 'Defectos triple pase' },
    ];
    for (const r of rows) await this.mermaRepo.save(this.mermaRepo.create({ ...r, cantidadSacos: null, activo: true }));
    this.logger.log(`✅ ${rows.length} mermas seeded`);
  }

  private async seedKardex(lfs: LoteFinal[], trillados: Trillado[]): Promise<void> {
    const movs = [
      { loteFinalId: lfs[0].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 2750, saldoKg: 2750, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[0].id, fecha: '2026-05-14', observaciones: 'Ingreso al promover lote Ríos 2026' },
      { loteFinalId: lfs[0].id, tipoMovimiento: TipoMovimientoKardex.MERMA,   cantidadKg: 310,  saldoKg: 2440, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[0].id, fecha: '2026-05-20', observaciones: 'Mermas trillado: LR 200 kg + LD 110 kg' },
      { loteFinalId: lfs[1].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 1900, saldoKg: 1900, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[1].id, fecha: '2026-05-16', observaciones: 'Ingreso al promover lote Soto cacao 2026' },
      { loteFinalId: lfs[1].id, tipoMovimiento: TipoMovimientoKardex.MERMA,   cantidadKg: 240,  saldoKg: 1660, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[1].id, fecha: '2026-05-22', observaciones: 'Mermas: LR 160 kg + LD 80 kg' },
      { loteFinalId: lfs[2].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 1900, saldoKg: 1900, referenciaTipo: ReferenciaTipoKardex.AJUSTE,   referenciaId: null,            fecha: '2026-05-22', observaciones: 'Ingreso sub-lote Mendoza A' },
      { loteFinalId: lfs[3].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 1380, saldoKg: 1380, referenciaTipo: ReferenciaTipoKardex.AJUSTE,   referenciaId: null,            fecha: '2026-06-05', observaciones: 'Ingreso Ríos segunda entrega' },
      { loteFinalId: lfs[4].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 2300, saldoKg: 2300, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[2].id, fecha: '2025-05-25', observaciones: 'Ingreso lote Huamán cacao 2025' },
      { loteFinalId: lfs[4].id, tipoMovimiento: TipoMovimientoKardex.MERMA,   cantidadKg: 277,  saldoKg: 2023, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[2].id, fecha: '2025-06-10', observaciones: 'Mermas: LR 185 kg + LD 92 kg' },
      { loteFinalId: lfs[4].id, tipoMovimiento: TipoMovimientoKardex.SALIDA,  cantidadKg: 2000, saldoKg: 23,   referenciaTipo: ReferenciaTipoKardex.VENTA,    referenciaId: null,            fecha: '2025-07-15', observaciones: 'Venta 40 qq × 50 kg — CACAO PREMIUM Francia. FOB Lima.' },
      { loteFinalId: lfs[5].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 1720, saldoKg: 1720, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[3].id, fecha: '2025-06-18', observaciones: 'Ingreso Mamani café honey 2025' },
      { loteFinalId: lfs[5].id, tipoMovimiento: TipoMovimientoKardex.MERMA,   cantidadKg: 135,  saldoKg: 1585, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[3].id, fecha: '2025-06-25', observaciones: 'Mermas: LR 100 kg + LD 35 kg' },
      { loteFinalId: lfs[5].id, tipoMovimiento: TipoMovimientoKardex.SALIDA,  cantidadKg: 1580, saldoKg: 5,    referenciaTipo: ReferenciaTipoKardex.VENTA,    referenciaId: null,            fecha: '2025-09-20', observaciones: 'Venta a True Origins Coffee — exportación Dinamarca' },
      { loteFinalId: lfs[6].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 2060, saldoKg: 2060, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[4].id, fecha: '2025-07-12', observaciones: 'Ingreso Condori agroforestal 2025' },
      { loteFinalId: lfs[6].id, tipoMovimiento: TipoMovimientoKardex.MERMA,   cantidadKg: 180,  saldoKg: 1880, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[4].id, fecha: '2025-07-18', observaciones: 'Mermas: LR 130 kg + LD 50 kg' },
      { loteFinalId: lfs[7].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 3100, saldoKg: 3100, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[5].id, fecha: '2024-06-05', observaciones: 'Ingreso Quispe café 2024' },
      { loteFinalId: lfs[7].id, tipoMovimiento: TipoMovimientoKardex.MERMA,   cantidadKg: 237,  saldoKg: 2863, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[5].id, fecha: '2024-06-12', observaciones: 'Mermas: LR 165 kg + LD 72 kg' },
      { loteFinalId: lfs[7].id, tipoMovimiento: TipoMovimientoKardex.SALIDA,  cantidadKg: 2860, saldoKg: 3,    referenciaTipo: ReferenciaTipoKardex.VENTA,    referenciaId: null,            fecha: '2024-08-10', observaciones: 'Venta a Volcafe Perú — primera exportación cooperativa' },
      { loteFinalId: lfs[8].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 4000, saldoKg: 4000, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[6].id, fecha: '2024-06-15', observaciones: 'Ingreso Lazo Geisha 2024' },
      { loteFinalId: lfs[8].id, tipoMovimiento: TipoMovimientoKardex.MERMA,   cantidadKg: 292,  saldoKg: 3708, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: trillados[6].id, fecha: '2024-06-20', observaciones: 'Mermas: LR 210 kg + LD 82 kg' },
      { loteFinalId: lfs[8].id, tipoMovimiento: TipoMovimientoKardex.SALIDA,  cantidadKg: 3700, saldoKg: 8,    referenciaTipo: ReferenciaTipoKardex.VENTA,    referenciaId: null,            fecha: '2024-08-25', observaciones: 'Venta a Nordic Approach — Geisha premium exportación Oslo' },
    ];
    for (const m of movs) await this.kardexRepo.save(this.kardexRepo.create(m as any));
    this.logger.log(`✅ ${movs.length} movimientos kardex seeded`);
  }

  private async seedMuestras(
    p: Productor[], lotes: Lote[], lfs: LoteFinal[],
    c2024: number, c2025: number, c2026: number,
  ): Promise<void> {
    const ms = [
      await this.muestraRepo.save(this.muestraRepo.create({ codigo: 'MST-2026-CAFE-001', campanaId: c2026, productorId: p[0].id, loteId: lotes[0].id, loteFinalId: lfs[0].id, tipoMuestra: TipoMuestraProducto.PERGAMINO, cantidadKg: 0.350, fechaRegistro: '2026-05-20', fechaCata: '2026-05-23', humedad: 10.8, rendimiento: 87.3, variedad: 'Caturra / Bourbon', proceso: 'Lavado', base: 'SCA 2020', estado: EstadoMuestra.COMPLETADA, puntajeFisico: 87.0, puntajeSensorial: 87.25, region: 'Jaén, Cajamarca', pais: 'Peru', añoCosecha: 2026, observaciones: 'Taza limpia. Acidez brillante, cuerpo cremoso, posgusto largo a cacao. Exportable.', activo: true })),
      await this.muestraRepo.save(this.muestraRepo.create({ codigo: 'MST-2026-CAFE-002', campanaId: c2026, productorId: p[2].id, loteId: lotes[5].id, loteFinalId: lfs[2].id, tipoMuestra: TipoMuestraProducto.PERGAMINO, cantidadKg: 0.300, fechaRegistro: '2026-05-24', fechaCata: '2026-05-27', humedad: 11.1, rendimiento: 85.9, variedad: 'Geisha / Pache', proceso: 'Lavado', base: 'SCA 2020', estado: EstadoMuestra.COMPLETADA, puntajeFisico: 84.5, puntajeSensorial: 85.5, region: 'Satipo, Junín', pais: 'Peru', añoCosecha: 2026, observaciones: 'Perfil floral Geisha. Excelente acidez cítrica.', activo: true })),
      await this.muestraRepo.save(this.muestraRepo.create({ codigo: 'MST-2026-CAFE-003', campanaId: c2026, productorId: p[3].id, loteId: lotes[7].id, tipoMuestra: TipoMuestraProducto.PERGAMINO, cantidadKg: 0.250, fechaRegistro: '2026-05-28', humedad: 11.8, variedad: 'Catimor', proceso: 'Lavado', base: 'SCA 2020', estado: EstadoMuestra.EN_PROCESO, puntajeFisico: 82.0, region: 'Oxapampa, Pasco', pais: 'Peru', añoCosecha: 2026, observaciones: 'Evaluación física completa. Pendiente sesión de catación.', activo: true })),
      await this.muestraRepo.save(this.muestraRepo.create({ codigo: 'MST-2026-CACAO-001', campanaId: c2026, productorId: p[1].id, loteId: lotes[2].id, loteFinalId: lfs[1].id, tipoMuestra: TipoMuestraProducto.GRANO_CACAO, cantidadKg: 0.250, fechaRegistro: '2026-05-22', fechaCata: '2026-05-25', humedad: 7.2, rendimiento: 86.8, variedad: 'CCN-51 / Clon Nativo', proceso: 'Fermentado 5 días', base: 'IICTE 2023', estado: EstadoMuestra.COMPLETADA, puntajeFisico: 83.0, puntajeSensorial: 79.5, region: 'Tocache, San Martín', pais: 'Peru', añoCosecha: 2026, observaciones: 'Fino de aroma. Florales y frutas amarillas. Grado 1.', activo: true })),
      await this.muestraRepo.save(this.muestraRepo.create({ codigo: 'MST-2025-CAFE-001', campanaId: c2025, productorId: p[6].id, loteId: lotes[10].id, loteFinalId: lfs[5].id, tipoMuestra: TipoMuestraProducto.PERGAMINO, cantidadKg: 0.400, fechaRegistro: '2025-06-10', fechaCata: '2025-06-14', humedad: 10.5, rendimiento: 88.4, variedad: 'Typica', proceso: 'Honey', base: 'SCA 2020', estado: EstadoMuestra.COMPLETADA, puntajeFisico: 88.5, puntajeSensorial: 90.0, region: 'Quillabamba, Cusco', pais: 'Peru', añoCosecha: 2025, observaciones: 'Extraordinario. Miel, durazno y vainilla. Cuerpo sedoso. Candidato concurso.', activo: true })),
      await this.muestraRepo.save(this.muestraRepo.create({ codigo: 'MST-2025-CACAO-001', campanaId: c2025, productorId: p[5].id, loteId: lotes[9].id, loteFinalId: lfs[4].id, tipoMuestra: TipoMuestraProducto.GRANO_CACAO, cantidadKg: 0.500, fechaRegistro: '2025-05-18', fechaCata: '2025-05-22', humedad: 6.9, rendimiento: 88.1, variedad: 'Clon Nativo Fino de Aroma', proceso: 'Fermentado 7 días', base: 'IICTE 2023', estado: EstadoMuestra.COMPLETADA, puntajeFisico: 86.5, puntajeSensorial: 87.5, region: 'Juanjuí, San Martín', pais: 'Peru', añoCosecha: 2025, observaciones: 'Premium. Perfil excepcional. Ganadora concurso regional 2024.', activo: true })),
      await this.muestraRepo.save(this.muestraRepo.create({ codigo: 'MST-2024-CAFE-001', campanaId: c2024, productorId: p[9].id, loteId: lotes[13].id, loteFinalId: lfs[8].id, tipoMuestra: TipoMuestraProducto.PERGAMINO, cantidadKg: 0.350, fechaRegistro: '2024-06-18', fechaCata: '2024-06-22', humedad: 10.2, rendimiento: 89.1, variedad: 'Geisha / Bourbon', proceso: 'Lavado', base: 'SCA 2020', estado: EstadoMuestra.COMPLETADA, puntajeFisico: 89.0, puntajeSensorial: 88.5, region: 'Rodríguez de Mendoza, Amazonas', pais: 'Peru', añoCosecha: 2024, observaciones: 'Geisha 88+ pts SCA. Exportado Nordic Approach Oslo.', activo: true })),
      await this.muestraRepo.save(this.muestraRepo.create({ codigo: 'MST-2026-CAFE-004', campanaId: c2026, productorId: p[0].id, loteId: lotes[1].id, loteFinalId: lfs[3].id, tipoMuestra: TipoMuestraProducto.PERGAMINO, cantidadKg: 0.300, fechaRegistro: '2026-06-08', estado: EstadoMuestra.PENDIENTE, variedad: 'Caturra', proceso: 'Lavado', region: 'Jaén, Cajamarca', pais: 'Peru', añoCosecha: 2026, observaciones: 'Segunda entrega Ríos. Pendiente evaluación completa.', activo: true })),
    ];

    await this.evalFisRepo.save(this.evalFisRepo.create({ muestraId: ms[0].id, productoTipo: 'CAFE', fecha: '2026-05-20', puntajeTotal: 87.0, camposJson: { cafeHumedad: 10.8, cafeRendimiento: 87.3, cafeGranulometria: '14/16', cafeDefectosPrimarios: 0, cafeDefectosSecundarios: 3, cafeColorGrano: 'Verde azulado', cafeOlorGrano: 'Característico, sin defectos' }, observaciones: 'Grano uniforme. Sin manchas. Presentación física excelente.' }));
    await this.evalFisRepo.save(this.evalFisRepo.create({ muestraId: ms[1].id, productoTipo: 'CAFE', fecha: '2026-05-24', puntajeTotal: 84.5, camposJson: { cafeHumedad: 11.1, cafeRendimiento: 85.9, cafeGranulometria: '15/16', cafeDefectosPrimarios: 0, cafeDefectosSecundarios: 5, cafeColorGrano: 'Verde', cafeOlorGrano: 'Característico' }, observaciones: 'Grano bien formado. Algunos con pergamino residual.' }));
    await this.evalFisRepo.save(this.evalFisRepo.create({ muestraId: ms[2].id, productoTipo: 'CAFE', fecha: '2026-05-28', puntajeTotal: 82.0, camposJson: { cafeHumedad: 11.8, cafeRendimiento: 83.2, cafeGranulometria: '14/15', cafeDefectosPrimarios: 0, cafeDefectosSecundarios: 8, cafeColorGrano: 'Verde amarillo', cafeOlorGrano: 'Característico' }, observaciones: 'Algunos defectos por secado irregular.' }));
    await this.evalFisRepo.save(this.evalFisRepo.create({ muestraId: ms[3].id, productoTipo: 'CACAO', fecha: '2026-05-22', puntajeTotal: 83.0, camposJson: { cacaoHumedadPct: 7.2, cacaoPesoCienGranos: 112.4, cacaoFermentacionPct: 88, cacaoCalificacion: 'Grado 1', cacaoDistrito: 'Tocache', cacaoVariedad: 'CCN-51 / Clon Nativo', cacaoEvaluador: 'Ing. Ana Rodríguez' }, observaciones: 'Fermentación 88%. Test corte: 88 bien fermentados. Grado 1.' }));
    await this.evalFisRepo.save(this.evalFisRepo.create({ muestraId: ms[4].id, productoTipo: 'CAFE', fecha: '2025-06-10', puntajeTotal: 88.5, camposJson: { cafeHumedad: 10.5, cafeRendimiento: 88.4, cafeGranulometria: '15/16', cafeDefectosPrimarios: 0, cafeDefectosSecundarios: 2, cafeColorGrano: 'Verde azulado', cafeOlorGrano: 'Aromático, dulce honey' }, observaciones: 'Honey excepcional. Sin defectos primarios.' }));
    await this.evalFisRepo.save(this.evalFisRepo.create({ muestraId: ms[5].id, productoTipo: 'CACAO', fecha: '2025-05-18', puntajeTotal: 86.5, camposJson: { cacaoHumedadPct: 6.9, cacaoPesoCienGranos: 118.2, cacaoFermentacionPct: 91, cacaoCalificacion: 'Grado 1 Premium', cacaoDistrito: 'Juanjuí', cacaoVariedad: 'Clon Nativo Fino de Aroma', cacaoEvaluador: 'Ing. Carlos Vega' }, observaciones: 'Fermentación 91%. 92 bien fermentados. Premio calidad 2024.' }));
    await this.evalFisRepo.save(this.evalFisRepo.create({ muestraId: ms[6].id, productoTipo: 'CAFE', fecha: '2024-06-18', puntajeTotal: 89.0, camposJson: { cafeHumedad: 10.2, cafeRendimiento: 89.1, cafeGranulometria: '15/16', cafeDefectosPrimarios: 0, cafeDefectosSecundarios: 1, cafeColorGrano: 'Verde azulado', cafeOlorGrano: 'Floral, aromático, Geisha' }, observaciones: 'Grano Geisha impecable. Calidad exportación premium.' }));

    await this.evalSenRepo.save(this.evalSenRepo.create({ muestraId: ms[0].id, productoTipo: 'CAFE', fecha: '2026-05-23', puntajeTotal: 87.25, camposJson: { cafeSca: { header: { nombre: 'Sesión 2026-01', fecha: '2026-05-23', mesa: 'A', session: '1' }, sample: { fragTotal: 8.25, sabor: 8.25, saborResidual: 8.0, acidez: 8.5, acidezIntensidad: 'alto', cuerpo: 8.0, cuerpoNivel: 'medio', balance: 8.0, puntosCatador: 8.25, uniformidad: [true,true,true,true,true], tazaLimpia: [true,true,true,true,true], dulzor: [true,true,true,true,true], defectoTazas: 0, notas: 'Naranja, durazno, chocolate. Alta acidez cítrica. Cuerpo cremoso.' } } }, observaciones: 'Café especial exportable. Acidez brillante.' }));
    await this.evalSenRepo.save(this.evalSenRepo.create({ muestraId: ms[1].id, productoTipo: 'CAFE', fecha: '2026-05-27', puntajeTotal: 85.5, camposJson: { cafeSca: { header: { nombre: 'Sesión 2026-02', fecha: '2026-05-27', mesa: 'A', session: '2' }, sample: { fragTotal: 8.0, sabor: 7.75, saborResidual: 7.75, acidez: 8.0, acidezIntensidad: 'alto', cuerpo: 7.75, cuerpoNivel: 'ligero', balance: 7.75, puntosCatador: 8.5, uniformidad: [true,true,true,true,true], tazaLimpia: [true,true,true,true,true], dulzor: [true,true,true,true,true], defectoTazas: 0, notas: 'Jazmín, bergamota, limón. Acidez viva Geisha.' } } }, observaciones: 'Perfil Geisha muy definido. Mercado de nicho.' }));
    await this.evalSenRepo.save(this.evalSenRepo.create({ muestraId: ms[3].id, productoTipo: 'CACAO', fecha: '2026-05-25', puntajeTotal: 79.5, camposJson: { aroma: { intensidad: 4, calidad: 7.5, comentario: 'Cacao, frutas amarillas, jazmín' }, acidez: { intensidad: 3, calidad: 7.0, comentario: 'Media, cítrica' }, amargor: { intensidad: 2, calidad: 7.5, comentario: 'Equilibrado' }, posgusto: { intensidad: 3, calidad: 7.5, comentario: 'Frutal, 45s' }, puntosCatador: 7.5, puntajeTotal: 79.5 }, observaciones: 'Cacao CCN-51 fino de aroma. Apto chocolate premium.' }));
    await this.evalSenRepo.save(this.evalSenRepo.create({ muestraId: ms[4].id, productoTipo: 'CAFE', fecha: '2025-06-14', puntajeTotal: 90.0, camposJson: { cafeSca: { header: { nombre: 'Sesión 2025-06', fecha: '2025-06-14', mesa: 'B', session: '6' }, sample: { fragTotal: 8.75, sabor: 8.75, saborResidual: 8.5, acidez: 9.0, acidezIntensidad: 'alto', cuerpo: 8.5, cuerpoNivel: 'alto', balance: 8.5, puntosCatador: 8.0, uniformidad: [true,true,true,true,true], tazaLimpia: [true,true,true,true,true], dulzor: [true,true,true,true,true], defectoTazas: 0, notas: 'Miel, durazno, vainilla, maracuyá. Cuerpo sedoso.' } } }, observaciones: 'EXTRAORDINARIO. Candidato concurso nacional.' }));
    await this.evalSenRepo.save(this.evalSenRepo.create({ muestraId: ms[5].id, productoTipo: 'CACAO', fecha: '2025-05-22', puntajeTotal: 87.5, camposJson: { aroma: { intensidad: 5, calidad: 8.5, comentario: 'Intenso. Floral, tropical, miel' }, acidez: { intensidad: 3, calidad: 8.0, comentario: 'Viva, limpia' }, amargor: { intensidad: 2, calidad: 8.0, comentario: 'Fino, elegante' }, posgusto: { intensidad: 5, calidad: 8.5, comentario: '+90s floral persistente' }, puntosCatador: 8.5, puntajeTotal: 87.5 }, observaciones: 'PREMIUM clase mundial. Aprobado comprador Francia.' }));
    await this.evalSenRepo.save(this.evalSenRepo.create({ muestraId: ms[6].id, productoTipo: 'CAFE', fecha: '2024-06-22', puntajeTotal: 88.5, camposJson: { cafeSca: { header: { nombre: 'Sesión 2024-04', fecha: '2024-06-22', mesa: 'A', session: '4' }, sample: { fragTotal: 8.5, sabor: 8.5, saborResidual: 8.25, acidez: 8.75, acidezIntensidad: 'alto', cuerpo: 8.25, cuerpoNivel: 'medio', balance: 8.5, puntosCatador: 8.25, uniformidad: [true,true,true,true,true], tazaLimpia: [true,true,true,true,true], dulzor: [true,true,true,true,true], defectoTazas: 0, notas: 'Geisha. Bergamota, durazno, jazmín. Acidez elegante.' } } }, observaciones: 'Geisha premium. Exportado Oslo.' }));

    this.logger.log(`✅ ${ms.length} muestras + evaluaciones seeded`);
  }

  private async seedOrdenesVenta(lfs: LoteFinal[]): Promise<OrdenVenta[]> {
    const batch = [
      { codigo: 'ORD-2024-001', cliente: 'Volcafe Perú S.A.C.',  productor: 'Héctor Quispe Arroyo',    campana: 'Campaña Selva Norte 2024', lote: lfs[7].codigo, cantidadKg: 2860, montoUSD:  42900, fecha: '2024-08-05', destino: 'Alemania',        tipoProducto: 'Café verde',            etapaActual: EtapaOrden.POST_VENTA  },
      { codigo: 'ORD-2024-002', cliente: 'Nordic Approach AS',   productor: 'Nora Lazo Ramos',         campana: 'Campaña Selva Norte 2024', lote: lfs[8].codigo, cantidadKg: 3700, montoUSD:  88800, fecha: '2024-08-20', destino: 'Noruega',         tipoProducto: 'Café especial SCA 88+', etapaActual: EtapaOrden.POST_VENTA  },
      { codigo: 'ORD-2025-001', cliente: 'CACAO PREMIUM SAS',    productor: 'Rosa Huamán Quispe',      campana: 'Campaña Selva Norte 2025', lote: lfs[4].codigo, cantidadKg: 2000, montoUSD:  52000, fecha: '2025-07-10', destino: 'Francia',         tipoProducto: 'Cacao en grano',        etapaActual: EtapaOrden.POST_VENTA  },
      { codigo: 'ORD-2025-002', cliente: 'Caravela Coffee LLC',  productor: 'Pedro Mamani Cruz',       campana: 'Campaña Selva Norte 2025', lote: lfs[5].codigo, cantidadKg: 1580, montoUSD:  31600, fecha: '2025-09-15', destino: 'Estados Unidos',  tipoProducto: 'Café especial SCA 90', etapaActual: EtapaOrden.POST_VENTA  },
      { codigo: 'ORD-2025-003', cliente: 'Trabocca B.V.',        productor: 'Elena Condori Flores',    campana: 'Campaña Selva Norte 2025', lote: lfs[6].codigo, cantidadKg: 1880, montoUSD:  32960, fecha: '2025-10-05', destino: 'Países Bajos',    tipoProducto: 'Café verde agroforestal', etapaActual: EtapaOrden.EXPORTACION },
      { codigo: 'ORD-2026-001', cliente: 'Volcafe Perú S.A.C.',  productor: 'Juan Carlos Ríos López',  campana: 'Campaña Selva Norte 2026', lote: lfs[0].codigo, cantidadKg: 2440, montoUSD:  36600, fecha: '2026-06-01', destino: 'Alemania',        tipoProducto: 'Café verde',            etapaActual: EtapaOrden.EXPORTACION },
      { codigo: 'ORD-2026-002', cliente: 'Olam International',   productor: 'María Elena Soto Huanca', campana: 'Campaña Selva Norte 2026', lote: lfs[1].codigo, cantidadKg: 1660, montoUSD:  41500, fecha: '2026-06-05', destino: 'Singapur',        tipoProducto: 'Cacao en grano',        etapaActual: EtapaOrden.ALISTADO    },
      { codigo: 'ORD-2026-003', cliente: 'Sucafina S.A.',        productor: 'Carlos Mendoza Paredes',  campana: 'Campaña Selva Norte 2026', lote: lfs[2].codigo, cantidadKg: 1900, montoUSD:  38000, fecha: '2026-06-10', destino: 'Suiza',           tipoProducto: 'Café especial SCA 85+', etapaActual: EtapaOrden.ALISTADO    },
      { codigo: 'ORD-2026-004', cliente: 'Nordic Approach AS',   productor: 'Juan Carlos Ríos López',  campana: 'Campaña Selva Norte 2026', lote: lfs[0].codigo, cantidadKg:  800, montoUSD:  19200, fecha: '2026-06-12', destino: 'Noruega',         tipoProducto: 'Café verde',            etapaActual: EtapaOrden.PREVENTA     },
      { codigo: 'ORD-2026-005', cliente: 'JUAN SAC',             productor: 'María Elena Soto Huanca', campana: 'Campaña Selva Norte 2026', lote: lfs[1].codigo, cantidadKg:  500, montoUSD:  12500, fecha: '2026-06-15', destino: 'Alemania',        tipoProducto: 'Cacao en grano',        etapaActual: EtapaOrden.PREVENTA     },
      { codigo: 'ORD-2026-006', cliente: 'MATEO SAC',            productor: 'Carlos Mendoza Paredes',  campana: 'Campaña Selva Norte 2026', lote: lfs[2].codigo, cantidadKg:  950, montoUSD:  19000, fecha: '2026-06-18', destino: 'Perú',             tipoProducto: 'Café especial SCA 85+', etapaActual: EtapaOrden.PREVENTA     },
      { codigo: 'ORD-2026-007', cliente: 'EXPORT PERU S.A.C.',   productor: 'Juan Carlos Ríos López',  campana: 'Campaña Selva Norte 2026', lote: lfs[3].codigo, cantidadKg: 1380, montoUSD:  20700, fecha: '2026-06-18', destino: 'Japón',            tipoProducto: 'Café verde',            etapaActual: EtapaOrden.PREVENTA     },
    ];

    const ordenes: OrdenVenta[] = [];
    for (const d of batch) ordenes.push(await this.ordenVentaRepo.save(this.ordenVentaRepo.create({ ...d, activo: true })));
    this.logger.log(`✅ ${ordenes.length} órdenes de venta seeded`);
    return ordenes;
  }

  private async seedOrdenPasos(ordenes: OrdenVenta[]): Promise<void> {
    const config: Record<string, { comp: number; en: number }[]> = {
      [EtapaOrden.POST_VENTA]:  [{ comp: 9, en: 0 }],
      [EtapaOrden.EXPORTACION]: [{ comp: 7, en: 1 }, { comp: 6, en: 1 }],
      [EtapaOrden.ALISTADO]:    [{ comp: 4, en: 1 }, { comp: 3, en: 1 }],
      [EtapaOrden.PREVENTA]:    [{ comp: 1, en: 1 }, { comp: 0, en: 1 }, { comp: 2, en: 1 }],
    };
    const cursors: Record<string, number> = {};
    const FECHAS = ['2026-01-05','2026-01-08','2026-01-12','2026-01-15','2026-01-20','2026-01-25','2026-01-28','2026-02-03','2026-02-10'];

    for (const orden of ordenes) {
      const etapa   = orden.etapaActual as string;
      const opciones = config[etapa] ?? [{ comp: 0, en: 1 }];
      const idx     = cursors[etapa] ?? 0;
      const { comp, en } = opciones[idx % opciones.length];
      cursors[etapa] = idx + 1;

      const pasos = PASOS_LABELS.map((label, i) => {
        let estado: EstadoPaso = EstadoPaso.PENDIENTE;
        if (i < comp)               estado = EstadoPaso.COMPLETADO;
        else if (i === comp && en)  estado = EstadoPaso.EN_PROCESO;
        return this.ordenPasoRepo.create({
          ordenVentaId: orden.id, indice: i, label, estado,
          fecha:   estado === EstadoPaso.COMPLETADO ? (FECHAS[i] ?? null) : null,
          usuario: estado !== EstadoPaso.PENDIENTE ? 'ops.admin' : null,
        });
      });
      await this.ordenPasoRepo.save(pasos);
    }
    this.logger.log('✅ Pasos de órdenes seeded');
  }

  private async seedPreventaYCotizacion(ordenes: OrdenVenta[]): Promise<void> {
    const preventa = ordenes.filter(o => o.etapaActual === EtapaOrden.PREVENTA);

    for (const [i, ord] of preventa.entries()) {
      await this.preventaRepo.save(this.preventaRepo.create({
        ordenVentaId:   ord.id,
        fechaEnvio:     '2026-06-18',
        fechaRecepcion: i % 2 === 0 ? '2026-06-22' : null,
        clienteNombre:  ord.cliente,
        courier:        ['DHL Express', 'FedEx International', 'Olva Courier'][i % 3],
        costoCourier:   [45, 62, 38][i % 3],
        fitosanitario:  i % 2 === 0 ? 'si' : 'no',
        muestrasDetalle: [],
      }));

      await this.cotizacionRepo.save(this.cotizacionRepo.create({
        ordenVentaId:   ord.id,
        nroCotizacion:  `COT-2026-${String(i + 1).padStart(3, '0')}`,
        fechaCotizacion: '2026-06-18',
        precioUsd:      [15.0, 20.5, 25.0, 18.0][i % 4],
        pesoKg:         ord.cantidadKg,
        incoterm:       ['FOB', 'CIF', 'DAP'][i % 3],
        puerto:         ['Callao, Perú', 'Rotterdam, Países Bajos', 'Hamburg, Alemania'][i % 3],
        condicionesPago: ['30 días', '60 días', 'Carta de crédito'][i % 3],
        validezDias:    15,
        observaciones:  'Precio sujeto a confirmación de calidad. Muestra enviada por DHL.',
      }));
    }

    this.logger.log(`✅ Preventa + cotización seeded para ${preventa.length} órdenes`);
  }
}
