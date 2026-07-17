import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sku } from './sku.entity';

type SkuSeed = {
  codigo: string;
  nombre: string;
  descripcion?: string;
  unidad: string;
  codigoHS?: string | null;
  requiereFito?: boolean;
  codigoFDA?: string | null;
  descripcionFDA?: string | null;
  nombreFDA?: string | null;
  soloOtros?: boolean;
};

const HS_CAFE       = '0901.11.90.00';
const HS_CACAO_RAW  = '1801.00.19.00';
const HS_MACAMBO    = '1801.00.20.00';
const HS_NIBS       = '1801.00.20.00';
const HS_PASTA      = '1803.10.00.00';
const HS_MANTECA    = '1804.00.13.00';
const HS_MANT_COP   = '1804.00.20.00';
const HS_POLVO      = '1805.00.00.00';
const HS_CERAMICA   = '6913.90.00.00';
const HS_TEXTILES   = '5208.59.90.00';
const HS_ARTESANAL  = '4202.19.00.00';
const HS_CASTANA    = '0801.22.00.00';
const HS_ACEITES    = '1515.90.00.90';
const HS_AJONJOLI   = '1207.40.90.00';
const HS_PAJILLA    = '0901.11.90.15';

const FDA_CAFE    = { codigoFDA: '31AAB01', descripcionFDA: 'COFFEE, BEANS, Fabric, RAW, FRESH, AMBIENT',                                                                            nombreFDA: 'Coffee Beans'         };
const FDA_CACAO   = { codigoFDA: '34AAB99', descripcionFDA: 'COCOA BEAN N.E.C., Fabric, RAW - FRESH',                                                                                nombreFDA: 'Raw Cacao Beans'      };
const FDA_COPUAZU = { codigoFDA: '34AAD99', descripcionFDA: 'COCOA BEAN N.E.C., Fabric, RAW - FRESH',                                                                                nombreFDA: 'Copuazu Beans'        };
const FDA_MACAMBO = { codigoFDA: '34AAN99', descripcionFDA: 'COCOA BEAN N.E.C., Fabric, HEAT TREATED',                                                                               nombreFDA: 'Roasted Macambo Beans'};
const FDA_NIBS    = { codigoFDA: '34BGN04', descripcionFDA: 'COCOA NIBS, CRACKED COCOA (EXCEPT CHOCOLATE CANDY AND CHOCOLATE BEVERAGE BASE), Plastic, Synth, HEAT TREATED',          nombreFDA: 'Cocoa Nibs'           };
const FDA_PASTA   = { codigoFDA: '34YFY99', descripcionFDA: 'CHOCOLATE & COCOA PRODUCTS NEC, Paper, NEC',                                                                            nombreFDA: 'Cacao Paste'          };
const FDA_MANTECA = { codigoFDA: '34BFY03', descripcionFDA: 'COCOA BUTTER (EXCEPT CHOCOLATE CANDY AND CHOCOLATE BEVERAGE BASE), Paper, NOT ELSEWHERE CLASSIFIED (NEC)',              nombreFDA: 'Cocoa Butter'         };
const FDA_POLVO   = { codigoFDA: '34BFY99', descripcionFDA: 'CHOCOLATE AND COCOA, N.E.C., Paper, NOT ELSEWHERE CLASSIFIED (NEC)',                                                    nombreFDA: 'Cocoa powder'         };
const FDA_CASTANA = { codigoFDA: '23BFB02', descripcionFDA: 'BRAZIL NUT, Shelled, Paper, RAW - FRESH',                                                                               nombreFDA: 'Brazil Nuts'          };
const FDA_AJJONJOLI={ codigoFDA: '28AFB43', descripcionFDA: 'SESAME, WHOLE',                                                                                                         nombreFDA: 'Sesame Seed'          };

const SEED_SKUS: SkuSeed[] = [
  // ── Café verde ────────────────────────────────────────────────────────────
  { codigo: 'CF001', nombre: 'Comunal Coffee Spot',       descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF002', nombre: 'Microlote Spot',            descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF003', nombre: 'Andres ASD',                descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF004', nombre: 'Classic Raul',              descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF005', nombre: 'Double Beam',               descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF006', nombre: 'Nuwa Tabi',                 descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF007', nombre: 'Nuwa Sidra',                descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF008', nombre: 'Comunal Aini',              descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF009', nombre: 'Comunal Diamante',          descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF010', nombre: 'Comunal Jorge Chavez',      descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF013', nombre: 'Amazon Natural',            descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF014', nombre: 'Amazon Washed',             descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF015', nombre: 'Comunal Canelón',           descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF016', nombre: 'Nuwa Papayo',               descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF017', nombre: 'Nuwa Gesha',                descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF018', nombre: 'Cholo Power Bourbon',       descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF019', nombre: 'Cholo Power Gesha',         descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF020', nombre: 'Cholo Power Pacamara',      descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF021', nombre: 'Ñusta Power Typica',        descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF022', nombre: 'Ñusta Power Pache',         descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF023', nombre: 'Purumacho Gesha',           descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF024', nombre: 'Purumacho Pacamara',        descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF025', nombre: 'Orange bourbon',            descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF026', nombre: 'Ñusta Power Gesha',         descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },
  { codigo: 'CF199', nombre: 'Segundas',                  descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_CAFE,     requiereFito: true,  ...FDA_CAFE     },

  // ── Cacao en grano ────────────────────────────────────────────────────────
  { codigo: 'CA001', nombre: 'Blend Condori',             descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA002', nombre: 'Chuncho Pumatiy',           descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA003', nombre: 'Blend Apecmu',              descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA004', nombre: 'Blend Chahuares',           descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA005', nombre: 'VRAE99 QW',                 descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA006', nombre: 'Bellavista QW',             descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA007', nombre: 'VRAE15 QW',                 descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA008', nombre: 'CHUNCHO QW',                descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA009', nombre: 'CHUNCHO JL',                descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA010', nombre: 'VRAE99 JL',                 descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA011', nombre: 'Bellavista KEMITO',         descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA012', nombre: 'Blend KEMITO',              descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA021', nombre: 'COPUAZU EL PROGRESO',       descripcion: 'Copuazu Pelado',  unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: false, ...FDA_COPUAZU, soloOtros: true },
  { codigo: 'CA023', nombre: 'CHUNCHO PAYTITI',           descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA030', nombre: 'Cacao Chuncho Pumatiy',     descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA031', nombre: 'Cacao Comunal',             descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA032', nombre: 'Chuncho David Condori',     descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },
  { codigo: 'CA033', nombre: 'Cacao Micro lote',          descripcion: 'Cacao en grano', unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO    },

  // ── OTROS (soloOtros: true) ────────────────────────────────────────────────
  { codigo: 'CA013', nombre: 'Nibs KEMITO',                   descripcion: 'Nibs de Cacao',     unidad: 'KILOGRAMO', codigoHS: HS_NIBS,   requiereFito: false, ...FDA_NIBS,    soloOtros: true },
  { codigo: 'CA014', nombre: 'Polvo de Cacao KEMITO',         descripcion: 'Polvo de cacao',    unidad: 'KILOGRAMO', codigoHS: HS_POLVO,  requiereFito: false, ...FDA_POLVO,   soloOtros: true },
  { codigo: 'CA015', nombre: 'Manteca de Cacao KEMITO',       descripcion: 'Manteca de cacao',  unidad: 'KILOGRAMO', codigoHS: HS_MANTECA,requiereFito: false, ...FDA_MANTECA, soloOtros: true },
  { codigo: 'CA016', nombre: 'Pasta de Cacao KEMITO',         descripcion: 'Pasta de Cacao',    unidad: 'KILOGRAMO', codigoHS: HS_PASTA,  requiereFito: false, ...FDA_PASTA,   soloOtros: true },
  { codigo: 'CA017', nombre: 'Pasta de Cacao QW',             descripcion: 'Pasta de Cacao',    unidad: 'KILOGRAMO', codigoHS: HS_PASTA,  requiereFito: false, ...FDA_PASTA,   soloOtros: true },
  { codigo: 'CA018', nombre: 'CUPUI',                         descripcion: 'Cupuí',             unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO, soloOtros: true },
  { codigo: 'CA019', nombre: 'MACAMBO MISKY',                  descripcion: 'Macambo tostado',   unidad: 'KILOGRAMO', codigoHS: HS_MACAMBO,requiereFito: false, ...FDA_MACAMBO, soloOtros: true },
  { codigo: 'CA020', nombre: 'MACAMBO Naturally Divine',      descripcion: 'Macambo tostado',   unidad: 'KILOGRAMO', codigoHS: HS_MACAMBO,requiereFito: false, ...FDA_MACAMBO, soloOtros: true },
  { codigo: 'CA022', nombre: 'MANTECA COPUAZU Naturally Divine', descripcion: 'Manteca de Copuazu', unidad: 'KILOGRAMO', codigoHS: HS_MANT_COP, requiereFito: false, ...FDA_MANTECA, soloOtros: true },
  { codigo: 'CA024', nombre: 'Manteca de Cacao QW',           descripcion: 'Manteca de cacao',  unidad: 'KILOGRAMO', codigoHS: HS_MANTECA,requiereFito: false, ...FDA_MANTECA, soloOtros: true },
  { codigo: 'CA025', nombre: 'Polvo de Cacao QW',             descripcion: 'Polvo de cacao',    unidad: 'KILOGRAMO', codigoHS: HS_POLVO,  requiereFito: false, ...FDA_POLVO,   soloOtros: true },
  { codigo: 'CA026', nombre: 'CUPUI PELADO TOSTADO - JHOPEL', descripcion: 'Cupuí',             unidad: 'KILOGRAMO', codigoHS: HS_CACAO_RAW, requiereFito: true,  ...FDA_CACAO, soloOtros: true },
  { codigo: 'CA027', nombre: 'PASTA CUPUI AL 100%',           descripcion: 'Pasta de Cacao',    unidad: 'KILOGRAMO', codigoHS: HS_PASTA,  requiereFito: false, ...FDA_PASTA,   soloOtros: true },
  { codigo: 'CA028', nombre: 'Macambo Fermentado - ND',       descripcion: 'Macambo tostado',   unidad: 'KILOGRAMO', codigoHS: HS_MACAMBO,requiereFito: false, ...FDA_MACAMBO, soloOtros: true },
  { codigo: 'VA001', nombre: 'Sarato tejido con Ornamentos',  descripcion: 'Bolsas de chambira',unidad: 'UNIDAD',     codigoHS: HS_ARTESANAL, requiereFito: false, codigoFDA: null, descripcionFDA: null, nombreFDA: 'Artisanal Pouches', soloOtros: true },
  { codigo: 'VA002', nombre: 'CUSHMA TEJIDA',                 descripcion: 'Bolsas de chambira',unidad: 'UNIDAD',     codigoHS: HS_ARTESANAL, requiereFito: false, codigoFDA: null, descripcionFDA: null, nombreFDA: 'Artisanal Pouches', soloOtros: true },
  { codigo: 'VA003', nombre: 'BOLSO DE CHAMBIRA',             descripcion: 'Bolsas de chambira',unidad: 'UNIDAD',     codigoHS: HS_ARTESANAL, requiereFito: false, codigoFDA: null, descripcionFDA: null, nombreFDA: 'Artisanal Pouches', soloOtros: true },
  { codigo: 'VA004', nombre: 'AJONJOLI',                      descripcion: 'Ajonjoli',          unidad: 'KILOGRAMO', codigoHS: HS_AJONJOLI, requiereFito: true,  ...FDA_AJJONJOLI, soloOtros: true },
  { codigo: 'VA005', nombre: 'Aceites Esenciales',            descripcion: 'Aceites vegetales', unidad: 'LITRO',     codigoHS: HS_ACEITES, requiereFito: false, codigoFDA: null, descripcionFDA: null, nombreFDA: 'Vegetable oils', soloOtros: true },
  { codigo: 'VA006', nombre: 'CUSHMA MUJER',                  descripcion: 'Bolsas de chambira',unidad: 'UNIDAD',     codigoHS: HS_ARTESANAL, requiereFito: false, codigoFDA: null, descripcionFDA: null, nombreFDA: 'Artisanal Pouches', soloOtros: true },
  { codigo: 'VA007', nombre: 'Mini Saquitos Yute',            descripcion: 'Textiles de algodón',unidad: 'UNIDAD',    codigoHS: HS_TEXTILES, requiereFito: false, codigoFDA: null, descripcionFDA: null, nombreFDA: 'Cotton textiles', soloOtros: true },
  { codigo: 'VA008', nombre: 'Castaña Pelada',                descripcion: 'Castaña Amazonica', unidad: 'KILOGRAMO', codigoHS: HS_CASTANA, requiereFito: true,  ...FDA_CASTANA, soloOtros: true },
  { codigo: 'VA011', nombre: 'Taza Grande - Chazuta - Blanca',descripcion: 'Cerámica artesanal',unidad: 'UNIDAD',     codigoHS: HS_CERAMICA, requiereFito: false, codigoFDA: null, descripcionFDA: 'ORNAMENTAL CERAMIC ARTICLES', nombreFDA: 'Pottery', soloOtros: true },
  { codigo: 'VA012', nombre: 'Taza Grande - Chazuta - Roja',  descripcion: 'Cerámica artesanal',unidad: 'UNIDAD',     codigoHS: HS_CERAMICA, requiereFito: false, codigoFDA: null, descripcionFDA: 'ORNAMENTAL CERAMIC ARTICLES', nombreFDA: 'Pottery', soloOtros: true },
  { codigo: 'VA013', nombre: 'Jarra Pequeña - Chazuta',       descripcion: 'Cerámica artesanal',unidad: 'UNIDAD',     codigoHS: HS_CERAMICA, requiereFito: false, codigoFDA: null, descripcionFDA: 'ORNAMENTAL CERAMIC ARTICLES', nombreFDA: 'Pottery', soloOtros: true },
  { codigo: 'VA014', nombre: 'Jarra Grande - Chazuta',        descripcion: 'Cerámica artesanal',unidad: 'UNIDAD',     codigoHS: HS_CERAMICA, requiereFito: false, codigoFDA: null, descripcionFDA: 'ORNAMENTAL CERAMIC ARTICLES', nombreFDA: 'Pottery', soloOtros: true },
  { codigo: 'VA015', nombre: 'Tiesto Hondo - Chazuta',        descripcion: 'Cerámica artesanal',unidad: 'UNIDAD',     codigoHS: HS_CERAMICA, requiereFito: false, codigoFDA: null, descripcionFDA: 'ORNAMENTAL CERAMIC ARTICLES', nombreFDA: 'Pottery', soloOtros: true },
  { codigo: 'VA016', nombre: 'Mocahuitos - Chazuta',          descripcion: 'Cerámica artesanal',unidad: 'UNIDAD',     codigoHS: HS_CERAMICA, requiereFito: false, codigoFDA: null, descripcionFDA: 'ORNAMENTAL CERAMIC ARTICLES', nombreFDA: 'Pottery', soloOtros: true },
  { codigo: 'VA017', nombre: 'Jarra Mediana',                 descripcion: 'Cerámica artesanal',unidad: 'UNIDAD',     codigoHS: HS_CERAMICA, requiereFito: false, codigoFDA: null, descripcionFDA: 'ORNAMENTAL CERAMIC ARTICLES', nombreFDA: 'Pottery', soloOtros: true },
  { codigo: 'CF200', nombre: 'Pajilla',                       descripcion: 'Granos Café verde', unidad: 'KILOGRAMO', codigoHS: HS_PAJILLA, requiereFito: true,  ...FDA_CAFE, soloOtros: true },
];

@Injectable()
export class SkusService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Sku)
    private readonly repo: Repository<Sku>,
  ) {}

  async onApplicationBootstrap() {
    const newCodes = SEED_SKUS.map(s => s.codigo);
    // Remove SKUs not in the new seed (by codigo)
    await this.repo
      .createQueryBuilder()
      .delete()
      .where('codigo IS NOT NULL AND codigo NOT IN (:...codes)', { codes: newCodes })
      .execute();

    await this.repo.upsert(
      SEED_SKUS.map(s => ({
        codigo:         s.codigo,
        nombre:         s.nombre,
        descripcion:    s.descripcion    ?? null,
        unidad:         s.unidad,
        codigoHS:       s.codigoHS       ?? null,
        requiereFito:   s.requiereFito   ?? false,
        codigoFDA:      s.codigoFDA      ?? null,
        descripcionFDA: s.descripcionFDA ?? null,
        nombreFDA:      s.nombreFDA      ?? null,
        soloOtros:      s.soloOtros      ?? false,
        activo: true,
      })),
      { conflictPaths: ['codigo'], skipUpdateIfNoValuesChanged: true },
    );
  }

  findAll(soloOtros?: boolean): Promise<Sku[]> {
    const where: any = { activo: true };
    if (soloOtros !== undefined) where.soloOtros = soloOtros;
    return this.repo.find({ where, order: { codigo: 'ASC' } });
  }

  async create(nombre: string, descripcion?: string): Promise<Sku> {
    return this.repo.save({ nombre, descripcion: descripcion ?? null });
  }
}
