import { useState, useEffect, useRef } from 'react';
import { X, Send, FileText, Calendar, ChevronDown, Search, Loader2 } from 'lucide-react';
import LoadingLogo from './LoadingLogo';
import { ModalLoadingOverlay } from '@/components/ui/ModalLoadingOverlay';
import { useToast } from '@/contexts/ToastContext';
import { ordenesVentaService } from '../services/ordenes-venta.service';
import { clientesService, Cliente } from '@/services/clientes.service';
import { campanasService } from '@/services/campanas.service';
import { muestrasService } from '@/services/muestras.service';
import { productoresService } from '@/services/productores.service';

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP      = 'w-full border rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle = { borderColor: BD, color: TX };

const INCOTERMS   = ['FOB','CIF','EXW','FCA','CPT','DAP','DDP'];
const PUERTOS     = ['Callao, Perú','Rotterdam, Países Bajos','Hamburg, Alemania','New York, EE.UU.','Amberes, Bélgica'];
const CONDICIONES = ['30 días','60 días','90 días','Contra entrega','Carta de crédito'];

const fieldLabel = (label: string) => (
  <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>{label}</label>
);

type Tab = 'muestras' | 'cotizacion';

interface Props {
  orden: { dbId: number; id: string; cliente: string; lote: string; tipoProducto: string; campana: string };
  initialTab?: Tab;
  onClose: () => void;
}

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'muestras',   label: 'Envío de Muestras',  icon: <Send size={12} /> },
  { key: 'cotizacion', label: 'Envío de Cotización', icon: <FileText size={12} /> },
];

interface MuestraRow {
  id:          number;
  codigo:      string;
  lote:        string;
  campana:     string;
  productor:   string;
  tipoMuestra: string;
  variedad:    string;
  fecha:       string;
  fechaEnvio:  string;
  cantidad:    string;
  costos:      string;
  comentario:  string;
}

export function PreventaModal({ orden, initialTab = 'muestras', onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const toast = useToast();

  const [fechaEnvio,     setFechaEnvio]     = useState('');
  const [fechaRecepcion, setFechaRecepcion] = useState('');
  const [rucDni,         setRucDni]         = useState('');
  const [clienteNombre,  setClienteNombre]  = useState(orden.cliente ?? '');
  const [courier,        setCourier]        = useState('');
  const [costoCourier,   setCostoCourier]   = useState('');
  const [fitosanitario,    setFitosanitario]    = useState<'si' | 'no' | ''>('');
  const [busqueda,         setBusqueda]         = useState('');
  const [filterProductor,  setFilterProductor]  = useState('');
  const [muestras,         setMuestras]         = useState<MuestraRow[]>([]);
  const [historialMuestras,setHistorialMuestras]= useState<MuestraRow[]>([]);
  const [buscando,         setBuscando]         = useState(false);
  const [clientes,         setClientes]         = useState<Cliente[]>([]);
  const [productores,      setProductores]      = useState<{ id: number; nombre: string }[]>([]);
  const [campanaIdCargado, setCampanaIdCargado] = useState<number | null>(null);
  const detallesRef    = useRef<any[]>([]);
  const productoresRef = useRef<{ id: number; nombre: string }[]>([]);
  const debounceRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [nroCotizacion, setNroCotizacion] = useState('');
  const [fechaCotiz,    setFechaCotiz]    = useState('');
  const [precioUsd,     setPrecioUsd]     = useState('');
  const [moneda,        setMoneda]        = useState<'USD' | 'PEN'>('USD');
  const [pesoKg,        setPesoKg]        = useState('');
  const [incoterm,      setIncoterm]      = useState('');
  const [puerto,        setPuerto]        = useState('');
  const [condPago,      setCondPago]      = useState('');
  const [validez,       setValidez]       = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [mercado,       setMercado]       = useState<'NACIONAL' | 'INTERNACIONAL'>('NACIONAL');

  useEffect(() => {
    clientesService.getPage(1, 200).then(r => setClientes(r.data)).catch(() => {});
  }, []);

  // Sincroniza RUC cuando cargan los clientes o cambia el nombre seleccionado
  useEffect(() => {
    if (!clientes.length || !clienteNombre) return;
    const c = clientes.find(c => c.nombre === clienteNombre);
    if (c?.nroDocumento) setRucDni(c.nroDocumento);
  }, [clientes, clienteNombre]);

  function handleClienteChange(nombre: string) {
    setClienteNombre(nombre);
    const c = clientes.find(c => c.nombre === nombre);
    setRucDni(c?.nroDocumento ?? '');
  }

  function mapMuestrasData(raw: any[], fechaEnvioOverride?: string): MuestraRow[] {
    return raw.map((m: any) => {
      const det = detallesRef.current.find((d: any) => d.muestraId === m.id);
      return {
        id:          m.id,
        codigo:      m.codigo ?? '',
        lote:        m.loteFinal?.codigo ?? m.lote?.codigo ?? '',
        campana:     m.campana?.nombre ?? '',
        productor:   m.productor
          ? `${m.productor.nombre}${m.productor.apellido ? ' ' + m.productor.apellido : ''}`.trim()
          : '',
        tipoMuestra: m.tipoMuestra ?? '',
        variedad:    m.variedad ?? '',
        fecha:       m.fecha ?? '',
        fechaEnvio:  fechaEnvioOverride ?? '',
        cantidad:    det?.cantidad   != null ? String(det.cantidad)   : '',
        costos:      det?.costos     != null ? String(det.costos)     : '',
        comentario:  det?.comentario != null ? String(det.comentario) : '',
      };
    });
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([
      ordenesVentaService.getPreventa(orden.dbId),
      ordenesVentaService.getCotizacion(orden.dbId),
      campanasService.getPage(1, 200),
    ]).then(async ([pv, cot, campanasData]) => {
      if (cot) {
        if (cot.nroCotizacion)        setNroCotizacion(cot.nroCotizacion);
        if (cot.fechaCotizacion)      setFechaCotiz(cot.fechaCotizacion);
        if (cot.precioUsd   != null)  setPrecioUsd(String(cot.precioUsd));
        if (cot.moneda)               setMoneda(cot.moneda as 'USD' | 'PEN');
        if (cot.pesoKg      != null)  setPesoKg(String(cot.pesoKg));
        if (cot.incoterm)             setIncoterm(cot.incoterm);
        if (cot.puerto)               setPuerto(cot.puerto);
        if (cot.condicionesPago)      setCondPago(cot.condicionesPago);
        if (cot.validezDias != null)  setValidez(String(cot.validezDias));
        if (cot.observaciones)        setObservaciones(cot.observaciones);
      }

      detallesRef.current = pv.preventa?.muestrasDetalle ?? [];

      const campanaObj = campanasData.data.find(c => c.nombre === orden.campana);
      if (campanaObj) {
        setCampanaIdCargado(campanaObj.id);

        // Cargar productores para el dropdown
        productoresService.getPage(1, 500, campanaObj.id)
          .then(r => {
            const list = r.data.map((p: any) => ({
              id:     p.id,
              nombre: `${p.nombre}${p.apellido ? ' ' + p.apellido : ''}`.trim(),
            }));
            setProductores(list);
            productoresRef.current = list;
          })
          .catch(() => {});

        // Si hay envíos guardados, cargarlos para el historial automáticamente
        if (detallesRef.current.length > 0) {
          const fechaEnvioGuardada = pv.preventa?.fechaEnvio ?? '';
          muestrasService.getPage({ campanaId: campanaObj.id, limit: 500 })
            .then(res => {
              const rows = mapMuestrasData(res.data, fechaEnvioGuardada)
                .filter(m => m.cantidad || m.costos || m.comentario);
              setHistorialMuestras(rows);
            })
            .catch(() => {});
        }

      }
    }).finally(() => setLoading(false));
  }, [orden.dbId, orden.campana]);

  // Debounce 5s: buscar en DB solo cuando hay algo en los filtros
  useEffect(() => {
    if (!campanaIdCargado) return;
    if (!busqueda && !filterProductor) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const prodId = productoresRef.current.find(p => p.nombre === filterProductor)?.id;
        const result = await muestrasService.getPage({
          campanaId:   campanaIdCargado,
          search:      busqueda || undefined,
          productorId: prodId,
          limit:       100,
        });
        setMuestras(mapMuestrasData(result.data));
      } catch { /* silencioso */ }
      finally { setBuscando(false); }
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [busqueda, filterProductor, campanaIdCargado]);

  const updateMuestra = (id: number, field: 'cantidad' | 'costos' | 'comentario', value: string) =>
    setMuestras(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));

  const filtradas = muestras;

  // Historial: unión de los guardados al abrir + los modificados en la búsqueda actual
  const historialBusqueda = muestras.filter(m => m.cantidad || m.costos || m.comentario);
  const historialIds = new Set(historialBusqueda.map(m => m.id));
  const historial = [
    ...historialBusqueda,
    ...historialMuestras.filter(m => !historialIds.has(m.id)),
  ];

  const total = precioUsd && pesoKg ? parseFloat(precioUsd) * parseFloat(pesoKg) : 0;
  const monedaSymbol = moneda === 'PEN' ? 'S/.' : 'USD';

  async function handleGuardar() {
    setSaving(true);
    try {
      if (activeTab === 'muestras') {
        await ordenesVentaService.upsertPreventa(orden.dbId, {
          fechaEnvio:     fechaEnvio     || undefined,
          fechaRecepcion: fechaRecepcion || undefined,
          rucDni:         rucDni         || undefined,
          clienteNombre:  clienteNombre  || undefined,
          courier:        courier        || undefined,
          costoCourier:   costoCourier   ? Number(costoCourier) : undefined,
          fitosanitario:  fitosanitario  || undefined,
          muestrasDetalle: (() => {
            const nuevos = muestras
              .filter(m => m.cantidad || m.costos || m.comentario)
              .map(m => ({
                muestraId:  m.id,
                cantidad:   m.cantidad  ? Number(m.cantidad) : null,
                costos:     m.costos    ? Number(m.costos)   : null,
                comentario: m.comentario || null,
              }));
            // merge with existing saved detalles not in current results
            const visiblesIds = new Set(muestras.map(m => m.id));
            const previos = detallesRef.current.filter((d: any) => !visiblesIds.has(d.muestraId));
            detallesRef.current = [...previos, ...nuevos];
            return detallesRef.current;
          })(),
        });
        // Actualizar historial con los guardados en esta sesión (con la fecha de envío actual)
        const guardados = muestras
          .filter(m => m.cantidad || m.costos || m.comentario)
          .map(m => ({ ...m, fechaEnvio: fechaEnvio || m.fechaEnvio }));
        setHistorialMuestras(prev => {
          const ids = new Set(guardados.map(m => m.id));
          return [...guardados, ...prev.filter(m => !ids.has(m.id))];
        });
        // Limpiar campos del formulario
        setFechaEnvio('');
        setFechaRecepcion('');
        setRucDni('');
        setClienteNombre('');
        setCourier('');
        setCostoCourier('');
        setFitosanitario('');
        setMuestras([]);
        setBusqueda('');
        setFilterProductor('');
      } else {
        await ordenesVentaService.upsertCotizacion(orden.dbId, {
          fechaCotizacion: fechaCotiz    || undefined,
          precioUsd:      precioUsd      ? Number(precioUsd) : undefined,
          moneda,
          pesoKg:         pesoKg         ? Number(pesoKg)    : undefined,
          incoterm:       incoterm       || undefined,
          puerto:         puerto         || undefined,
          condicionesPago: condPago      || undefined,
          validezDias:    validez        ? Number(validez)   : undefined,
          observaciones:  observaciones  || undefined,
          mercado:        mercado,
        });
      }
      toast.success(activeTab === 'muestras' ? 'Envío guardado correctamente' : 'Cotización actualizada');
    } catch {
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ backgroundColor: 'rgba(0,0,0,0.38)', backdropFilter: 'blur(12px) saturate(0.75)' }}
      onClick={e => !saving && e.target === e.currentTarget && onClose()}
    >
      <div
        className="relative w-full sm:max-w-5xl rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(28px) saturate(1.4)', WebkitBackdropFilter: 'blur(28px) saturate(1.4)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 24px 60px rgba(0,0,0,0.22)', maxHeight: '92vh' }}
      >
        <ModalLoadingOverlay show={saving} message="Guardando…" />

        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: CP }}>
              <Send size={15} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-black text-sm uppercase tracking-wide" style={{ color: TX }}>Preventa</p>
              <p className="text-[0.62rem] text-gray-400 truncate">{orden.id} · {orden.cliente} · {orden.lote}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleGuardar}
              disabled={saving || loading}
              className="text-[0.65rem] font-bold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: CP }}
            >
              GUARDAR
            </button>
            <button onClick={onClose} disabled={saving} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-black/06 transition-all ml-1"><X size={16} /></button>
          </div>
        </div>

        <div className="flex gap-1 px-5 pt-4 shrink-0 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-t-xl text-xs font-bold uppercase tracking-wide transition-all"
              style={{
                backgroundColor: activeTab === t.key ? CP : 'transparent',
                color:           activeTab === t.key ? '#fff' : '#9CA3AF',
                borderBottom:    activeTab === t.key ? `2px solid ${CP}` : '2px solid transparent',
                marginBottom:    '-1px',
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-20"><LoadingLogo compact /></div>
          ) : activeTab === 'muestras' ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {fieldLabel('Fecha de envío')}
                  <div className="relative">
                    <input type="date" value={fechaEnvio} onChange={e => setFechaEnvio(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Fecha de recepción')}
                  <div className="relative">
                    <input type="date" value={fechaRecepcion} onChange={e => setFechaRecepcion(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('RUC / DNI')}
                  <input type="text" value={rucDni} onChange={e => setRucDni(e.target.value)} className={INP} style={inpStyle} placeholder="20xxxxxxxxx" />
                </div>
                <div>
                  {fieldLabel('Razón social / Cliente')}
                  <div className="relative">
                    <select value={clienteNombre} onChange={e => handleClienteChange(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                      <option value="">Seleccionar cliente…</option>
                      {clientes.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Nombre del courier')}
                  <input type="text" value={courier} onChange={e => setCourier(e.target.value)} className={INP} style={inpStyle} placeholder="DHL, FedEx, Olva…" />
                </div>
                <div>
                  {fieldLabel('Costo del courier')}
                  <input type="number" min={0} value={costoCourier} onChange={e => setCostoCourier(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
                </div>
              </div>

              <div>
                <p className="text-[0.65rem] font-bold uppercase tracking-wide mb-2" style={{ color: TX }}>Fitosanitario:</p>
                <div className="flex items-center gap-4">
                  {(['si','no'] as const).map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={fitosanitario === v} onChange={() => setFitosanitario(fitosanitario === v ? '' : v)} className="w-4 h-4 rounded-sm" style={{ accentColor: CP }} />
                      <span className="text-sm font-semibold" style={{ color: TX }}>{v.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <select value={filterProductor} onChange={e => setFilterProductor(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                    <option value="">Todos los productores</option>
                    {productores.map(p => <option key={p.id} value={p.nombre}>{p.nombre}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative flex-1">
                  <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar muestra…" className={INP} style={inpStyle} />
                  <Search size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {buscando ? (
                <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
                  <Loader2 size={15} className="animate-spin" style={{ color: CP }} />
                  <span className="text-xs">Buscando muestras…</span>
                </div>
              ) : muestras.length === 0 ? (
                <p className="text-center text-xs text-gray-400 py-6">
                  {(busqueda || filterProductor) ? 'Sin resultados para los filtros aplicados' : 'Usa los filtros de arriba para buscar muestras (búsqueda automática en 5 seg)'}
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border" style={{ borderColor: BD }}>
                  <table className="w-full text-xs border-collapse min-w-[700px]">
                    <thead>
                      <tr style={{ backgroundColor: BG }}>
                        {['CÓDIGO','CAMPAÑA','PRODUCTOR','VARIEDAD','CANTIDAD (kg)','COMENTARIO'].map(h => (
                          <th key={h} className="text-[0.6rem] font-black uppercase tracking-wide text-center py-2.5 px-3" style={{ color: CP, borderBottom: `2px solid ${BD}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtradas.map((m, i) => (
                        <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : BG }}>
                          <td className="py-2 px-3 text-center font-mono font-semibold" style={{ color: CP }}>{m.codigo}</td>
                          <td className="py-2 px-3 text-center text-gray-500">{m.campana}</td>
                          <td className="py-2 px-3 text-center" style={{ color: TX }}>{m.productor}</td>
                          <td className="py-2 px-3 text-center text-gray-500">{m.variedad || '—'}</td>
                          <td className="py-2 px-3 text-center">
                            <input type="number" value={m.cantidad} onChange={e => updateMuestra(m.id,'cantidad',e.target.value)} className="w-20 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="0 kg" />
                          </td>
                          <td className="py-2 px-3">
                            <input type="text" value={m.comentario} onChange={e => updateMuestra(m.id,'comentario',e.target.value)} className="w-full border rounded-full px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-green-500" style={{ borderColor: BD }} placeholder="Comentario del cliente…" />
                          </td>
                        </tr>
                      ))}
                      {filtradas.length === 0 && (
                        <tr><td colSpan={6} className="py-6 text-center text-xs text-gray-400">Sin resultados</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {historial.length > 0 && (
                <div>
                  <p className="text-[0.65rem] font-black uppercase tracking-wide mb-2" style={{ color: TX, opacity: 0.55 }}>Historial de envíos</p>
                  <div className="overflow-x-auto rounded-xl border" style={{ borderColor: BD }}>
                    <table className="w-full text-xs border-collapse min-w-[600px]">
                      <thead>
                        <tr style={{ backgroundColor: BG }}>
                          {['CÓDIGO','FECHA','PRODUCTOR','VARIEDAD','CANTIDAD (kg)','COMENTARIO CLIENTE'].map(h => (
                            <th key={h} className="text-[0.6rem] font-black uppercase tracking-wide text-center py-2.5 px-3" style={{ color: CP, borderBottom: `2px solid ${BD}` }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {historial.map((m, i) => (
                          <tr key={m.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : BG }}>
                            <td className="py-2 px-3 text-center font-mono font-semibold" style={{ color: CP }}>{m.codigo}</td>
                            <td className="py-2 px-3 text-center text-gray-500">{m.fechaEnvio || m.fecha || '—'}</td>
                            <td className="py-2 px-3 text-center" style={{ color: TX }}>{m.productor}</td>
                            <td className="py-2 px-3 text-center text-gray-500">{m.variedad || '—'}</td>
                            <td className="py-2 px-3 text-center font-semibold" style={{ color: CP }}>{m.cantidad} kg</td>
                            <td className="py-2 px-3 text-center text-gray-500">{m.comentario || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {fieldLabel('Fecha de cotización')}
                  <div className="relative">
                    <input type="date" value={fechaCotiz} onChange={e => setFechaCotiz(e.target.value)} className={INP} style={inpStyle} />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Total de venta')}
                  <div className="flex gap-2">
                    <div className="flex rounded-xl overflow-hidden border shrink-0" style={{ borderColor: BD }}>
                      {(['USD', 'PEN'] as const).map(m => (
                        <button key={m} type="button"
                          onClick={() => setMoneda(m)}
                          className="px-3 py-2 text-xs font-bold transition-colors"
                          style={{
                            backgroundColor: moneda === m ? CP : '#fff',
                            color: moneda === m ? '#fff' : '#6B7280',
                          }}>{m}</button>
                      ))}
                    </div>
                    <input type="number" min={0} step="0.01" value={precioUsd} onChange={e => setPrecioUsd(e.target.value)} className={INP} style={inpStyle} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Peso total (kg)')}
                  <input type="number" min={0} value={pesoKg} onChange={e => setPesoKg(e.target.value)} className={INP} style={inpStyle} placeholder="0" />
                </div>
                <div>
                  {fieldLabel('Incoterm')}
                  <div className="relative">
                    <select value={incoterm} onChange={e => setIncoterm(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                      <option value="">Seleccionar…</option>
                      {INCOTERMS.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Puerto de destino')}
                  <div className="relative">
                    <select value={puerto} onChange={e => setPuerto(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                      <option value="">Seleccionar…</option>
                      {PUERTOS.map(p => <option key={p}>{p}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Condiciones de pago')}
                  <div className="relative">
                    <select value={condPago} onChange={e => setCondPago(e.target.value)} className={`${INP} pr-9 appearance-none`} style={inpStyle}>
                      <option value="">Seleccionar…</option>
                      {CONDICIONES.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  {fieldLabel('Mes de exportación (est.)')}
                  <input type="month" value={validez} onChange={e => setValidez(e.target.value)} className={INP} style={inpStyle} />
                </div>
              </div>

              {total > 0 && (
                <div className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ backgroundColor: `${CP}12` }}>
                  <p className="text-[0.65rem] font-bold uppercase tracking-wide" style={{ color: CP }}>Total estimado:</p>
                  <p className="font-black text-base" style={{ color: CP }}>{monedaSymbol} {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                </div>
              )}

              <div>
                {fieldLabel('Mercado')}
                <div className="flex gap-2 mt-1">
                  {(['NACIONAL', 'INTERNACIONAL'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMercado(m)}
                      className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: mercado === m ? CP : '#EFF2EF',
                        color: mercado === m ? '#fff' : '#7A9A7C',
                      }}
                    >
                      {m === 'NACIONAL' ? 'Nacional' : 'Internacional'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {fieldLabel('Observaciones')}
                <textarea rows={3} value={observaciones} onChange={e => setObservaciones(e.target.value)} className={`${INP} resize-none`} style={inpStyle} placeholder="Condiciones especiales, notas al cliente…" />
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t shrink-0 flex justify-end" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={onClose} disabled={saving} className="text-[0.65rem] font-semibold px-3 py-1.5 rounded-lg text-gray-500 hover:bg-black/05 transition-all disabled:opacity-40">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
