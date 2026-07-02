import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sku } from './sku.entity';

type SkuSeed = {
  codigo: string;
  nombre: string;
  unidad: string;
  codigoHS?: string | null;
  requiereFito?: boolean;
  codigoFDA?: string | null;
  descripcionFDA?: string | null;
  nombreFDA?: string | null;
};

// HS 0901 — café verde (variedades): comparten mismo HS/FDA
const HS_CAFE  = '0901.11.90.00';
const FDA_CAFE = { codigoFDA: '31AAB01', descripcionFDA: 'COFFEE, BEANS, Fabric, RAW, FRESH, AMBIENT', nombreFDA: 'Coffee Beans' };

// HS 1801.00.19.00 — cacao en grano crudo
const HS_CACAO_RAW = '1801.00.19.00';
const FDA_CACAO    = { codigoFDA: '34AAB99', descripcionFDA: 'COCOA BEAN N.E.C., Fabric, RAW - FRESH', nombreFDA: 'Raw Cacao Beans' };

const SEED_SKUS: SkuSeed[] = [
  // ── Variedades de café (verde, exportación) ──────────────────────────────
  { codigo: 'CF001',    nombre: 'Catuaí',              unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF002',    nombre: 'Mundo Novo',           unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF003',    nombre: 'Maragogipe',           unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF004',    nombre: 'SL34',                unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF005',    nombre: 'SL28',                unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF006',    nombre: 'Bourbon',             unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF007',    nombre: 'Pache',               unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF008',    nombre: 'Pacamara',            unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF009',    nombre: 'Gesha',               unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF010',    nombre: 'Catimor',             unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF011',    nombre: 'Caturra',             unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF012',    nombre: 'Typica',              unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF013',    nombre: 'Bourbon Rojo',        unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF014',    nombre: 'Café Especial',       unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF015',    nombre: 'Café Molido',         unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF016',    nombre: 'Granos Tostados',     unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF017',    nombre: 'Granos Verdes',       unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF018',    nombre: 'Café Comercial',      unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF019',    nombre: 'Café Premium',        unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF020',    nombre: 'Miel de Caña',        unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF021',    nombre: 'Monteverde',          unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF022',    nombre: 'Ñusta Power Pache',   unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF023',    nombre: 'Purumacho Gesha',     unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF024',    nombre: 'Purumacho Pacamara',  unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF025',    nombre: 'Orange Bourbon',      unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  { codigo: 'CF026-46', nombre: 'Ñusta Gesha',         unidad: 'SACO',      codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },
  // Granos Café verde — producto regulatorio genérico
  { codigo: 'CF027',    nombre: 'Granos Café verde',   unidad: 'KILOGRAMO', codigoHS: HS_CAFE, requiereFito: true,  ...FDA_CAFE },

  // ── Cacao y derivados ────────────────────────────────────────────────────
  { codigo: 'CA031',       nombre: 'Cacao Comunal',          unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW,  requiereFito: true,  ...FDA_CACAO },
  { codigo: 'CA031-COM-50',nombre: 'Sacos de Cacao Comunal', unidad: 'SACO',      codigoHS: HS_CACAO_RAW,  requiereFito: true,  ...FDA_CACAO },
  { codigo: 'CA032',       nombre: 'Chuncho David Condori',  unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW,  requiereFito: true,  ...FDA_CACAO },
  { codigo: 'CA033',       nombre: 'Cacao en grano',         unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW,  requiereFito: true,  ...FDA_CACAO },
  { codigo: 'CA034',       nombre: 'Copuazu Pelado',         unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW,  requiereFito: false, codigoFDA: '34AAD99', descripcionFDA: 'COCOA BEAN N.E.C., Fabric, RAW - FRESH', nombreFDA: 'Copuazu Beans' },
  { codigo: 'CA035',       nombre: 'Cupui',                  unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW,  requiereFito: true,  ...FDA_CACAO },
  { codigo: 'CA036',       nombre: 'Macambo tostado',        unidad: 'KILOGRAMO', codigoHS: '1801.00.20.00', requiereFito: false, codigoFDA: '34AAN99', descripcionFDA: 'COCOA BEAN N.E.C., Fabric, HEAT TREATED', nombreFDA: 'Roasted Macambo Beans' },
  { codigo: 'CA037',       nombre: 'Nibs de Cacao',          unidad: 'KILOGRAMO', codigoHS: '1801.00.20.00', requiereFito: false, codigoFDA: '34BGN04', descripcionFDA: 'COCOA NIBS, CRACKED COCOA (EXCEPT CHOCOLATE CANDY AND CHOCOLATE BEVERAGE BASE), Plastic, Synth, HEAT TREATED', nombreFDA: 'Cocoa Nibs' },
  { codigo: 'CA038',       nombre: 'Pasta de Cacao',         unidad: 'KILOGRAMO', codigoHS: '1803.10.00.00', requiereFito: false, codigoFDA: '34YFY99', descripcionFDA: 'CHOCOLATE & COCOA PRODUCTS NEC, Paper, NEC', nombreFDA: 'Cacao Paste' },
  { codigo: 'CA039',       nombre: 'Manteca de cacao',       unidad: 'KILOGRAMO', codigoHS: '1804.00.13.00', requiereFito: false, codigoFDA: '34BFY03', descripcionFDA: 'COCOA BUTTER (EXCEPT CHOCOLATE CANDY AND CHOCOLATE BEVERAGE BASE), Paper, NOT ELSEWHERE CLASSIFIED (NEC)', nombreFDA: 'Cocoa Butter' },
  { codigo: 'CA040',       nombre: 'Manteca de Copuazu',     unidad: 'KILOGRAMO', codigoHS: '1804.00.20.00', requiereFito: false, codigoFDA: '34BFY03', descripcionFDA: 'COCOA BUTTER (EXCEPT CHOCOLATE CANDY AND CHOCOLATE BEVERAGE BASE), Paper, NOT ELSEWHERE CLASSIFIED (NEC)', nombreFDA: 'Cocoa Butter' },
  { codigo: 'CA041',       nombre: 'Polvo de cacao',         unidad: 'KILOGRAMO', codigoHS: '1805.00.00.00', requiereFito: false, codigoFDA: '34BFY99', descripcionFDA: 'CHOCOLATE AND COCOA, N.E.C., Paper, NOT ELSEWHERE CLASSIFIED (NEC)', nombreFDA: 'Cocoa powder' },

  // ── Otros productos de exportación ──────────────────────────────────────
  { codigo: 'CS001',  nombre: 'Castaña Amazonica',   unidad: 'KILOGRAMO', codigoHS: '0801.22.00.00', requiereFito: true,  codigoFDA: '23BFB02', descripcionFDA: 'BRAZIL NUT, Shelled, Paper, RAW - FRESH', nombreFDA: 'Brazil Nuts' },
  { codigo: 'SE001',  nombre: 'Ajonjolí',            unidad: 'KILOGRAMO', codigoHS: '1207.40.90.00', requiereFito: true,  codigoFDA: '28AFB43', descripcionFDA: 'SESAME, WHOLE', nombreFDA: 'Sesame Seed' },
  { codigo: 'AV001',  nombre: 'Aceites vegetales',   unidad: 'LITRO',     codigoHS: '1515.90.00.90', requiereFito: false, codigoFDA: '26YFY99', descripcionFDA: 'VEGETABLE OIL, Not elsewhere classified', nombreFDA: 'Vegetable oils' },
  { codigo: 'TX001',  nombre: 'Textiles de algodón', unidad: 'KILOGRAMO', codigoHS: '5208.59.90.00', requiereFito: false, codigoFDA: null, descripcionFDA: null, nombreFDA: 'Cotton textiles' },

  // ── Artesanal / Cerámica ────────────────────────────────────────────────
  { codigo: 'VA015',  nombre: 'Tiesto Hondo - Chazuta', unidad: 'UNIDAD', codigoHS: '6913.90.00.00', requiereFito: false, codigoFDA: null, descripcionFDA: 'ORNAMENTAL CERAMIC ARTICLES', nombreFDA: 'Pottery' },
  { codigo: 'VA016',  nombre: 'Mocahuitos - Chazuta',   unidad: 'UNIDAD', codigoHS: '6913.90.00.00', requiereFito: false, codigoFDA: null, descripcionFDA: 'ORNAMENTAL CERAMIC ARTICLES', nombreFDA: 'Pottery' },
  { codigo: 'VA017',  nombre: 'Jarra Mediana',           unidad: 'UNIDAD', codigoHS: '6913.90.00.00', requiereFito: false, codigoFDA: null, descripcionFDA: 'ORNAMENTAL CERAMIC ARTICLES', nombreFDA: 'Pottery' },
  { codigo: 'VA018',  nombre: 'Ceramica artesanal',      unidad: 'UNIDAD', codigoHS: '6913.90.00.00', requiereFito: false, codigoFDA: null, descripcionFDA: 'ORNAMENTAL CERAMIC ARTICLES', nombreFDA: 'Pottery' },
  { codigo: 'VA019',  nombre: 'Bolsas de chambira',      unidad: 'UNIDAD', codigoHS: '4202.19.00.00', requiereFito: false, codigoFDA: null, descripcionFDA: null, nombreFDA: 'Artisanal Pouches' },
];

@Injectable()
export class SkusService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Sku)
    private readonly repo: Repository<Sku>,
  ) {}

  async onApplicationBootstrap() {
    await this.repo.upsert(
      SEED_SKUS.map(s => ({
        ...s,
        descripcion:    null,
        codigoHS:       s.codigoHS       ?? null,
        requiereFito:   s.requiereFito   ?? false,
        codigoFDA:      s.codigoFDA      ?? null,
        descripcionFDA: s.descripcionFDA ?? null,
        nombreFDA:      s.nombreFDA      ?? null,
        activo: true,
      })),
      { conflictPaths: ['nombre'], skipUpdateIfNoValuesChanged: true },
    );
  }

  findAll(): Promise<Sku[]> {
    return this.repo.find({ where: { activo: true }, order: { codigo: 'ASC' } });
  }

  async create(nombre: string, descripcion?: string): Promise<Sku> {
    return this.repo.save({ nombre, descripcion: descripcion ?? null });
  }
}
