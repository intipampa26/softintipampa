import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lotesService, Lote, LoteEstado } from '@/services/lotes.service';
import { tiposProductoService, TipoProducto } from '@/services/tipos-producto.service';
import { LoteFinal, LoteFinalOrigen } from '@/services/lotes-finales.service';
import { muestrasService, Muestra } from '@/services/muestras.service';
import LoadingLogo from '@/components/LoadingLogo';
import { useToast } from '@/contexts/ToastContext';

function apiMsg(err: unknown): string {
  const e = err as any;
  return e?.response?.data?.message ?? e?.message ?? 'Error inesperado';
}

const ALISTADO_STATES: LoteEstado[] = ['PRE_ALISTADO', 'PREPARADO', 'EMBARCADO', 'EXPORTADO'];
function displaySubtipo(estado: LoteEstado, tp?: { tipo: string; subtipoEntrada: string }) {
  if (!tp) return '';
  return tp.tipo === 'CAFE'
    ? (ALISTADO_STATES.includes(estado) ? 'Café Pergamino' : 'Café Oro Verde')
    : tp.subtipoEntrada.replace(/_/g, ' ');
}

const ESTADO_LABEL: Record<string, string> = {
  PRE_ADQUISICION: 'Pre Adquisición',
  PRE_ALISTADO:    'Pre Alistado',
  PREPARADO:       'Preparado',
  EMBARCADO:       'Embarcado',
  EXPORTADO:       'Exportado',
};
const ESTADO_COLOR: Record<string, string> = {
  PRE_ADQUISICION: 'bg-orange-100 text-orange-700 border-orange-200',
  PRE_ALISTADO:    'bg-amber-100 text-amber-700 border-amber-200',
  PREPARADO:       'bg-green-100 text-green-700 border-green-200',
  EMBARCADO:       'bg-blue-100 text-blue-700 border-blue-200',
  EXPORTADO:       'bg-indigo-100 text-indigo-700 border-indigo-200',
};

function PromoverModal({ lote, onClose, onConfirm }: { lote: Lote; onClose: () => void; onConfirm: () => Promise<string> }) {
  const [saving, setSaving] = useState(false);
  const [done,   setDone]   = useState('');
  const toast = useToast();

  async function handleConfirm() {
    setSaving(true);
    try {
      const lfCodigo = await onConfirm();
      setDone(lfCodigo);
      setTimeout(onClose, 2000);
    } catch (err) {
      toast.error(apiMsg(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }} onClick={e => !done && e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative overflow-hidden">
        {saving && <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}><LoadingLogo compact /></div>}

        {done ? (
          <div className="flex flex-col items-center text-center py-2">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#D1FAE5' }}>
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="#065F46" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <p className="font-black text-gray-800 text-base mb-1">¡Lote Final creado!</p>
            <p className="text-xs text-gray-500 mb-3">Se promovió correctamente desde <strong>{lote.codigo}</strong></p>
            <span className="px-4 py-1.5 rounded-full text-sm font-black" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>{done}</span>
            <p className="text-[0.65rem] text-gray-400 mt-4">Cerrando automáticamente…</p>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-gray-800 mb-1">Pasar directo a Lote Final</h3>
            <p className="text-xs text-gray-500 mb-4">El lote <strong>{lote.codigo}</strong> ({Number(lote.cantidadKg).toFixed(2)} kg) se promoverá tal cual a Lote Final.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
              <button onClick={handleConfirm} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#2d5a3d' }}>Confirmar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DividirModal({ lote, onClose, onConfirm }: {
  lote: Lote;
  onClose: () => void;
  onConfirm: (divisiones: Array<{ codigoLf: string; cantidadKg: number }>) => Promise<void>;
}) {
  const [partes, setPartes] = useState([
    { cantidadKg: '' as number | '' },
    { cantidadKg: '' as number | '' },
  ]);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const suma = partes.reduce((a, p) => a + Number(p.cantidadKg || 0), 0);
  const disponible = Number(lote.cantidadKg);
  const restante = disponible - suma;

  async function handleSubmit() {
    if (partes.some(p => !p.cantidadKg || Number(p.cantidadKg) <= 0)) {
      toast.error('Ingresa la cantidad en kg para cada parte'); return;
    }
    if (suma > disponible + 0.001) {
      toast.error(`La suma (${suma.toFixed(2)} kg) supera el disponible (${disponible.toFixed(2)} kg)`); return;
    }
    setSaving(true);
    try {
      await onConfirm(partes.map(p => ({ codigoLf: '', cantidadKg: Number(p.cantidadKg) })));
      onClose();
    } catch (err) { toast.error(apiMsg(err)); }
    finally { setSaving(false); }
  }

  const cls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md max-h-[92dvh] overflow-y-auto relative">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="font-bold text-gray-800">Dividir lote {lote.codigo}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Disponible: <strong className="text-gray-700">{disponible.toFixed(2)} kg</strong>
              {' · '}Los códigos LF se generan automáticamente
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        {saving && (
          <div className="absolute inset-0 z-20 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
          </div>
        )}
        <div className="px-6 py-5 space-y-3">
          {partes.map((p, i) => (
            <div key={i} className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Parte {i + 1}
                  <span className="ml-1.5 font-normal text-gray-400 normal-case">→ LF auto-generado</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0.01} step={0.01}
                    value={p.cantidadKg}
                    onChange={e => {
                      const n = [...partes];
                      n[i] = { cantidadKg: e.target.value ? Number(e.target.value) : '' };
                      setPartes(n);
                    }}
                    className={cls}
                    placeholder="0.000 kg"
                  />
                  <span className="text-xs text-gray-400 shrink-0">kg</span>
                </div>
              </div>
              {partes.length > 2 && (
                <button
                  onClick={() => setPartes(partes.filter((_, j) => j !== i))}
                  className="mb-0.5 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => setPartes([...partes, { cantidadKg: '' }])}
            className="text-xs font-medium text-purple-700 hover:text-purple-900">
            + Agregar parte
          </button>

          <div className={`rounded-xl px-4 py-3 border ${suma > disponible + 0.001 ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-100'}`}>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Suma partes:</span>
              <strong className={suma > disponible + 0.001 ? 'text-red-600' : 'text-gray-800'}>{suma.toFixed(2)} kg</strong>
            </div>
            <div className="flex justify-between text-sm mt-0.5">
              <span className="text-gray-500">Restante sin asignar:</span>
              <span className={`font-semibold ${restante < -0.001 ? 'text-red-600' : restante > 0.001 ? 'text-amber-600' : 'text-green-600'}`}>
                {restante.toFixed(2)} kg
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ backgroundColor: '#7c3aed' }}>
              Confirmar división ({partes.length} partes)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MezclarModal({ lote, onClose, onConfirm }: {
  lote: Lote;
  onClose: () => void;
  onConfirm: (origenes: Array<{ loteId: number; cantidadKg: number }>, codigoLf: string) => Promise<void>;
}) {
  
  const [elegibles, setElegibles]   = useState<Lote[]>([]);
  const [loadingLotes, setLoadingLotes] = useState(true);

  
  const [seleccion, setSeleccion] = useState<Record<number, number | ''>>({});
  
  const [kgActual, setKgActual]   = useState<number | ''>(Number(lote.cantidadKg));

  const [busqueda, setBusqueda] = useState('');
  const [saving,   setSaving]   = useState(false);
  const toast = useToast();

  useEffect(() => {
    setLoadingLotes(true);
    lotesService.getPage({
      tipoProductoId: lote.tipoProductoId,
      limit: 100,
    }).then(res => {
      setElegibles(res.data.filter(l => l.id !== lote.id));
    }).finally(() => setLoadingLotes(false));
  }, [lote.id, lote.tipoProductoId]);

  const elegiblesFiltrados = busqueda.trim()
    ? elegibles.filter(l =>
        l.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
        (l.productor && `${l.productor.nombre} ${l.productor.apellido ?? ''}`.toLowerCase().includes(busqueda.toLowerCase()))
      )
    : elegibles;

  const lotesSeleccionados = Object.entries(seleccion).filter(([, kg]) => kg !== '' && Number(kg) > 0);
  const totalKg = Number(kgActual || 0) + lotesSeleccionados.reduce((a, [, kg]) => a + Number(kg), 0);

  function toggleLote(id: number, disponibleKg: number) {
    setSeleccion(prev => {
      if (id in prev) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: disponibleKg };
    });
  }

  async function handleSubmit() {
    if (!kgActual || Number(kgActual) <= 0) { toast.error('Indica cuántos kg aporta este lote'); return; }
    if (lotesSeleccionados.length === 0) { toast.error('Selecciona al menos un lote adicional para mezclar'); return; }
    setSaving(true);
    try {
      const origenes = [
        { loteId: lote.id, cantidadKg: Number(kgActual) },
        ...lotesSeleccionados.map(([id, kg]) => ({ loteId: Number(id), cantidadKg: Number(kg) })),
      ];
      await onConfirm(origenes, '');
      onClose();
    } catch (err) { toast.error(apiMsg(err)); }
    finally { setSaving(false); }
  }

  const cls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-xl max-h-[94dvh] flex flex-col relative">

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-bold text-gray-800">Mezclar lotes → Lote Final</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Solo se pueden mezclar lotes del mismo producto
            </p>
            {lote.tipoProducto && (
              <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold"
                style={{ backgroundColor: '#EEF3EC', borderColor: '#C8DCC8', color: '#1A2B23' }}>
                <span>{lote.tipoProducto.tipo}</span>
                <span className="text-gray-400">·</span>
                <span className="capitalize">{displaySubtipo(lote.estado, lote.tipoProducto)}</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {saving && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lote actual (incluido)</p>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3 border border-gray-200 bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-800">{lote.codigo}</p>
                  {lote.tipoProducto && (
                    <span className="text-[0.6rem] font-semibold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-500 capitalize">
                      {lote.tipoProducto.tipo} · {displaySubtipo(lote.estado, lote.tipoProducto)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Disponible: <strong>{Number(lote.cantidadKg).toFixed(2)} kg</strong>
                  {lote.productor && ` · ${lote.productor.nombre} ${lote.productor.apellido ?? ''}`}
                </p>
              </div>
              <div className="w-28 shrink-0">
                <label className="block text-[0.6rem] font-semibold text-gray-500 uppercase mb-1">Kg a aportar</label>
                <input
                  type="number" min={0.01} step={0.01}
                  max={Number(lote.cantidadKg)}
                  value={kgActual}
                  onChange={e => setKgActual(e.target.value ? Number(e.target.value) : '')}
                  className="w-full border border-cyan-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Lotes disponibles para mezclar
                {!loadingLotes && (
                  <span className="ml-1.5 font-normal normal-case text-gray-400">
                    ({elegibles.length} elegible{elegibles.length !== 1 ? 's' : ''})
                  </span>
                )}
              </p>
              <span className="text-[0.6rem] text-cyan-700 bg-cyan-50 border border-cyan-200 px-2 py-0.5 rounded-full font-semibold">
                {lotesSeleccionados.length} seleccionado{lotesSeleccionados.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="relative mb-2">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>
              <input
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar por código o productor…"
                className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {loadingLotes ? (
              <div className="flex items-center justify-center py-8 text-gray-400 text-sm">Cargando lotes…</div>
            ) : elegibles.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm font-medium">Sin lotes disponibles para mezclar</p>
                <p className="text-xs mt-1">
                Se necesitan lotes con el mismo producto:{' '}
                <strong>{lote.tipoProducto?.tipo} · {displaySubtipo(lote.estado, lote.tipoProducto)}</strong>
              </p>
              </div>
            ) : elegiblesFiltrados.length === 0 ? (
              <p className="text-center py-4 text-sm text-gray-400">Sin resultados para "{busqueda}"</p>
            ) : (
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {elegiblesFiltrados.map(l => {
                  const checked = l.id in seleccion;
                  return (
                    <div key={l.id}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border transition-colors cursor-pointer ${
                        checked
                          ? 'bg-cyan-50 border-cyan-300'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleLote(l.id, Number(l.cantidadKg))}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                        checked ? 'bg-cyan-600 border-cyan-600' : 'border-gray-300'
                      }`}>
                        {checked && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="text-sm font-semibold text-gray-800 truncate">{l.codigo}</p>
                          {l.tipoProducto && (
                            <span className="text-[0.55rem] font-semibold px-1.5 py-0.5 rounded-full bg-white border border-gray-200 text-gray-400 capitalize shrink-0">
                              {l.tipoProducto.tipo} · {displaySubtipo(l.estado, l.tipoProducto)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          <strong>{Number(l.cantidadKg).toFixed(2)} kg</strong> disponibles
                          {l.productor && ` · ${l.productor.nombre} ${l.productor.apellido ?? ''}`}
                          {l.campana && ` · ${l.campana.nombre}`}
                        </p>
                      </div>
                      {checked && (
                        <div className="w-28 shrink-0" onClick={e => e.stopPropagation()}>
                          <label className="block text-[0.6rem] font-semibold text-gray-500 uppercase mb-0.5">Kg a aportar</label>
                          <input
                            type="number" min={0.01} step={0.01}
                            max={Number(l.cantidadKg)}
                            value={seleccion[l.id] ?? ''}
                            onChange={e => setSeleccion(prev => ({
                              ...prev,
                              [l.id]: e.target.value ? Number(e.target.value) : '',
                            }))}
                            className="w-full border border-cyan-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-green-700 font-semibold uppercase tracking-wide">Lote Final resultante</p>
              <p className="text-xl font-black text-green-800 mt-0.5">{totalKg.toFixed(2)} kg</p>
            </div>
            <p className="text-xs text-green-600">
              {1 + lotesSeleccionados.length} lote{1 + lotesSeleccionados.length !== 1 ? 's' : ''} mezclado{1 + lotesSeleccionados.length !== 1 ? 's' : ''}
            </p>
          </div>

          <p className="text-[0.65rem] text-gray-400 text-center">
            El código del Lote Final se genera automáticamente (LF-YYYY-NNNN)
          </p>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || lotesSeleccionados.length === 0}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
            style={{ backgroundColor: '#0891b2' }}
          >
            Crear Lote Final ({totalKg.toFixed(1)} kg)
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoteDetallePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lote, setLote] = useState<Lote | null>(null);
  const [origenes, setOrigenes] = useState<LoteFinalOrigen[]>([]);
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [muestras, setMuestras] = useState<Muestra[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'promover' | 'dividir' | 'mezclar' | null>(null);
  const [accionando, setAccionando] = useState(false);
  const toast = useToast();

  useEffect(() => {
    tiposProductoService.getAll().then(setTiposProducto);
    if (!id) return;
    Promise.all([
      lotesService.getOne(Number(id)),
      lotesService.getLotesFinalOrigen(Number(id)),
      muestrasService.getPage({ loteId: Number(id), limit: 50 }),
    ]).then(([l, o, m]) => { setLote(l); setOrigenes(o); setMuestras(m.data); setLoading(false); });
  }, [id]);

  async function handlePromover(): Promise<string> {
    if (!lote) throw new Error('Sin lote');
    setAccionando(true);
    try {
      const lf = await lotesService.promoverALf(lote.id, {});
      const [l, o] = await Promise.all([lotesService.getOne(lote.id), lotesService.getLotesFinalOrigen(lote.id)]);
      setLote(l); setOrigenes(o);
      return lf.codigo;
    } finally {
      setAccionando(false);
    }
  }

  async function handleDividir(divisiones: Array<{ codigoLf: string; cantidadKg: number }>) {
    if (!lote) return;
    try {
      const lfs = await lotesService.dividir({ loteId: lote.id, divisiones });
      toast.success(`División exitosa: ${lfs.map(f => f.codigo).join(', ')}`);
      const [l, o] = await Promise.all([lotesService.getOne(lote.id), lotesService.getLotesFinalOrigen(lote.id)]);
      setLote(l); setOrigenes(o);
    } catch (err) { throw new Error(apiMsg(err)); }
  }

  async function handleMezclar(origenesInput: Array<{ loteId: number; cantidadKg: number }>, codigoLf: string) {
    const lf = await lotesService.mezclar({ origenes: origenesInput, codigoLf });
    toast.success(`Lote Final ${lf.codigo} creado por mezcla`);
    if (lote) {
      const [l, o] = await Promise.all([lotesService.getOne(lote.id), lotesService.getLotesFinalOrigen(lote.id)]);
      setLote(l); setOrigenes(o);
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-full"><LoadingLogo /></div>;
  if (!lote) return <div className="p-8 text-gray-500">Lote no encontrado</div>;

  return (
    <div className="min-h-full bg-white p-4 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/dashboard/lotes')} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div className="flex-1">
          <h1 className="font-headline text-2xl font-black uppercase tracking-wide text-gray-800">{lote.codigo}</h1>
          <p className="text-xs text-gray-400">Detalle del lote y trazabilidad</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${ESTADO_COLOR[lote.estado]}`}>{ESTADO_LABEL[lote.estado]}</span>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-50 rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            {[
              ['Tipo Producto', lote.tipoProducto ? `${lote.tipoProducto.tipo} (${displaySubtipo(lote.estado, lote.tipoProducto)})` : `#${lote.tipoProductoId}`],
              ['Cantidad actual', `${Number(lote.cantidadKg).toFixed(2)} kg`],
              ['Sacos (ref.)', lote.cantidadSacos != null ? String(lote.cantidadSacos) : '—'],
              ['Productor', lote.productor ? `${lote.productor.nombre} ${lote.productor.apellido ?? ''}`.trim() : `#${lote.productorId}`],
              ['Parcela', lote.parcela?.nombre ?? '—'],
              ['Campaña', lote.campana?.nombre ?? '—'],
              ['Fecha adquisición', lote.fechaAdquisicion ?? '—'],
              ['Lote padre', lote.lotePadreId ? `#${lote.lotePadreId}` : '—'],
            ].map(([k, v]) => (
              <div key={k}><span className="text-xs text-gray-400">{k}</span><p className="font-semibold text-gray-800 mt-0.5">{String(v)}</p></div>
            ))}
          </div>
          {lote.observaciones && <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-400 mb-1">Observaciones</p><p className="text-sm text-gray-700">{lote.observaciones}</p></div>}

          {muestras.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Muestra{muestras.length > 1 ? 's' : ''} asociada{muestras.length > 1 ? 's' : ''}
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-4 py-2.5 text-left text-gray-500 font-semibold">Código</th>
                      <th className="px-4 py-2.5 text-right text-gray-500 font-semibold">Rendimiento</th>
                      <th className="px-4 py-2.5 text-right text-gray-500 font-semibold">Humedad</th>
                      <th className="px-4 py-2.5 text-left text-gray-500 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {muestras.map(m => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 font-semibold text-gray-800">{m.codigo}</td>
                        <td className="px-4 py-2.5 text-right tabular-nums font-medium text-gray-700">
                          {m.rendimiento != null ? `${Number(m.rendimiento).toFixed(2)}%` : '—'}
                        </td>
                        <td className="px-4 py-2.5 text-right tabular-nums text-gray-600">
                          {m.humedad != null ? `${Number(m.humedad).toFixed(1)}%` : '—'}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`inline-flex items-center gap-1 font-medium capitalize ${
                            m.estado === 'completada' ? 'text-green-600' :
                            m.estado === 'en_proceso' ? 'text-yellow-600' : 'text-gray-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              m.estado === 'completada' ? 'bg-green-500' :
                              m.estado === 'en_proceso' ? 'bg-yellow-500' : 'bg-gray-300'
                            }`}/>
                            {m.estado.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {origenes.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Lotes Finales originados por este lote</p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-xs">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-2.5 text-left text-gray-500 font-semibold">Código LF</th>
                    <th className="px-4 py-2.5 text-right text-gray-500 font-semibold">Kg aportados</th>
                    <th className="px-4 py-2.5 text-left text-gray-500 font-semibold">Fecha</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {origenes.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/dashboard/lotes-finales?highlight=${o.loteFinalId}`)}>
                        <td className="px-4 py-2 font-semibold text-blue-600">{(o as any).loteFinal?.codigo ?? `LF #${o.loteFinalId}`}</td>
                        <td className="px-4 py-2 text-right tabular-nums font-medium">{Number(o.cantidadAportadaKg).toFixed(2)} kg</td>
                        <td className="px-4 py-2 text-gray-500">{(o as any).loteFinal?.fechaCreacion ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Transformaciones (R1)</p>

          {lote.estado === 'PRE_ADQUISICION' ? (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-orange-200 bg-orange-50">
              <svg className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
              <div>
                <p className="text-sm font-bold text-orange-700">Transformaciones bloqueadas</p>
                <p className="text-xs text-orange-600 mt-0.5">El lote está en estado <strong>PRE ADQUISICIÓN</strong>. Adquiérelo primero para habilitar las transformaciones.</p>
              </div>
            </div>
          ) : Number(lote.cantidadKg) <= 0 ? (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50">
              <svg className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>
              <div>
                <p className="text-sm font-bold text-gray-600">Sin cantidad disponible</p>
                <p className="text-xs text-gray-500 mt-0.5">Este lote ya fue transformado completamente. No quedan kg para operar.</p>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => setModal('promover')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#2d5a3d' }}>
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <div className="text-left"><p>Pasar directo a LF</p><p className="text-xs font-normal opacity-75">Camino 1 — sin transformación</p></div>
              </button>
              <button onClick={() => setModal('dividir')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#7c3aed' }}>
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4M4 17h12m0 0l-4-4m4 4l-4-4"/></svg>
                <div className="text-left"><p>Dividir en LF</p><p className="text-xs font-normal opacity-75">Camino 2 — crea múltiples LF</p></div>
              </button>
              <button onClick={() => setModal('mezclar')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-opacity" style={{ backgroundColor: '#0891b2' }}>
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7"/></svg>
                <div className="text-left"><p>Mezclar con otros lotes</p><p className="text-xs font-normal opacity-75">Camino 3 — cantidades parciales</p></div>
              </button>
            </>
          )}

          <div className="pt-2 border-t border-gray-100">
            <button onClick={() => navigate('/dashboard/lotes-finales')} className="w-full text-xs font-medium text-blue-600 hover:text-blue-800 py-2">
              Ver Lotes Finales →
            </button>
          </div>
        </div>
      </div>

      {modal === 'promover' && <PromoverModal lote={lote} onClose={() => setModal(null)} onConfirm={handlePromover} />}
      {modal === 'dividir' && <DividirModal lote={lote} onClose={() => setModal(null)} onConfirm={handleDividir} />}
      {modal === 'mezclar' && <MezclarModal lote={lote} onClose={() => setModal(null)} onConfirm={handleMezclar} />}
    </div>
  );
}
