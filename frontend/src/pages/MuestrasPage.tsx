import { useState, useEffect, useCallback, useRef } from 'react';
import JSZip from 'jszip';
import { buildSensorialCafePdfDirect, buildFisicaCafePdfDirect, PdfMuestraInfo } from '@/utils/pdf-evaluaciones';

const VARIEDADES_CAFE  = ['Caturra','Borbón Rojo','Borbon naranja','Gesha','Pacamara','Tabi','Sidra','Papayo','Blend','Pache','Costa Rica 95','Tipica','Catimor','Maragogipe','SL34','Villa Sarchí','Marsellesa','Limani'];
const VARIEDADES_CACAO = ['Cacao','Macambo','Cupui','Copuazu','Manteca de cacao','Polvo de cacao','Nibs de cacao','Pasta de cacao'];
import { useSearchParams } from 'react-router-dom';
import {
  EvaluacionSensorialCacao,
  type IICTEData,
} from '@/components/EvaluacionSensorialCacao';
import { ExportarMuestrasModal } from '@/components/ExportarMuestrasModal';
import { ImportarMuestrasModal } from '@/components/ImportarMuestrasModal';
import {
  muestrasService,
  Muestra, EvaluacionFisica, EvaluacionSensorial,
  CreateMuestraDto, FilterMuestrasDto,
  TipoMuestra, EstadoMuestra, PaginationMeta,
} from '@/services/muestras.service';
import { campanasService, Campana } from '@/services/campanas.service';
import { productoresService, Productor } from '@/services/productores.service';
import { lotesService, Lote, CreateLoteDto, LoteEstado } from '@/services/lotes.service';
import { lotesFinalesService, LoteFinal } from '@/services/lotes-finales.service';
import { tiposProductoService, TipoProducto } from '@/services/tipos-producto.service';
import { syncService } from '@/services/sync.service';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { TablePagination } from '@/components/TablePagination';
import LoadingLogo from '@/components/LoadingLogo';
import { EvaluacionFisicaContent } from '@/components/EvaluacionFisicaContent';
import { EvaluacionFisicaCacaoContent } from '@/components/EvaluacionFisicaCacaoContent';
import { EvaluacionSensorialCafeContent } from '@/components/EvaluacionSensorialCafeContent';
import { useToast } from '@/contexts/ToastContext';

const ESTADO_LABEL: Record<string, string> = {
  pendiente:  'PENDIENTE',
  en_proceso: 'EVALUADA',
};

const ESTADO_BADGE: Record<string, string> = {
  pendiente:  'bg-yellow-100 text-yellow-700 border border-yellow-200',
  en_proceso: 'bg-blue-100   text-blue-700   border border-blue-200',
};


interface FormularioModalProps {
  muestra: Muestra;
  onClose: () => void;
  onGuardado: () => void;
}

function FormularioModal({ muestra, onClose, onGuardado }: FormularioModalProps) {
  const esCacao = (muestra as any).loteFinal?.tipoProductoId === 2
    || (muestra as any).lote?.tipoProducto?.tipo === 'CACAO'
    || muestra.tipoMuestra === 'cacao'
    || muestra.tipoProducto === 'cacao';
  const esCafe  = (muestra as any).loteFinal?.tipoProductoId === 1
    || (muestra as any).lote?.tipoProducto?.tipo === 'CAFE'
    || muestra.tipoMuestra === 'cafe'
    || muestra.tipoProducto === 'cafe';

  const [tab,                  setTab]                 = useState<'sensorial' | 'fisica'>('sensorial');
  const [loadingDetalle,       setLoadingDetalle]       = useState(true);
  const [fisicaLoading,        setFisicaLoading]        = useState(false);
  const [cafeSensorialLoading, setCafeSensorialLoading] = useState(false);
  const [saving,               setSaving]               = useState(false);
  const [saveResult,           setSaveResult]           = useState<null | 'success' | 'error'>(null);
  const [downloadingPdf,       setDownloadingPdf]       = useState(false);
  const toast = useToast();

  const iictDataRef           = useRef<IICTEData | null>(null);
  const [iictData, setIictData] = useState<Partial<IICTEData>>({});
  const sensorialLiveStateRef = useRef<any>(null);

  async function handleDescargarPDF() {
    setDownloadingPdf(true);
    try {
      const pdfInfo: PdfMuestraInfo = {
        codigo:          muestra.codigo,
        productorNombre: muestra.productor ? `${muestra.productor.nombre} ${muestra.productor.apellido ?? ''}`.trim() : null,
        campana:         muestra.campana?.nombre,
        lote:            muestra.lote?.codigo ?? (muestra as any).loteFinal?.codigo,
        fecha:           muestra.fecha,
        variedad:        muestra.variedad,
        proceso:         muestra.proceso,
        planta:          muestra.planta,
        parcela:         muestra.parcela ? `${muestra.parcela.nombre} (${muestra.parcela.codigo})` : null,
        rendimiento:     muestra.rendimiento,
        humedad:         muestra.humedad    != null ? String(muestra.humedad)    : null,
        base:            muestra.base       != null ? String(muestra.base)       : null,
        cantidadKg:      muestra.cantidadKg != null ? String(muestra.cantidadKg) : null,
        añoCosecha:      muestra.añoCosecha != null ? String(muestra.añoCosecha) : null,
        region:          muestra.region,
        pais:            muestra.pais,
      };

      const detalle = await muestrasService.getDetalle(muestra.id);

      const fecha  = new Date().toISOString().slice(0, 10);
      const folder = `${muestra.codigo}-${fecha}`;
      const zip    = new JSZip();
      const dir    = zip.folder(folder)!;

      // Física PDF
      dir.file('evaluacion-fisica.pdf', buildFisicaCafePdfDirect(pdfInfo, detalle.evaluacionFisica));

      // Sensorial PDF
      if (!esCacao) {
        // Priority: live state → API saved data → localStorage draft
        const scaData = sensorialLiveStateRef.current
          ?? (detalle.evaluacionSensorial as any)?.camposJson?.cafeSca
          ?? (() => {
            try {
              const raw = localStorage.getItem(`intipampa_cafe_cupping_${muestra.id}`);
              return raw ? JSON.parse(raw) : null;
            } catch { return null; }
          })();
        dir.file('evaluacion-sensorial.pdf', buildSensorialCafePdfDirect(pdfInfo, scaData));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a   = document.createElement('a');
      a.href     = url;
      a.download = `${folder}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[PDF] Error:', err);
      toast.error('Error al generar PDFs. Intenta de nuevo.');
    } finally {
      setDownloadingPdf(false);
    }
  }

  useEffect(() => {
    if (!esCacao) { setLoadingDetalle(false); return; }
    muestrasService.getDetalle(muestra.id).then((d) => {
      if (d.evaluacionSensorial) {
        const cj = (d.evaluacionSensorial as any).camposJson ?? {};
        setIictData({
          fecha:             cj.fecha,
          evaluador:         cj.evaluador,
          aroma:             cj.aroma,
          acidez:            cj.acidez,
          amargor:           cj.amargor,
          astringencia:      cj.astringencia,
          posgusto:          cj.posgusto,
          defectos:          cj.defectos,
          saborCalidad:      cj.saborCalidad,
          saborDescriptores: cj.saborDescriptores,
          puntosCatador:     cj.puntosCatador,
          comentarios:       cj.comentarios,
          puntajeTotal:      cj.puntajeTotal,
        });
      }
    }).finally(() => setLoadingDetalle(false));
  }, [muestra.id, esCacao]);

  async function handleGuardar() {
    setSaving(true);
    try {
      const data = iictDataRef.current;
      if (!data) { toast.error('Completa el formulario antes de guardar'); setSaving(false); return; }
      await muestrasService.upsertEvaluacionSensorial(muestra.id, {
        cacaoPuntajeTotal: data.puntajeTotal,
        fechaEvaluacion:   data.fecha,
        ...Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v])),
      } as any);
      await muestrasService.actualizarEstadoPorEvaluaciones(muestra.id);
      onGuardado();
      setSaveResult('success');
      setTimeout(() => { setSaveResult(null); onClose(); }, 2000);
    } catch {
      toast.error('Error al guardar. Intenta de nuevo.');
      setSaveResult('error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem', backgroundColor: 'rgba(0,0,0,0.6)',
      }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ width: '100%', maxWidth: '72rem', maxHeight: '94vh' }}>

        {saveResult && (
          <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
            <div className="rounded-2xl shadow-2xl overflow-hidden w-72">
              {saveResult === 'success' ? (
                <>
                  <div className="flex flex-col items-center gap-3 px-8 py-7" style={{ backgroundColor: '#1A2B23' }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(255,255,255,0.12)' }}>
                      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" stroke="#86efac"/>
                      </svg>
                    </div>
                    <p className="font-black text-white text-base text-center leading-tight">
                      Evaluación guardada
                    </p>
                    <p className="text-xs text-white/50 text-center">
                      {muestra.codigo} · {esCacao ? 'IICTE' : 'SCA'}
                    </p>
                  </div>
                  <div className="bg-white px-6 py-4 flex items-center justify-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-300 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    <p className="text-xs text-gray-400 font-medium">Cerrando…</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-3 px-8 py-7 bg-red-600">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-500">
                      <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" stroke="white"/>
                      </svg>
                    </div>
                    <p className="font-black text-white text-base text-center leading-tight">
                      Error al guardar
                    </p>
                    <p className="text-xs text-white/60 text-center">
                      Revisa tu conexión e intenta de nuevo
                    </p>
                  </div>
                  <div className="bg-white px-6 py-4 flex gap-2">
                    <button onClick={() => setSaveResult(null)}
                      className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                      Cerrar
                    </button>
                    <button onClick={() => { setSaveResult(null); tab === 'sensorial' && esCacao ? handleGuardar() : undefined; }}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
                      style={{ backgroundColor: '#1A2B23' }}>
                      Reintentar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0 gap-3">
          <div className="min-w-0">
            <h2 className="font-black text-gray-800 uppercase tracking-wide">Evaluaciones</h2>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {muestra.codigo} · {esCacao ? 'Cacao — IICTE' : 'Café — SCA'}
            </p>
          </div>

          <div className="flex rounded-xl border border-gray-200 overflow-hidden shrink-0 text-xs font-bold">
              {(['sensorial', 'fisica'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className="px-3 py-1.5 transition-colors capitalize"
                  style={{
                    backgroundColor: tab === t ? '#1A2B23' : '#ffffff',
                    color:           tab === t ? '#ffffff' : '#6B7280',
                  }}
                >
                  {t === 'sensorial' ? 'Sensorial' : 'Física'}
                </button>
              ))}
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {(saving || loadingDetalle || fisicaLoading || cafeSensorialLoading) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">
              {loadingDetalle || fisicaLoading ? 'Cargando…' : 'Guardando…'}
            </p>
          </div>
        )}

        <div className="overflow-y-auto flex-1 px-6 py-5">
          {tab === 'fisica' && esCacao && (
            <EvaluacionFisicaCacaoContent
              muestra={muestra}
              formId="fisica-eval-form"
              onSaved={() => { onGuardado(); setSaveResult('success'); setTimeout(() => { setSaveResult(null); onClose(); }, 2000); }}
              onSaveError={() => setSaveResult('error')}
              onSavingChange={setSaving}
              onLoadingChange={setFisicaLoading}
            />
          )}
          {tab === 'fisica' && !esCacao && (
            <EvaluacionFisicaContent
              muestra={muestra}
              formId="fisica-eval-form"
              onSaved={() => { onGuardado(); setSaveResult('success'); setTimeout(() => { setSaveResult(null); onClose(); }, 2000); }}
              onSaveError={() => setSaveResult('error')}
              onSavingChange={setSaving}
              onLoadingChange={setFisicaLoading}
            />
          )}

          
          {tab === 'sensorial' && !esCacao && (
            <EvaluacionSensorialCafeContent
              muestra={muestra}
              formId="cafe-sensorial-form"
              onSaved={() => { onGuardado(); setSaveResult('success'); setTimeout(() => { setSaveResult(null); onClose(); }, 2000); }}
              onSaveError={() => setSaveResult('error')}
              onSavingChange={setSaving}
              onLoadingChange={setCafeSensorialLoading}
              onFormStateChange={(state) => { sensorialLiveStateRef.current = state; }}
            />
          )}

          {tab === 'sensorial' && esCacao && !loadingDetalle && (
            <EvaluacionSensorialCacao
              initialData={iictData}
              onDataChange={(data) => {
                iictDataRef.current = data;
                setIictData(data);
              }}
            />
          )}

        </div>

        <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleDescargarPDF}
            disabled={downloadingPdf || saving || loadingDetalle}
            className="py-2.5 px-4 rounded-xl border text-sm font-semibold disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
            style={{ borderColor: '#283F34', color: '#283F34' }}
            title="Descargar ambas evaluaciones en PDF (ZIP)"
          >
            {downloadingPdf ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Generando…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                </svg>
                PDF
              </>
            )}
          </button>
          {tab === 'sensorial' && esCacao && (
            <button type="button" onClick={handleGuardar} disabled={saving || loadingDetalle}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: '#1A2B23' }}>
              {saving ? 'Guardando…' : `Guardar evaluación (${iictData.puntajeTotal ?? 0} pts)`}
            </button>
          )}
          {tab === 'sensorial' && !esCacao && (
            <button type="submit" form="cafe-sensorial-form" disabled={saving || cafeSensorialLoading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: '#1A2B23' }}>
              {saving ? 'Guardando…' : 'Guardar evaluación SCA'}
            </button>
          )}
          {tab === 'fisica' && (
            <button
              type="submit"
              form="fisica-eval-form"
              disabled={saving || fisicaLoading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
              style={{ backgroundColor: '#1A2B23' }}>
              {saving ? 'Guardando…' : 'Guardar evaluación física'}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}

interface MuestraFormModalProps {
  initial?: Muestra | null;
  campanas: Campana[];
  tiposProducto: TipoProducto[];
  onClose: () => void;
  onSave: (dto: CreateMuestraDto, id?: number) => Promise<void>;
}

const PLANTAS_STD = ['CB JAEN','CB LIMA','EXPOCAFÉ','KUSKA','MEGO','SELVA NORTE','AICASA','NORANDINO','NEGRISA'];

function MuestraFormModal({ initial, campanas, tiposProducto, onClose, onSave }: MuestraFormModalProps) {
  const [productores,       setProductores]       = useState<Productor[]>([]);
  const [plantaOtro,        setPlantaOtro]        = useState(() => {
    const p = initial?.planta;
    return !!p && !PLANTAS_STD.includes(p);
  });
  const [lotes,              setLotes]              = useState<Lote[]>([]);
  const [lotesFinalesPropios, setLotesFinalesPropios] = useState<LoteFinal[]>([]);
  const [lotesFinalesDisp,   setLotesFinalesDisp]   = useState<LoteFinal[]>([]);
  const [loadingLF,          setLoadingLF]          = useState(false);
  const [loadingSub,         setLoadingSub]         = useState(false);
  const [tipoProductoId, setTipoProductoId] = useState<number | undefined>(
    initial?.lote ? (lotes.find(l => l.id === initial.loteId)?.tipoProductoId) : undefined
  );

  const [form, setForm] = useState<CreateMuestraDto>({
    campanaId:       initial?.campanaId        ?? ('' as unknown as number),
    productorId:     initial?.productorId      ?? ('' as unknown as number),
    loteId:          initial?.loteId           ?? undefined,
    loteFinalId:     (initial as any)?.loteFinal?.id ?? undefined,
    tipoProducto:    initial?.tipoProducto     ?? undefined,
    rendimiento:     initial?.rendimiento      ?? '',
    humedad:         initial?.humedad          ?? '',
    base:            initial?.base             ?? '',
    variedad:        initial?.variedad         ?? '',
    proceso:         initial?.proceso          ?? '',
    planta:          initial?.planta           ?? '',
    cantidadKg:      initial?.cantidadKg       ?? undefined,
    fecha:           initial?.fecha            ?? '',
    categoriaMuestra: initial?.categoriaMuestra ?? '',
    tipoMuestra:     initial?.tipoMuestra      ?? undefined,
    estado:          initial?.estado           ?? 'pendiente',
    fechaCata:       initial?.fechaCata        ?? '',
    añoCosecha:      initial?.añoCosecha       ?? undefined,
    pais:            initial?.pais             ?? '',
    region:          initial?.region           ?? '',
    observaciones:   initial?.observaciones    ?? '',
    puntaje:         initial?.puntaje          ?? undefined,
  });

  const [saving,       setSaving]       = useState(false);
  const [cantidadUnit, setCantidadUnit] = useState<'kg' | 'g'>('kg');
  const toast = useToast();

  const cls  = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';
  const set  = <K extends keyof CreateMuestraDto>(k: K) =>
    (v: CreateMuestraDto[K]) => setForm((f) => ({ ...f, [k]: v }));

  
  const [calc, setCalc] = useState({ pergaminoKg: '', segundasKg: '', pajillaKg: '', cacaoRawKg: '', cascarillaKg: '' });

  const tipoNorm = ((form.tipoProducto ?? form.tipoMuestra) ?? '').toLowerCase();
  const calcEsCafe  = tipoNorm.includes('cafe');
  const calcEsCacao = tipoNorm.includes('cacao') && !tipoNorm.includes('cafe');

  const cafeCalc = (() => {
    const p = parseFloat(calc.pergaminoKg) || 0;
    const s = parseFloat(calc.segundasKg)  || 0;
    const j = parseFloat(calc.pajillaKg)   || 0;
    const exportable = Math.max(0, p - s - j);
    return { exportable, rendimiento: p > 0 ? (exportable / p) * 100 : 0, valid: p > 0 };
  })();

  const cacaoCalc = (() => {
    const r = parseFloat(calc.cacaoRawKg)   || 0;
    const k = parseFloat(calc.cascarillaKg) || 0;
    const nibs = Math.max(0, r - k);
    return { nibs, rendimiento: r > 0 ? (nibs / r) * 100 : 0, valid: r > 0 };
  })();

  useEffect(() => {
    if (calcEsCafe && cafeCalc.valid) {
      setForm(f => ({ ...f, rendimiento: cafeCalc.rendimiento.toFixed(2) }));
    } else if (calcEsCacao && cacaoCalc.valid) {
      setForm(f => ({ ...f, rendimiento: cacaoCalc.rendimiento.toFixed(2) }));
    }
  }, [calc, calcEsCafe, calcEsCacao]); 

  useEffect(() => {
    const cid = form.campanaId ? Number(form.campanaId) : undefined;
    if (!cid) {
      setProductores([]);
      setLotes([]);
      setLotesFinalesPropios([]);
      setForm(f => ({ ...f, productorId: '' as unknown as number, loteId: undefined, loteFinalId: undefined }));
      return;
    }
    setLoadingSub(true);
    productoresService.getPage(1, 200, cid)
      .then(ps => {
        setProductores(ps.data);
        setForm(f => ({
          ...f,
          productorId: ps.data.find(p => p.id === Number(f.productorId)) ? f.productorId : '' as unknown as number,
          loteId: undefined,
          loteFinalId: undefined,
        }));
      })
      .finally(() => setLoadingSub(false));
  }, [form.campanaId]);

  useEffect(() => {
    const cid = form.campanaId ? Number(form.campanaId) : undefined;
    const pid = form.productorId ? Number(form.productorId) : undefined;
    if (!cid || !pid) {
      setLotes([]);
      setLotesFinalesPropios([]);
      setForm(f => ({ ...f, loteId: undefined, loteFinalId: undefined }));
      return;
    }
    setLoadingSub(true);
    Promise.all([
      lotesService.getPage({ page: 1, limit: 200, campanaId: cid, productorId: pid }),
      lotesFinalesService.getPage({ campanaId: cid, productorId: pid, limit: 200 }),
    ]).then(([ls, lfs]) => {
      setLotes(ls.data);
      setLotesFinalesPropios(lfs.data);
      setForm(f => ({
        ...f,
        loteId:      ls.data.find(l  => l.id  === f.loteId)      ? f.loteId      : undefined,
        loteFinalId: lfs.data.find(lf => lf.id === f.loteFinalId) ? f.loteFinalId : undefined,
      }));
    }).finally(() => setLoadingSub(false));
  }, [form.campanaId, form.productorId]);

  useEffect(() => {
    if (!form.loteId) {
      setLotesFinalesDisp([]);
      setLoadingLF(false);
      return;
    }
    setLoadingLF(true);
    lotesFinalesService.getPage({ loteOrigenId: form.loteId, limit: 50 })
      .then(res => {
        setLotesFinalesDisp(res.data);
        if (res.data.length === 1) setForm(f => ({ ...f, loteFinalId: res.data[0].id }));
      })
      .catch(() => setLotesFinalesDisp([]))
      .finally(() => setLoadingLF(false));
  }, [form.loteId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.productorId || !form.campanaId) {
      toast.error('Campaña y Productor son requeridos');
      return;
    }
    setSaving(true);
    try {
      const loteEraPreexistente = !!form.loteId;
      let loteId = form.loteId ? Number(form.loteId) : undefined;

      if (!loteId && !initial?.id && tipoProductoId) {
        const nuevoLote = await lotesService.create({
          tipoProductoId,
          productorId: Number(form.productorId),
          campanaId:   form.campanaId ? Number(form.campanaId) : undefined,
          cantidadKg:  form.cantidadKg ? Number(form.cantidadKg) : 1,
        });
        loteId = nuevoLote.id;
      }

      await onSave({
        ...form,
        productorId: Number(form.productorId),
        campanaId:   Number(form.campanaId),
        ...(loteId              && { loteId                                        }),
        ...(form.loteFinalId    && { loteFinalId:  Number(form.loteFinalId)        }),
        ...(form.cantidadKg != null && { cantidadKg: Number(form.cantidadKg) }),
        ...(form.añoCosecha != null && { añoCosecha: Number(form.añoCosecha) }),
        ...(form.puntaje    != null && { puntaje:    Number(form.puntaje)    }),
        loteCreado: !loteEraPreexistente,
      }, initial?.id);
      onClose();
    } catch { toast.error('Error al guardar. Intenta de nuevo.'); }
    finally  { setSaving(false); }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-3xl max-h-[95dvh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-black text-gray-800 uppercase tracking-wide">
              {initial ? 'Editar muestra' : 'Nueva muestra'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Completa los campos para registrar la evaluación</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {saving && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl"
               style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">Guardando…</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full text-white text-[0.65rem] font-black flex items-center justify-center shrink-0" style={{ backgroundColor: '#1A2B23' }}>1</span>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Contexto de la muestra</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Campaña <span className="text-red-400">*</span></label>
                <select
                  value={form.campanaId ?? ''}
                  onChange={(e) => set('campanaId')(e.target.value ? Number(e.target.value) as unknown as number : '' as unknown as number)}
                  className={cls}
                >
                  <option value="">Seleccionar campaña…</option>
                  {campanas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Productor <span className="text-red-400">*</span></label>
                <select
                  value={form.productorId ?? ''}
                  onChange={(e) => set('productorId')(e.target.value ? Number(e.target.value) as unknown as number : '' as unknown as number)}
                  disabled={!form.campanaId || loadingSub}
                  className={`${cls} disabled:opacity-40`}
                >
                  <option value="">{!form.campanaId ? '← Elige campaña primero' : loadingSub ? 'Cargando…' : 'Seleccionar productor…'}</option>
                  {productores.map((p) => <option key={p.id} value={p.id}>{p.nombre} {p.apellido ?? ''}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Lote / Lote Final</label>
                {(() => {
                  const ESTADO_COLORS: Record<string, string> = {
                    PRE_ADQUISICION:  'bg-orange-100 text-orange-700 border-orange-200',
                    POST_ADQUISICION: 'bg-blue-100 text-blue-700 border-blue-200',
                    PRE_TRILLADO:     'bg-yellow-100 text-yellow-700 border-yellow-200',
                    POST_TRILLADO:    'bg-purple-100 text-purple-700 border-purple-200',
                    PREPARADO:        'bg-teal-100 text-teal-700 border-teal-200',
                    EMBARCADO:        'bg-indigo-100 text-indigo-700 border-indigo-200',
                    EXPORTADO:        'bg-green-100 text-green-700 border-green-200',
                  };
                  const ESTADO_LABELS: Record<string, string> = {
                    PRE_ADQUISICION:  'Pre Adquisición',
                    POST_ADQUISICION: 'Post Adquisición',
                    PRE_TRILLADO:     'Pre Alistado',
                    POST_TRILLADO:    'Post Alistado',
                    PREPARADO:        'Preparado',
                    EMBARCADO:        'Embarcado',
                    EXPORTADO:        'Exportado',
                    PENDIENTE_TRILLADO: 'Pendiente alistado',
                    TRILLADO:         'Alistado',
                    VENDIDO:          'Vendido',
                  };
                  const selectVal = form.loteId
                    ? `lote-${form.loteId}`
                    : form.loteFinalId && !form.loteId
                      ? `lf-${form.loteFinalId}`
                      : '';
                  const selectedLote = form.loteId ? lotes.find(l => l.id === form.loteId) : null;
                  const selectedLF   = (!form.loteId && form.loteFinalId) ? lotesFinalesPropios.find(lf => lf.id === form.loteFinalId) : null;

                  return (
                    <>
                      <select
                        value={selectVal}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (!val) {
                            setTipoProductoId(undefined);
                            setForm(f => ({ ...f, loteId: undefined, loteFinalId: undefined, estadoLote: undefined }));
                            return;
                          }
                          if (val.startsWith('lote-')) {
                            const loteId = Number(val.slice(5));
                            const lote   = lotes.find(l => l.id === loteId);
                            setTipoProductoId(lote?.tipoProductoId);
                            setForm(f => ({ ...f, loteId, loteFinalId: undefined, tipoMuestra: (lote?.tipoProducto?.tipo?.toLowerCase() as TipoMuestra | undefined) ?? f.tipoMuestra, estadoLote: lote?.estado ?? undefined }));
                          } else {
                            const lfId = Number(val.slice(3));
                            const lf   = lotesFinalesPropios.find(l => l.id === lfId);
                            setTipoProductoId(lf?.tipoProductoId);
                            setForm(f => ({ ...f, loteFinalId: lfId, loteId: undefined, tipoMuestra: (lf?.tipoProducto?.tipo?.toLowerCase() as TipoMuestra | undefined) ?? f.tipoMuestra, estadoLote: undefined }));
                          }
                        }}
                        disabled={!form.productorId || loadingSub}
                        className={`${cls} disabled:opacity-40`}
                      >
                        <option value="">{loadingSub ? 'Cargando…' : !form.productorId ? '← Elige productor primero' : 'Sin lote (opcional)'}</option>
                        {lotes.length > 0 && (
                          <optgroup label="— Lotes —">
                            {lotes.map(l => (
                              <option key={`lote-${l.id}`} value={`lote-${l.id}`}>
                                {l.codigo} · {(l.tipoProducto?.tipo ?? '').toUpperCase()} ({Number(l.cantidadKg).toFixed(1)} kg){l.variedad ? ` · ${l.variedad}` : ''}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        {lotesFinalesPropios.length > 0 && (
                          <optgroup label="— Lotes Finales —">
                            {lotesFinalesPropios.map(lf => (
                              <option key={`lf-${lf.id}`} value={`lf-${lf.id}`}>
                                {lf.codigo} · {(lf.tipoProducto?.tipo ?? '').toUpperCase()} ({Number(lf.cantidadKg).toFixed(1)} kg)
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                      {selectedLote && (
                        <p className="mt-1.5 text-xs text-gray-500">
                          Estado:{' '}
                          <span className={`inline-block px-2 py-0.5 rounded-full border text-[0.65rem] font-bold ${ESTADO_COLORS[selectedLote.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                            {ESTADO_LABELS[selectedLote.estado] ?? selectedLote.estado}
                          </span>
                        </p>
                      )}
                      {selectedLF && (
                        <p className="mt-1.5 text-xs text-gray-500">
                          Estado:{' '}
                          <span className={`inline-block px-2 py-0.5 rounded-full border text-[0.65rem] font-bold ${ESTADO_COLORS[selectedLF.estado] ?? 'bg-gray-100 text-gray-600'}`}>
                            {ESTADO_LABELS[selectedLF.estado] ?? selectedLF.estado}
                          </span>
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {form.loteId && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Sub-lote de la muestra
                  </p>
                  {form.loteFinalId && (
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, loteFinalId: undefined }))}
                      className="text-[0.6rem] text-gray-400 hover:text-red-500 underline underline-offset-2"
                    >
                      × Quitar selección
                    </button>
                  )}
                </div>

                {loadingLF ? (
                  <p className="text-xs text-gray-400 italic">Cargando sub-lotes…</p>
                ) : lotesFinalesDisp.length === 0 ? (
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <span className="inline-block px-2 py-0.5 rounded-full border text-[0.65rem] font-bold bg-gray-100 text-gray-500 border-gray-200">
                      Muestra directa del lote
                    </span>
                    <span className="text-gray-400">· sin división registrada</span>
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {lotesFinalesDisp.map(lf => {
                      const selected = form.loteFinalId === lf.id;
                      const ESTADO_COLOR: Record<string, string> = {
                        PENDIENTE_TRILLADO: 'bg-orange-100 text-orange-700 border-orange-200',
                        TRILLADO:           'bg-green-100 text-green-700 border-green-200',
                      };
                      const ESTADO_LABEL: Record<string, string> = {
                        PENDIENTE_TRILLADO: 'Pendiente alistado',
                        TRILLADO:           'Alistado',
                      };
                      const ORIGEN_LABEL: Record<string, string> = {
                        DIVISION: 'División', MEZCLA: 'Mezcla', DIRECTO: 'Directo',
                      };
                      return (
                        <button
                          key={lf.id}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, loteFinalId: selected ? undefined : lf.id }))}
                          className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                            selected
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selected ? 'border-green-500 bg-green-500' : 'border-gray-300 bg-white'}`}>
                                {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-800">{lf.codigo}</p>
                                <p className="text-xs text-gray-400">{ORIGEN_LABEL[lf.tipoOrigen] ?? lf.tipoOrigen} · {Number(lf.cantidadKg).toFixed(2)} kg</p>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full border text-[0.65rem] font-bold shrink-0 ${ESTADO_COLOR[lf.estado] ?? 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                              {ESTADO_LABEL[lf.estado] ?? lf.estado}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {!form.loteId && (
              <div className="max-w-xs">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Tipo de producto</label>
                <select
                  value={form.tipoMuestra ?? ''}
                  onChange={(e) => {
                    const tm = (e.target.value as TipoMuestra) || undefined;
                    const tp = tiposProducto.find(t => t.tipo === tm?.toUpperCase());
                    setTipoProductoId(tp?.id);
                    setForm(f => ({ ...f, tipoMuestra: tm }));
                  }}
                  className={cls}
                >
                  <option value="">Sin especificar</option>
                  <option value="cafe">Café</option>
                  <option value="cacao">Cacao</option>
                </select>
              </div>
            )}

            {form.tipoMuestra && (
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                form.tipoMuestra === 'cafe'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-purple-100 text-purple-800 border border-purple-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${form.tipoMuestra === 'cafe' ? 'bg-amber-500' : 'bg-purple-500'}`} />
                {form.tipoMuestra === 'cafe' ? 'CAFÉ — se evaluará con protocolo SCA' : 'CACAO — se evaluará con protocolo IICTE / Cut Test'}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full text-white text-[0.65rem] font-black flex items-center justify-center shrink-0" style={{ backgroundColor: '#1A2B23' }}>2</span>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Datos de la muestra</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Fecha de Muestreo</label>
                <input type="date" value={form.fecha ?? ''} onChange={(e) => set('fecha')(e.target.value || undefined)} className={cls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Fecha de cata</label>
                <input type="date" value={form.fechaCata ?? ''} onChange={(e) => set('fechaCata')(e.target.value || undefined)} className={cls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Cantidad
                  <span className="ml-1 text-gray-400 font-normal normal-case">({cantidadUnit})</span>
                </label>
                <div className="flex gap-1">
                  <input
                    type="number" min={0} step={cantidadUnit === 'kg' ? 0.01 : 1}
                    value={
                      form.cantidadKg != null
                        ? cantidadUnit === 'g'
                          ? Number((form.cantidadKg * 1000).toFixed(0))
                          : form.cantidadKg
                        : ''
                    }
                    onChange={(e) => {
                      const raw = e.target.value ? Number(e.target.value) : undefined;
                      set('cantidadKg')(raw != null ? (cantidadUnit === 'g' ? raw / 1000 : raw) : undefined);
                    }}
                    className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={cantidadUnit === 'kg' ? '0.00' : '0'}
                  />
                  <div className="flex rounded-xl border border-gray-200 overflow-hidden shrink-0 text-xs font-bold">
                    {(['kg', 'g'] as const).map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setCantidadUnit(u)}
                        className="px-2.5 py-2 transition-colors"
                        style={{
                          backgroundColor: cantidadUnit === u ? '#1A2B23' : '#ffffff',
                          color: cantidadUnit === u ? '#ffffff' : '#6B7280',
                        }}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Año cosecha</label>
                <input
                  type="number"
                  min={2000}
                  max={2100}
                  step={1}
                  value={form.añoCosecha ?? ''}
                  onChange={(e) => {
                    const year = e.target.value ? parseInt(e.target.value, 10) : undefined;
                    set('añoCosecha')(year);
                  }}
                  placeholder="2026"
                  className={cls}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Tipo de muestra</label>
              <input value={form.categoriaMuestra ?? ''} onChange={(e) => set('categoriaMuestra')(e.target.value)}
                className={cls} placeholder="Ej: Pergamino, Verde, Tostado…" />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full text-white text-[0.65rem] font-black flex items-center justify-center shrink-0" style={{ backgroundColor: '#1A2B23' }}>3</span>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Características del producto</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Variedad</label>
                <select value={form.variedad ?? ''} onChange={(e) => set('variedad')(e.target.value)} className={cls}>
                  <option value="">Seleccionar…</option>
                  {(calcEsCacao ? VARIEDADES_CACAO : VARIEDADES_CAFE).map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Proceso</label>
                <select value={form.proceso ?? ''} onChange={(e) => set('proceso')(e.target.value)} className={cls}>
                  <option value="">Sin proceso</option>
                  {['PROCESO','LAVADO','HONEY','NATURAL','ASD','DOBLE FERMENTO','FERMENTACIÓN PROLONGADO','CAJONES FERMENTADORES','EXPERIMENTAL','OTRO'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Planta</label>
                <select
                  value={plantaOtro ? 'OTRO' : (form.planta ?? '')}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === 'OTRO') { setPlantaOtro(true); set('planta')(undefined as any); }
                    else { setPlantaOtro(false); set('planta')(v || undefined as any); }
                  }}
                  className={cls}
                >
                  <option value="">Sin planta</option>
                  {PLANTAS_STD.map(p => <option key={p} value={p}>{p}</option>)}
                  <option value="OTRO">OTRO</option>
                </select>
                {plantaOtro && (
                  <input
                    value={form.planta ?? ''}
                    onChange={(e) => set('planta')(e.target.value)}
                    className={`${cls} mt-1`}
                    placeholder="Especificar planta…"
                    autoFocus
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Humedad %</label>
                <input type="number" min={0} max={100} step={0.1} value={form.humedad ?? ''}
                  onChange={(e) => set('humedad')(e.target.value)} className={cls} placeholder="11.5" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Rendimiento %{(calcEsCafe || calcEsCacao) && <span className="ml-1 text-[0.6rem] text-gray-400 font-normal normal-case">(auto)</span>}
                </label>
                <input
                  type="number" min={0} max={100} step={0.1}
                  value={form.rendimiento ?? ''}
                  onChange={(e) => set('rendimiento')(e.target.value)}
                  readOnly={calcEsCafe || calcEsCacao}
                  className={`${cls} ${(calcEsCafe || calcEsCacao) ? 'bg-gray-50 text-red-600 font-bold cursor-default' : ''}`}
                  placeholder="78"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Base</label>
                <input value={form.base ?? ''} onChange={(e) => set('base')(e.target.value)} className={cls} placeholder="Ej: SCA 2020" />
              </div>
            </div>
          </div>

          {(calcEsCafe || calcEsCacao) && (
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Calculadora — {calcEsCafe ? 'Café (pergamino)' : 'Cacao'}
              </p>

              {calcEsCafe ? (
                <div className={`rounded-xl border p-4 space-y-3`} style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
                  <div className="grid grid-cols-3 gap-3">
                    {([['pergaminoKg', 'Pergamino KG'], ['segundasKg', 'Segundas KG'], ['pajillaKg', 'Pajilla KG']] as const).map(([key, label]) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{label}</label>
                        <input
                          type="number" min={0} step={0.01}
                          value={calc[key]}
                          onChange={e => setCalc(c => ({ ...c, [key]: e.target.value }))}
                          className={cls}
                          placeholder="0.00"
                        />
                      </div>
                    ))}
                  </div>
                  {cafeCalc.valid && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-amber-200">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Café exportable KG</label>
                        <input readOnly value={cafeCalc.exportable.toFixed(2)} className={`${cls} bg-white text-gray-700 cursor-default`} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-red-600 uppercase tracking-wide mb-1">Rendimiento %</label>
                        <div className={`${cls} bg-white text-red-600 font-black text-center text-base cursor-default`}>
                          {cafeCalc.rendimiento.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }}>
                  <div className="grid grid-cols-2 gap-3">
                    {([['cacaoRawKg', 'Cacao Raw G'], ['cascarillaKg', 'Cascarilla G']] as const).map(([key, label]) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">{label}</label>
                        <input
                          type="number" min={0} step={0.01}
                          value={calc[key]}
                          onChange={e => setCalc(c => ({ ...c, [key]: e.target.value }))}
                          className={cls}
                          placeholder="0.00"
                        />
                      </div>
                    ))}
                  </div>
                  {cacaoCalc.valid && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-200">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Nibs de Cacao G</label>
                        <input readOnly value={cacaoCalc.nibs.toFixed(2)} className={`${cls} bg-white text-gray-700 cursor-default`} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-red-600 uppercase tracking-wide mb-1">Rendimiento %</label>
                        <div className={`${cls} bg-white text-red-600 font-black text-center text-base cursor-default`}>
                          {cacaoCalc.rendimiento.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-gray-100">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Observaciones</label>
            <textarea value={form.observaciones ?? ''} onChange={(e) => set('observaciones')(e.target.value || undefined)}
              rows={2} className={`${cls} resize-none`} placeholder="Notas adicionales sobre la muestra…" />
          </div>

          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: saving ? '#9ca3af' : '#1A2B23' }}>
              {saving ? 'Guardando…' : initial ? 'Actualizar muestra' : 'Crear muestra'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EliminarModal({ muestra, onClose, onConfirm }: { muestra: Muestra; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        {loading && <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(2px)' }}><LoadingLogo compact /></div>}
        <h3 className="font-bold text-gray-800 mb-2">Eliminar muestra</h3>
        <p className="text-sm text-gray-500 mb-5">¿Eliminar <span className="font-semibold text-gray-700">"{muestra.codigo}"</span>? Esta acción no se puede deshacer.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
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

function CardBtn({ label, color, title, onClick, icon }: {
  label: string; color: string; title: string; onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className="flex flex-col items-center gap-1 group min-w-0"
    >
      <span
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-opacity group-hover:opacity-80 active:scale-95"
        style={{ backgroundColor: color }}
      >
        {icon}
      </span>
      <span className="hidden sm:block text-[0.55rem] text-gray-400 font-medium leading-none">{label}</span>
    </button>
  );
}

interface CardProps {
  muestra:        Muestra;
  onEvaluaciones: () => void;
  onEditar:       () => void;
  onEliminar:     () => void;
  onAdquirir?:    () => void;
}

function AdquirirModal({
  loteRef,
  onClose,
  onConfirm,
}: {
  loteRef: { id: number; codigo: string };
  onClose: () => void;
  onConfirm: (dto: Partial<CreateLoteDto> & { estado: LoteEstado }) => Promise<void>;
}) {
  const [lote,   setLote]   = useState<Lote | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const toast = useToast();

  const [form, setForm] = useState({
    cantidadKg:       '',
    cantidadSacos:    '',
    fechaAdquisicion: '',
    variedad:         '',
    planta:           '',
    observaciones:    '',
  });

  const cls = 'w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500';

  useEffect(() => {
    lotesService.getOne(loteRef.id).then((l) => {
      setLote(l);
      setForm({
        cantidadKg:       l.cantidadKg != null ? String(l.cantidadKg) : '',
        cantidadSacos:    l.cantidadSacos != null ? String(l.cantidadSacos) : '',
        fechaAdquisicion: l.fechaAdquisicion ?? '',
        variedad:         l.variedad ?? '',
        planta:           l.planta ?? '',
        observaciones:    l.observaciones ?? '',
      });
      setLoading(false);
    }).catch(() => { toast.error('Error al cargar datos del lote'); setLoading(false); });
  }, [loteRef.id]);

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    const kg = parseFloat(form.cantidadKg);
    if (!kg || kg <= 0) { toast.error('La cantidad (kg) es requerida y debe ser mayor a 0'); return; }
    setSaving(true);
    try {
      await onConfirm({
        estado:           'POST_ADQUISICION',
        cantidadKg:       kg,
        cantidadSacos:    form.cantidadSacos    ? Number(form.cantidadSacos)    : undefined,
        fechaAdquisicion: form.fechaAdquisicion || undefined,
        variedad:         form.variedad         || undefined,
        planta:           form.planta           || undefined,
        observaciones:    form.observaciones    || undefined,
      });
    } catch { toast.error('Error al guardar'); setSaving(false); }
  }

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-lg max-h-[92dvh] flex flex-col">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="font-black text-gray-800 uppercase tracking-wide">Acopio</h3>
            <p className="text-xs text-gray-400 mt-0.5">Lote <span className="font-semibold text-gray-600">{loteRef.codigo}</span> — confirma datos de ingreso al almacén</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {(loading || saving) && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-2xl" style={{ backgroundColor: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo compact />
            <p className="text-sm font-semibold text-gray-600">{saving ? 'Guardando…' : 'Cargando…'}</p>
          </div>
        )}

        <form onSubmit={handleConfirm} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {lote && (
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-500 space-y-1">
              <p><span className="font-semibold text-gray-700">Código:</span> {lote.codigo}</p>
              <p><span className="font-semibold text-gray-700">Tipo:</span> {lote.tipoProducto?.tipo ?? `#${lote.tipoProductoId}`}</p>
              {lote.productor && <p><span className="font-semibold text-gray-700">Productor:</span> {lote.productor.nombre} {lote.productor.apellido ?? ''}</p>}
              {lote.campana   && <p><span className="font-semibold text-gray-700">Campaña:</span> {lote.campana.nombre}</p>}
              {lote.parcela   && <p><span className="font-semibold text-gray-700">Parcela:</span> {lote.parcela.nombre}</p>}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">
                Cantidad kg <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number" min="0.001" step="0.001"
                  value={form.cantidadKg}
                  onChange={(e) => { setForm(f => ({ ...f, cantidadKg: e.target.value })); }}
                  placeholder="0.000" autoFocus
                  className={`${cls} pr-9`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">kg</span>
              </div>
            </div>
            <div>
              <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Sacos (ref.)</label>
              <input type="number" min="0" value={form.cantidadSacos} onChange={(e) => setForm(f => ({ ...f, cantidadSacos: e.target.value }))} className={cls} />
            </div>
          </div>

          <div>
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Fecha adquisición</label>
            <input type="date" value={form.fechaAdquisicion} onChange={(e) => setForm(f => ({ ...f, fechaAdquisicion: e.target.value }))} className={cls} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Variedad</label>
              <select value={form.variedad} onChange={(e) => setForm(f => ({ ...f, variedad: e.target.value }))} className={cls}>
                <option value="">Sin variedad</option>
                {(lote?.tipoProducto?.tipo === 'CACAO' ? VARIEDADES_CACAO : VARIEDADES_CAFE).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Planta</label>
              <select value={form.planta} onChange={(e) => setForm(f => ({ ...f, planta: e.target.value }))} className={cls}>
                <option value="">Sin planta</option>
                {['CB JAEN','CB LIMA','EXPOCAFÉ','KUSKA','MEGO','SELVA NORTE','AICASA','NORANDINO','NEGRISA'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Observaciones</label>
            <textarea rows={2} value={form.observaciones} onChange={(e) => setForm(f => ({ ...f, observaciones: e.target.value }))} className={`${cls} resize-none`} />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancelar</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: saving ? '#9ca3af' : '#1A2B23' }}>
              {saving ? 'Guardando…' : 'Confirmar adquisición'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MuestraCard({ muestra, onEvaluaciones, onEditar, onEliminar, onAdquirir }: CardProps) {
  const esCacao = (muestra as any).loteFinal?.tipoProductoId === 2
    || (muestra as any).lote?.tipoProducto?.tipo === 'CACAO'
    || muestra.tipoMuestra === 'cacao'
    || muestra.tipoProducto === 'cacao';
  const nombreProductor = muestra.productor
    ? `${muestra.productor.nombre} ${muestra.productor.apellido ?? ''}`.trim().toUpperCase()
    : `PRODUCTOR #${muestra.productorId}`;
  const fechaFormateada = muestra.fecha
    ? new Date(muestra.fecha + 'T00:00:00')
        .toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })
        .toUpperCase()
    : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
      <div className="p-4 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="font-black text-gray-800 text-xs uppercase tracking-wide leading-tight">
              {muestra.codigo} — {nombreProductor}
            </p>
            {muestra.lote && (
              <span className="inline-flex items-center gap-1 text-[0.65rem] font-bold text-white px-2 py-0.5 rounded-md w-fit"
                style={{ backgroundColor: muestra.lote.estado === 'PRE_ADQUISICION' ? '#B45309' : '#283F34' }}>
                <svg className="w-2.5 h-2.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                </svg>
                {muestra.lote.codigo}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {(() => {
              const tieneAmbas = muestra.puntajeFisico != null && muestra.puntajeSensorial != null;
              const badge = tieneAmbas ? 'en_proceso' : 'pendiente';
              return (
                <span className={`text-[0.6rem] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap ${ESTADO_BADGE[badge]}`}>
                  {ESTADO_LABEL[badge]}
                </span>
              );
            })()}
            {muestra.puntajeFisico != null && (
              <span className="text-[0.62rem] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                Física: {Number(muestra.puntajeFisico).toFixed(1)} pts
              </span>
            )}
            {muestra.puntajeSensorial != null && (
              <span className="text-[0.62rem] font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full whitespace-nowrap">
                {esCacao ? 'IICTE' : 'SCA'}: {Number(muestra.puntajeSensorial).toFixed(1)} pts
              </span>
            )}
            {muestra.puntajeFisico == null && muestra.puntajeSensorial == null && (
              <span className="text-[0.6rem] text-gray-400 whitespace-nowrap">sin puntaje</span>
            )}
          </div>
        </div>

        {muestra._pendiente && (
          <span className="inline-flex items-center gap-1 text-[0.6rem] font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Pendiente de sync
          </span>
        )}

        {fechaFormateada && <p className="text-xs text-gray-500 font-medium">{fechaFormateada}</p>}

        <div className="space-y-0.5">
          <p className="text-[0.7rem] text-gray-400">
            Campaña: <span className="text-gray-600 font-semibold">{muestra.campana?.nombre ?? `#${muestra.campanaId}`}</span>
          </p>
          {esCacao !== undefined && (
            <p className="text-[0.7rem] text-gray-400">
              Tipo: <span className="text-gray-600 font-semibold uppercase">{esCacao ? 'CACAO' : 'CAFÉ'}</span>
            </p>
          )}
          {muestra.variedad && (
            <p className="text-[0.7rem] text-gray-400">
              Variedad: <span className="text-gray-600 font-semibold">{muestra.variedad}</span>
            </p>
          )}
          {muestra.proceso && (
            <p className="text-[0.7rem] text-gray-400">
              Proceso: <span className="text-gray-600 font-semibold">{muestra.proceso}</span>
            </p>
          )}
          {muestra.lote?.estado === 'PRE_ADQUISICION' && onAdquirir && (
            <button
              onClick={onAdquirir}
              className="mt-1 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[0.65rem] font-bold text-white uppercase tracking-wide hover:opacity-90 active:scale-[0.97] transition-all"
              style={{ backgroundColor: '#283F34' }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              ACOPIO
            </button>
          )}
          {muestra.parcela && (
            <p className="text-[0.7rem] text-gray-400">
              Parcela: <span className="text-gray-600 font-semibold">{muestra.parcela.nombre}</span>
              {muestra.parcela.codigo && (
                <span className="text-gray-400 font-mono ml-1">({muestra.parcela.codigo})</span>
              )}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-50 px-3 py-3 flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
        <CardBtn
          label="evaluaciones"
          color="#f97316"
          title="Abrir evaluaciones"
          onClick={onEvaluaciones}
          icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
        />
        <CardBtn
          label="editar"
          color="#eab308"
          title="Editar muestra"
          onClick={onEditar}
          icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"/></svg>}
        />
        <CardBtn
          label="eliminar"
          color="#ef4444"
          title="Eliminar muestra"
          onClick={onEliminar}
          icon={<svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>}
        />
      </div>
    </div>
  );
}

function ProximamenteToast({ onDismiss }: { onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2800);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-gray-800 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-fade-in">
      <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      Exportación PDF individual — próximamente
    </div>
  );
}

type ModalType = 'create' | 'edit' | 'delete' | 'evaluaciones' | 'exportar' | 'importar' | 'adquirir' | null;

export function MuestrasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user }                    = useAuth();
  const { isOffline, justReconnected } = useNetworkStatus();
  const isAdmin                     = user?.role === 'admin';

  
  const [filterCampanaId,   setFilterCampanaId]   = useState(searchParams.get('campanaId')  ?? '');
  const [filterProductorId, setFilterProductorId] = useState(searchParams.get('productorId') ?? '');
  const [filterLote,        setFilterLote]        = useState(searchParams.get('lote')       ?? '');
  const [filterEstado,      setFilterEstado]      = useState<EstadoMuestra | ''>(searchParams.get('estado') as EstadoMuestra ?? '');
  const [filterTipo,        setFilterTipo]        = useState<TipoMuestra | ''>(searchParams.get('tipo') as TipoMuestra ?? '');
  const [filterFechaDesde]  = useState(searchParams.get('fechaDesde') ?? '');
  const [filterFechaHasta]  = useState(searchParams.get('fechaHasta') ?? '');
  const [filterEstadoLote,  setFilterEstadoLote]  = useState(searchParams.get('estadoLote') ?? '');
  const [filterVariedad,    setFilterVariedad]    = useState(searchParams.get('variedad')   ?? '');

  
  const [campanas,      setCampanas]      = useState<Campana[]>([]);
  const [productores,   setProductores]   = useState<Productor[]>([]);
  const [lotes,         setLotes]         = useState<Lote[]>([]);
  const [tiposProducto, setTiposProducto] = useState<TipoProducto[]>([]);
  const [loadingOpts,   setLoadingOpts]   = useState(true);

  
  const [muestras, setMuestras] = useState<Muestra[]>([]);
  const [meta, setMeta]         = useState<PaginationMeta>({ total: 0, page: 1, lastPage: 1, limit: 12 });
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(Number(searchParams.get('page') ?? '1'));

  
  const [modal,    setModal]    = useState<ModalType>(null);
  const [selected, setSelected] = useState<Muestra | null>(null);
  const [showProximamente, setShowProximamente] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  
  useEffect(() => {
    const params: Record<string, string> = {};
    if (filterCampanaId)   params.campanaId   = filterCampanaId;
    if (filterProductorId) params.productorId = filterProductorId;
    if (filterLote)        params.lote        = filterLote;
    if (filterEstado)      params.estado      = filterEstado;
    if (filterTipo)        params.tipo        = filterTipo;
    if (filterFechaDesde)  params.fechaDesde  = filterFechaDesde;
    if (filterFechaHasta)  params.fechaHasta  = filterFechaHasta;
    if (filterEstadoLote)  params.estadoLote  = filterEstadoLote;
    if (filterVariedad)    params.variedad    = filterVariedad;
    if (page > 1)          params.page        = String(page);
    setSearchParams(params, { replace: true });
  }, [filterCampanaId, filterProductorId, filterLote, filterEstado, filterTipo, filterFechaDesde, filterFechaHasta, filterEstadoLote, filterVariedad, page]); 

  
  useEffect(() => {
    setLoadingOpts(true);
    Promise.all([
      campanasService.getPage(1, 100),
      productoresService.getPage(
        1, 100,
        filterCampanaId ? Number(filterCampanaId) : undefined,
      ),
      lotesService.getPage({
        page: 1, limit: 100,
        ...(filterCampanaId && { campanaId: Number(filterCampanaId) }),
      }),
      tiposProductoService.getAll(),
    ]).then(([cs, ps, ls, tps]) => {
      setCampanas(cs.data);
      setProductores(ps.data);
      setLotes(ls.data);
      setTiposProducto(tps);
    }).finally(() => setLoadingOpts(false));
  }, [filterCampanaId]);

  
  const buildFilter = useCallback((): FilterMuestrasDto => ({
    page, limit: 12,
    ...(filterCampanaId   && { campanaId:   Number(filterCampanaId)   }),
    ...(filterProductorId && { productorId: Number(filterProductorId) }),
    ...(filterLote        && { search:      filterLote               }),
    ...(filterEstado      && { estado:      filterEstado             }),
    ...(filterTipo        && { tipoMuestra: filterTipo               }),
    ...(filterFechaDesde  && { fechaDesde:  filterFechaDesde         }),
    ...(filterFechaHasta  && { fechaHasta:  filterFechaHasta         }),
    ...(filterEstadoLote  && { estadoLote:  filterEstadoLote         }),
    ...(filterVariedad    && { variedad:    filterVariedad           }),
  }), [page, filterCampanaId, filterProductorId, filterLote, filterEstado, filterTipo, filterFechaDesde, filterFechaHasta, filterEstadoLote, filterVariedad]);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await muestrasService.getPage(buildFilter());
    setMuestras(result.data);
    setMeta(result.meta);
    setLoading(false);
  }, [buildFilter]);

  useEffect(() => { load(); }, [load]);

  
  useEffect(() => {
    if (!justReconnected) return;
    syncService.flush().then(({ ok }) => {
      if (ok > 0) {
        setSyncDone(true);
        load();
        setTimeout(() => setSyncDone(false), 4000);
      } else {
        load(); 
      }
    });
  }, [justReconnected]); 

  

  function changeFilter<T>(setter: (v: T) => void) {
    return (v: T) => { setter(v); setPage(1); };
  }

  async function handleSave(dto: CreateMuestraDto, id?: number) {
    if (id) await muestrasService.update(id, dto);
    else    await muestrasService.create(dto);
    await load();
  }

  async function handleDelete() {
    if (!selected) return;
    await muestrasService.remove(selected.id);
    setModal(null); setSelected(null);
    await load();
  }

  async function handleAdquirir(muestra: Muestra) {
    if (!muestra.lote) return;
    setSelected(muestra);
    setModal('adquirir');
  }

  async function confirmarAdquisicion(dto: Partial<CreateLoteDto> & { estado: LoteEstado }) {
    if (!selected?.lote) return;
    await lotesService.update(selected.lote.id, dto);
    setModal(null);
    setSelected(null);
    await load();
  }

  function handleExportarIndividual() {
    
    setShowProximamente(true);
  }

  function handleBuscar() {
    setPage(1);
    load();
  }

  return (
    <div className="min-h-full bg-white flex flex-col">
      <div className="px-4 md:px-8 pt-6 pb-3">
        <h1 className="font-headline text-2xl sm:text-3xl font-black uppercase tracking-wide text-gray-800" style={{ letterSpacing: '0.05em' }}>
          Muestras
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Registro y evaluación de muestras de café y cacao
        </p>
      </div>

      <div className="px-4 md:px-8 py-4 bg-white border-b border-gray-100">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto] gap-3 items-end">

          <div>
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Campaña</label>
            <select
              value={filterCampanaId}
              onChange={(e) => changeFilter(setFilterCampanaId)(e.target.value)}
              disabled={loadingOpts}
              className="w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              aria-label="Filtrar por campaña"
            >
              <option value="">Todas las campañas</option>
              {campanas.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Lote</label>
            <select
              value={filterLote}
              onChange={(e) => changeFilter(setFilterLote)(e.target.value)}
              disabled={loadingOpts}
              className="w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              aria-label="Filtrar por lote"
            >
              <option value="">Todos los lotes</option>
              {lotes.map((l) => (
                <option key={l.id} value={l.codigo}>{l.codigo}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Productor / Razón Social</label>
            <div className="flex gap-2">
              <select
                value={filterProductorId}
                onChange={(e) => changeFilter(setFilterProductorId)(e.target.value)}
                disabled={loadingOpts}
                className="flex-1 min-w-0 border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                aria-label="Filtrar por productor"
              >
                <option value="">Todos los productores</option>
                {productores.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre} {p.apellido ?? ''}</option>
                ))}
              </select>
              <button
                onClick={handleBuscar}
                aria-label="Buscar muestras"
                className="w-10 h-10 shrink-0 rounded-xl bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35"/></svg>
              </button>
            </div>
          </div>

          <div className="hidden lg:block" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div>
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Estado de lote</label>
            <select
              value={filterEstadoLote}
              onChange={(e) => changeFilter(setFilterEstadoLote)(e.target.value)}
              className="w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Filtrar por estado de lote"
            >
              <option value="">Todos los lotes</option>
              <option value="PRE_ADQUISICION">Pre-Adquisición</option>
              <option value="POST_ADQUISICION">Post-Adquisición</option>
            </select>
          </div>
          <div>
            <label className="block text-[0.65rem] font-bold text-gray-600 uppercase tracking-wider mb-1">Variedad</label>
            <input
              value={filterVariedad}
              onChange={(e) => changeFilter(setFilterVariedad)(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              className="w-full border border-gray-300 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Variedad…"
              aria-label="Filtrar por variedad"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">

          <div className="flex flex-wrap gap-1.5">
            {(['', 'pendiente', 'en_proceso'] as const).map((s) => (
              <button
                key={s}
                onClick={() => changeFilter(setFilterEstado)(s as EstadoMuestra | '')}
                className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold border transition-all ${
                  filterEstado === s
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-500 border-gray-300 hover:border-gray-500'
                }`}
                style={filterEstado === s ? { backgroundColor: '#283F34' } : {}}
              >
                {s === '' ? 'Todos' : ESTADO_LABEL[s as EstadoMuestra]}
              </button>
            ))}
            <div className="w-px bg-gray-300 self-stretch" />
            {(['cafe', 'cacao'] as const).map((t) => (
              <button
                key={t}
                onClick={() => changeFilter(setFilterTipo)(filterTipo === t ? '' : t)}
                className={`px-2.5 py-1 rounded-full text-[0.65rem] font-semibold border transition-all ${
                  filterTipo === t
                    ? 'text-white border-transparent'
                    : 'bg-white text-gray-500 border-gray-300 hover:border-gray-500'
                }`}
                style={filterTipo === t ? { backgroundColor: '#283F34' } : {}}
              >
                {t === 'cafe' ? 'CAFE' : 'CACAO'}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 sm:shrink-0">
            {isAdmin && (
              <button
                onClick={() => setModal('exportar')}
                aria-label="Exportar muestras a Excel"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white uppercase tracking-wide hover:opacity-90 active:scale-[0.98] transition-all"
                style={{ backgroundColor: '#2d5a3d' }}
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                Exportar
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setModal('importar')}
                aria-label="Importar muestras desde Excel"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white uppercase tracking-wide hover:opacity-90 active:scale-[0.98] transition-all"
                style={{ backgroundColor: '#3d6b4f' }}
              >
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4-4m4 4H3"/></svg>
                Importar
              </button>
            )}
            <button
              onClick={() => { setSelected(null); setModal('create'); }}
              aria-label="Agregar nueva muestra"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white uppercase tracking-wide hover:opacity-90 active:scale-[0.98] transition-all"
              style={{ backgroundColor: '#1A2B23' }}
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              Agregar muestra
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex-1 px-4 md:px-8 py-6">
        {isOffline && (
          <div className="mb-4 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shrink-0" />
            <span>
              <strong>Sin conexión</strong> — mostrando datos en caché.
              Los cambios se sincronizarán al reconectar.
            </span>
          </div>
        )}

        {justReconnected && !syncDone && (
          <div className="mb-4 text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-blue-500 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Conexión restaurada — sincronizando cambios pendientes…
          </div>
        )}

        {syncDone && (
          <div className="mb-4 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
            Sincronización completada — datos actualizados.
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: 'rgba(249,250,251,0.9)', backdropFilter: 'blur(2px)' }}>
            <LoadingLogo />
          </div>
        )}

        {!loading && muestras.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <svg className="w-14 h-14 mb-3 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path d="M17 8h1a4 4 0 010 8h-1"/><path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/>
              <line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/>
            </svg>
            <p className="text-sm font-semibold">Sin muestras registradas</p>
            <p className="text-xs mt-1">Usa "Agregar muestra" para crear la primera</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {muestras.map((m) => (
                <MuestraCard
                  key={m.id}
                  muestra={m}
                  onEvaluaciones={() => { setSelected(m); setModal('evaluaciones'); }}
                  onEditar={()       => { setSelected(m); setModal('edit'); }}
                  onEliminar={()     => { setSelected(m); setModal('delete'); }}
                  onAdquirir={m.lote?.estado === 'PRE_ADQUISICION' ? () => handleAdquirir(m) : undefined}
                />
              ))}
            </div>
            <TablePagination
              total={meta.total}
              page={page}
              lastPage={meta.lastPage}
              limit={12}
              onPageChange={setPage}
              onLimitChange={() => {}}
            />
          </>
        )}
      </div>

      {(modal === 'create' || modal === 'edit') && (
        <MuestraFormModal
          initial={modal === 'edit' ? selected : null}
          campanas={campanas}
          tiposProducto={tiposProducto}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {modal === 'evaluaciones' && selected && (
        <FormularioModal
          muestra={selected}
          onClose={() => setModal(null)}
          onGuardado={load}
        />
      )}

      {modal === 'delete' && selected && (
        <EliminarModal
          muestra={selected}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      )}

      {modal === 'exportar' && (
        <ExportarMuestrasModal onClose={() => setModal(null)} />
      )}

      {modal === 'importar' && (
        <ImportarMuestrasModal
          onClose={() => setModal(null)}
          onImportado={() => { setModal(null); load(); }}
        />
      )}

      {modal === 'adquirir' && selected?.lote && (
        <AdquirirModal
          loteRef={selected.lote}
          onClose={() => { setModal(null); setSelected(null); }}
          onConfirm={confirmarAdquisicion}
        />
      )}

      {showProximamente && <ProximamenteToast onDismiss={() => setShowProximamente(false)} />}
    </div>
  );
}
