import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { muestrasService } from '@/services/muestras.service';
import LoadingLogo from '@/components/LoadingLogo';

type PreviewRow = Record<string, unknown>;

interface Props { onClose: () => void; onImportado?: () => void; }

export function ImportarMuestrasModal({ onClose, onImportado }: Props) {
  const inputRef  = useRef<HTMLInputElement>(null);

  const [file,      setFile]      = useState<File | null>(null);
  const [headers,   setHeaders]   = useState<string[]>([]);
  const [rows,      setRows]      = useState<PreviewRow[]>([]);
  const [parsing,   setParsing]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result,    setResult]    = useState<{ creadas: number; actualizadas: number; errores: string[] } | null>(null);
  const [error,     setError]     = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f); setResult(null); setError(''); setParsing(true);
    try {
      const buffer = await f.arrayBuffer();
      const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data: PreviewRow[] = XLSX.utils.sheet_to_json(ws, { defval: '' });
      if (!data.length) { setError('El archivo está vacío o sin formato válido.'); return; }
      setHeaders(Object.keys(data[0]));
      setRows(data.slice(0, 50));
    } catch { setError('No se pudo leer el archivo. Verifica que sea .xlsx o .csv válido.'); }
    finally { setParsing(false); }
  }

  async function handleSubir() {
    if (!file) return;
    setUploading(true); setError('');
    try {
      const res = await muestrasService.importHistorico(file);
      setResult(res);
      onImportado?.();
    } catch { setError('Error al importar. Verifica el formato del archivo.'); }
    finally { setUploading(false); }
  }

  function handleReset() {
    setFile(null); setHeaders([]); setRows([]); setResult(null); setError('');
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', backgroundColor: 'rgba(0,0,0,0.55)',
      }}>
      <div style={{ width: '100%', maxWidth: '56rem', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
        className="bg-white rounded-2xl shadow-2xl">

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-black text-gray-800 uppercase tracking-wide">Importar Muestras</h2>
            <p className="text-xs text-gray-400 mt-0.5">Carga datos históricos desde un archivo Excel o CSV</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 shrink-0 bg-gray-50 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div
              onClick={() => !result && inputRef.current?.click()}
              className={`flex items-center gap-3 border-2 border-dashed rounded-xl px-4 py-3 flex-1 min-w-0 transition-colors ${result ? 'border-gray-200 bg-white' : 'border-gray-300 bg-white hover:border-green-400 cursor-pointer'}`}
            >
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <span className="text-sm text-gray-500 truncate">
                {file ? file.name : 'Haz clic para seleccionar un archivo .xlsx, .xls o .csv'}
              </span>
              {file && !result && (
                <button onClick={e => { e.stopPropagation(); handleReset(); }}
                  className="ml-auto shrink-0 text-gray-400 hover:text-red-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
            <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />

            {rows.length > 0 && !result && (
              <button onClick={handleSubir} disabled={uploading}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 shrink-0"
                style={{ backgroundColor: '#2d5a3d' }}>
                {uploading
                  ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Importando…</>
                  : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>Confirmar importación</>
                }
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400">
            Columnas esperadas: <span className="font-mono text-gray-600">Codigo, Fecha, TipoMuestra, ProductorId, CampanaId, Puntaje, Resultado, Observaciones</span>
          </p>
          {error && <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
        </div>

        <div className="flex-1 overflow-auto px-6 py-5">

          {result && (
            <div className="mb-5 bg-green-50 border border-green-200 rounded-2xl p-5">
              <p className="text-sm font-bold text-green-800 mb-3">Importación completada</p>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white font-black text-sm">{result.creadas}</span>
                  <span className="text-sm text-green-700">Creadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-sm">{result.actualizadas}</span>
                  <span className="text-sm text-blue-700">Actualizadas</span>
                </div>
                {result.errores.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white font-black text-sm">{result.errores.length}</span>
                    <span className="text-sm text-red-700">Errores</span>
                  </div>
                )}
              </div>
              {result.errores.length > 0 && (
                <div className="mt-3 max-h-24 overflow-y-auto space-y-0.5">
                  {result.errores.map((e, i) => <p key={i} className="text-xs text-red-600">{e}</p>)}
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#2d5a3d' }}>
                  Cerrar
                </button>
                <button onClick={handleReset} className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50">
                  Importar otro archivo
                </button>
              </div>
            </div>
          )}

          {parsing && <div className="flex items-center justify-center py-16"><LoadingLogo /></div>}

          {!parsing && !file && !result && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <svg className="w-14 h-14 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              <p className="text-sm font-medium">Selecciona un archivo para previsualizarlo</p>
              <p className="text-xs mt-1">Formatos aceptados: .xlsx, .xls, .csv</p>
            </div>
          )}

          {!parsing && rows.length > 0 && !result && (
            <>
              <p className="text-xs text-gray-500 mb-3">
                Previsualizando <strong className="text-gray-800">{rows.length}</strong> fila{rows.length !== 1 ? 's' : ''}
                {rows.length === 50 && ' (máx. 50 mostradas)'}
                {' · '}<span className="text-gray-400">{headers.length} columnas detectadas</span>
              </p>
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-max border-collapse">
                    <thead>
                      <tr>
                        <th className="px-3 py-2.5 text-[0.6rem] font-bold text-white text-center border-r border-gray-600 w-8" style={{ backgroundColor: '#374151' }}>#</th>
                        {headers.map(h => (
                          <th key={h} className="px-3 py-2.5 text-[0.6rem] font-bold text-white text-left border-r border-gray-600 last:border-r-0 whitespace-nowrap" style={{ backgroundColor: '#374151' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-3 py-1.5 text-gray-400 text-center border-r border-gray-100 font-mono">{i + 1}</td>
                          {headers.map(h => (
                            <td key={h} className="px-3 py-1.5 text-gray-700 border-r border-gray-100 last:border-r-0 whitespace-nowrap max-w-[200px] truncate" title={String(row[h] ?? '')}>
                              {row[h] != null && row[h] !== '' ? String(row[h]) : <span className="text-gray-300">—</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        {!result && (
          <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex justify-end">
            <button onClick={onClose} className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
