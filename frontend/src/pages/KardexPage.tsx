import { useState, useEffect, useCallback } from 'react';
import { kardexService, MovimientoKardex, TipoMovimientoKardex } from '@/services/kardex.service';
import { tiposProductoService, TipoProducto } from '@/services/tipos-producto.service';
import { lotesFinalesService, LoteFinal } from '@/services/lotes-finales.service';
import LoadingLogo from '@/components/LoadingLogo';
import { TablePagination } from '@/components/TablePagination';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

function fmtFecha(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function fmtDatetime(dt: string | null | undefined): string {
  if (!dt) return '—';
  try {
    const d = new Date(dt);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yy} ${hh}:${mi}`;
  } catch { return '—'; }
}

function fmtKg(v: number | string | null | undefined) {
  if (v == null) return '';
  const n = Number(v);
  return isNaN(n) ? '' : n.toFixed(2);
}

function getOrigenes(m: MovimientoKardex): string {
  const origenes = m.loteFinal?.origenes;
  if (origenes && origenes.length > 0) {
    return origenes.map(o => o.loteOrigen?.codigo ?? `Lote #${o.loteOrigenId}`).join(', ');
  }
  return '—';
}

const TIPO_ORIGEN_LABEL: Record<string, string> = {
  DIRECTO:          'DIRECTO',
  DIVISION:         'DIVISIÓN',
  MEZCLA:           'MEZCLA',
  MUESTRA:          'Env. Muestra',
  PREVENTA_MUESTRA: 'Env. Muestra',
};

const TIPO_ORIGEN_COLOR: Record<string, { bg: string; text: string }> = {
  DIRECTO:          { bg: '#ECFDF5', text: '#065F46' },
  DIVISION:         { bg: '#EFF6FF', text: '#1E40AF' },
  MEZCLA:           { bg: '#FFF7ED', text: '#9A3412' },
  MUESTRA:          { bg: '#F5F3FF', text: '#6D28D9' },
  PREVENTA_MUESTRA: { bg: '#F5F3FF', text: '#6D28D9' },
};

const MOTIVO_COLOR: Record<TipoMovimientoKardex, string> = {
  INGRESO: '#166534',
  SALIDA:  '#991B1B',
  MERMA:   '#92400E',
  AJUSTE:  '#1E40AF',
};

const TH = {
  border:          '1px solid #374151',
  padding:         '6px 8px',
  backgroundColor: '#1A2B23',
  fontWeight:      700,
  fontSize:        '0.65rem',
  textAlign:       'center' as const,
  textTransform:   'uppercase' as const,
  color:           '#FFFFFF',
  verticalAlign:   'middle' as const,
  whiteSpace:      'nowrap' as const,
};

const TD = {
  border:        '1px solid #D1D5DB',
  padding:       '6px 8px',
  fontSize:      '0.75rem',
  verticalAlign: 'middle' as const,
  color:         '#1F2937',
};

export function KardexPage() {
  const { isOnline } = useNetworkStatus();

  const [movimientos, setMovimientos] = useState<MovimientoKardex[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [lastPage,    setLastPage]    = useState(1);
  const [total,       setTotal]       = useState(0);
  const [limit,       setLimit]       = useState(10);

  const [filtroTipo,  setFiltroTipo]  = useState<TipoMovimientoKardex | ''>('');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');

  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [filtroCultivo, setFiltroCultivo] = useState('');
  const [filtroTpId,    setFiltroTpId]    = useState('');
  const [lotesFinales,  setLotesFinales]  = useState<LoteFinal[]>([]);
  const [filtroLfId,    setFiltroLfId]    = useState('');
  const [loadingLf,     setLoadingLf]     = useState(false);

  useEffect(() => {
    tiposProductoService.getAll().then(setTiposProducto).catch(() => {});
  }, []);

  const productosFiltrados = filtroCultivo
    ? tiposProducto.filter(t => t.tipo === filtroCultivo)
    : [];

  useEffect(() => {
    setFiltroTpId('');
    setFiltroLfId('');
    setLotesFinales([]);
  }, [filtroCultivo]);

  useEffect(() => {
    setFiltroLfId('');
    setLotesFinales([]);
    if (!filtroTpId) return;
    setLoadingLf(true);
    lotesFinalesService.getPage({ tipoProductoId: Number(filtroTpId), limit: 200 })
      .then(r => setLotesFinales(r.data))
      .catch(() => {})
      .finally(() => setLoadingLf(false));
  }, [filtroTpId]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await kardexService.getPage({
        page, limit,
        tipoMovimiento: filtroTipo  || undefined,
        fechaDesde:     filtroDesde || undefined,
        fechaHasta:     filtroHasta || undefined,
        loteFinalId:    filtroLfId  ? Number(filtroLfId) : undefined,
      });
      setMovimientos(res.data);
      setLastPage(res.meta.lastPage);
      setTotal(res.meta.total);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filtroTipo, filtroDesde, filtroHasta, filtroLfId]);

  useEffect(() => { load(); }, [load]);

  const sel = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';

  return (
    <div className="p-4 md:p-6 space-y-4 relative">

      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(249,250,251,0.92)', backdropFilter: 'blur(2px)' }}>
          <LoadingLogo />
        </div>
      )}

      {!isOnline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2 rounded-xl">
          Sin conexión — mostrando datos en caché
        </div>
      )}

      <div>
        <h1 className="text-2xl font-black uppercase tracking-wide" style={{ color: '#1A2B23' }}>
          Kardex
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Control de movimientos de inventario · {total} registro{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tipo movimiento</label>
            <select value={filtroTipo}
              onChange={e => { setFiltroTipo(e.target.value as TipoMovimientoKardex | ''); setPage(1); }}
              className={sel}>
              <option value="">Todos</option>
              <option value="INGRESO">Ingreso</option>
              <option value="SALIDA">Salida</option>
              <option value="MERMA">Merma</option>
              <option value="AJUSTE">Ajuste</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Desde</label>
            <input type="date" value={filtroDesde}
              onChange={e => { setFiltroDesde(e.target.value); setPage(1); }}
              className={sel} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Hasta</label>
            <input type="date" value={filtroHasta}
              onChange={e => { setFiltroHasta(e.target.value); setPage(1); }}
              className={sel} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Cultivo</label>
            <select value={filtroCultivo}
              onChange={e => { setFiltroCultivo(e.target.value); setPage(1); }}
              className={sel}>
              <option value="">Todos</option>
              <option value="CAFE">Café</option>
              <option value="CACAO">Cacao</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Producto</label>
            <select value={filtroTpId}
              onChange={e => { setFiltroTpId(e.target.value); setPage(1); }}
              disabled={!filtroCultivo}
              className={`${sel} disabled:opacity-50`}>
              <option value="">{!filtroCultivo ? '← Elige cultivo primero' : 'Todos los productos'}</option>
              {productosFiltrados.map(t => (
                <option key={t.id} value={t.id}>
                  {t.subtipoEntrada.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Lote Final
              {loadingLf && <span className="ml-1 text-gray-400 font-normal">cargando…</span>}
            </label>
            <select value={filtroLfId}
              onChange={e => { setFiltroLfId(e.target.value); setPage(1); }}
              disabled={!filtroTpId || loadingLf}
              className={`${sel} disabled:opacity-50`}>
              <option value="">{!filtroTpId ? '← Elige producto primero' : 'Todos los lotes'}</option>
              {lotesFinales.map(lf => (
                <option key={lf.id} value={lf.id}>{lf.codigo}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: '980px' }}>
            <thead>
              <tr>
                <th style={{ ...TH, width: '44px' }} rowSpan={2}>#</th>
                <th style={{ ...TH, width: '90px' }} rowSpan={2}>FECHA</th>
                <th style={{ ...TH, minWidth: '130px' }} rowSpan={2}>LOTE FINAL</th>
                <th style={{ ...TH, width: '90px' }} rowSpan={2}>TIPO ORIGEN</th>
                <th style={{ ...TH, minWidth: '140px' }} rowSpan={2}>LOTES ORIGEN</th>
                <th style={{ ...TH }} colSpan={2}>ENTRADA (KG)</th>
                <th style={{ ...TH }} colSpan={2}>SALIDA (KG)</th>
                <th style={{ ...TH, width: '90px' }} rowSpan={2}>MERMA (KG)</th>
                <th style={{ ...TH, width: '90px' }} rowSpan={2}>SALDO (KG)</th>
                <th style={{ ...TH, width: '75px' }} rowSpan={2}>MOTIVO</th>
                <th style={{ ...TH, width: '90px' }} rowSpan={2}>CAMPAÑA</th>
              </tr>
              <tr>
                <th style={{ ...TH, width: '52px', backgroundColor: '#0F3D22' }}>CANT</th>
                <th style={{ ...TH, width: '82px', backgroundColor: '#0F3D22' }}>PESO</th>
                <th style={{ ...TH, width: '52px', backgroundColor: '#6B1111' }}>CANT</th>
                <th style={{ ...TH, width: '82px', backgroundColor: '#6B1111' }}>PESO</th>
              </tr>
            </thead>

            <tbody>
              {movimientos.length === 0 && !loading ? (
                <tr>
                  <td colSpan={13} style={{ ...TD, textAlign: 'center', padding: '48px', color: '#9CA3AF' }}>
                    Sin movimientos registrados
                  </td>
                </tr>
              ) : (
                movimientos.map((m, idx) => {
                  const nOper   = (page - 1) * limit + idx + 1;
                  const isEntry = m.tipoMovimiento === 'INGRESO';
                  const isExit  = m.tipoMovimiento === 'SALIDA';
                  const isMerma = m.tipoMovimiento === 'MERMA';
                  const lf      = m.loteFinal;
                  const tp      = lf?.tipoProducto;
                  const origen  = getOrigenes(m);
                  const tipoOrigenKey = (['MUESTRA', 'PREVENTA_MUESTRA'] as string[]).includes(m.referenciaTipo)
                    ? m.referenciaTipo
                    : (lf?.tipoOrigen ?? m.referenciaTipo ?? null);
                  const tipoOrigenStyle = tipoOrigenKey ? TIPO_ORIGEN_COLOR[tipoOrigenKey] : null;

                  const descLote = tp
                    ? `${tp.tipo} · ${tp.subtipoEntrada?.replace(/_/g, ' ') ?? ''}`
                    : '';

                  return (
                    <tr key={m.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#F9FAFB' }}>
                      <td style={{ ...TD, textAlign: 'center', fontWeight: 600, color: '#6B7280', fontSize: '0.7rem' }}>
                        {nOper}
                      </td>
                      <td style={{ ...TD, textAlign: 'center', whiteSpace: 'nowrap', fontSize: '0.68rem' }}>
                        {m.horaEntrada ? fmtDatetime(m.horaEntrada) : fmtFecha(m.fecha)}
                      </td>
                      <td style={{ ...TD }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.72rem', color: '#1A2B23' }}>
                          {lf?.codigo ?? `LF-${m.loteFinalId}`}
                        </span>
                        {descLote && (
                          <span style={{ display: 'block', fontSize: '0.62rem', color: '#6B7280', marginTop: '1px' }}>
                            {descLote}
                          </span>
                        )}
                      </td>
                      <td style={{ ...TD, textAlign: 'center' }}>
                        {tipoOrigenKey && tipoOrigenStyle ? (
                          <span style={{
                            display: 'inline-block', padding: '2px 6px',
                            borderRadius: '4px', fontSize: '0.58rem', fontWeight: 700,
                            backgroundColor: tipoOrigenStyle.bg, color: tipoOrigenStyle.text,
                            letterSpacing: '0.04em',
                          }}>
                            {TIPO_ORIGEN_LABEL[tipoOrigenKey]}
                          </span>
                        ) : <span style={{ color: '#9CA3AF' }}>—</span>}
                      </td>
                      <td style={{ ...TD, fontSize: '0.68rem', color: '#374151' }}>
                        {origen !== '—' ? (
                          <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#374151' }}>{origen}</span>
                        ) : <span style={{ color: '#9CA3AF' }}>—</span>}
                      </td>
                      <td style={{ ...TD, textAlign: 'center', color: '#6B7280', fontSize: '0.68rem' }}>
                        {isEntry ? '1' : ''}
                      </td>
                      <td style={{ ...TD, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700,
                        color: isEntry ? '#166534' : 'transparent' }}>
                        {isEntry ? fmtKg(m.cantidadKg) : ''}
                      </td>
                      <td style={{ ...TD, textAlign: 'center', color: '#6B7280', fontSize: '0.68rem' }}>
                        {isExit ? '1' : ''}
                      </td>
                      <td style={{ ...TD, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700,
                        color: isExit ? '#991B1B' : 'transparent' }}>
                        {isExit ? fmtKg(m.cantidadKg) : ''}
                      </td>
                      <td style={{ ...TD, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700,
                        color: isMerma ? '#92400E' : 'transparent', backgroundColor: isMerma ? '#FFFBEB' : undefined }}>
                        {isMerma ? fmtKg(m.cantidadKg) : ''}
                      </td>
                      <td style={{ ...TD, textAlign: 'right', fontFamily: 'monospace', fontWeight: 800,
                        color: '#1A2B23', fontSize: '0.78rem' }}>
                        {fmtKg(m.saldoKg)}
                      </td>
                      <td style={{ ...TD, textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block', padding: '2px 6px',
                          borderRadius: '4px', fontSize: '0.58rem', fontWeight: 700,
                          color: '#fff', backgroundColor: MOTIVO_COLOR[m.tipoMovimiento],
                          letterSpacing: '0.04em',
                        }}>
                          {m.tipoMovimiento}
                        </span>
                      </td>
                      <td style={{ ...TD, textAlign: 'center', fontSize: '0.65rem', color: '#6B7280' }}>
                        {lf?.campana?.nombre ?? '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {lastPage > 1 && (
          <div className="border-t border-gray-200">
            <TablePagination
              page={page} lastPage={lastPage} total={total} limit={limit}
              onPageChange={setPage}
              onLimitChange={l => { setLimit(l); setPage(1); }}
            />
          </div>
        )}
      </div>

      <div className="md:hidden space-y-3">
        {movimientos.length === 0 && !loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            <p className="text-sm font-medium">Sin movimientos registrados</p>
          </div>
        ) : (
          movimientos.map((m, idx) => {
            const nOper    = (page - 1) * limit + idx + 1;
            const lf       = m.loteFinal;
            const isEntry  = m.tipoMovimiento === 'INGRESO';
            const isExit   = m.tipoMovimiento === 'SALIDA';
            const isMerma  = m.tipoMovimiento === 'MERMA';
            const origen   = getOrigenes(m);
            const tipoOrigenKey = lf?.tipoOrigen ?? m.referenciaTipo ?? null;
            const tipoOrigenStyle = tipoOrigenKey ? TIPO_ORIGEN_COLOR[tipoOrigenKey] : null;

            return (
              <div key={m.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 pt-3 pb-2 flex items-start justify-between gap-2"
                  style={{ backgroundColor: '#F8FDF9', borderBottom: '1px solid #E5E7EB' }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.6rem] text-gray-400 font-mono">#{nOper}</span>
                      <span className="font-mono text-xs font-black" style={{ color: '#1A2B23' }}>
                        {lf?.codigo ?? `LF-${m.loteFinalId}`}
                      </span>
                      <span style={{
                        padding: '1px 6px', borderRadius: '4px', fontSize: '0.58rem',
                        fontWeight: 700, color: '#fff', backgroundColor: MOTIVO_COLOR[m.tipoMovimiento],
                      }}>
                        {m.tipoMovimiento}
                      </span>
                    </div>
                    {lf?.tipoProducto && (
                      <p className="text-[0.62rem] text-gray-500 mt-0.5">
                        {lf.tipoProducto.tipo} · {lf.tipoProducto.subtipoEntrada?.replace(/_/g, ' ')}
                        {lf.campana && <span className="text-gray-400"> · {lf.campana.nombre}</span>}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-sm" style={{ color: '#1A2B23' }}>
                      {fmtKg(m.saldoKg)} kg
                    </div>
                    <div className="text-[0.6rem] text-gray-400">saldo</div>
                  </div>
                </div>

                <div className="px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{m.horaEntrada ? fmtDatetime(m.horaEntrada) : fmtFecha(m.fecha)}</span>
                    <div className="flex items-center gap-2">
                      {isEntry && (
                        <span className="font-mono font-bold text-green-700">
                          +{fmtKg(m.cantidadKg)} kg
                        </span>
                      )}
                      {isExit && (
                        <span className="font-mono font-bold text-red-700">
                          -{fmtKg(m.cantidadKg)} kg
                        </span>
                      )}
                      {isMerma && (
                        <span className="font-mono font-bold text-amber-700">
                          -{fmtKg(m.cantidadKg)} kg merma
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {tipoOrigenKey && tipoOrigenStyle && (
                      <span style={{
                        padding: '2px 7px', borderRadius: '4px', fontSize: '0.6rem', fontWeight: 700,
                        backgroundColor: tipoOrigenStyle.bg, color: tipoOrigenStyle.text,
                      }}>
                        {TIPO_ORIGEN_LABEL[tipoOrigenKey]}
                      </span>
                    )}
                    {origen !== '—' && (
                      <span className="text-[0.65rem] font-mono font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md">
                        Origen: {origen}
                      </span>
                    )}
                  </div>

                  {m.observaciones && (
                    <p className="text-[0.65rem] text-gray-400 leading-relaxed">{m.observaciones}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
        {lastPage > 1 && (
          <TablePagination
            page={page} lastPage={lastPage} total={total} limit={limit}
            onPageChange={setPage}
            onLimitChange={l => { setLimit(l); setPage(1); }}
          />
        )}
      </div>
    </div>
  );
}
