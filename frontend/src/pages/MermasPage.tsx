import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  mermasService, Merma, TipoMerma,
  TIPO_MERMA_LABEL, TIPO_MERMA_BADGE,
} from '@/services/mermas.service';
import { TablePagination } from '@/components/TablePagination';
import LoadingLogo from '@/components/LoadingLogo';

function fmtFecha(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function MermasPage() {
  const navigate = useNavigate();
  const [mermas,   setMermas]   = useState<Merma[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [page,     setPage]     = useState(1);
  const [limit,    setLimit]    = useState(20);
  const [lastPage, setLastPage] = useState(1);
  const [total,    setTotal]    = useState(0);

  const [filtroTipo,  setFiltroTipo]  = useState<TipoMerma | ''>('');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await mermasService.getPage({
        page, limit,
        tipoMerma:  filtroTipo  || undefined,
        fechaDesde: filtroDesde || undefined,
        fechaHasta: filtroHasta || undefined,
      });
      setMermas(res.data);
      setLastPage(res.meta.lastPage);
      setTotal(res.meta.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filtroTipo, filtroDesde, filtroHasta]);

  useEffect(() => { load(); }, [load]);

  function resetPage() { setPage(1); }

  const cls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="p-4 md:p-6 space-y-4 relative">

      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(2px)' }}>
          <LoadingLogo />
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/lotes')}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          title="Volver a Lotes"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide" style={{ color: '#172216' }}>
            Mermas
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Registro de mermas generadas en el trillado · {total} registro{total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tipo de merma</label>
            <select value={filtroTipo} onChange={e => { setFiltroTipo(e.target.value as TipoMerma | ''); resetPage(); }} className={cls}>
              <option value="">Todos los tipos</option>
              <option value="REUTILIZABLE">Reutilizable (LR)</option>
              <option value="DESECHABLE">Desechable (LD)</option>
              <option value="EXPORTABLE">Exportable/Sobrante (LE)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Desde</label>
            <input type="date" value={filtroDesde} onChange={e => { setFiltroDesde(e.target.value); resetPage(); }} className={cls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Hasta</label>
            <input type="date" value={filtroHasta} onChange={e => { setFiltroHasta(e.target.value); resetPage(); }} className={cls} />
          </div>
        </div>
      </div>

      <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#172216' }} className="text-white">
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Código</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Lote Final</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Producto</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Productor</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Tipo Merma</th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wide">Cantidad Kg</th>
              <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wide">Sacos</th>
              <th className="px-4 py-3 text-left font-semibold text-xs uppercase tracking-wide">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mermas.length === 0 && !loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-sm font-medium">Sin mermas registradas</span>
                    <span className="text-xs text-gray-400">Las mermas se generan automáticamente al registrar un trillado</span>
                  </div>
                </td>
              </tr>
            ) : (
              mermas.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs font-bold" style={{ color: '#172216' }}>{m.codigo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-semibold text-gray-800">{m.loteFinal?.codigo ?? `LF-${m.loteFinalId}`}</p>
                    {m.loteOrigenCodigo && (
                      <p className="text-[0.65rem] text-gray-400 mt-0.5">Lote: {m.loteOrigenCodigo}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-gray-700">{m.loteFinal?.tipoProducto?.tipo ?? '—'}</p>
                    <p className="text-[0.65rem] text-gray-400 mt-0.5">
                      {m.loteFinal?.tipoProducto?.subtipoEntrada ?? ''}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">
                    {m.productorNombre
                      ? `${m.productorNombre} ${m.productorApellido ?? ''}`.trim()
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${TIPO_MERMA_BADGE[m.tipoMerma]}`}>
                      {TIPO_MERMA_LABEL[m.tipoMerma]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-semibold text-gray-800">
                    {Number(m.cantidadKg).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-500">
                    {m.cantidadSacos ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    {fmtFecha(m.fecha)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {lastPage > 1 && (
          <TablePagination
            page={page} lastPage={lastPage} total={total} limit={limit}
            onPageChange={setPage}
            onLimitChange={l => { setLimit(l); setPage(1); }}
          />
        )}
      </div>

      <div className="sm:hidden space-y-3">
        {mermas.length === 0 && !loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            <p className="text-sm font-medium">Sin mermas registradas</p>
          </div>
        ) : (
          mermas.map(m => (
            <div key={m.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs font-bold" style={{ color: '#172216' }}>{m.codigo}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TIPO_MERMA_BADGE[m.tipoMerma]}`}>
                  {TIPO_MERMA_LABEL[m.tipoMerma]}
                </span>
              </div>
              <p className="font-mono text-xs font-semibold text-gray-700">{m.loteFinal?.codigo ?? `LF-${m.loteFinalId}`}</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{m.loteFinal?.tipoProducto?.tipo ?? '—'} · {m.loteFinal?.tipoProducto?.subtipoEntrada ?? ''}</span>
                <span className="font-mono font-bold text-gray-700">{Number(m.cantidadKg).toFixed(2)} kg</span>
              </div>
              {m.productorNombre && (
                <p className="text-xs text-gray-500">{m.productorNombre} {m.productorApellido ?? ''}</p>
              )}
              <p className="text-xs text-gray-400">{fmtFecha(m.fecha)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
