import { useState, useEffect } from 'react';
import { Search, Trash2, Package } from 'lucide-react';
import { TopBar }      from '@/components/flow/TopBar';
import { StatusCards } from '@/components/flow/StatusCards';
import { useFlow }     from '@/contexts/FlowContext';

interface HsInfo {
  codigoHS: string;
  nombreProducto: string;
  fito: boolean;
  codigoFDA: string;
}

const HS_TABLE: Record<string, HsInfo> = {
  'PERGAMINO': { codigoHS: '0901.11.90.00', nombreProducto: 'Granos Café verde',  fito: true,  codigoFDA: '31AAB01' },
  'ORO VERDE': { codigoHS: '0901.11.90.00', nombreProducto: 'Granos Café verde',  fito: true,  codigoFDA: '31AAB01' },
  'ORO':       { codigoHS: '0901.11.90.00', nombreProducto: 'Granos Café verde',  fito: true,  codigoFDA: '31AAB01' },
  'CAFE':      { codigoHS: '0901.11.90.00', nombreProducto: 'Granos Café verde',  fito: true,  codigoFDA: '31AAB01' },
  'CACAO':     { codigoHS: '1801.00.19.00', nombreProducto: 'Cacao en grano',     fito: true,  codigoFDA: '34AAB99' },
  'CASTAÑA':   { codigoHS: '0801.22.00.00', nombreProducto: 'Castaña Amazónica',  fito: true,  codigoFDA: '23BFB02' },
  'NIBS':      { codigoHS: '1801.00.20.00', nombreProducto: 'Nibs de Cacao',      fito: false, codigoFDA: '34BGN04' },
  'PASTA':     { codigoHS: '1803.10.00.00', nombreProducto: 'Pasta de Cacao',     fito: false, codigoFDA: '34YFY99' },
  'MANTECA':   { codigoHS: '1804.00.13.00', nombreProducto: 'Manteca de cacao',   fito: false, codigoFDA: '34BFY03' },
  'POLVO':     { codigoHS: '1805.00.00.00', nombreProducto: 'Polvo de cacao',     fito: false, codigoFDA: '34BFY99' },
  'AJONJOLI':  { codigoHS: '1207.40.90.00', nombreProducto: 'Ajonjolí',           fito: true,  codigoFDA: '28AFB43' },
  'ACEITE':    { codigoHS: '1515.90.00.90', nombreProducto: 'Aceites vegetales',  fito: false, codigoFDA: '26YFY99' },
};

function getHsInfo(producto: string): HsInfo | null {
  const up = producto.toUpperCase();
  const key = Object.keys(HS_TABLE).find(k => up.includes(k));
  return key ? HS_TABLE[key] : null;
}

const CP = '#445D46';
const BD = '#D9DDD8';
const TX = '#2C2C2C';
const BG = '#F7F8F7';

const INP_SEARCH = 'w-full border rounded-xl px-3 py-2.5 pr-10 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-600 transition-all';
const inpStyle   = { borderColor: BD, color: TX };

interface LoteRow {
  id:        number;
  codigo:    string;
  nombre:    string;
  producto:  string;
  cantidad:  string;
  sacos:     string;
  productor: string;
  variedad:  string;
  sku:       string;
  fechas:    string;
}

const LOTES_INIT: LoteRow[] = [
  { id: 1, codigo: 'LF1', nombre: 'DIAMANTE',    producto: 'PERGAMINO', cantidad: '', sacos: '', productor: 'CAFFE SAC', variedad: '', sku: '', fechas: '' },
  { id: 2, codigo: 'LF2', nombre: 'ORO VERDE 3', producto: 'ORO',       cantidad: '', sacos: '', productor: 'JUAN',      variedad: '', sku: '', fechas: '' },
];

export function AlistadoAsignacionLotesPage() {
  const { setCurrentStep, saveAndNext, cancelToPrev } = useFlow();

  useEffect(() => { setCurrentStep('asignacion_lotes'); }, []);

  const [busqLotes,  setBusqLotes]  = useState('');
  const [busqMermas, setBusqMermas] = useState('');
  const [lotes,      setLotes]      = useState<LoteRow[]>(LOTES_INIT);

  const updateLote = (id: number, field: keyof LoteRow, val: string) =>
    setLotes(prev => prev.map(l => l.id === id ? { ...l, [field]: val } : l));

  const deleteLote = (id: number) => setLotes(prev => prev.filter(l => l.id !== id));

  const filtrados = lotes.filter(l => {
    const q = busqLotes.toLowerCase();
    return !q || [l.codigo, l.nombre, l.producto, l.productor].some(v => v.toLowerCase().includes(q));
  });

  return (
    <div className="min-h-full flex flex-col" style={{ backgroundColor: BG }}>
      <TopBar
        icon={<Package size={15} className="text-white" />}
        titulo="Alistado — Asignación de Lotes"
        subtitulo="Asignar lotes trillados y mermas reutilizables"
        onGuardar={() => saveAndNext('asignacion_lotes')}
        onCancelar={() => cancelToPrev('asignacion_lotes')}
      />

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div>
            <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>
              Asignación de lotes trillados
            </label>
            <div className="relative">
              <input
                value={busqLotes}
                onChange={e => setBusqLotes(e.target.value)}
                placeholder="Buscar lote trillado…"
                className={INP_SEARCH}
                style={inpStyle}
              />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          
          <div>
            <label className="block text-[0.65rem] font-bold uppercase tracking-wide mb-1.5" style={{ color: TX, opacity: 0.55 }}>
              Mermas reutilizables
            </label>
            <div className="relative">
              <input
                value={busqMermas}
                onChange={e => setBusqMermas(e.target.value)}
                placeholder="Buscar merma…"
                className={INP_SEARCH}
                style={inpStyle}
              />
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            <p className="text-[0.58rem] font-black uppercase tracking-wide text-amber-700 mt-1.5">
              REVISAR SI SE PUEDE AGREGAR LA PLANTA
            </p>
          </div>
        </div>

        
        <div className="overflow-x-auto rounded-xl border bg-white" style={{ borderColor: BD }}>
          <table className="w-full text-xs border-collapse min-w-[1200px]">
            <thead>
              <tr style={{ backgroundColor: BG }}>
                {['CÓDIGO','NOMBRE DEL LOTE','PRODUCTO','CANTIDAD','# SACOS','PRODUCTOR','VARIEDAD','SKU','COD. HS','NOMBRE PROD.','FITO','COD. FDA','FECHAS DE PROCESO','ACCIONES'].map(h => (
                  <th key={h} className="text-[0.6rem] font-black uppercase tracking-wide text-center py-2.5 px-3 whitespace-nowrap" style={{ color: CP, borderBottom: `2px solid ${BD}` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((l, i) => {
                const hs = getHsInfo(l.producto);
                return (
                  <tr key={l.id} style={{ backgroundColor: i % 2 === 0 ? '#fff' : BG }}>
                    <td className="py-2 px-3 text-center font-mono font-semibold" style={{ color: CP }}>{l.codigo}</td>
                    <td className="py-2 px-3 text-center font-semibold" style={{ color: TX }}>{l.nombre}</td>
                    <td className="py-2 px-3 text-center text-gray-500 whitespace-nowrap">{l.producto}</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number" min={0}
                        value={l.cantidad}
                        onChange={e => updateLote(l.id, 'cantidad', e.target.value)}
                        className="w-20 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500"
                        style={{ borderColor: BD }}
                        placeholder="0 kg"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="number" min={0}
                        value={l.sacos}
                        onChange={e => updateLote(l.id, 'sacos', e.target.value)}
                        className="w-16 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500"
                        style={{ borderColor: BD }}
                        placeholder="0"
                      />
                    </td>
                    <td className="py-2 px-3 text-center whitespace-nowrap" style={{ color: TX }}>{l.productor}</td>
                    <td className="py-2 px-3 text-center text-gray-500">{l.variedad || '—'}</td>
                    <td className="py-2 px-3 text-center">
                      {l.sku
                        ? <span className="px-2 py-0.5 rounded-full text-[0.58rem] font-bold bg-green-50 text-green-700">{l.sku}</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-[0.65rem] whitespace-nowrap" style={{ color: TX }}>{hs?.codigoHS ?? '—'}</td>
                    <td className="py-2 px-3 text-center text-[0.65rem] whitespace-nowrap" style={{ color: '#7A9A7C' }}>{hs?.nombreProducto ?? '—'}</td>
                    <td className="py-2 px-3 text-center">
                      {hs != null ? (
                        <span className={`px-2 py-0.5 rounded-full text-[0.6rem] font-bold ${hs.fito ? 'bg-red-50 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                          {hs.fito ? 'SI' : 'NO'}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-[0.65rem]" style={{ color: TX }}>{hs?.codigoFDA ?? '—'}</td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="text"
                        value={l.fechas}
                        onChange={e => updateLote(l.id, 'fechas', e.target.value)}
                        className="w-28 border rounded-full px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-green-500"
                        style={{ borderColor: BD }}
                        placeholder="dd/mm/aaaa"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <button
                        onClick={() => deleteLote(l.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center mx-auto transition-all hover:scale-105"
                        style={{ backgroundColor: '#fdecea', color: '#c62828' }}
                        title="Eliminar fila"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={14} className="py-8 text-center text-xs text-gray-400">
                    {busqLotes ? `Sin resultados para "${busqLotes}"` : 'Sin lotes asignados'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        
        <StatusCards steps={['compromiso_venta','asignacion_lotes','despacho']} currentStep="asignacion_lotes" />
      </div>
    </div>
  );
}
