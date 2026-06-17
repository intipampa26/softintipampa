import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/user.entity';
import { ClientesService } from '../clientes/clientes.service';
import { TipoProducto, TipoProductoEnum } from '../tipos-producto/tipo-producto.entity';
import { Campana } from '../campanas/campana.entity';
import { Productor, ProductorTipoProducto } from '../productores/productor.entity';
import { Parcela, ParcelaTipoProducto } from '../parcelas/parcela.entity';
import { FamiliarProductor, Parentesco, TipoDocumento, Sexo } from '../familiares-productor/familiar-productor.entity';
import { Lote, LoteEstado } from '../lotes/lote.entity';
import { LoteFinal, LoteFinalEstado, LoteFinalTipoOrigen } from '../lotes-finales/lote-final.entity';
import { LoteFinalOrigen } from '../lotes-finales/lote-final-origen.entity';
import { Trillado } from '../trillado/trillado.entity';
import { MovimientoKardex, TipoMovimientoKardex, ReferenciaTipoKardex } from '../kardex/movimiento-kardex.entity';
import { Muestra, EstadoMuestra } from '../muestras/muestra.entity';
import { EvaluacionFisica } from '../muestras/evaluacion-fisica.entity';
import { EvaluacionSensorial } from '../muestras/evaluacion-sensorial.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly usersService:    UsersService,
    private readonly clientesService: ClientesService,
    @InjectRepository(TipoProducto)      private tpRepo:       Repository<TipoProducto>,
    @InjectRepository(Campana)           private campanaRepo:   Repository<Campana>,
    @InjectRepository(Productor)         private productorRepo: Repository<Productor>,
    @InjectRepository(Parcela)           private parcelaRepo:   Repository<Parcela>,
    @InjectRepository(FamiliarProductor) private familiarRepo:  Repository<FamiliarProductor>,
    @InjectRepository(Lote)              private loteRepo:      Repository<Lote>,
    @InjectRepository(LoteFinal)         private lfRepo:        Repository<LoteFinal>,
    @InjectRepository(LoteFinalOrigen)   private lfOrigenRepo:  Repository<LoteFinalOrigen>,
    @InjectRepository(Trillado)          private trilladoRepo:  Repository<Trillado>,
    @InjectRepository(MovimientoKardex)   private kardexRepo:     Repository<MovimientoKardex>,
    @InjectRepository(Muestra)           private muestraRepo:   Repository<Muestra>,
    @InjectRepository(EvaluacionFisica)  private evalFisRepo:   Repository<EvaluacionFisica>,
    @InjectRepository(EvaluacionSensorial) private evalSenRepo: Repository<EvaluacionSensorial>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedAdminUser();
    await this.seedClientes();
    await this.seedTiposProducto();
    await this.seedDemoData();
  }

  

  private async seedAdminUser(): Promise<void> {
    const existing = await this.usersService.findByUsername('admin');
    if (existing) {
      this.logger.log('Admin user already exists — skipping seed');
      return;
    }
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await this.usersService.create({ username: 'admin', password: hashedPassword, role: UserRole.ADMIN });
    this.logger.log('✅ Admin user seeded');
  }

  private async seedTiposProducto(): Promise<void> {
    const catalog = [
      { tipo: TipoProductoEnum.CAFE,  subtipoEntrada: 'pergamino',   subtipoSalida: 'oro_verde'    },
      { tipo: TipoProductoEnum.CACAO, subtipoEntrada: 'cacao_grano', subtipoSalida: 'cacao_limpio' },
    ];
    for (const item of catalog) {
      const exists = await this.tpRepo.findOne({ where: { tipo: item.tipo } });
      if (!exists) {
        await this.tpRepo.save(this.tpRepo.create({ ...item, activo: true }));
        this.logger.log(`✅ TipoProducto "${item.tipo}" seeded`);
      }
    }
  }

  private async seedClientes(): Promise<void> {
    const ejemplos = [
      { nombre: 'MATEO SAC',     nroDocumento: '20123456780', telefono: '999111222', direccion: 'Av. Cafe 100',      pais: 'Peru'     },
      { nombre: 'JUAN SAC',      nroDocumento: '20134567891', telefono: '999222333', direccion: 'Kaffeestr. 22',      pais: 'Alemania' },
      { nombre: 'EXPORT PERU',   nroDocumento: '20298765432', telefono: '999333444', direccion: 'Jr. Exportación 300', pais: 'Peru'    },
      { nombre: 'CACAO PREMIUM', nroDocumento: '20387654321', telefono: '999444555', direccion: 'Chocolaterie 5',     pais: 'Francia'  },
    ];
    for (const dto of ejemplos) {
      const existe = await this.clientesService.existsByNombre(dto.nombre);
      if (!existe) {
        await this.clientesService.create(dto);
        this.logger.log(`✅ Cliente "${dto.nombre}" seeded`);
      }
    }
  }

  

  private async seedDemoData(): Promise<void> {
    const yaExiste = await this.campanaRepo.findOne({ where: { nombre: 'Campaña Selva Norte 2026' } });
    if (yaExiste) {
      this.logger.log('Demo data already seeded — skipping');
      return;
    }
    this.logger.log('⏳ Seeding demo data...');

    const [camp2025, camp2026] = await this.seedCampanas();
    const tiposProducto = await this.tpRepo.find();
    const tpCafe  = tiposProducto.find(t => t.tipo === TipoProductoEnum.CAFE)!;
    const tpCacao = tiposProducto.find(t => t.tipo === TipoProductoEnum.CACAO)!;

    const productores     = await this.seedProductores(camp2025.id, camp2026.id);
    await this.seedParcelas(productores);
    await this.seedFamiliares(productores);
    const lotes           = await this.seedLotes(productores, camp2025.id, camp2026.id, tpCafe.id, tpCacao.id);
    const lotesFinales    = await this.seedLotesFinales(lotes, camp2025.id, camp2026.id, tpCafe.id, tpCacao.id);
    await this.seedTrillados(lotesFinales);
    await this.seedMuestras(productores, lotes, camp2025.id, camp2026.id);

    this.logger.log('✅ Demo data seeded successfully');
  }

  private async seedCampanas(): Promise<[Campana, Campana]> {
    const c2025 = await this.campanaRepo.save(this.campanaRepo.create({
      nombre:      'Campaña Selva Norte 2025',
      descripcion: 'Campaña de acopio café y cacao — temporada 2025',
      temporada:   'cafe_cacao' as any,
      fechaInicio: '2025-03-01',
      fechaFin:    '2025-11-30',
    }));
    const c2026 = await this.campanaRepo.save(this.campanaRepo.create({
      nombre:      'Campaña Selva Norte 2026',
      descripcion: 'Campaña de acopio café y cacao — temporada 2026 (activa)',
      temporada:   'cafe_cacao' as any,
      fechaInicio: '2026-03-01',
      fechaFin:    '2026-11-30',
    }));
    this.logger.log('✅ Campañas seeded');
    return [c2025, c2026];
  }

  private async seedProductores(camp2025Id: number, camp2026Id: number): Promise<Productor[]> {
    const data = [
      { nombre: 'Juan Carlos',  apellido: 'Ríos López',       nroDocumento: '47823561', telefono: '946381720', email: 'jrios@gmail.com',     direccion: 'Caserío El Paraíso, Jaén, Cajamarca',              tipoProducto: ProductorTipoProducto.CAFE,       esApto: true,  campanaId: camp2026Id, fecha: '2026-03-15', descripcion: 'Productor de café de altura, variedad Caturra y Bourbon. 12 años de experiencia.' },
      { nombre: 'María Elena',  apellido: 'Soto Huanca',      nroDocumento: '29543817', telefono: '952814630', email: 'msoto@hotmail.com',   direccion: 'Comunidad Nuevo Amazonas, Tocache, San Martín',     tipoProducto: ProductorTipoProducto.CACAO,      esApto: true,  campanaId: camp2026Id, fecha: '2026-03-18', descripcion: 'Socia fundadora de la cooperativa. Cacao CCN-51 y clon nativo.' },
      { nombre: 'Carlos Alberto', apellido: 'Mendoza Paredes', nroDocumento: '38291047', telefono: '963520481', email: 'cmendoza@gmail.com', direccion: 'Finca San José, Satipo, Junín',                     tipoProducto: ProductorTipoProducto.CAFE,       esApto: true,  campanaId: camp2026Id, fecha: '2026-04-02', descripcion: 'Especializado en cafés especiales. Certificación orgánica en proceso.' },
      { nombre: 'Ana Lucía',    apellido: 'Vásquez Torres',   nroDocumento: '45671289', telefono: '971234856', email: 'avasquez@gmail.com',  direccion: 'Caserío La Florida, Oxapampa, Pasco',              tipoProducto: ProductorTipoProducto.CAFE_CACAO,  esApto: true,  campanaId: camp2026Id, fecha: '2026-04-10', descripcion: 'Diversifica producción entre café y cacao en distintas altitudes.' },
      { nombre: 'Roberto Enrique', apellido: 'Díaz Silva',   nroDocumento: '31782934', telefono: '948762031', email: null,                  direccion: 'Sector Bella Vista, San Ignacio, Cajamarca',        tipoProducto: ProductorTipoProducto.CAFE,       esApto: false, campanaId: camp2026Id, fecha: '2026-04-20', descripcion: 'Productor en observación — deficiencias en proceso de post-cosecha.' },
      { nombre: 'Rosa Inés',    apellido: 'Huamán Quispe',    nroDocumento: '26547893', telefono: '935671240', email: 'rhuaman@gmail.com',   direccion: 'Comunidad Tres de Mayo, Juanjuí, San Martín',       tipoProducto: ProductorTipoProducto.CACAO,      esApto: true,  campanaId: camp2025Id, fecha: '2025-04-05', descripcion: 'Productora de cacao fino de aroma. Ganadora concurso regional 2024.' },
      { nombre: 'Pedro Gonzalo', apellido: 'Mamani Cruz',     nroDocumento: '41237856', telefono: '924583761', email: 'pmamani@outlook.com', direccion: 'Asociación Nueva Unión, Quillabamba, Cusco',        tipoProducto: ProductorTipoProducto.CAFE,       esApto: true,  campanaId: camp2025Id, fecha: '2025-04-12', descripcion: 'Café de altura 1800 msnm. Proceso honey y natural.' },
      { nombre: 'Elena Patricia', apellido: 'Condori Flores', nroDocumento: '35694821', telefono: '968234175', email: 'econdori@gmail.com',  direccion: 'Finca Las Palmas, Puerto Maldonado, Madre de Dios', tipoProducto: ProductorTipoProducto.CAFE_CACAO,  esApto: true,  campanaId: camp2025Id, fecha: '2025-05-08', descripcion: 'Pionera en agroforestería. Trabaja con ONGs de conservación.' },
    ];
    const result: Productor[] = [];
    for (const d of data) {
      result.push(await this.productorRepo.save(this.productorRepo.create({ ...d, activo: true })));
    }
    this.logger.log(`✅ ${result.length} productores seeded`);
    return result;
  }

  private async seedParcelas(productores: Productor[]): Promise<void> {
    const defs: Array<Array<Partial<Parcela>>> = [
      
      [
        { codigo: 'PC-JAE-001', nombre: 'Parcela El Cedro',      tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 3.5, altitud: 1650, variedadesCafe: 'Caturra, Bourbon', periodoCosecha: 'Abril – Agosto',     coordenadas: [{lat:-5.703,lng:-78.813},{lat:-5.702,lng:-78.812},{lat:-5.701,lng:-78.813},{lat:-5.702,lng:-78.814}] as any },
        { codigo: 'PC-JAE-002', nombre: 'Parcela Los Naranjos',  tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 2.0, altitud: 1720, variedadesCafe: 'Typica',            periodoCosecha: 'Mayo – Septiembre', coordenadas: [{lat:-5.706,lng:-78.816},{lat:-5.705,lng:-78.815},{lat:-5.704,lng:-78.816},{lat:-5.705,lng:-78.817}] as any },
      ],
      
      [
        { codigo: 'PC-TOC-001', nombre: 'Parcela Huayabamba',    tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 4.2, altitud: 650,  periodoCosecha: 'Todo el año',       coordenadas: [{lat:-8.176,lng:-76.513},{lat:-8.175,lng:-76.512},{lat:-8.174,lng:-76.513},{lat:-8.175,lng:-76.514}] as any },
        { codigo: 'PC-TOC-002', nombre: 'Parcela El Aguajal',    tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 2.8, altitud: 590,  periodoCosecha: 'Todo el año',       coordenadas: [{lat:-8.180,lng:-76.517},{lat:-8.179,lng:-76.516},{lat:-8.178,lng:-76.517},{lat:-8.179,lng:-76.518}] as any },
      ],
      
      [
        { codigo: 'PC-SAT-001', nombre: 'Parcela Río Tambo',     tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 5.1, altitud: 1380, variedadesCafe: 'Geisha, Pache',    periodoCosecha: 'Junio – Octubre',   coordenadas: [{lat:-11.253,lng:-74.636},{lat:-11.252,lng:-74.635},{lat:-11.251,lng:-74.636},{lat:-11.252,lng:-74.637}] as any },
        { codigo: 'PC-SAT-002', nombre: 'Parcela Alto Camana',   tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 3.3, altitud: 1550, variedadesCafe: 'Caturra',          periodoCosecha: 'Mayo – Septiembre', coordenadas: [{lat:-11.258,lng:-74.640},{lat:-11.257,lng:-74.639},{lat:-11.256,lng:-74.640},{lat:-11.257,lng:-74.641}] as any },
        { codigo: 'PC-SAT-003', nombre: 'Parcela La Rinconada',  tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 1.8, altitud: 1480, variedadesCafe: 'Bourbon',          periodoCosecha: 'Junio – Octubre',   coordenadas: [{lat:-11.261,lng:-74.644},{lat:-11.260,lng:-74.643},{lat:-11.259,lng:-74.644},{lat:-11.260,lng:-74.645}] as any },
      ],
      
      [
        { codigo: 'PC-OXA-001', nombre: 'Parcela Villa Rica',    tipoProducto: ParcelaTipoProducto.CAFE_CACAO, hectareasTotales: 6.0, altitud: 1050, variedadesCafe: 'Catimor',          periodoCosecha: 'Marzo – Julio',     coordenadas: [{lat:-10.778,lng:-75.237},{lat:-10.777,lng:-75.236},{lat:-10.776,lng:-75.237},{lat:-10.777,lng:-75.238}] as any },
        { codigo: 'PC-OXA-002', nombre: 'Parcela El Progreso',   tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 2.5, altitud: 820,  periodoCosecha: 'Todo el año',       coordenadas: [{lat:-10.783,lng:-75.242},{lat:-10.782,lng:-75.241},{lat:-10.781,lng:-75.242},{lat:-10.782,lng:-75.243}] as any },
      ],
      
      [
        { codigo: 'PC-SIG-001', nombre: 'Parcela Bella Vista',   tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 2.2, altitud: 1800, variedadesCafe: 'Typica, Caturra',  periodoCosecha: 'Abril – Agosto',    coordenadas: [{lat:-5.143,lng:-79.001},{lat:-5.142,lng:-79.000},{lat:-5.141,lng:-79.001},{lat:-5.142,lng:-79.002}] as any },
      ],
      
      [
        { codigo: 'PC-JUA-001', nombre: 'Parcela Tres de Mayo',  tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 3.8, altitud: 430,  periodoCosecha: 'Todo el año',       coordenadas: [{lat:-7.172,lng:-76.728},{lat:-7.171,lng:-76.727},{lat:-7.170,lng:-76.728},{lat:-7.171,lng:-76.729}] as any },
        { codigo: 'PC-JUA-002', nombre: 'Parcela San Francisco', tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 2.1, altitud: 480,  periodoCosecha: 'Todo el año',       coordenadas: [{lat:-7.177,lng:-76.733},{lat:-7.176,lng:-76.732},{lat:-7.175,lng:-76.733},{lat:-7.176,lng:-76.734}] as any },
      ],
      
      [
        { codigo: 'PC-QUI-001', nombre: 'Parcela Alto Yanatile', tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 4.5, altitud: 1900, variedadesCafe: 'Typica, Geisha',   periodoCosecha: 'Mayo – Octubre',    coordenadas: [{lat:-12.849,lng:-72.697},{lat:-12.848,lng:-72.696},{lat:-12.847,lng:-72.697},{lat:-12.848,lng:-72.698}] as any },
        { codigo: 'PC-QUI-002', nombre: 'Parcela Maranura',      tipoProducto: ParcelaTipoProducto.CAFE,       hectareasTotales: 2.9, altitud: 1750, variedadesCafe: 'Bourbon',          periodoCosecha: 'Junio – Octubre',   coordenadas: [{lat:-12.853,lng:-72.701},{lat:-12.852,lng:-72.700},{lat:-12.851,lng:-72.701},{lat:-12.852,lng:-72.702}] as any },
      ],
      
      [
        { codigo: 'PC-PMA-001', nombre: 'Parcela Los Castaños',  tipoProducto: ParcelaTipoProducto.CAFE_CACAO, hectareasTotales: 7.2, altitud: 260,  periodoCosecha: 'Febrero – Junio',  coordenadas: [{lat:-12.600,lng:-69.196},{lat:-12.599,lng:-69.195},{lat:-12.598,lng:-69.196},{lat:-12.599,lng:-69.197}] as any },
        { codigo: 'PC-PMA-002', nombre: 'Parcela El Aguila',     tipoProducto: ParcelaTipoProducto.CACAO,      hectareasTotales: 3.6, altitud: 290,  periodoCosecha: 'Todo el año',       coordenadas: [{lat:-12.606,lng:-69.200},{lat:-12.605,lng:-69.199},{lat:-12.604,lng:-69.200},{lat:-12.605,lng:-69.201}] as any },
      ],
    ];

    let count = 0;
    for (let i = 0; i < productores.length && i < defs.length; i++) {
      for (const p of defs[i]) {
        await this.parcelaRepo.save(this.parcelaRepo.create({ ...p, productorId: productores[i].id, activo: true, descripcion: null, fechaRegistro: '2026-03-01' }));
        count++;
      }
    }
    this.logger.log(`✅ ${count} parcelas seeded`);
  }

  private async seedFamiliares(productores: Productor[]): Promise<void> {
    const defs: Array<Array<Partial<FamiliarProductor>>> = [
      
      [
        { nombres: 'Carmen Rosa',     apellidos: 'Gutiérrez Díaz',  parentesco: Parentesco.CONYUGUE, sexo: Sexo.FEMENINO,  tipoDocumento: TipoDocumento.DNI, nroDocumento: '47823562', telefono: '946381721' },
        { nombres: 'Luis Ángel',      apellidos: 'Ríos Gutiérrez',  parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2005-07-14' },
        { nombres: 'Sofía',           apellidos: 'Ríos Gutiérrez',  parentesco: Parentesco.HIJA,     sexo: Sexo.FEMENINO,  fechaNacimiento: '2009-11-03' },
      ],
      
      [
        { nombres: 'Marcos Antonio',  apellidos: 'Pérez Soto',      parentesco: Parentesco.CONYUGUE, sexo: Sexo.MASCULINO, tipoDocumento: TipoDocumento.DNI, nroDocumento: '29543818', telefono: '952814631' },
        { nombres: 'Valentina',       apellidos: 'Pérez Soto',      parentesco: Parentesco.HIJA,     sexo: Sexo.FEMENINO,  fechaNacimiento: '2012-04-22' },
      ],
      
      [
        { nombres: 'Patricia Elena',  apellidos: 'Campos Rivera',   parentesco: Parentesco.CONYUGUE, sexo: Sexo.FEMENINO,  tipoDocumento: TipoDocumento.DNI, nroDocumento: '38291048' },
        { nombres: 'Diego Alonso',    apellidos: 'Mendoza Campos',  parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2003-09-15' },
        { nombres: 'Sebastián',       apellidos: 'Mendoza Campos',  parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2007-01-28' },
        { nombres: 'Joaquín',         apellidos: 'Mendoza Torres',  parentesco: Parentesco.PADRE,    sexo: Sexo.MASCULINO, observaciones: 'Vive en la misma propiedad, colabora en cosecha' },
      ],
      
      [
        { nombres: 'Fernando José',   apellidos: 'Luna Rojas',      parentesco: Parentesco.CONYUGUE, sexo: Sexo.MASCULINO, tipoDocumento: TipoDocumento.DNI, nroDocumento: '45671290' },
        { nombres: 'Isabella',        apellidos: 'Luna Vásquez',    parentesco: Parentesco.HIJA,     sexo: Sexo.FEMENINO,  fechaNacimiento: '2015-06-11' },
      ],
      
      [
        { nombres: 'Lucía Esperanza', apellidos: 'Quispe Muñoz',   parentesco: Parentesco.CONYUGUE, sexo: Sexo.FEMENINO,  tipoDocumento: TipoDocumento.DNI, nroDocumento: '31782935' },
      ],
      
      [
        { nombres: 'Gilberto',        apellidos: 'Torres Vega',     parentesco: Parentesco.CONYUGUE, sexo: Sexo.MASCULINO, tipoDocumento: TipoDocumento.DNI, nroDocumento: '26547894', telefono: '935671241' },
        { nombres: 'Milagros',        apellidos: 'Torres Huamán',   parentesco: Parentesco.HIJA,     sexo: Sexo.FEMENINO,  fechaNacimiento: '2008-03-30' },
        { nombres: 'Óscar',           apellidos: 'Torres Huamán',   parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2011-10-17' },
      ],
      
      [
        { nombres: 'Rosario Beatriz', apellidos: 'Ccoa Quispe',     parentesco: Parentesco.CONYUGUE, sexo: Sexo.FEMENINO,  tipoDocumento: TipoDocumento.DNI, nroDocumento: '41237857' },
        { nombres: 'Alejandro',       apellidos: 'Mamani Ccoa',     parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2001-12-05' },
      ],
      
      [
        { nombres: 'Hugo Ramiro',     apellidos: 'Flores Apaza',    parentesco: Parentesco.CONYUGUE, sexo: Sexo.MASCULINO, tipoDocumento: TipoDocumento.DNI, nroDocumento: '35694822', telefono: '968234176' },
        { nombres: 'Natalia',         apellidos: 'Flores Condori',  parentesco: Parentesco.HIJA,     sexo: Sexo.FEMENINO,  fechaNacimiento: '2006-08-19' },
        { nombres: 'Ernesto Ramiro',  apellidos: 'Flores Condori',  parentesco: Parentesco.HIJO,     sexo: Sexo.MASCULINO, fechaNacimiento: '2010-02-25' },
      ],
    ];

    let count = 0;
    for (let i = 0; i < productores.length && i < defs.length; i++) {
      for (const f of defs[i]) {
        await this.familiarRepo.save(this.familiarRepo.create({ ...f, productorId: productores[i].id, activo: true }));
        count++;
      }
    }
    this.logger.log(`✅ ${count} familiares seeded`);
  }

  private async seedLotes(
    productores: Productor[],
    camp2025Id: number, camp2026Id: number,
    tpCafeId: number, tpCacaoId: number,
  ): Promise<Lote[]> {
    const [p0, p1, p2, p3, p4, p5, p6, p7] = productores;

    const batch = [
      
      { codigo: 'LOT-RIO-001',   tipoProductoId: tpCafeId,  campanaId: camp2026Id, productorId: p0.id, cantidadKg: 2800, estado: LoteEstado.PREPARADO,         fechaAdquisicion: '2026-05-10', observaciones: 'Café pergamino seco. Proceso lavado. Calidad exportable.' },
      { codigo: 'LOT-SOT-001',   tipoProductoId: tpCacaoId, campanaId: camp2026Id, productorId: p1.id, cantidadKg: 1950, estado: LoteEstado.PREPARADO,         fechaAdquisicion: '2026-05-12', observaciones: 'Cacao grano seco. Fermentación 5 días. Buena calidad organoléptica.' },
      { codigo: 'LOT-MEN-001',   tipoProductoId: tpCafeId,  campanaId: camp2026Id, productorId: p2.id, cantidadKg: 3500, estado: LoteEstado.PRE_TRILLADO,      fechaAdquisicion: '2026-05-18', observaciones: 'Lote original dividido en dos sub-lotes por calidad.' },
      { codigo: 'LOT-MEN-001A',  tipoProductoId: tpCafeId,  campanaId: camp2026Id, productorId: p2.id, cantidadKg: 1900, estado: LoteEstado.PREPARADO,         fechaAdquisicion: '2026-05-18', observaciones: 'Sub-lote A — grano premium 14/16. Listo para lote final.' },
      { codigo: 'LOT-MEN-001B',  tipoProductoId: tpCafeId,  campanaId: camp2026Id, productorId: p2.id, cantidadKg: 1550, estado: LoteEstado.POST_ADQUISICION,  fechaAdquisicion: '2026-05-18', observaciones: 'Sub-lote B — grano estándar. Pendiente evaluación.' },
      { codigo: 'LOT-VAS-001',   tipoProductoId: tpCafeId,  campanaId: camp2026Id, productorId: p3.id, cantidadKg: 1200, estado: LoteEstado.POST_ADQUISICION,  fechaAdquisicion: '2026-05-25', observaciones: 'Café zonas mixtas. Perfil frutal y achocolatado.' },
      { codigo: 'LOT-DIA-001',   tipoProductoId: tpCafeId,  campanaId: camp2026Id, productorId: p4.id, cantidadKg: 980,  estado: LoteEstado.PRE_ADQUISICION,   fechaAdquisicion: '2026-06-02', observaciones: 'Lote en espera — productor en observación.' },
      
      { codigo: 'LOT-HUA-001',   tipoProductoId: tpCacaoId, campanaId: camp2025Id, productorId: p5.id, cantidadKg: 2350, estado: LoteEstado.PREPARADO,         fechaAdquisicion: '2025-05-20', observaciones: 'Cacao fino de aroma. Fermentación controlada 7 días. Prémium.' },
      { codigo: 'LOT-MAM-001',   tipoProductoId: tpCafeId,  campanaId: camp2025Id, productorId: p6.id, cantidadKg: 1750, estado: LoteEstado.POST_ADQUISICION,  fechaAdquisicion: '2025-06-15', observaciones: 'Café altura 1900 msnm. Proceso honey. Notas a miel y durazno.' },
      { codigo: 'LOT-CON-001',   tipoProductoId: tpCafeId,  campanaId: camp2025Id, productorId: p7.id, cantidadKg: 2100, estado: LoteEstado.POST_ADQUISICION,  fechaAdquisicion: '2025-07-08', observaciones: 'Café bajo sombra en sistema agroforestal.' },
    ];

    const lotes: Lote[] = [];
    for (const d of batch) {
      lotes.push(await this.loteRepo.save(this.loteRepo.create({ ...d, activo: true, cantidadSacos: null })));
    }
    
    const padreId = lotes[2].id;
    await this.loteRepo.update(lotes[3].id, { lotePadreId: padreId });
    await this.loteRepo.update(lotes[4].id, { lotePadreId: padreId });

    this.logger.log(`✅ ${lotes.length} lotes seeded`);
    return lotes;
  }

  private async seedLotesFinales(
    lotes: Lote[],
    camp2025Id: number, camp2026Id: number,
    tpCafeId: number, tpCacaoId: number,
  ): Promise<LoteFinal[]> {
    const batch = [
      { codigo: 'LF-2026-0001', tipoProductoId: tpCafeId,  campanaId: camp2026Id, cantidadKg: 2750, tipoOrigen: LoteFinalTipoOrigen.DIRECTO,  estado: LoteFinalEstado.TRILLADO,           fechaCreacion: '2026-05-14', observaciones: 'Café oro verde primera calidad. Taza 87.5 pts SCA.' },
      { codigo: 'LF-2026-0002', tipoProductoId: tpCacaoId, campanaId: camp2026Id, cantidadKg: 1900, tipoOrigen: LoteFinalTipoOrigen.DIRECTO,  estado: LoteFinalEstado.TRILLADO,           fechaCreacion: '2026-05-16', observaciones: 'Cacao limpio grado 1. Perfil cítrico y floral.' },
      { codigo: 'LF-2026-0003', tipoProductoId: tpCafeId,  campanaId: camp2026Id, cantidadKg: 1900, tipoOrigen: LoteFinalTipoOrigen.DIVISION, estado: LoteFinalEstado.PENDIENTE_TRILLADO, fechaCreacion: '2026-05-22', observaciones: 'Sub-lote A Mendoza. Pendiente ingreso a trilladora.' },
      { codigo: 'LF-2025-0001', tipoProductoId: tpCacaoId, campanaId: camp2025Id, cantidadKg: 2300, tipoOrigen: LoteFinalTipoOrigen.DIRECTO,  estado: LoteFinalEstado.VENDIDO,            fechaCreacion: '2025-05-25', observaciones: 'Cacao fino vendido a CACAO PREMIUM (Francia). FOB Lima.' },
    ];

    const lfs: LoteFinal[] = [];
    for (const d of batch) {
      lfs.push(await this.lfRepo.save(this.lfRepo.create({ ...d, activo: true })));
    }

    
    const origenes = [
      { loteFinalId: lfs[0].id, loteOrigenId: lotes[0].id, cantidadAportadaKg: 2750 },
      { loteFinalId: lfs[1].id, loteOrigenId: lotes[1].id, cantidadAportadaKg: 1900 },
      { loteFinalId: lfs[2].id, loteOrigenId: lotes[3].id, cantidadAportadaKg: 1900 },
      { loteFinalId: lfs[3].id, loteOrigenId: lotes[7].id, cantidadAportadaKg: 2300 },
    ];
    for (const o of origenes) {
      await this.lfOrigenRepo.save(this.lfOrigenRepo.create(o));
    }

    this.logger.log(`✅ ${lfs.length} lotes finales + trazabilidad seeded`);
    return lfs;
  }

  private async seedTrillados(lfs: LoteFinal[]): Promise<void> {
    
    const t1 = await this.trilladoRepo.save(this.trilladoRepo.create({
      loteFinalId: lfs[0].id, fecha: '2026-05-20',
      planta: 'Planta Procesadora Jaén', malla: '14/16',
      tipoSeleccion: 'Doble catado electrónico', encargado: 'Ing. Marco Salazar',
      pesoPorQuintalKg: 46, pesoPfKg: 2400,
      cantidadQuintales: Math.floor(2400 / 46),
      kgSueltos: 2400 - (Math.floor(2400 / 46) * 46),
      mermaReutilizableKg: 200, mermaDesechableKg: 100, sobranteExportableKg: 50,
      observaciones: 'Proceso sin incidentes. Humedad final 10.8%. Listo para exportación.',
    }));

    
    const t2 = await this.trilladoRepo.save(this.trilladoRepo.create({
      loteFinalId: lfs[1].id, fecha: '2026-05-22',
      planta: 'Planta Procesadora Tocache', malla: null,
      tipoSeleccion: 'Mesa de gravedad', encargado: 'Ing. Sofía Reyes',
      pesoPorQuintalKg: 50, pesoPfKg: 1650,
      cantidadQuintales: Math.floor(1650 / 50),
      kgSueltos: 1650 - (Math.floor(1650 / 50) * 50),
      mermaReutilizableKg: 150, mermaDesechableKg: 80, sobranteExportableKg: 20,
      observaciones: 'Cacao grado 1 certificado. Test de corte: 92% bien fermentado.',
    }));

    
    const t3 = await this.trilladoRepo.save(this.trilladoRepo.create({
      loteFinalId: lfs[3].id, fecha: '2025-06-10',
      planta: 'Planta Procesadora San Martín', malla: null,
      tipoSeleccion: 'Selección manual + ventilador', encargado: 'Ing. Carlos Vega',
      pesoPorQuintalKg: 50, pesoPfKg: 2000,
      cantidadQuintales: Math.floor(2000 / 50),
      kgSueltos: 2000 - (Math.floor(2000 / 50) * 50),
      mermaReutilizableKg: 180, mermaDesechableKg: 90, sobranteExportableKg: 30,
      observaciones: 'Cacao fino de aroma. Aprobado por compradora francesa.',
    }));

    
    const movs = [
      
      { loteFinalId: lfs[0].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 2750, saldoKg: 2750, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: t1.id, fecha: '2026-05-14', observaciones: 'Ingreso inicial al promover lote Ríos' },
      { loteFinalId: lfs[0].id, tipoMovimiento: TipoMovimientoKardex.MERMA,   cantidadKg: 300,  saldoKg: 2450, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: t1.id, fecha: '2026-05-20', observaciones: 'Mermas de trillado: LR 200 kg + LD 100 kg' },
      
      { loteFinalId: lfs[1].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 1900, saldoKg: 1900, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: t2.id, fecha: '2026-05-16', observaciones: 'Ingreso inicial al promover lote Soto' },
      { loteFinalId: lfs[1].id, tipoMovimiento: TipoMovimientoKardex.MERMA,   cantidadKg: 230,  saldoKg: 1670, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: t2.id, fecha: '2026-05-22', observaciones: 'Mermas de trillado: LR 150 kg + LD 80 kg' },
      
      { loteFinalId: lfs[2].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 1900, saldoKg: 1900, referenciaTipo: ReferenciaTipoKardex.AJUSTE,   referenciaId: null, fecha: '2026-05-22', observaciones: 'Ingreso al promover sub-lote Mendoza A' },
      
      { loteFinalId: lfs[3].id, tipoMovimiento: TipoMovimientoKardex.INGRESO, cantidadKg: 2300, saldoKg: 2300, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: t3.id, fecha: '2025-05-25', observaciones: 'Ingreso inicial al promover lote Huamán' },
      { loteFinalId: lfs[3].id, tipoMovimiento: TipoMovimientoKardex.MERMA,   cantidadKg: 270,  saldoKg: 2030, referenciaTipo: ReferenciaTipoKardex.TRILLADO, referenciaId: t3.id, fecha: '2025-06-10', observaciones: 'Mermas de trillado: LR 180 kg + LD 90 kg' },
      { loteFinalId: lfs[3].id, tipoMovimiento: TipoMovimientoKardex.SALIDA,  cantidadKg: 2000, saldoKg: 30,   referenciaTipo: ReferenciaTipoKardex.VENTA,    referenciaId: null, fecha: '2025-07-15', observaciones: 'Venta 40 qq × 50 kg — CACAO PREMIUM Francia. FOB Lima.' },
    ];
    for (const m of movs) {
      await this.kardexRepo.save(this.kardexRepo.create(m as any));
    }

    this.logger.log('✅ Trillados + KARDEX seeded');
  }

  private async seedMuestras(
    productores: Productor[],
    lotes: Lote[],
    camp2025Id: number,
    camp2026Id: number,
  ): Promise<void> {
    const [p0, p1, p2, p3, , p5, p6, p7] = productores;
    
    
    
    const [L0, L1, , L3, , L5, , L7, L8, L9] = lotes;

    

    const mCafe1 = await this.muestraRepo.save(this.muestraRepo.create({
      codigo: 'MST-CAFE-001', campanaId: camp2026Id, productorId: p0.id, loteId: L0.id,
      tipoMuestra: 'cafe', cantidadKg: 0.350, fechaRegistro: '2026-05-20', fechaCata: '2026-05-23',
      humedad: 10.8, rendimiento: 87.3, variedad: 'Caturra / Bourbon', proceso: 'Lavado',
      base: 'SCA 2020', estado: EstadoMuestra.COMPLETADA, puntajeFisico: 87.0, puntajeSensorial: 87.25,
      region: 'Jaén, Cajamarca', pais: 'Peru', añoCosecha: 2026,
      observaciones: 'Taza limpia, acidez brillante, cuerpo cremoso, posgusto largo a cacao. Exportable.', activo: true,
    }));

    const mCafe2 = await this.muestraRepo.save(this.muestraRepo.create({
      codigo: 'MST-CAFE-002', campanaId: camp2026Id, productorId: p2.id, loteId: L3.id,
      tipoMuestra: 'cafe', cantidadKg: 0.300, fechaRegistro: '2026-05-24', fechaCata: '2026-05-27',
      humedad: 11.1, rendimiento: 85.9, variedad: 'Geisha / Pache', proceso: 'Lavado',
      base: 'SCA 2020', estado: EstadoMuestra.COMPLETADA, puntajeFisico: 84.5, puntajeSensorial: 85.5,
      region: 'Satipo, Junín', pais: 'Peru', añoCosecha: 2026,
      observaciones: 'Perfil floral y cítrico característico de Geisha. Excelente acidez.', activo: true,
    }));

    const mCafe3 = await this.muestraRepo.save(this.muestraRepo.create({
      codigo: 'MST-CAFE-003', campanaId: camp2025Id, productorId: p6.id, loteId: L8.id,
      tipoMuestra: 'cafe', cantidadKg: 0.400, fechaRegistro: '2025-06-10', fechaCata: '2025-06-14',
      humedad: 10.5, rendimiento: 88.4, variedad: 'Typica', proceso: 'Honey',
      base: 'SCA 2020', estado: EstadoMuestra.COMPLETADA, puntajeFisico: 88.5, puntajeSensorial: 90.0,
      region: 'Quillabamba, Cusco', pais: 'Peru', añoCosecha: 2025,
      observaciones: 'Extraordinario. Notas a miel, durazno y vainilla. Cuerpo sedoso. Candidato a concurso.', activo: true,
    }));

    const mCafe4 = await this.muestraRepo.save(this.muestraRepo.create({
      codigo: 'MST-CAFE-004', campanaId: camp2026Id, productorId: p3.id, loteId: L5.id,
      tipoMuestra: 'cafe', cantidadKg: 0.250, fechaRegistro: '2026-05-28',
      humedad: 11.8, variedad: 'Catimor', proceso: 'Lavado',
      base: 'SCA 2020', estado: EstadoMuestra.EN_PROCESO, puntajeFisico: 82.0,
      region: 'Oxapampa, Pasco', pais: 'Peru', añoCosecha: 2026,
      observaciones: 'Evaluación física completa. Pendiente sesión de catación.', activo: true,
    }));

    await this.muestraRepo.save(this.muestraRepo.create({
      codigo: 'MST-CAFE-005', campanaId: camp2025Id, productorId: p7.id, loteId: L9.id,
      tipoMuestra: 'cafe', cantidadKg: 0.300, fechaRegistro: '2025-07-05',
      variedad: 'Catimor', proceso: 'Lavado', base: 'SCA 2020',
      estado: EstadoMuestra.PENDIENTE,
      region: 'Puerto Maldonado, Madre de Dios', pais: 'Peru', añoCosecha: 2025,
      observaciones: 'Muestra pendiente de evaluación. Lote bajo sombra agroforestal.', activo: true,
    }));

    

    const mCacao1 = await this.muestraRepo.save(this.muestraRepo.create({
      codigo: 'MST-CACAO-001', campanaId: camp2026Id, productorId: p1.id, loteId: L1.id,
      tipoMuestra: 'cacao', cantidadKg: 0.250, fechaRegistro: '2026-05-22', fechaCata: '2026-05-25',
      humedad: 7.2, rendimiento: 86.8, variedad: 'CCN-51 / Clon Nativo', proceso: 'Fermentado 5 días',
      base: 'IICTE 2023', estado: EstadoMuestra.COMPLETADA, puntajeFisico: 83.0, puntajeSensorial: 79.5,
      region: 'Tocache, San Martín', pais: 'Peru', añoCosecha: 2026,
      observaciones: 'Fino de aroma. Florales y frutas amarillas. Grado 1 certificado.', activo: true,
    }));

    const mCacao2 = await this.muestraRepo.save(this.muestraRepo.create({
      codigo: 'MST-CACAO-002', campanaId: camp2025Id, productorId: p5.id, loteId: L7.id,
      tipoMuestra: 'cacao', cantidadKg: 0.500, fechaRegistro: '2025-05-18', fechaCata: '2025-05-22',
      humedad: 6.9, rendimiento: 88.1, variedad: 'Clon Nativo Fino de Aroma', proceso: 'Fermentado 7 días',
      base: 'IICTE 2023', estado: EstadoMuestra.COMPLETADA, puntajeFisico: 86.5, puntajeSensorial: 87.5,
      region: 'Juanjuí, San Martín', pais: 'Peru', añoCosecha: 2025,
      observaciones: 'Premium. Perfil excepcional validado por comprador francés. Ganadora concurso regional 2024.', activo: true,
    }));

    

    const cafeTablaDefectos = (cat1: number, cat2: number) => ({
      cafeDefectosPrimarios: cat1,
      cafeDefectosSecundarios: cat2,
      cafeColorGrano: 'Verde azulado',
      cafeVerdeDetalle: JSON.stringify({ manchas_negras: 0, granos_negros: 0, granos_secos: cat1, granos_mohosos: 0, brozas: cat2, palos: 0 }),
    });

    await this.evalFisRepo.save(this.evalFisRepo.create({
      muestraId: mCafe1.id, productoTipo: 'CAFE', fecha: '2026-05-20', puntajeTotal: 87.0,
      camposJson: { ...cafeTablaDefectos(0, 3), cafeHumedad: 10.8, cafeRendimiento: 87.3, cafeGranulometria: '14/16', cafeOlorGrano: 'Característico, sin defectos' },
      observaciones: 'Grano uniforme, verde azulado, sin manchas. Presentación física excelente.',
    }));

    await this.evalFisRepo.save(this.evalFisRepo.create({
      muestraId: mCafe2.id, productoTipo: 'CAFE', fecha: '2026-05-24', puntajeTotal: 84.5,
      camposJson: { ...cafeTablaDefectos(0, 5), cafeHumedad: 11.1, cafeRendimiento: 85.9, cafeGranulometria: '15/16', cafeOlorGrano: 'Característico, leve olor a pergamino' },
      observaciones: 'Grano bien formado, tamaño uniforme. Algunos granos con pergamino residual.',
    }));

    await this.evalFisRepo.save(this.evalFisRepo.create({
      muestraId: mCafe3.id, productoTipo: 'CAFE', fecha: '2025-06-10', puntajeTotal: 88.5,
      camposJson: { ...cafeTablaDefectos(0, 2), cafeHumedad: 10.5, cafeRendimiento: 88.4, cafeGranulometria: '15/16', cafeOlorGrano: 'Aromático, notas dulces de proceso honey' },
      observaciones: 'Grano excepcional. Honey process con miel adherida uniforme. Sin defectos primarios.',
    }));

    await this.evalFisRepo.save(this.evalFisRepo.create({
      muestraId: mCafe4.id, productoTipo: 'CAFE', fecha: '2026-05-28', puntajeTotal: 82.0,
      camposJson: { ...cafeTablaDefectos(0, 8), cafeHumedad: 11.8, cafeRendimiento: 83.2, cafeGranulometria: '14/15', cafeOlorGrano: 'Característico' },
      observaciones: 'Grano aceptable. Algunos defectos secundarios por irregularidad en secado.',
    }));

    

    const cafeScaSample = (
      fragTotal: number, fragSeco: string, fragEspuma: string, fragCualidades: string,
      sabor: number, saborResidual: number,
      acidez: number, acidezIntensidad: string,
      cuerpo: number, cuerpoNivel: string,
      balance: number, puntosCatador: number,
      notas: string,
      defectoTazas = 0, defectoTipo: 'ligero' | 'rechazo' = 'ligero',
    ) => ({
      numero: '01', nivelTueste: 2,
      fragTotal, fragSeco, fragEspuma, fragCualidades,
      sabor, saborResidual,
      acidez, acidezIntensidad,
      cuerpo, cuerpoNivel,
      uniformidad: [true, true, true, true, true],
      balance,
      tazaLimpia: [true, true, true, true, true],
      dulzor: [true, true, true, true, true],
      puntosCatador,
      defectoTipo, defectoTazas,
      notas,
    });

    
    const scaForm1 = {
      header: { nombre: 'Sesión 2026-01', fecha: '2026-05-23', mesa: 'A', session: '1' },
      sample: cafeScaSample(8.25, '8.25', '8.00', 'Naranja, durazno, cacao', 8.25, 8.0, 8.5, 'alto', 8.0, 'medio', 8.0, 8.25, 'Naranja, durazno, chocolate amargo. Alta acidez cítrica. Cuerpo cremoso. Posgusto a cacao.'),
    };
    await this.evalSenRepo.save(this.evalSenRepo.create({
      muestraId: mCafe1.id, productoTipo: 'CAFE', fecha: '2026-05-23', puntajeTotal: 87.25,
      camposJson: { cafeSca: scaForm1, puntajeTotal: 87.25 },
      observaciones: 'Café especial. Acidez brillante, taza limpia, cuerpo redondo. Mercado europeo.',
    }));

    
    const scaForm2 = {
      header: { nombre: 'Sesión 2026-02', fecha: '2026-05-27', mesa: 'A', session: '2' },
      sample: cafeScaSample(8.0, '8.00', '7.75', 'Floral, jazmín, bergamota', 7.75, 7.75, 8.0, 'alto', 7.75, 'medio', 7.75, 8.5, 'Jazmín, bergamota, limón. Acidez viva tipo Geisha. Cuerpo ligero, posgusto floral.'),
    };
    await this.evalSenRepo.save(this.evalSenRepo.create({
      muestraId: mCafe2.id, productoTipo: 'CAFE', fecha: '2026-05-27', puntajeTotal: 85.5,
      camposJson: { cafeSca: scaForm2, puntajeTotal: 85.5 },
      observaciones: 'Perfil floral Geisha muy definido. Alta calidad. Mercado de nicho.',
    }));

    
    const scaForm3 = {
      header: { nombre: 'Sesión 2025-06', fecha: '2025-06-14', mesa: 'B', session: '6' },
      sample: cafeScaSample(8.75, '8.75', '8.50', 'Miel, durazno, vainilla', 8.75, 8.5, 9.0, 'alto', 8.5, 'alto', 8.5, 8.0, 'Miel de abeja, durazno maduro, vainilla, maracuyá. Acidez elegante. Cuerpo pleno y sedoso. Dulzor excepcional.'),
    };
    await this.evalSenRepo.save(this.evalSenRepo.create({
      muestraId: mCafe3.id, productoTipo: 'CAFE', fecha: '2025-06-14', puntajeTotal: 90.0,
      camposJson: { cafeSca: scaForm3, puntajeTotal: 90.0 },
      observaciones: 'EXTRAORDINARIO. Café de origen único. Candidato a concurso nacional de cafés especiales.',
    }));

    

    const cacaoFisBase = (
      humedadPct: string, fermentacionPct: number, pesoCienGranos: number,
      bFerA: string, bFerB: string, mFerA: string, mFerB: string,
      violA: string, violB: string, pizA: string, pizB: string,
      danA: string, danB: string, gerA: string, gerB: string, mohA: string, mohB: string,
      calificacion: string,
    ) => ({
      cacaoHumedadPct: parseFloat(humedadPct),
      cacaoPesoCienGranos: pesoCienGranos,
      cacaoFermentacionPct: fermentacionPct,
      cacaoCalificacion: calificacion,
      cacaoTablaHumedad: {
        peso100g:    { a: String(pesoCienGranos - 0.3), b: String(pesoCienGranos + 0.3) },
        humedadPct:  { a: humedadPct, b: String(parseFloat(humedadPct) + 0.1) },
        indiceGrano: { a: String((pesoCienGranos / 100 / 10).toFixed(2)), b: String((pesoCienGranos / 100 / 10 + 0.01).toFixed(2)) },
      },
      cacaoTablaFerment: {
        bienFerment: { a: bFerA, b: bFerB },
        medFerment:  { a: mFerA, b: mFerB },
        violetas:    { a: violA, b: violB },
        pizarrosos:  { a: pizA,  b: pizB  },
      },
      cacaoTablaDefectos: {
        danadosIns: { a: danA, b: danB },
        germinados:  { a: gerA, b: gerB },
        mohosos:     { a: mohA, b: mohB },
      },
    });

    
    await this.evalFisRepo.save(this.evalFisRepo.create({
      muestraId: mCacao1.id, productoTipo: 'CACAO', fecha: '2026-05-22', puntajeTotal: 83.0,
      camposJson: {
        ...cacaoFisBase('7.2', 88, 112.4, '44','44', '4','4', '1','2', '1','1', '0','0', '0','0', '0','0', 'Grado 1'),
        cacaoDistrito: 'Tocache', cacaoVariedad: 'CCN-51 / Clon Nativo',
        cacaoFechaCosecha: '2026-04-15', cacaoAromaApariencia: 'Marrón oscuro uniforme, aroma a cacao y florales',
        cacaoEvaluador: 'Ing. Ana Rodríguez', cacaoFechaEval: '2026-05-22',
      },
      observaciones: 'Fermentación excelente 88%. Test de corte: 88 bien fermentados, 8 medianamente, 3 violetas. Grado 1.',
    }));

    
    await this.evalFisRepo.save(this.evalFisRepo.create({
      muestraId: mCacao2.id, productoTipo: 'CACAO', fecha: '2025-05-18', puntajeTotal: 86.5,
      camposJson: {
        ...cacaoFisBase('6.9', 91, 118.2, '46','46', '3','3', '1','0', '0','1', '0','0', '0','0', '0','0', 'Grado 1 Premium'),
        cacaoDistrito: 'Juanjuí', cacaoVariedad: 'Clon Nativo Fino de Aroma',
        cacaoFechaCosecha: '2025-04-10', cacaoAromaApariencia: 'Marrón intenso, aroma a cacao intenso con florales y frutas',
        cacaoEvaluador: 'Ing. Carlos Vega', cacaoFechaEval: '2025-05-18',
      },
      observaciones: 'Fermentación excepcional 91%. Test de corte: 92 bien fermentados. Premio calidad regional 2024.',
    }));

    

    const defectosCacao = (key: string): object[] => [
      { key: 'moho',           nombre: 'Moho',           intensidad: 0, comentario: '' },
      { key: 'tierra',         nombre: 'Tierra',         intensidad: 0, comentario: '' },
      { key: 'quemado',        nombre: 'Quemado',        intensidad: 0, comentario: '' },
      { key: 'contaminantes',  nombre: 'Contaminantes',  intensidad: 0, comentario: '' },
      { key: 'descomposicion', nombre: 'Descomposición', intensidad: 0, comentario: '' },
      { key: 'otros',          nombre: 'Otros',          intensidad: 0, comentario: '' },
    ];

    const saborDesc = (cocoa: number, dulce: number, nuez: number, frutasFres: number, floral: number, frutasSec = 0, especias = 0, notas = '') => [
      { key: 'cocoa',      label: 'Cacao / Cocoa',  intensidad: cocoa,     comentario: '' },
      { key: 'dulce',      label: 'Dulce',           intensidad: dulce,     comentario: '' },
      { key: 'nuez',       label: 'Nuez',            intensidad: nuez,      comentario: '' },
      { key: 'frutasSec',  label: 'Frutas secas',    intensidad: frutasSec, comentario: '' },
      { key: 'frutasFres', label: 'Frutas frescas',  intensidad: frutasFres, comentario: notas },
      { key: 'floral',     label: 'Floral',          intensidad: floral,    comentario: '' },
      { key: 'especias',   label: 'Especias',        intensidad: especias,  comentario: '' },
      { key: 'otros',      label: 'Otros',           intensidad: 0,         comentario: '' },
    ];

    
    
    await this.evalSenRepo.save(this.evalSenRepo.create({
      muestraId: mCacao1.id, productoTipo: 'CACAO', fecha: '2026-05-25', puntajeTotal: 79.5,
      camposJson: {
        fecha: '2026-05-25', evaluador: 'Ing. Ana Rodríguez',
        aroma:        { intensidad: 4, calidad: 7.5, comentario: 'Cacao, frutas amarillas, jazmín, leve floral' },
        acidez:       { intensidad: 3, calidad: 7.0, comentario: 'Media, cítrica, limón' },
        amargor:      { intensidad: 2, calidad: 7.5, comentario: 'Equilibrado, agradable' },
        astringencia: { intensidad: 2, calidad: 7.5, comentario: 'Leve, bien integrada' },
        posgusto:     { intensidad: 3, calidad: 7.5, comentario: 'Persistente, frutal, 45 segundos' },
        defectos: defectosCacao(''),
        saborCalidad: 8.5,
        saborDescriptores: saborDesc(3, 2, 1, 3, 2, 0, 0, 'Maracuyá, mango'),
        puntosCatador: 7.5,
        comentarios: 'Perfil fino con notas florales y frutales. Acidez cítrica elegante. Fin de fermentación óptimo.',
        puntajeTotal: 79.5,
      },
      observaciones: 'Cacao CCN-51 con perfil fino de aroma. Apto para chocolate premium de origen.',
    }));

    
    
    await this.evalSenRepo.save(this.evalSenRepo.create({
      muestraId: mCacao2.id, productoTipo: 'CACAO', fecha: '2025-05-22', puntajeTotal: 87.5,
      camposJson: {
        fecha: '2025-05-22', evaluador: 'Ing. Carlos Vega',
        aroma:        { intensidad: 5, calidad: 8.5, comentario: 'Intenso, complejo. Floral, frutas tropicales, miel' },
        acidez:       { intensidad: 3, calidad: 8.0, comentario: 'Viva, limpia, tropical' },
        amargor:      { intensidad: 2, calidad: 8.0, comentario: 'Fino, cacao negro, muy elegante' },
        astringencia: { intensidad: 1, calidad: 8.0, comentario: 'Mínima, seda en boca' },
        posgusto:     { intensidad: 5, calidad: 8.5, comentario: 'Largo y complejo, +90 segundos. Floral persistente' },
        defectos: defectosCacao(''),
        saborCalidad: 9.0,
        saborDescriptores: saborDesc(4, 3, 2, 4, 4, 1, 0, 'Maracuyá, piña, mango. Excepcional'),
        puntosCatador: 8.5,
        comentarios: 'Cacao premium de clase mundial. Fermentación perfecta. Perfil complejo con frutas tropicales y florales. Ganadora regional 2024.',
        puntajeTotal: 87.5,
      },
      observaciones: 'PREMIUM. Perfil excepcional validado por catador internacional. Aprobado comprador CACAO PREMIUM Francia.',
    }));

    this.logger.log('✅ 7 muestras + evaluaciones físicas y sensoriales seeded');
  }
}
