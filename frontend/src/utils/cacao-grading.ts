

export interface CategoriaBase {
  intensidad: number;   
  calidad:    number;   
  comentario: string;
}

export type DefectoKey =
  | 'moho' | 'tierra' | 'quemado'
  | 'contaminantes' | 'descomposicion' | 'otros';

export interface DefectoEntry {
  key:        DefectoKey;
  nombre:     string;
  intensidad: number;  
  comentario: string;
}

export interface SaborDescriptor {
  key:        string;
  label:      string;
  intensidad: number;  
  comentario: string;
}

export interface IICTEData {
  fecha:             string;
  evaluador:         string;
  aroma:             CategoriaBase;
  acidez:            CategoriaBase;
  amargor:           CategoriaBase;
  astringencia:      CategoriaBase;
  posgusto:          CategoriaBase;
  defectos:          DefectoEntry[];
  saborCalidad:      number;           
  saborDescriptores: SaborDescriptor[];
  puntosCatador:     number;           
  comentarios:       string;
  puntajeTotal:      number;
}

export type InterpretacionNivel =
  | 'defectuoso' | 'comercial' | 'buen_cacao' | 'fino_aroma' | 'premium';

export interface Interpretacion {
  nivel:       InterpretacionNivel;
  label:       string;
  descripcion: string;
  color:       string;
  bg:          string;
  border:      string;
}

export const INTENSIDAD_LABELS: string[] = [
  'Ausente',
  'Apenas detectable',
  'Presente',
  'Caracteriza la muestra',
  'Dominante',
  'Extremo',
];

export const INTENSIDAD_COLORS: string[] = [
  '#D1D5DB', 
  '#86EFAC', 
  '#4ADE80', 
  '#FBBF24', 
  '#F97316', 
  '#EF4444', 
];

export const DEFECTO_CATALOG: Array<{ key: DefectoKey; nombre: string }> = [
  { key: 'moho',           nombre: 'Moho'          },
  { key: 'tierra',         nombre: 'Tierra'         },
  { key: 'quemado',        nombre: 'Quemado'        },
  { key: 'contaminantes',  nombre: 'Contaminantes'  },
  { key: 'descomposicion', nombre: 'Descomposición' },
  { key: 'otros',          nombre: 'Otros'          },
];

export const SABOR_DESCRIPTORES_CATALOG: Array<{ key: string; label: string }> = [
  { key: 'cocoa',      label: 'Cacao / Cocoa'  },
  { key: 'dulce',      label: 'Dulce'           },
  { key: 'nuez',       label: 'Nuez'            },
  { key: 'frutasSec',  label: 'Frutas secas'    },
  { key: 'frutasFres', label: 'Frutas frescas'  },
  { key: 'floral',     label: 'Floral'          },
  { key: 'especias',   label: 'Especias'        },
  { key: 'otros',      label: 'Otros'           },
];

export const PESOS = {
  aroma:         1,
  acidez:        1,
  amargor:       1,
  astringencia:  1,
  defectos:      2,
  sabor:         2,
  posgusto:      1,
  puntosCatador: 1,
} as const;

export const PUNTAJE_MAX = 100;

export function calcCalidadDefecto(defectos: DefectoEntry[]): number {
  const activos = defectos.filter(d => d.intensidad > 0);
  if (activos.length === 0) return 10;
  const avg = activos.reduce((s, d) => s + d.intensidad, 0) / activos.length;
  return Math.min(10, Math.max(0, Math.round((10 - avg * 2) * 100) / 100));
}

export function calcPuntajeTotal(data: Omit<IICTEData, 'puntajeTotal'>): number {
  const calidadDef = calcCalidadDefecto(data.defectos);
  return Math.round((
    data.aroma.calidad        * PESOS.aroma         +
    data.acidez.calidad       * PESOS.acidez        +
    data.amargor.calidad      * PESOS.amargor       +
    data.astringencia.calidad * PESOS.astringencia  +
    calidadDef                * PESOS.defectos      +
    data.saborCalidad         * PESOS.sabor         +
    data.posgusto.calidad     * PESOS.posgusto      +
    data.puntosCatador        * PESOS.puntosCatador
  ) * 10) / 10;
}

const INTERP_TABLE: Array<{ max: number; data: Interpretacion }> = [
  { max: 20,  data: { nivel: 'defectuoso', label: 'Cacao Defectuoso',            descripcion: 'Presencia de defectos significativos que comprometen su calidad.',            color: '#B91C1C', bg: '#FEF2F2', border: '#FECACA' } },
  { max: 40,  data: { nivel: 'comercial',  label: 'Cacao Comercial',              descripcion: 'Calidad mínima para uso comercial general.',                                  color: '#B45309', bg: '#FFFBEB', border: '#FDE68A' } },
  { max: 60,  data: { nivel: 'buen_cacao', label: 'Buen Cacao',                   descripcion: 'Buenas características organolépticas para uso estándar.',                    color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' } },
  { max: 80,  data: { nivel: 'fino_aroma', label: 'Cacao Fino de Aroma',          descripcion: 'Perfil sensorial complejo y equilibrado. Apto para chocolatería fina.',       color: '#6D28D9', bg: '#F5F3FF', border: '#DDD6FE' } },
  { max: 100, data: { nivel: 'premium',    label: 'Cacao Premium / Especialidad', descripcion: 'Excepcional. Perfil único, apto para chocolate de origen y especialidad.', color: '#047857', bg: '#ECFDF5', border: '#A7F3D0' } },
];

export function getInterpretacion(puntaje: number): Interpretacion {
  return (INTERP_TABLE.find(r => puntaje <= r.max) ?? INTERP_TABLE[INTERP_TABLE.length - 1]).data;
}

export function checkAmargorAstringenciaWarning(
  intensidad: number,
  calidad: number,
): string | null {
  return intensidad > 2.5 && calidad > 7
    ? 'Una intensidad excesiva normalmente reduce la calidad sensorial.'
    : null;
}

export function getCalidadColor(calidad: number): string {
  if (calidad === 0) return '#9CA3AF';
  if (calidad <= 2)  return '#DC2626';
  if (calidad <= 5)  return '#D97706';
  if (calidad <= 8)  return '#2563EB';
  return '#059669';
}

export function getCalidadLabel(calidad: number): string {
  if (calidad === 0) return '—';
  if (calidad <= 2)  return 'Malo';
  if (calidad <= 5)  return 'Regular';
  if (calidad <= 8)  return 'Bueno';
  return 'Excelente';
}

const initCat = (): CategoriaBase => ({ intensidad: 0, calidad: 0, comentario: '' });

export function buildInitialIICTEData(): Omit<IICTEData, 'puntajeTotal'> {
  return {
    fecha:             new Date().toISOString().slice(0, 10),
    evaluador:         '',
    aroma:             initCat(),
    acidez:            initCat(),
    amargor:           initCat(),
    astringencia:      initCat(),
    posgusto:          initCat(),
    defectos:          DEFECTO_CATALOG.map(d => ({ ...d, intensidad: 0, comentario: '' })),
    saborCalidad:      0,
    saborDescriptores: SABOR_DESCRIPTORES_CATALOG.map(s => ({ ...s, intensidad: 0, comentario: '' })),
    puntosCatador:     0,
    comentarios:       '',
  };
}
