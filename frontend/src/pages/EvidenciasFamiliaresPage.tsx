import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { evidenciasFamiliaresService, EvidenciaFamiliar } from '@/services/evidencias-familiares.service';
import { productoresService, Productor } from '@/services/productores.service';
import { syncService } from '@/services/sync.service';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import LoadingLogo from '@/components/LoadingLogo';
import { useToast } from '@/contexts/ToastContext';

function codigoProductor(p: Productor) {
  return `PR${String(p.id).padStart(3, '0')}`;
}
function nombreCompleto(p: Productor) {
  return p.apellido ? `${p.nombre} ${p.apellido}` : p.nombre;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function fmtBytes(b: number | null) {
  if (!b) return null;
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 ** 2).toFixed(1)} MB`;
}
function mimeInfo(mime: string | null) {
  if (!mime) return { emoji: '📄', bg: 'bg-gray-100', text: 'text-gray-500' };
  if (mime.startsWith('image/'))    return { emoji: '🖼',  bg: 'bg-sky-50',    text: 'text-sky-600' };
  if (mime === 'application/pdf')   return { emoji: '📕',  bg: 'bg-red-50',    text: 'text-red-500' };
  if (mime.includes('word'))        return { emoji: '📝',  bg: 'bg-indigo-50', text: 'text-indigo-500' };
  if (mime.includes('excel') || mime.includes('spreadsheet'))
                                    return { emoji: '📊',  bg: 'bg-emerald-50',text: 'text-emerald-600' };
  return { emoji: '📄', bg: 'bg-gray-100', text: 'text-gray-500' };
}

function DeleteConfirm({ ev, onClose, onConfirm }: {
  ev: EvidenciaFamiliar; onClose: () => void; onConfirm: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        {loading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">Eliminando archivo…</p>
          </div>
        )}
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </div>
        <h3 className="font-bold text-gray-800 text-base mb-1">Eliminar archivo</h3>
        <p className="text-sm text-gray-500 mb-5">
          ¿Eliminar <span className="font-semibold text-gray-700">"{ev.nombreArchivo}"</span>? No se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            disabled={loading}
            onClick={async () => { setLoading(true); await onConfirm(); setLoading(false); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: '#dc2626' }}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export function EvidenciasFamiliaresPage() {
  const { productorId } = useParams<{ productorId: string }>();
  const navigate        = useNavigate();
  const { isOffline, justReconnected } = useNetworkStatus();
  const toast = useToast();
  const pid = Number(productorId);

  const [productor,   setProductor]   = useState<Productor | null>(null);
  const [evidencias,  setEvidencias]  = useState<EvidenciaFamiliar[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [uploading,   setUploading]   = useState(false);
  const [deleting,    setDeleting]    = useState<EvidenciaFamiliar | null>(null);
  const [syncDone,    setSyncDone]    = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [selectedFile,  setSelectedFile]  = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [prod, evs] = await Promise.all([
      productoresService.getOne(pid),
      evidenciasFamiliaresService.getByProductor(pid),
    ]);
    setProductor(prod);
    setEvidencias(evs);
    setLoading(false);
  }, [pid]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!justReconnected) return;
    syncService.flush().then(({ ok }) => {
      if (ok > 0) { setSyncDone(true); load(); }
    });
  }, [justReconnected]); 

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setUploadError('');
    if (file) {
      
      if (file.type.startsWith('video/')) {
        setUploadError('No se permiten archivos de video.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const MAX = 1 * 1024 * 1024;
      if (file.size > MAX) {
        setUploadError(`El archivo supera el límite de 1 MB (tamaño: ${(file.size / 1024 / 1024).toFixed(2)} MB).`);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setSelectedFile(file);
      if (!nombreArchivo.trim()) setNombreArchivo(file.name.replace(/\.[^/.]+$/, ''));
    } else {
      setSelectedFile(null);
    }
  }

  function resetForm() {
    setNombreArchivo(''); setSelectedFile(null); setUploadError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile)         { setUploadError('Selecciona un archivo'); return; }
    if (!nombreArchivo.trim()) { setUploadError('Ingresa el nombre del archivo'); return; }
    setUploading(true); setUploadError('');
    try {
      await evidenciasFamiliaresService.upload({ productorId: pid, nombreArchivo: nombreArchivo.trim(), file: selectedFile });
      resetForm(); await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setUploadError(typeof msg === 'string' ? msg : 'Error al subir. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    await evidenciasFamiliaresService.remove(deleting.id, pid);
    setDeleting(null); await load();
  }

  async function handleDownload(ev: EvidenciaFamiliar) {
    try { await evidenciasFamiliaresService.download(ev); }
    catch { toast.error('No se pudo descargar el archivo.'); }
  }

  

  return (
    <div className="relative p-4 md:p-8 min-h-full bg-white">
      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(2px)' }}>
          <LoadingLogo />
        </div>
      )}

      <div className="flex items-start gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mt-1 w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        <div>
          <h1 className="font-headline text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wide text-gray-800 leading-tight" style={{ letterSpacing: '0.05em' }}>
            {productor ? `${codigoProductor(productor)} — ${nombreCompleto(productor)}` : 'Evidencias Familiares'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">Documentos y evidencias de familiares</p>
        </div>
      </div>

      {isOffline && (
        <div className="mb-5 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shrink-0" />
          Modo offline — los archivos nuevos se marcarán como pendientes. La descarga requiere conexión.
        </div>
      )}
      {syncDone && (
        <div className="mb-5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 inline-flex items-center gap-2">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
          Datos sincronizados
        </div>
      )}

      <div className="mb-5 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 flex items-start gap-2">
        <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/>
        </svg>
        <span>Archivos permitidos: PDF, Word, Excel, imágenes (jpg, png, webp) · Máx. 1 MB por archivo · No se permiten videos</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        <div className="w-full lg:w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 pt-4 pb-3 border-b border-gray-100 flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
              </svg>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Subir archivo</span>
            </div>

            <form onSubmit={handleUpload} className="p-5 space-y-4">
              {uploadError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{uploadError}</p>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Nombre del archivo *</label>
                <input
                  value={nombreArchivo}
                  onChange={(e) => setNombreArchivo(e.target.value)}
                  placeholder="Ej: Partida de nacimiento"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Archivo *</label>
                <div
                  className="w-full border border-dashed border-gray-300 rounded-xl px-3 py-4 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-all"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {selectedFile ? (
                    <div>
                      <p className="text-xs font-semibold text-gray-700 truncate">{selectedFile.name}</p>
                      <p className="text-[0.65rem] text-gray-400 mt-0.5">{fmtBytes(selectedFile.size)}</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-6 h-6 text-gray-300 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13"/>
                      </svg>
                      <p className="text-xs text-gray-400">Haz clic para seleccionar</p>
                      <p className="text-[0.65rem] text-gray-300 mt-0.5">PDF, Word, Excel, imágenes · máx. 1 MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-70"
                  style={{ backgroundColor: uploading ? '#9ca3af' : '#1A2B23' }}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Subiendo
                    </span>
                  ) : 'Subir'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Limpiar
                </button>
              </div>
            </form>

            {!loading && (
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Total de archivos</span>
                  <span className="text-xs font-bold text-gray-700">{evidencias.length}</span>
                </div>
                {evidencias.some((e) => e._pendiente) && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-[0.65rem] text-yellow-600">Pendientes de sincronizar</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {!loading && (
            evidencias.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
                  <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-500">Sin archivos de familiares</p>
                <p className="text-xs mt-1">Usa el formulario para subir el primer archivo</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                <div style={{ minWidth: '480px' }}>
                <div className="grid items-center border-b border-gray-100 bg-gray-50 px-5 py-3"
                  style={{ gridTemplateColumns: '2rem 1fr 7rem 6rem 6rem' }}>
                  <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider text-center">Nº</span>
                  <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider">Nombre del archivo</span>
                  <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider">Fecha de carga</span>
                  <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider text-center">Versión</span>
                  <span className="text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider text-center">Acciones</span>
                </div>

                {evidencias.map((ev, idx) => {
                  const { emoji, bg, text } = mimeInfo(ev.mimeType);
                  return (
                    <div
                      key={ev.id}
                      className={`grid items-center px-5 py-4 hover:bg-gray-50 transition-colors ${
                        idx < evidencias.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                      style={{ gridTemplateColumns: '2rem 1fr 7rem 6rem 6rem' }}
                    >
                      <span className="text-xs text-gray-400 font-medium text-center">{idx + 1}</span>

                      <div className="flex items-center gap-3 min-w-0 pr-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base ${bg} ${text}`}>
                          {emoji}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-800 truncate">{ev.nombreArchivo}</span>
                            {ev._pendiente && (
                              <span className="shrink-0 text-[0.6rem] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-bold uppercase tracking-wide">
                                Pendiente
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {ev.originalFilename && ev.originalFilename !== ev.nombreArchivo && (
                              <span className="text-[0.7rem] text-gray-400 truncate">{ev.originalFilename}</span>
                            )}
                            {fmtBytes(ev.fileSize) && (
                              <span className="text-[0.65rem] text-gray-400 shrink-0 font-medium">{fmtBytes(ev.fileSize)}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs text-gray-500">{fmtDate(ev.createdAt)}</span>

                      <div className="flex justify-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 tracking-wide">
                          V{ev.version}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-1">
                        {!ev._pendiente && (
                          <button
                            onClick={() => handleDownload(ev)}
                            title="Descargar"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => setDeleting(ev)}
                          title="Eliminar"
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
                </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {deleting && (
        <DeleteConfirm ev={deleting} onClose={() => setDeleting(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}
