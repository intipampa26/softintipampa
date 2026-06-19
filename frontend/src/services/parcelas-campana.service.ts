import api from '@/api/axios';

export interface ParcelaCampana {
  id: number;
  parcelaId: number;
  campanaId: number;
  campana?: { id: number; nombre: string };
  
  nombreFinca: string | null;
  breveHistoriaInicioProduccion: string | null;
  areaTotalFinca: number | null;
  altitud: number | null;
  estadoPropiedad: string | null;
  inicioProduccionAnio: number | null;
  
  controlesBiologicos: boolean | null;
  usoHerbicidasChala: boolean | null;
  practicaCultivo: string | null;
  rgazar: string | null;
  metodoFertilizacion: string | null;
  practicasConservacionAmbiental: string | null;
  
  tanqueTina: boolean | null;
  pozoAguasMieles: boolean | null;
  timbosFermentacion: boolean | null;
  despulpadora: boolean | null;
  secadorSolar: boolean | null;
  compostera: boolean | null;
  infraOtros: string | null;
  
  produccion: number | null;
  tipoBeneficio: string | null;
  tipoSecado: string | null;
  
  hectareasTotales: number | null;
  hectareasCafe: number | null;
  variedadesCafe: string | null;
  hectareasRenovacion: number | null;
  areaPurma: number | null;
  areaBosque: number | null;
  tipoArbolesBosque: string | null;
  
  conoceTipoSuelo: boolean | null;
  estudioSuelos: string | null;
  temperaturaPromedio: number | null;
  tiempoSecadoDias: number | null;
  periodoCosecha: string | null;
  densidadSombra: string | null;
  floraFauna: string | null;
  
  cosechaManejo: string | null;
  despulpado: string | null;
  fermentacion: string | null;
  secadoManejo: string | null;
  almacenaje: string | null;
  bienestarLaboral: string | null;
  observacionesCampana: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UpsertParcelaCampanaDto = Omit<ParcelaCampana, 'id' | 'campana' | 'createdAt' | 'updatedAt'>;

const BASE = '/parcelas-campana';

export const parcelasCampanaService = {
   
  async findOne(parcelaId: number, campanaId: number): Promise<ParcelaCampana | null> {
    try {
      const { data } = await api.get<ParcelaCampana | null>(BASE, {
        params: { parcelaId, campanaId },
      });
      return data ?? null;
    } catch {
      return null;
    }
  },

   
  async historial(parcelaId: number): Promise<ParcelaCampana[]> {
    try {
      const { data } = await api.get<ParcelaCampana[]>(`${BASE}/historial`, {
        params: { parcelaId },
      });
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  },

   
  async upsert(dto: UpsertParcelaCampanaDto): Promise<ParcelaCampana | null> {
    if (!navigator.onLine) return null;
    try {
      const { data } = await api.post<ParcelaCampana>(BASE, dto);
      return data;
    } catch {
      return null;
    }
  },

   
  async remove(parcelaId: number, campanaId: number): Promise<void> {
    if (!navigator.onLine) return;
    try {
      await api.delete(BASE, { params: { parcelaId, campanaId } });
    } catch {   }
  },
};
