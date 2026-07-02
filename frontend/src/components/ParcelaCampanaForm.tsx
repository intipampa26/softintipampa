 
import { useState, useEffect } from 'react';
import { Parcela } from '@/services/parcelas.service';
import { parcelasCampanaService, ParcelaCampana } from '@/services/parcelas-campana.service';
import { useToast } from '@/contexts/ToastContext';

type SnapFields = Omit<ParcelaCampana, 'id' | 'parcelaId' | 'campanaId' | 'campana' | 'createdAt' | 'updatedAt'>;

const EMPTY: SnapFields = {
  nombreFinca: null, breveHistoriaInicioProduccion: null, areaTotalFinca: null,
  altitud: null, estadoPropiedad: null, inicioProduccionAnio: null,
  controlesBiologicos: null, usoHerbicidasChala: null, practicaCultivo: null, rgazar: null,
  metodoFertilizacion: null, practicasConservacionAmbiental: null,
  tanqueTina: null, pozoAguasMieles: null,
  timbosFermentacion: null, despulpadora: null,
  secadorSolar: null, compostera: null, infraOtros: null,
  produccion: null, tipoBeneficio: null, tipoSecado: null,
  hectareasTotales: null, hectareasCafe: null, variedadesCafe: null,
  hectareasRenovacion: null, areaPurma: null, areaBosque: null, tipoArbolesBosque: null,
  conoceTipoSuelo: null, estudioSuelos: null, temperaturaPromedio: null,
  tiempoSecadoDias: null, periodoCosecha: null, densidadSombra: null, floraFauna: null,
  cosechaManejo: null, despulpado: null, fermentacion: null, secadoManejo: null,
  almacenaje: null, bienestarLaboral: null, observacionesCampana: null,
};

function fromParcela(p: Parcela): SnapFields {
  return {
    ...EMPTY,
    nombreFinca: p.nombreFinca, breveHistoriaInicioProduccion: p.breveHistoriaInicioProduccion,
    areaTotalFinca: p.areaTotalFinca, altitud: p.altitud, estadoPropiedad: p.estadoPropiedad,
    inicioProduccionAnio: p.inicioProduccionAnio, controlesBiologicos: p.controlesBiologicos,
    usoHerbicidasChala: p.usoHerbicidasChala, practicaCultivo: p.practicaCultivo, rgazar: p.rgazar,
    metodoFertilizacion: p.metodoFertilizacion,
    practicasConservacionAmbiental: p.practicasConservacionAmbiental,
    tanqueTina: p.tanqueTina, pozoAguasMieles: p.pozoAguasMieles,
    timbosFermentacion: p.timbosFermentacion, despulpadora: p.despulpadora,
    secadorSolar: p.secadorSolar, compostera: p.compostera, infraOtros: p.infraOtros,
    produccion: p.produccion2023, tipoBeneficio: p.tipoBeneficio, tipoSecado: p.tipoSecado,
    hectareasTotales: p.hectareasTotales, hectareasCafe: p.hectareasCafe,
    variedadesCafe: p.variedadesCafe, hectareasRenovacion: p.hectareasRenovacion,
    areaPurma: p.areaPurma, areaBosque: p.areaBosque, tipoArbolesBosque: p.tipoArbolesBosque,
    conoceTipoSuelo: p.conoceTipoSuelo, estudioSuelos: p.estudioSuelos,
    temperaturaPromedio: p.temperaturaPromedio, tiempoSecadoDias: p.tiempoSecadoDias,
    periodoCosecha: p.periodoCosecha, densidadSombra: p.densidadSombra, floraFauna: p.floraFauna,
    cosechaManejo: p.cosechaManejo, despulpado: p.despulpado, fermentacion: p.fermentacion,
    secadoManejo: p.secadoManejo, almacenaje: p.almacenaje, bienestarLaboral: p.bienestarLaboral,
  };
}

const inp  = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow placeholder-gray-300';
const inpS = 'w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400 transition-shadow placeholder-gray-300';
const lbl  = 'block text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest mb-1';

interface SectionProps { title: string; children: React.ReactNode; }
function Sec({ title, children }: SectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-[0.68rem] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100 pb-1">{title}</p>
      {children}
    </div>
  );
}

interface ParcelaCampanaFormProps {
  parcelaId: number;
  campanaId: number;
  campanaNombre: string;
  parcelaBase: Parcela;
  onSaved?: (snap: ParcelaCampana) => void;
  compact?: boolean;
}

export function ParcelaCampanaForm({
  parcelaId, campanaId, campanaNombre, parcelaBase, onSaved, compact,
}: ParcelaCampanaFormProps) {
  const [fields, setFields] = useState<SnapFields>({ ...EMPTY });
  const [loading, setLoading]  = useState(true);
  const [saving, setSaving]    = useState(false);
  const [saved, setSaved]      = useState(false);
  const [hasSavedSnap, setHasSavedSnap] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    setHasSavedSnap(false);
    parcelasCampanaService.findOne(parcelaId, campanaId).then(snap => {
      if (snap) {
        const { id: _i, parcelaId: _p, campanaId: _c, campana: _camp, createdAt: _ca, updatedAt: _ua, ...rest } = snap;
        setFields(rest as SnapFields);
        setHasSavedSnap(true);
      } else {
        setFields(fromParcela(parcelaBase));
      }
      setLoading(false);
    });
  }, [parcelaId, campanaId]);

  const setF = (k: keyof SnapFields, v: unknown) => setFields(f => ({ ...f, [k]: v }));
  const numF = (k: keyof SnapFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(k, e.target.value === '' ? null : +e.target.value);
  const strF = (k: keyof SnapFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF(k, e.target.value || null);
  const boolF = (k: keyof SnapFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF(k, e.target.checked);
  const numV = (v: number | null) => v ?? '';
  const strV = (v: string | null) => v ?? '';
  const boolV = (v: boolean | null) => v ?? false;

  async function handleSave() {
    setSaving(true);
    const result = await parcelasCampanaService.upsert({ parcelaId, campanaId, ...fields });
    setSaving(false);
    if (result) {
      setHasSavedSnap(true);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      onSaved?.(result);
    } else {
      toast.error('Error al guardar. Intenta de nuevo.');
    }
  }

  const inputCls = compact ? inpS : inp;
  const labelCls = lbl;

  if (loading) return (
    <div className="py-6 text-center text-xs text-gray-400 animate-pulse">Cargando datos de campaña…</div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full ${hasSavedSnap ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${hasSavedSnap ? 'bg-blue-500' : 'bg-amber-400'}`}/>
          {hasSavedSnap ? `Versión guardada — ${campanaNombre}` : `Sin versión para ${campanaNombre} (datos inicializados desde base)`}
        </span>
      </div>

      <Sec title="Finca e historia">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelCls}>Nombre de la finca</label>
            <input className={inputCls} placeholder="Ej: Finca El Mirador"
              value={strV(fields.nombreFinca)} onChange={strF('nombreFinca')} />
          </div>
          <div>
            <label className={labelCls}>Área total (ha)</label>
            <input type="number" min="0" step="0.01" className={inputCls} placeholder="0.00"
              value={numV(fields.areaTotalFinca)} onChange={numF('areaTotalFinca')} />
          </div>
          <div>
            <label className={labelCls}>Altitud (msnm)</label>
            <input type="number" min="0" step="1" className={inputCls} placeholder="1200"
              value={numV(fields.altitud)} onChange={numF('altitud')} />
          </div>
          <div>
            <label className={labelCls}>Estado de propiedad</label>
            <input className={inputCls} placeholder="Propio, Alquilado…"
              value={strV(fields.estadoPropiedad)} onChange={strF('estadoPropiedad')} />
          </div>
          <div>
            <label className={labelCls}>Año inicio producción</label>
            <input type="number" min="1900" max="2030" step="1" className={inputCls} placeholder="2008"
              value={numV(fields.inicioProduccionAnio)} onChange={numF('inicioProduccionAnio')} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Historia / inicio de producción</label>
          <textarea className={`${inputCls} resize-none`} rows={3}
            placeholder="Describe cómo inició la producción…"
            value={strV(fields.breveHistoriaInicioProduccion)} onChange={strF('breveHistoriaInicioProduccion')} />
        </div>
      </Sec>

      <Sec title="Manejo agrícola">
        <div className="flex flex-col gap-2">
          {([
            ['controlesBiologicos', 'Controles biológicos'],
            ['usoHerbicidasChala', 'Herbicidas en chala'],
          ] as [keyof SnapFields, string][]).map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded accent-blue-600"
                checked={boolV(fields[k] as boolean | null)} onChange={boolF(k)} />
              {label}
            </label>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Práctica de cultivo</label>
            <input className={inputCls} placeholder="Orgánico, Convencional…"
              value={strV(fields.practicaCultivo)} onChange={strF('practicaCultivo')} />
          </div>
          <div>
            <label className={labelCls}>RGAZAR</label>
            <div className="flex gap-4 mt-1">
              {(['DTA', 'FTA'] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded accent-green-700"
                    checked={!!fields.rgazar && fields.rgazar.includes(opt)}
                    onChange={(e) => {
                      const other = opt === 'DTA' ? 'FTA' : 'DTA';
                      const hasOther = !!fields.rgazar && fields.rgazar.includes(other);
                      setF('rgazar', e.target.checked
                        ? (hasOther ? 'DTA/FTA' : opt)
                        : (hasOther ? other : null));
                    }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className={labelCls}>Método de fertilización</label>
          <textarea className={`${inputCls} resize-none`} rows={2}
            value={strV(fields.metodoFertilizacion)} onChange={strF('metodoFertilizacion')} />
        </div>
        <div>
          <label className={labelCls}>Conservación ambiental</label>
          <textarea className={`${inputCls} resize-none`} rows={2}
            value={strV(fields.practicasConservacionAmbiental)} onChange={strF('practicasConservacionAmbiental')} />
        </div>
      </Sec>

      <Sec title="Infraestructura">
        <div className="grid grid-cols-2 gap-y-2">
          {([
            ['tanqueTina',        'Tanque tina'],
            ['pozoAguasMieles',   'Pozo aguas mieles'],
            ['timbosFermentacion','Timbos fermentación'],
            ['despulpadora',      'Despulpadora'],
            ['secadorSolar',      'Secador solar'],
            ['compostera',        'Compostera'],
          ] as [keyof SnapFields, string][]).map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 rounded accent-blue-600"
                checked={boolV(fields[k] as boolean | null)} onChange={boolF(k)} />
              {label}
            </label>
          ))}
        </div>
        <div className="mt-2">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Otros</label>
          <input className={inputCls} placeholder="Otros equipos o infraestructura…"
            value={strV(fields.infraOtros)}
            onChange={strF('infraOtros')} />
        </div>
      </Sec>

      <Sec title="Producción">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Producción (qq)</label>
            <input type="number" min="0" step="0.1" className={inputCls} placeholder="0.0"
              value={numV(fields.produccion)} onChange={numF('produccion')} />
          </div>
          <div>
            <label className={labelCls}>Tipo de beneficio</label>
            <input className={inputCls} placeholder="Húmedo, Seco…"
              value={strV(fields.tipoBeneficio)} onChange={strF('tipoBeneficio')} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Tipo de secado</label>
          <div className="relative">
            <select className={`${inputCls} appearance-none pr-7`}
              value={strV(fields.tipoSecado)}
              onChange={strF('tipoSecado')}>
              <option value="">Sin especificar</option>
              <option value="africana">Tarima africana</option>
              <option value="solar">Secador solar</option>
              <option value="manta">Secado en manta</option>
              <option value="otro">Otro</option>
            </select>
            <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </Sec>

      <Sec title="Áreas (hectáreas)">
        <div className="grid grid-cols-2 gap-3">
          {([
            ['hectareasTotales', 'Ha totales'],
            ['hectareasCafe', 'Ha café'],
            ['hectareasRenovacion', 'Ha renovación'],
            ['areaPurma', 'Ha purma'],
            ['areaBosque', 'Ha bosque'],
          ] as [keyof SnapFields, string][]).map(([k, label]) => (
            <div key={k}>
              <label className={labelCls}>{label}</label>
              <input type="number" min="0" step="0.01" className={inputCls} placeholder="0.00"
                value={numV(fields[k] as number | null)} onChange={numF(k)} />
            </div>
          ))}
        </div>
        <div>
          <label className={labelCls}>Variedades de café</label>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
            {['Caturra','Borbón Rojo','Borbon naranja','Gesha','Pacamara','Tabi','Sidra','Papayo','Blend','Pache','Costa Rica 95','Tipica','Catimor','Maragogipe','SL34','Villa Sarchí','Marsellesa','Limani'].map(v => {
              const selected = (fields.variedadesCafe ?? '').split(',').map(s => s.trim()).filter(Boolean);
              const checked  = selected.includes(v);
              return (
                <label key={v} className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {
                      const next = checked ? selected.filter(s => s !== v) : [...selected, v];
                      setF('variedadesCafe', next.join(', ') || null);
                    }}
                    className="accent-blue-600 w-3.5 h-3.5 shrink-0"
                  />
                  <span className="text-xs text-gray-700">{v}</span>
                </label>
              );
            })}
          </div>
        </div>
        <div>
          <label className={labelCls}>Tipo de árboles (sombra/bosque)</label>
          <input className={inputCls} placeholder="Guaba, Cedro, Aliso…"
            value={strV(fields.tipoArbolesBosque)} onChange={strF('tipoArbolesBosque')} />
        </div>
      </Sec>

      <Sec title="Condiciones">
        <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer mb-1">
          <input type="checkbox" className="w-3.5 h-3.5 rounded accent-blue-600"
            checked={boolV(fields.conoceTipoSuelo)} onChange={boolF('conoceTipoSuelo')} />
          Conoce el tipo de suelo
        </label>
        {fields.conoceTipoSuelo && (
          <div>
            <label className={labelCls}>Descripción del suelo</label>
            <textarea className={`${inputCls} resize-none`} rows={2}
              placeholder="pH, textura, materia orgánica…"
              value={strV(fields.estudioSuelos)} onChange={strF('estudioSuelos')} />
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Temperatura promedio (°C)</label>
            <input type="number" step="0.1" className={inputCls} placeholder="18.5"
              value={numV(fields.temperaturaPromedio)} onChange={numF('temperaturaPromedio')} />
          </div>
          <div>
            <label className={labelCls}>Tiempo de secado (días)</label>
            <input type="number" min="0" step="1" className={inputCls} placeholder="14"
              value={numV(fields.tiempoSecadoDias)} onChange={numF('tiempoSecadoDias')} />
          </div>
          <div>
            <label className={labelCls}>Período de cosecha</label>
            <input className={inputCls} placeholder="Abril – Agosto"
              value={strV(fields.periodoCosecha)} onChange={strF('periodoCosecha')} />
          </div>
          <div>
            <label className={labelCls}>Densidad de sombra</label>
            <input className={inputCls} placeholder="35%, Media…"
              value={strV(fields.densidadSombra)} onChange={strF('densidadSombra')} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Flora y fauna</label>
          <textarea className={`${inputCls} resize-none`} rows={2}
            placeholder="Especies presentes en la finca…"
            value={strV(fields.floraFauna)} onChange={strF('floraFauna')} />
        </div>
      </Sec>

      <Sec title="Manejo de parcela y cultivo">
        {([
          ['cosechaManejo', 'Cosecha', 'Describe el proceso de cosecha…'],
          ['despulpado',    'Despulpado', 'Describe el proceso de despulpado…'],
          ['fermentacion',  'Fermentación', 'Describe el proceso de fermentación…'],
          ['secadoManejo',  'Secado', 'Describe el proceso de secado…'],
          ['almacenaje',    'Almacenaje', 'Condiciones de almacenaje…'],
          ['bienestarLaboral', 'Bienestar laboral', 'Condiciones laborales…'],
        ] as [keyof SnapFields, string, string][]).map(([k, label, ph]) => (
          <div key={k}>
            <label className={labelCls}>{label}</label>
            <textarea className={`${inputCls} resize-none`} rows={2} placeholder={ph}
              value={strV(fields[k] as string | null)}
              onChange={strF(k)} />
          </div>
        ))}
      </Sec>

      <Sec title="Observaciones de campaña">
        <textarea className={`${inputCls} resize-none`} rows={2}
          placeholder="Notas específicas para esta campaña…"
          value={strV(fields.observacionesCampana)} onChange={strF('observacionesCampana')} />
      </Sec>

      {saved && (
        <p className="text-xs text-green-700 bg-green-50 px-3 py-2 rounded-xl flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          Versión guardada para {campanaNombre}
        </p>
      )}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: '#1A2B23', color: '#fff' }}
      >
        {saving ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
          </svg>
        )}
        Guardar datos de {campanaNombre}
      </button>
    </div>
  );
}
