import { useState, useEffect, useCallback, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  parcelasService,
  Parcela,
  LatLng,
  CreateParcelaDto,
  PaginationMeta,
  ParcelaTipoProducto,
  PARCELA_TIPO_LABEL,
} from '@/services/parcelas.service';
import { productoresService, Productor } from '@/services/productores.service';
import { useCampana } from '@/contexts/CampanaContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { TablePagination } from '@/components/TablePagination';
import LoadingLogo from '@/components/LoadingLogo';
import { ParcelaCampanaForm } from '@/components/ParcelaCampanaForm';
import { MapContainer, TileLayer, Polygon, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER: [number, number] = [-6.0, -77.0]; 
const DEFAULT_ZOOM = 10;

function centroid(coords: LatLng[]): [number, number] {
  const lat = coords.reduce((s, c) => s + c.lat, 0) / coords.length;
  const lng = coords.reduce((s, c) => s + c.lng, 0) / coords.length;
  return [lat, lng];
}

function calcAreaHa(coords: LatLng[]): number {
  if (coords.length < 3) return 0;
  let area = 0;
  const n = coords.length;
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += coords[i].lat * coords[j].lng;
    area -= coords[j].lat * coords[i].lng;
  }
  area = Math.abs(area) / 2;
  const avgLat = coords.reduce((s, c) => s + c.lat, 0) / n;
  const mPerLat = 111319.9;
  const mPerLng = 111319.9 * Math.cos((avgLat * Math.PI) / 180);
  return (area * mPerLat * mPerLng) / 10000;
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}

function numberedIcon(n: number, active = true) {
  return L.divIcon({
    className: '',
    html: `<div style="width:22px;height:22px;border-radius:50%;background:${active ? '#1A2B23' : '#6b7280'};color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;border:2px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,0.35)">${n}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

const TIPO_BADGE: Record<ParcelaTipoProducto, { bg: string; text: string }> = {
  cafe:       { bg: '#fef3c7', text: '#92400e' },
  cacao:      { bg: '#fce7f3', text: '#9d174d' },
  cafe_cacao: { bg: '#ede9fe', text: '#5b21b6' },
};

const EMPTY_FORM: CreateParcelaDto = {
  nombre:        '',
  descripcion:   '',
  fechaRegistro: '',
  tipoProducto:  undefined,
  activo:        true,
  tienePpa:      undefined,
  productorId:   0,
  coordenadas:   [],
  
  nombreFinca:                  undefined,
  breveHistoriaInicioProduccion: undefined,
  areaTotalFinca:               undefined,
  altitud:                      undefined,
  estadoPropiedad:              undefined,
  inicioProduccionAnio:         undefined,
  
  controlesBiologicos:          undefined,
  usoHerbicidasChala:           undefined,
  practicaCultivo:              undefined,
  rgazar:                       undefined,
  metodoFertilizacion:          undefined,
  practicasConservacionAmbiental: undefined,
  
  tanqueTina:                   undefined,
  pozoAguasMieles:              undefined,
  secadorSolar:                 undefined,
  compostera:                   undefined,
  infraOtros:                   undefined,
  timbosFermentacion:           undefined,
  despulpadora:                 undefined,
  
  produccion2023:               undefined,
  tipoBeneficio:                undefined,
  tipoSecado:                   undefined,
  
  hectareasTotales:             undefined,
  hectareasCafe:                undefined,
  variedadesCafe:               undefined,
  hectareasRenovacion:          undefined,
  areaPurma:                    undefined,
  areaBosque:                   undefined,
  tipoArbolesBosque:            undefined,
  
  conoceTipoSuelo:              undefined,
  estudioSuelos:                undefined,
  temperaturaPromedio:          undefined,
  tiempoSecadoDias:             undefined,
  periodoCosecha:               undefined,
  densidadSombra:               undefined,
  floraFauna:                   undefined,
  
  cosechaManejo:                undefined,
  despulpado:                   undefined,
  fermentacion:                 undefined,
  secadoManejo:                 undefined,
  almacenaje:                   undefined,
  bienestarLaboral:             undefined,
  jornalerosPorCampana:         undefined,
};

function MapClickLayer({ onAdd }: { onAdd: (pt: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onAdd({ lat: +e.latlng.lat.toFixed(7), lng: +e.latlng.lng.toFixed(7) });
    },
  });
  return null;
}

function MapFitter({ coords }: { coords: LatLng[] }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length === 0) return;
    if (coords.length === 1) {
      map.setView([coords[0].lat, coords[0].lng], 15, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(coords.map((c) => [c.lat, c.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [50, 50], animate: true });
  
  }, [coords]);
  return null;
}

interface ParcelaModalProps {
  initial?: Parcela | null;
  productorId: number;
  onClose: () => void;
  onSave: (data: CreateParcelaDto, id?: number) => Promise<void>;
}

function ParcelaModal({ initial, productorId, onClose, onSave }: ParcelaModalProps) {
  const { campanas } = useCampana();

  
  const [campanaVersion, setCampanaVersion] = useState<number | ''>('');

  const [form, setForm] = useState<CreateParcelaDto>(
    initial
      ? {
          nombre:        initial.nombre,
          descripcion:   initial.descripcion ?? '',
          fechaRegistro: initial.fechaRegistro ?? '',
          tipoProducto:  initial.tipoProducto ?? undefined,
          activo:        initial.activo,
          tienePpa:      initial.tienePpa ?? undefined,
          productorId:   initial.productorId,
          coordenadas:   initial.coordenadas ?? [],
          nombreFinca:                   initial.nombreFinca ?? undefined,
          breveHistoriaInicioProduccion: initial.breveHistoriaInicioProduccion ?? undefined,
          areaTotalFinca:                initial.areaTotalFinca ?? undefined,
          altitud:                       initial.altitud ?? undefined,
          estadoPropiedad:               initial.estadoPropiedad ?? undefined,
          inicioProduccionAnio:          initial.inicioProduccionAnio ?? undefined,
          controlesBiologicos:           initial.controlesBiologicos ?? undefined,
          usoHerbicidasChala:            initial.usoHerbicidasChala ?? undefined,
          practicaCultivo:               initial.practicaCultivo ?? undefined,
          rgazar:                        initial.rgazar          ?? undefined,
          metodoFertilizacion:           initial.metodoFertilizacion ?? undefined,
          practicasConservacionAmbiental: initial.practicasConservacionAmbiental ?? undefined,
          tanqueTina:                    initial.tanqueTina ?? undefined,
          pozoAguasMieles:               initial.pozoAguasMieles ?? undefined,
          secadorSolar:                  initial.secadorSolar    ?? undefined,
          compostera:                    initial.compostera       ?? undefined,
          infraOtros:                    initial.infraOtros       ?? undefined,
          timbosFermentacion:            initial.timbosFermentacion ?? undefined,
          despulpadora:                  initial.despulpadora ?? undefined,
          produccion2023:                initial.produccion2023 ?? undefined,
          tipoBeneficio:                 initial.tipoBeneficio ?? undefined,
          tipoSecado:                    initial.tipoSecado ?? undefined,
          hectareasTotales:              initial.hectareasTotales ?? undefined,
          hectareasCafe:                 initial.hectareasCafe ?? undefined,
          variedadesCafe:                initial.variedadesCafe ?? undefined,
          hectareasRenovacion:           initial.hectareasRenovacion ?? undefined,
          areaPurma:                     initial.areaPurma ?? undefined,
          areaBosque:                    initial.areaBosque ?? undefined,
          tipoArbolesBosque:             initial.tipoArbolesBosque ?? undefined,
          conoceTipoSuelo:               initial.conoceTipoSuelo ?? undefined,
          estudioSuelos:                 initial.estudioSuelos ?? undefined,
          temperaturaPromedio:           initial.temperaturaPromedio ?? undefined,
          tiempoSecadoDias:              initial.tiempoSecadoDias ?? undefined,
          periodoCosecha:                initial.periodoCosecha ?? undefined,
          densidadSombra:                initial.densidadSombra ?? undefined,
          floraFauna:                    initial.floraFauna ?? undefined,
          cosechaManejo:                 initial.cosechaManejo ?? undefined,
          despulpado:                    initial.despulpado ?? undefined,
          fermentacion:                  initial.fermentacion ?? undefined,
          secadoManejo:                  initial.secadoManejo ?? undefined,
          almacenaje:                    initial.almacenaje ?? undefined,
          bienestarLaboral:              initial.bienestarLaboral       ?? undefined,
          jornalerosPorCampana:          initial.jornalerosPorCampana   ?? undefined,
        }
      : { ...EMPTY_FORM, productorId },
  );
  const [saving,     setSaving]     = useState(false);
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [manualLat,  setManualLat]  = useState('');
  const [manualLng,  setManualLng]  = useState('');
  const [manualErr,  setManualErr]  = useState('');

  const set = <K extends keyof CreateParcelaDto>(k: K, v: CreateParcelaDto[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const coords      = form.coordenadas ?? [];
  const hasPolygon  = coords.length >= 3;
  const area        = calcAreaHa(coords);
  const polyPositions = coords.map((c) => [c.lat, c.lng] as [number, number]);
  const mapKey      = initial?.id ?? 'new';
  const initCenter  = coords.length > 0 ? centroid(coords) : DEFAULT_CENTER;
  const initZoom    = coords.length > 0 ? 15 : DEFAULT_ZOOM;

  function addCoord(pt: LatLng) {
    setForm((f) => ({ ...f, coordenadas: [...(f.coordenadas ?? []), pt] }));
  }

  function removeCoord(idx: number) {
    setForm((f) => ({
      ...f,
      coordenadas: (f.coordenadas ?? []).filter((_, i) => i !== idx),
    }));
  }

  function addManual() {
    const lat = parseFloat(manualLat.replace(',', '.'));
    const lng = parseFloat(manualLng.replace(',', '.'));
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setManualErr('Latitud inválida. Rango: -90 a 90');
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setManualErr('Longitud inválida. Rango: -180 a 180');
      return;
    }
    setManualErr('');
    addCoord({ lat: +lat.toFixed(7), lng: +lng.toFixed(7) });
    setManualLat('');
    setManualLng('');
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e['nombre'] = 'El nombre es requerido';
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    setErrors({});
    try {
      const dto: CreateParcelaDto = {
        ...form,
        nombre:        form.nombre.trim(),
        descripcion:   form.descripcion?.trim()   || undefined,
        fechaRegistro: form.fechaRegistro?.trim() || undefined,
        tipoProducto:  form.tipoProducto          || undefined,
        coordenadas:   coords.length > 0 ? coords : undefined,
      };
      await onSave(dto, initial?.id);
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setErrors({ general: typeof msg === 'string' ? msg : 'Error al guardar. Intenta de nuevo.' });
    } finally {
      setSaving(false);
    }
  }

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition-shadow placeholder-gray-300';
  const labelCls = 'block text-[0.68rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => !saving && e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col lg:flex-row"
        style={{ height: 'min(calc(100vh - 40px), 780px)' }}
      >
        {saving && (
          <div
            className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(3px)' }}
          >
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">
              {initial ? 'Actualizando parcela…' : 'Registrando parcela…'}
            </p>
          </div>
        )}

        <div className="flex flex-col lg:w-[400px] lg:shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 max-h-[55vh] lg:max-h-none lg:h-full">

          <div className="px-6 pt-5 pb-4 border-b border-gray-100 shrink-0 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#bef264' }}
                >
                  <svg className="w-3.5 h-3.5" style={{ color: '#365314' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                  </svg>
                </div>
                <h2 className="font-black text-gray-800 text-base tracking-tight">
                  {initial ? 'Editar parcela' : 'Nueva parcela'}
                </h2>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {initial ? `Código: ${initial.codigo}` : 'Ingresa los datos y delimita el área en el mapa'}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={saving}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} id="parcela-form" className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

            {errors['general'] && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5">
                <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
                {errors['general']}
              </div>
            )}

            <div>
              <label className={labelCls}>Nombre de la parcela *</label>
              <input
                value={form.nombre}
                onChange={(e) => set('nombre', e.target.value)}
                className={`${inputCls}${errors['nombre'] ? ' border-red-300 ring-2 ring-red-100' : ''}`}
                placeholder="Ej: Parcela Alta Norte"
                maxLength={200}
              />
              {errors['nombre'] && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                  {errors['nombre']}
                </p>
              )}
            </div>
{initial?.id && (
  <div className="border-t border-gray-100 pt-4 space-y-3">
    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Datos por campaña</p>
    <p className="text-[0.68rem] text-gray-400 leading-relaxed">
      Edita los datos de finca/manejo para una campaña sin modificar otras campañas.
    </p>
    <div>
      <label className={labelCls}>Seleccionar campaña</label>
      <div className="relative">
        <select
          className={`${inputCls} appearance-none pr-7`}
          value={campanaVersion}
          onChange={e => setCampanaVersion(e.target.value === '' ? '' : Number(e.target.value))}
        >
          <option value="">— Elige una campaña —</option>
          {campanas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>
        <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>

    {campanaVersion !== '' && (
      <div className="rounded-xl border border-blue-100 bg-blue-50/20 p-4">
        <ParcelaCampanaForm
          parcelaId={initial.id}
          campanaId={Number(campanaVersion)}
          campanaNombre={campanas.find(c => c.id === Number(campanaVersion))?.nombre ?? ''}
          parcelaBase={initial}
          compact
        />
      </div>
    )}
  </div>
)}

<div className="border-t border-gray-100 pt-4 space-y-3">
  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Parcela e historia</p>

  <div>
    <label className={labelCls}>Breve historia / inicio de producción</label>
    <textarea className={`${inputCls} resize-none`} rows={3}
      placeholder="Describe brevemente cómo inició la producción…"
      value={form.breveHistoriaInicioProduccion ?? ''}
      onChange={(e) => set('breveHistoriaInicioProduccion', e.target.value)} />
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className={labelCls}>Área total finca (ha)</label>
      <input type="number" min="0" step="0.01" className={inputCls} placeholder="0.00"
        value={form.areaTotalFinca ?? ''}
        onChange={(e) => set('areaTotalFinca', e.target.value === '' ? undefined : +e.target.value)} />
    </div>
    <div>
      <label className={labelCls}>Altitud (msnm)</label>
      <input type="number" min="0" step="1" className={inputCls} placeholder="Ej: 1200"
        value={form.altitud ?? ''}
        onChange={(e) => set('altitud', e.target.value === '' ? undefined : +e.target.value)} />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className={labelCls}>Estado de propiedad</label>
      <input className={inputCls} placeholder="Ej: Propio, Alquilado"
        value={form.estadoPropiedad ?? ''}
        onChange={(e) => set('estadoPropiedad', e.target.value)} />
    </div>
    <div>
      <label className={labelCls}>Año inicio producción</label>
      <input type="number" min="1900" max="2030" step="1" className={inputCls} placeholder="Ej: 2005"
        value={form.inicioProduccionAnio ?? ''}
        onChange={(e) => set('inicioProduccionAnio', e.target.value === '' ? undefined : +e.target.value)} />
    </div>
  </div>

  <div>
    <label className={labelCls}>PPA (Padrón de Productor Agrario)</label>
    <select
      className={inputCls}
      value={form.tienePpa ?? ''}
      onChange={(e) => set('tienePpa', e.target.value || undefined)}
    >
      <option value="">— Sin seleccionar —</option>
      <option value="TIENE">Tiene</option>
      <option value="NO TIENE">No tiene</option>
      <option value="EN PROCESO">En proceso</option>
    </select>
  </div>
</div>

<div className="border-t border-gray-100 pt-4 space-y-3">
  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Manejo agrícola</p>

  <div className="flex flex-col gap-2">
    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
      <input type="checkbox" className="w-3.5 h-3.5 rounded accent-green-700"
        checked={form.controlesBiologicos ?? false}
        onChange={(e) => set('controlesBiologicos', e.target.checked)} />
      Uso de controles biológicos
    </label>
    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
      <input type="checkbox" className="w-3.5 h-3.5 rounded accent-green-700"
        checked={form.usoHerbicidasChala ?? false}
        onChange={(e) => set('usoHerbicidasChala', e.target.checked)} />
      Uso de herbicidas en chala
    </label>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className={labelCls}>Práctica de cultivo</label>
      <input className={inputCls} placeholder="Ej: Orgánico, Convencional"
        value={form.practicaCultivo ?? ''}
        onChange={(e) => set('practicaCultivo', e.target.value)} />
    </div>
    <div>
      <label className={labelCls}>RGAZAR</label>
      <div className="flex gap-4 mt-1">
        {(['DTA', 'FTA'] as const).map((opt) => (
          <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-green-700"
              checked={!!form.rgazar && form.rgazar.includes(opt)}
              onChange={(e) => {
                const other = opt === 'DTA' ? 'FTA' : 'DTA';
                const hasOther = !!form.rgazar && form.rgazar.includes(other);
                set('rgazar', e.target.checked
                  ? (hasOther ? 'DTA/FTA' : opt)
                  : (hasOther ? other : undefined));
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
      placeholder="Describe el método de fertilización…"
      value={form.metodoFertilizacion ?? ''}
      onChange={(e) => set('metodoFertilizacion', e.target.value)} />
  </div>

  <div>
    <label className={labelCls}>Prácticas de conservación ambiental</label>
    <textarea className={`${inputCls} resize-none`} rows={2}
      placeholder="Describe las prácticas de conservación…"
      value={form.practicasConservacionAmbiental ?? ''}
      onChange={(e) => set('practicasConservacionAmbiental', e.target.value)} />
  </div>
</div>

<div className="border-t border-gray-100 pt-4 space-y-3">
  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Infraestructura</p>
  <div className="flex flex-col gap-2">
    {([
      ['tanqueTina',        'Tanque tina']            ,
      ['pozoAguasMieles',   'Pozo de aguas mieles']   ,
      ['timbosFermentacion','Timbos de fermentación'] ,
      ['despulpadora',      'Despulpadora']            ,
      ['secadorSolar',      'Secador solar']           ,
      ['compostera',        'Compostera']              ,
    ] as [keyof CreateParcelaDto, string][]).map(([key, lbl]) => (
      <label key={key} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
        <input type="checkbox" className="w-3.5 h-3.5 rounded accent-green-700"
          checked={(form[key] as boolean | undefined) ?? false}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))} />
        {lbl}
      </label>
    ))}
  </div>
  <div>
    <label className={labelCls}>Otros</label>
    <input
      className={inputCls}
      placeholder="Otros equipos o infraestructura…"
      value={form.infraOtros ?? ''}
      onChange={(e) => set('infraOtros', e.target.value || undefined)}
    />
  </div>
</div>

<div className="border-t border-gray-100 pt-4 space-y-3">
  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Producción</p>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className={labelCls}>Producción 2023 (qq)</label>
      <input type="number" min="0" step="0.1" className={inputCls} placeholder="0.0"
        value={form.produccion2023 ?? ''}
        onChange={(e) => set('produccion2023', e.target.value === '' ? undefined : +e.target.value)} />
    </div>
    <div>
      <label className={labelCls}>Tipo de beneficio</label>
      <input className={inputCls} placeholder="Ej: Húmedo, Seco"
        value={form.tipoBeneficio ?? ''}
        onChange={(e) => set('tipoBeneficio', e.target.value)} />
    </div>
  </div>

  <div>
    <label className={labelCls}>Tipo de secado</label>
    <div className="relative">
      <select className={`${inputCls} appearance-none pr-7`}
        value={form.tipoSecado ?? ''}
        onChange={(e) => set('tipoSecado', e.target.value || undefined)}>
        <option value="">Sin especificar</option>
        <option value="solar">Secador solar</option>
        <option value="africana">Tarima africana</option>
        <option value="manta">Secado en manta</option>
        <option value="otro">Otro</option>
      </select>
      <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
  </div>
</div>

<div className="border-t border-gray-100 pt-4 space-y-3">
  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Áreas (hectáreas)</p>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className={labelCls}>Ha totales</label>
      <input type="number" min="0" step="0.01" className={inputCls} placeholder="0.00"
        value={form.hectareasTotales ?? ''}
        onChange={(e) => set('hectareasTotales', e.target.value === '' ? undefined : +e.target.value)} />
    </div>
    <div>
      <label className={labelCls}>Ha café</label>
      <input type="number" min="0" step="0.01" className={inputCls} placeholder="0.00"
        value={form.hectareasCafe ?? ''}
        onChange={(e) => set('hectareasCafe', e.target.value === '' ? undefined : +e.target.value)} />
    </div>
    <div>
      <label className={labelCls}>Ha en renovación</label>
      <input type="number" min="0" step="0.01" className={inputCls} placeholder="0.00"
        value={form.hectareasRenovacion ?? ''}
        onChange={(e) => set('hectareasRenovacion', e.target.value === '' ? undefined : +e.target.value)} />
    </div>
    <div>
      <label className={labelCls}>Ha purma</label>
      <input type="number" min="0" step="0.01" className={inputCls} placeholder="0.00"
        value={form.areaPurma ?? ''}
        onChange={(e) => set('areaPurma', e.target.value === '' ? undefined : +e.target.value)} />
    </div>
    <div>
      <label className={labelCls}>Ha bosque</label>
      <input type="number" min="0" step="0.01" className={inputCls} placeholder="0.00"
        value={form.areaBosque ?? ''}
        onChange={(e) => set('areaBosque', e.target.value === '' ? undefined : +e.target.value)} />
    </div>
  </div>

  <div>
    <label className={labelCls}>Variedades de café</label>
    <input className={inputCls} placeholder="Ej: Caturra, Bourbon, Gesha"
      value={form.variedadesCafe ?? ''}
      onChange={(e) => set('variedadesCafe', e.target.value)} />
  </div>

  <div>
    <label className={labelCls}>Tipo de árboles (bosque/sombra)</label>
    <input className={inputCls} placeholder="Ej: Guaba, Cedro, Aliso"
      value={form.tipoArbolesBosque ?? ''}
      onChange={(e) => set('tipoArbolesBosque', e.target.value)} />
  </div>
</div>

<div className="border-t border-gray-100 pt-4 space-y-3">
  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Condiciones</p>

  <div>
    <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer mb-2">
      <input type="checkbox" className="w-3.5 h-3.5 rounded accent-green-700"
        checked={form.conoceTipoSuelo ?? false}
        onChange={(e) => set('conoceTipoSuelo', e.target.checked)} />
      Conoce el tipo de suelo
    </label>
    {form.conoceTipoSuelo && (
      <textarea className={`${inputCls} resize-none`} rows={2}
        placeholder="Describe el tipo y características del suelo…"
        value={form.estudioSuelos ?? ''}
        onChange={(e) => set('estudioSuelos', e.target.value)} />
    )}
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className={labelCls}>Temperatura promedio (°C)</label>
      <input type="number" step="0.1" className={inputCls} placeholder="Ej: 18.5"
        value={form.temperaturaPromedio ?? ''}
        onChange={(e) => set('temperaturaPromedio', e.target.value === '' ? undefined : +e.target.value)} />
    </div>
    <div>
      <label className={labelCls}>Tiempo de secado (días)</label>
      <input type="number" min="0" step="1" className={inputCls} placeholder="Ej: 14"
        value={form.tiempoSecadoDias ?? ''}
        onChange={(e) => set('tiempoSecadoDias', e.target.value === '' ? undefined : +e.target.value)} />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className={labelCls}>Período de cosecha</label>
      <input className={inputCls} placeholder="Ej: Abril - Agosto"
        value={form.periodoCosecha ?? ''}
        onChange={(e) => set('periodoCosecha', e.target.value)} />
    </div>
    <div>
      <label className={labelCls}>Densidad de sombra</label>
      <input className={inputCls} placeholder="Ej: 30%, Media"
        value={form.densidadSombra ?? ''}
        onChange={(e) => set('densidadSombra', e.target.value)} />
    </div>
  </div>

  <div>
    <label className={labelCls}>Flora y fauna</label>
    <textarea className={`${inputCls} resize-none`} rows={2}
      placeholder="Especies relevantes presentes en la finca…"
      value={form.floraFauna ?? ''}
      onChange={(e) => set('floraFauna', e.target.value)} />
  </div>
</div>

<div className="border-t border-gray-100 pt-4 space-y-3">
  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Manejo de parcela y cultivo</p>

  <div>
    <label className={labelCls}>Cosecha</label>
    <textarea className={`${inputCls} resize-none`} rows={2}
      placeholder="Describe el proceso de cosecha…"
      value={form.cosechaManejo ?? ''}
      onChange={(e) => set('cosechaManejo', e.target.value)} />
  </div>

  <div>
    <label className={labelCls}>Despulpado</label>
    <textarea className={`${inputCls} resize-none`} rows={2}
      placeholder="Describe el proceso de despulpado…"
      value={form.despulpado ?? ''}
      onChange={(e) => set('despulpado', e.target.value)} />
  </div>

  <div>
    <label className={labelCls}>Fermentación</label>
    <textarea className={`${inputCls} resize-none`} rows={2}
      placeholder="Describe el proceso de fermentación…"
      value={form.fermentacion ?? ''}
      onChange={(e) => set('fermentacion', e.target.value)} />
  </div>

  <div>
    <label className={labelCls}>Secado</label>
    <textarea className={`${inputCls} resize-none`} rows={2}
      placeholder="Describe el proceso de secado…"
      value={form.secadoManejo ?? ''}
      onChange={(e) => set('secadoManejo', e.target.value)} />
  </div>

  <div>
    <label className={labelCls}>Almacenaje</label>
    <textarea className={`${inputCls} resize-none`} rows={2}
      placeholder="Describe las condiciones de almacenaje…"
      value={form.almacenaje ?? ''}
      onChange={(e) => set('almacenaje', e.target.value)} />
  </div>

  <div>
    <label className={labelCls}>Bienestar laboral</label>
    <textarea className={`${inputCls} resize-none`} rows={2}
      placeholder="Describe las condiciones laborales…"
      value={form.bienestarLaboral ?? ''}
      onChange={(e) => set('bienestarLaboral', e.target.value)} />
  </div>

  <div>
    <label className={labelCls}>N° Jornaleros por campaña</label>
    <input
      type="number" min="0" step="1"
      className={inputCls}
      placeholder="Ej: 5"
      value={form.jornalerosPorCampana ?? ''}
      onChange={(e) => set('jornalerosPorCampana', e.target.value === '' ? undefined : +e.target.value)}
    />
  </div>
</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Fecha de registro</label>
                <input
                  type="date"
                  value={form.fechaRegistro ?? ''}
                  onChange={(e) => set('fechaRegistro', e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Tipo de producto</label>
                <div className="relative">
                  <select
                    value={form.tipoProducto ?? ''}
                    onChange={(e) => set('tipoProducto', (e.target.value as ParcelaTipoProducto) || undefined)}
                    className={`${inputCls} appearance-none pr-7`}
                  >
                    <option value="">Sin especificar</option>
                    {(Object.keys(PARCELA_TIPO_LABEL) as ParcelaTipoProducto[]).map((k) => (
                      <option key={k} value={k}>{PARCELA_TIPO_LABEL[k]}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Descripción</label>
              <textarea
                value={form.descripcion ?? ''}
                onChange={(e) => set('descripcion', e.target.value)}
                className={`${inputCls} resize-none`}
                rows={2}
                placeholder="Observaciones sobre la parcela…"
              />
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <p className="text-[0.68rem] font-bold text-gray-500 uppercase tracking-widest">Vértices del polígono</p>
                  {coords.length > 0 && (
                    <span
                      className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: hasPolygon ? '#dcfce7' : '#fef9c3', color: hasPolygon ? '#166534' : '#854d0e' }}
                    >
                      {coords.length} {coords.length === 1 ? 'punto' : 'puntos'}
                    </span>
                  )}
                </div>
                {coords.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, coordenadas: [] }))}
                    className="text-[0.65rem] font-semibold text-red-400 hover:text-red-600 transition-colors"
                  >
                    Limpiar todo
                  </button>
                )}
              </div>

              {coords.length > 0 ? (
                <div className="space-y-1 max-h-32 overflow-y-auto pr-0.5 mb-3">
                  {coords.map((pt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-xs group"
                    >
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white font-black text-[9px] shrink-0"
                        style={{ backgroundColor: '#1A2B23' }}
                      >
                        {i + 1}
                      </span>
                      <span className="font-mono text-gray-600 flex-1 truncate">
                        {pt.lat.toFixed(6)}, {pt.lng.toFixed(6)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeCoord(i)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-center mb-3">
                  <p className="text-xs text-gray-400">Haz clic en el mapa para agregar vértices</p>
                </div>
              )}

              {hasPolygon && (
                <div className="flex items-center gap-1.5 mb-3 px-3 py-2 rounded-xl bg-green-50 border border-green-100">
                  <svg className="w-3.5 h-3.5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/>
                  </svg>
                  <span className="text-xs font-semibold text-green-700">
                    Área estimada: {area < 0.01 ? '<0.01' : area.toFixed(2)} ha
                  </span>
                </div>
              )}

              {!hasPolygon && coords.length > 0 && (
                <p className="text-[0.68rem] text-amber-600 mb-3 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
                  </svg>
                  Necesitas al menos 3 puntos para cerrar el polígono
                </p>
              )}

              <div className="space-y-1.5">
                <p className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-widest">Agregar punto manual</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Latitud"
                    value={manualLat}
                    onChange={(e) => { setManualLat(e.target.value); setManualErr(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addManual())}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-gray-300"
                  />
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Longitud"
                    value={manualLng}
                    onChange={(e) => { setManualLng(e.target.value); setManualErr(''); }}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addManual())}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-green-600 placeholder-gray-300"
                  />
                  <button
                    type="button"
                    onClick={addManual}
                    disabled={!manualLat || !manualLng}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold transition-all hover:opacity-90 disabled:opacity-30 shrink-0"
                    style={{ backgroundColor: '#1A2B23' }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
                    </svg>
                  </button>
                </div>
                {manualErr && (
                  <p className="text-[0.65rem] text-red-500">{manualErr}</p>
                )}
              </div>
            </div>
          </form>

          <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              form="parcela-form"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-white rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center gap-2"
              style={{ backgroundColor: '#1A2B23' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
              </svg>
              {initial ? 'Guardar cambios' : 'Registrar parcela'}
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-[280px] lg:min-h-0 relative bg-gray-100">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[400] pointer-events-none">
            <div className="bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-md flex items-center gap-1.5 whitespace-nowrap">
              <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
              </svg>
              Haz clic en el mapa para agregar vértices
            </div>
          </div>

          {coords.length > 0 && (
            <div className="absolute top-3 right-3 z-[400]">
              <button
                onClick={() => setForm((f) => ({ ...f, coordenadas: [] }))}
                className="bg-white/95 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs font-semibold text-red-500 hover:text-red-700 shadow-md transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
                Limpiar
              </button>
            </div>
          )}

          <MapContainer
            key={mapKey}
            center={initCenter}
            zoom={initZoom}
            style={{ height: '100%', width: '100%', minHeight: '280px' }}
            scrollWheelZoom
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <MapClickLayer onAdd={addCoord} />
            <MapFitter coords={coords} />
            {hasPolygon && (
              <Polygon
                positions={polyPositions}
                pathOptions={{ color: '#1A2B23', fillColor: '#22c55e', fillOpacity: 0.25, weight: 2.5 }}
              />
            )}
            {coords.map((pt, i) => (
              <Marker key={i} position={[pt.lat, pt.lng]} icon={numberedIcon(i + 1)} />
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

interface MapViewModalProps {
  parcela: Parcela;
  onClose: () => void;
  onEdit: () => void;
}

function MapViewModal({ parcela, onClose, onEdit }: MapViewModalProps) {
  const coords     = parcela.coordenadas ?? [];
  const hasMap     = coords.length >= 3;
  const center     = coords.length > 0 ? centroid(coords) : DEFAULT_CENTER;
  const zoom       = coords.length > 0 ? 15 : DEFAULT_ZOOM;
  const polyPos    = coords.map((c) => [c.lat, c.lng] as [number, number]);
  const area       = calcAreaHa(coords);
  const badge      = parcela.tipoProducto ? TIPO_BADGE[parcela.tipoProducto] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" style={{ height: 'min(calc(100vh - 48px), 560px)' }}>

        <div className="shrink-0 flex items-center gap-3 px-5 py-3.5 border-b border-gray-100">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
            <h2 className="font-black text-gray-800 truncate text-sm">{parcela.nombre}</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 shrink-0">{parcela.codigo}</span>
            {badge && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg shrink-0" style={{ backgroundColor: badge.bg, color: badge.text }}>
                {PARCELA_TIPO_LABEL[parcela.tipoProducto!]}
              </span>
            )}
            {hasMap && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-green-100 text-green-700 shrink-0">
                {coords.length} vértices
              </span>
            )}
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-xl transition-all hover:opacity-90 shrink-0"
            style={{ backgroundColor: '#1A2B23' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
            </svg>
            Editar
          </button>
        </div>

        <div className="flex-1 relative">
          {!hasMap && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <div className="text-center space-y-2 px-6">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                  </svg>
                </div>
                <p className="font-bold text-gray-700 text-sm">Sin geolocalización</p>
                <p className="text-xs text-gray-400">Edita la parcela para delimitar su área en el mapa</p>
              </div>
            </div>
          )}

          <MapContainer
            key={parcela.id}
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom
            zoomControl
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {hasMap && (
              <>
                <Polygon
                  positions={polyPos}
                  pathOptions={{ color: '#1A2B23', fillColor: '#22c55e', fillOpacity: 0.3, weight: 3 }}
                />
                <MapFitter coords={coords} />
                {coords.map((pt, i) => (
                  <Marker key={i} position={[pt.lat, pt.lng]} icon={numberedIcon(i + 1)} />
                ))}
              </>
            )}
          </MapContainer>

          {hasMap && (
            <div className="absolute bottom-3 left-3 z-[400]">
              <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg px-3 py-2 space-y-1 min-w-[180px]">
                <p className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest">Detalles</p>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-600">Vértices</span>
                  <span className="text-xs font-bold text-gray-800">{coords.length}</span>
                </div>
                {area > 0 && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-600">Área aprox.</span>
                    <span className="text-xs font-bold text-green-700">{area < 0.01 ? '<0.01' : area.toFixed(2)} ha</span>
                  </div>
                )}
                {parcela.fechaRegistro && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-gray-600">Registro</span>
                    <span className="text-xs font-bold text-gray-800">{fmtDate(parcela.fechaRegistro)}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DeleteModalProps {
  parcela: Parcela;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function DeleteModal({ parcela, onClose, onConfirm }: DeleteModalProps) {
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try { await onConfirm(); onClose(); }
    finally { setLoading(false); }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={(e) => !loading && e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.75h.007v.008H12v-.008z"/>
            </svg>
          </div>
          <div>
            <h3 className="font-black text-gray-800">Inactivar parcela</h3>
            <p className="text-xs text-gray-400 mt-0.5">Esta acción desactiva el registro</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          ¿Deseas inactivar <span className="font-bold text-gray-800">{parcela.nombre}</span>?
          <br />
          <span className="text-xs text-gray-400">Código: {parcela.codigo}</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handle}
            disabled={loading}
            className="flex-1 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Inactivando…' : 'Inactivar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function GeoMapsPage() {
  const { productorId } = useParams<{ productorId: string }>();
  const navigate = useNavigate();
  const pid = Number(productorId);

  const [productor,  setProductor]  = useState<Productor | null>(null);
  const [rows,       setRows]       = useState<Parcela[]>([]);
  const [meta,       setMeta]       = useState<PaginationMeta>({ total: 0, page: 1, lastPage: 1, limit: 10 });
  const [page,       setPage]       = useState(1);
  const [limit,      setLimit]      = useState(10);
  const [loading,    setLoading]    = useState(true);
  const [modal,      setModal]      = useState<'create' | 'edit' | 'delete' | 'map' | null>(null);
  const [selected,   setSelected]   = useState<Parcela | null>(null);

  const { isOnline, justReconnected } = useNetworkStatus();

  useEffect(() => {
    if (!pid) return;
    productoresService.getOne(pid).then(setProductor);
  }, [pid]);

  const load = useCallback(async () => {
    if (!pid) return;
    setLoading(true);
    try {
      const res = await parcelasService.getPage(page, limit, pid);
      setRows(res.data);
      setMeta(res.meta);
    } finally {
      setLoading(false);
    }
  }, [pid, page, limit]);

  useEffect(() => { load(); }, [load]);

  async function handleSave(dto: CreateParcelaDto, id?: number) {
    if (id) {
      
      const { productorId: _, ...updateDto } = dto;
      await parcelasService.update(id, updateDto);
    } else {
      await parcelasService.create({ ...dto, productorId: pid });
    }
    await load();
  }

  async function handleDelete() {
    if (!selected) return;
    await parcelasService.remove(selected.id);
    await load();
  }

  const nombreProductor = productor
    ? (productor.apellido ? `${productor.apellido}, ${productor.nombre}` : productor.nombre)
    : '…';

  const conMapa  = rows.filter((p) => (p.coordenadas?.length ?? 0) >= 3).length;
  const sinMapa  = rows.length - conMapa;

  function openMap(p: Parcela) { setSelected(p); setModal('map'); }
  function openEdit(p: Parcela) { setSelected(p); setModal('edit'); }

  return (
    <div className="relative p-4 md:p-8 min-h-full space-y-5">

      {!isOnline && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"/>
          </svg>
          Modo sin conexión — mostrando datos en caché
        </div>
      )}
      {isOnline && justReconnected && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"/>
          </svg>
          Sincronizando cambios pendientes…
        </div>
      )}

      <div className="flex flex-col gap-2">
        <button
          onClick={() => navigate('/dashboard/productores')}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors w-fit"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5"/>
          </svg>
          Productores / {nombreProductor}
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-black tracking-tight uppercase leading-none"
              style={{ color: '#1A2B23' }}
            >
              Geomaps
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1.5">
              Parcelas de <span className="text-gray-600">{nombreProductor}</span>
            </p>
          </div>
          <button
            onClick={() => setModal('create')}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white rounded-xl transition-all hover:opacity-90 active:scale-95 self-start sm:self-auto"
            style={{ backgroundColor: '#1A2B23' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            Agregar parcela
          </button>
        </div>
      </div>

      {loading && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(2px)' }}
        >
          <LoadingLogo />
        </div>
      )}

      {!loading && meta.total > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total parcelas', value: meta.total, color: '#1A2B23', bg: '#f0fdf4' },
            { label: 'Con polígono',   value: conMapa,    color: '#16a34a', bg: '#dcfce7' },
            { label: 'Sin mapa',       value: sinMapa,    color: '#9ca3af', bg: '#f9fafb' },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="rounded-2xl border border-gray-200 shadow-sm px-4 py-3" style={{ backgroundColor: bg }}>
              <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
              <p className="text-2xl font-black mt-0.5" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && rows.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-16 flex flex-col items-center gap-4 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: '#bef264' }}
          >
            <svg className="w-8 h-8" style={{ color: '#365314' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
            </svg>
          </div>
          <div className="space-y-1">
            <p className="font-black text-gray-700 text-base">Sin parcelas registradas</p>
            <p className="text-sm text-gray-400 max-w-xs">
              Registra la primera parcela para comenzar a mapear las áreas de cultivo.
            </p>
          </div>
          <button
            onClick={() => setModal('create')}
            className="mt-1 flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl hover:opacity-90 transition-all active:scale-95"
            style={{ backgroundColor: '#1A2B23' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
            </svg>
            Agregar primera parcela
          </button>
        </div>
      )}

      {!loading && rows.length > 0 && (
        <>
          <div className="hidden sm:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left px-5 py-3.5 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest w-32">Código</th>
                    <th className="text-left px-5 py-3.5 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest">Nombre</th>
                    <th className="text-left px-5 py-3.5 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest w-36">Producto</th>
                    <th className="text-left px-5 py-3.5 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest w-32">Fecha</th>
                    <th className="text-center px-5 py-3.5 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest w-28">Polígono</th>
                    <th className="text-right px-5 py-3.5 text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rows.map((p) => {
                    const hasP   = (p.coordenadas?.length ?? 0) >= 3;
                    const badge  = p.tipoProducto ? TIPO_BADGE[p.tipoProducto] : null;
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 tracking-wide whitespace-nowrap">
                            {p.codigo}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-semibold text-gray-800 truncate max-w-[200px]">{p.nombre}</p>
                          {p.descripcion && (
                            <p className="text-xs text-gray-400 truncate max-w-[200px] mt-0.5">{p.descripcion}</p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {badge ? (
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg whitespace-nowrap" style={{ backgroundColor: badge.bg, color: badge.text }}>
                              {PARCELA_TIPO_LABEL[p.tipoProducto!]}
                            </span>
                          ) : (
                            <span className="text-gray-300 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-500 whitespace-nowrap">{fmtDate(p.fechaRegistro)}</td>
                        <td className="px-5 py-3.5 text-center">
                          {hasP ? (
                            <button
                              onClick={() => openMap(p)}
                              className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
                              style={{ backgroundColor: '#dcfce7', color: '#166534' }}
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                              </svg>
                              {p.coordenadas!.length} pts
                            </button>
                          ) : (
                            <span className="text-xs text-gray-300 font-medium">Sin mapa</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(p)}
                              title="Editar"
                              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                              style={{ backgroundColor: '#e0f2fe' }}
                            >
                              <svg className="w-3.5 h-3.5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
                              </svg>
                            </button>
                            <button
                              onClick={() => { setSelected(p); setModal('delete'); }}
                              title="Inactivar"
                              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                              style={{ backgroundColor: '#fee2e2' }}
                            >
                              <svg className="w-3.5 h-3.5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sm:hidden space-y-3">
            {rows.map((p) => {
              const hasP  = (p.coordenadas?.length ?? 0) >= 3;
              const badge = p.tipoProducto ? TIPO_BADGE[p.tipoProducto] : null;
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-4 pt-4 pb-3 flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: hasP ? '#bef264' : '#f3f4f6' }}
                    >
                      <svg
                        className="w-5 h-5"
                        style={{ color: hasP ? '#365314' : '#9ca3af' }}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600">{p.codigo}</span>
                        {badge && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ backgroundColor: badge.bg, color: badge.text }}>
                            {PARCELA_TIPO_LABEL[p.tipoProducto!]}
                          </span>
                        )}
                        {hasP && (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-green-100 text-green-700">
                            {p.coordenadas!.length} pts
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-gray-800 mt-1 truncate">{p.nombre}</p>
                      {p.descripcion && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.descripcion}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">{fmtDate(p.fechaRegistro)}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-2.5 flex items-center gap-2">
                    {hasP && (
                      <button
                        onClick={() => openMap(p)}
                        className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
                        style={{ backgroundColor: '#bef264', color: '#365314' }}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                        </svg>
                        Ver mapa
                      </button>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => openEdit(p)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                        style={{ backgroundColor: '#e0f2fe' }}
                      >
                        <svg className="w-4 h-4 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => { setSelected(p); setModal('delete'); }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80 active:scale-95"
                        style={{ backgroundColor: '#fee2e2' }}
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <TablePagination
              total={meta.total}
              page={page}
              lastPage={meta.lastPage}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={(l) => { setLimit(l); setPage(1); }}
              limitOptions={[10, 20, 50]}
            />
          </div>
        </>
      )}

      {(modal === 'create' || modal === 'edit') && (
        <ParcelaModal
          initial={modal === 'edit' ? selected : null}
          productorId={pid}
          onClose={() => { setModal(null); setSelected(null); }}
          onSave={handleSave}
        />
      )}
      {modal === 'delete' && selected && (
        <DeleteModal
          parcela={selected}
          onClose={() => { setModal(null); setSelected(null); }}
          onConfirm={handleDelete}
        />
      )}
      {modal === 'map' && selected && (
        <MapViewModal
          parcela={selected}
          onClose={() => { setModal(null); setSelected(null); }}
          onEdit={() => { setModal('edit'); }}
        />
      )}
    </div>
  );
}
