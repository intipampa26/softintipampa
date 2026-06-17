import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { muestrasService } from '@/services/muestras.service';
import LoadingLogo from '@/components/LoadingLogo';

type PreviewRow = Record<string, unknown>;

export function ImportarMuestrasPage() {
  const navigate   = useNavigate();
  const inputRef   = useRef<HTMLInputElement>(null);

  const [file,       setFile]       = useState<File | null>(null);
  const [headers,    setHeaders]    = useState<string[]>([]);
  const [rows,       setRows]       = useState<PreviewRow[]>([]);
  const [parsing,    setParsing]    = useState(false);
  const [uploading,  setUploading]  = useState(false);
  const [result,     setResult]     = useState<{ creadas: number; actualizadas: number; errores: string[] } | null>(null);
  const [error,      setError]      = useState('');

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    setError('');
    setParsing(true);

    try {
      const buffer = await f.arrayBuffer();
      const wb = XLSX.read(new Uint8Array(buffer), { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data: PreviewRow[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

      if (data.length === 0) {
        setError('El archivo está vacío o no tiene el formato correcto.');
        setRows([]); setHeaders([]);
        return;
      }

      const hdrs = Object.keys(data[0]);
      setHeaders(hdrs);
      setRows(data.slice(0, 50)); 
    } catch {
      setError('No se pudo leer el archivo. Verifica que sea un Excel (.xlsx) o CSV válido.');
      setRows([]); setHeaders([]);
    } finally {
      setParsing(false);
    }
  }

  async function handleSubir() {
    if (!file) return;
    setUploading(true); setError('');
    try {
      const res = await muestrasService.importHistorico(file);
      setResult(res);
    } catch {
      setError('Error al importar. Verifica el formato del archivo.');
    } finally {
      setUploading(false);
    }
  }

  function handleCancelar() {
    navigate('/dashboard/muestras');
  }

  return (
    <div className="min-h-full bg-white flex flex-col">
      <div className="px-4 md:px-8 pt-6 pb-4 flex items-center gap-4">
        <button onClick={handleCancelar} className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-wide text-gray-800">Importar muestras</h1>
          <p className="text-xs text-gray-400 mt-0.5">Carga datos históricos desde un archivo Excel o CSV</p>
        </div>
      </div>

      <div className="px-4 md:px-8 py-5 border-b border-gray-100">
        <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-2">Cargar archivo</label>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white max-w-md w-full">
            <span className="flex-1 px-4 py-2 text-sm text-gray-500 truncate min-w-0">
              {file ? file.name : 'Ningún archivo seleccionado'}
            </span>
            <button onClick={() => inputRef.current?.click()}
              className="px-4 py-2 text-sm font-semibold text-white shrink-0 h-full"
              style={{ backgroundColor: '#6b7280' }}>
              Subir archivos...
            </button>
          </div>
          <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />

          {rows.length > 0 && !result && (
            <button onClick={handleSubir} disabled={uploading}
              className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white uppercase tracking-wide transition-opacity hover:opacity-90"
              style={{ backgroundColor: uploading ? '#9ca3af' : '#4a7c59' }}>
              {uploading ? (
                <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Subiendo…</>
              ) : 'Subir'}
            </button>
          )}
          <button onClick={handleCancelar}
            className="px-6 py-2 rounded-xl text-sm font-bold text-white uppercase tracking-wide"
            style={{ backgroundColor: '#e11d74' }}>
            Cancelar
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Columnas esperadas: <span className="font-mono text-gray-600">Codigo, Fecha, TipoMuestra, ProductorId, CampanaId, LoteId, Puntaje, Resultado, Observaciones</span>
        </p>
      </div>

      <div className="flex-1 px-4 md:px-8 py-6">
        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</div>
        )}

        {result && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5">
            <p className="text-sm font-bold text-green-800 mb-2">Importación completada</p>
            <div className="flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xs">{result.creadas}</span>
                <span className="text-green-700">Muestras creadas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">{result.actualizadas}</span>
                <span className="text-blue-700">Actualizadas</span>
              </div>
              {result.errores.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xs">{result.errores.length}</span>
                  <span className="text-red-700">Errores</span>
                </div>
              )}
            </div>
            {result.errores.length > 0 && (
              <div className="mt-3 max-h-32 overflow-y-auto">
                {result.errores.map((e, i) => <p key={i} className="text-xs text-red-600">{e}</p>)}
              </div>
            )}
            <button onClick={() => navigate('/dashboard/muestras')}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ backgroundColor: '#4a7c59' }}>
              Ir a Muestras
            </button>
          </div>
        )}

        {parsing && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <LoadingLogo />
            <p className="text-sm text-gray-400">Leyendo archivo…</p>
          </div>
        )}

        {!parsing && rows.length === 0 && !error && !result && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg className="w-16 h-16 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p className="text-sm font-medium">Selecciona un archivo para previsualizarlo</p>
            <p className="text-xs mt-1">Formatos aceptados: .xlsx, .xls, .csv</p>
          </div>
        )}

        {!parsing && rows.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">
                Previsualizando <span className="font-semibold text-gray-800">{rows.length}</span> fila{rows.length !== 1 ? 's' : ''}
                {rows.length === 50 && <span className="text-gray-400"> (máx. 50 mostradas)</span>}
              </p>
              <p className="text-xs text-gray-400">{headers.length} columna{headers.length !== 1 ? 's' : ''} detectada{headers.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-max border-collapse">
                  <thead>
                    <tr>
                      <th className="px-3 py-2.5 text-[0.6rem] font-bold text-white uppercase text-center border-r border-gray-600 w-8" style={{ backgroundColor: '#374151' }}>#</th>
                      {headers.map((h) => (
                        <th key={h} className="px-3 py-2.5 text-[0.6rem] font-bold text-white uppercase tracking-wide text-left border-r border-gray-600 last:border-r-0 whitespace-nowrap" style={{ backgroundColor: '#374151' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-3 py-1.5 text-gray-400 text-center border-r border-gray-100 font-mono">{i + 1}</td>
                        {headers.map((h) => (
                          <td key={h} className="px-3 py-1.5 text-gray-700 border-r border-gray-100 last:border-r-0 whitespace-nowrap max-w-[200px] truncate" title={String(row[h] ?? '')}>
                            {row[h] != null && row[h] !== ''
                              ? <span>{String(row[h])}</span>
                              : <span className="text-gray-300">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {!result && (
              <div className="mt-4 flex items-center gap-3">
                <button onClick={handleSubir} disabled={uploading}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white uppercase tracking-wide"
                  style={{ backgroundColor: uploading ? '#9ca3af' : '#4a7c59' }}>
                  {uploading
                    ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Importando…</>
                    : 'Confirmar importación'}
                </button>
                <p className="text-xs text-gray-400">Se procesarán todas las filas del archivo</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
