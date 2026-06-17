import { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Productor, TIPO_PRODUCTO_LABEL } from '@/services/productores.service';
import { familiaresService, FamiliarProductor, PARENTESCO_LABEL, TIPO_DOCUMENTO_LABEL } from '@/services/familiares.service';
import { parcelasService, Parcela } from '@/services/parcelas.service';
import { evidenciasService, Evidencia } from '@/services/evidencias.service';
import { evidenciasFamiliaresService, EvidenciaFamiliar } from '@/services/evidencias-familiares.service';
import { storageService } from '@/services/storage.service';
import { mergePdfs, downloadBlob } from '@/utils/pdfMerge';
import LoadingLogo from '@/components/LoadingLogo';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const PDF_TYPE    = 'application/pdf';
const WORD_TYPES  = new Set([
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);
const EXCEL_TYPES = new Set([
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
]);

function isImage(mimeType: string | null) { return mimeType ? IMAGE_TYPES.has(mimeType) : false; }
function isPdf(mimeType: string | null)   { return mimeType === PDF_TYPE; }
function isWord(mimeType: string | null)  { return mimeType ? WORD_TYPES.has(mimeType) : false; }
function isExcel(mimeType: string | null) { return mimeType ? EXCEL_TYPES.has(mimeType) : false; }

function docIcon(mimeType: string | null) {
  if (isImage(mimeType))  return '🖼️';
  if (isPdf(mimeType))    return '📄';
  if (isWord(mimeType))   return '📝';
  if (isExcel(mimeType))  return '📊';
  return '📎';
}

function fmtFileSize(bytes: number | null) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function fetchEvidenciaBlob(id: number, base: 'evidencias' | 'evidencias-familiares'): Promise<string | null> {
  try {
    const token = storageService.getAccessToken();
    const resp = await fetch(`/api/${base}/${id}/download`, {
      headers: { Authorization: `Bearer ${token ?? ''}` },
    });
    if (!resp.ok) return null;
    return URL.createObjectURL(await resp.blob());
  } catch { return null; }
}

async function fetchImageBlob(id: number): Promise<string | null> {
  return fetchEvidenciaBlob(id, 'evidencias');
}
async function fetchFamiliarImageBlob(id: number): Promise<string | null> {
  return fetchEvidenciaBlob(id, 'evidencias-familiares');
}

interface PolygonSVGProps { coords: Array<{ lat: number; lng: number }>; }
function PolygonSVG({ coords }: PolygonSVGProps) {
  if (coords.length < 2) return null;
  const W = 300, H = 180, PAD = 18;
  const lats = coords.map(c => c.lat);
  const lngs = coords.map(c => c.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 0.0005;
  const lngRange = maxLng - minLng || 0.0005;
  const scaleX = (W - PAD * 2) / lngRange;
  const scaleY = (H - PAD * 2) / latRange;
  const scale  = Math.min(scaleX, scaleY);
  const offsetX = (W - PAD * 2 - lngRange * scale) / 2;
  const offsetY = (H - PAD * 2 - latRange * scale) / 2;
  const toX = (lng: number) => PAD + offsetX + (lng - minLng) * scale;
  const toY = (lat: number) => H - PAD - offsetY - (lat - minLat) * scale;
  const points = coords.map(c => `${toX(c.lng).toFixed(1)},${toY(c.lat).toFixed(1)}`).join(' ');
  const centLat = (minLat + maxLat) / 2, centLng = (minLng + maxLng) / 2;

  return (
    <svg width={W} height={H} style={{ border: '1px solid #d1fae5', borderRadius: '8px', background: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', display: 'block' }}>
      <polygon points={points} fill="#86efac" fillOpacity="0.5" stroke="#16a34a" strokeWidth="1.5" strokeLinejoin="round" />
      {coords.map((c, i) => (
        <circle key={i} cx={toX(c.lng)} cy={toY(c.lat)} r="3" fill="#15803d" stroke="#fff" strokeWidth="1" />
      ))}
      <text x={toX(centLng)} y={toY(centLat) + 4} textAnchor="middle" fontSize="9" fill="#166534" fontWeight="600">
        {coords.length} vértices
      </text>
    </svg>
  );
}

function fmtDate(d: string | null | undefined) {
  if (!d) return '—';
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
}
function fmtNum(v: number | null | undefined, suffix = '') {
  if (v == null) return '—';
  return `${v}${suffix}`;
}
function bool(v: boolean | null | undefined) {
  if (v === true) return 'Sí';
  if (v === false) return 'No';
  return '—';
}
function codigoProductor(p: Productor) {
  return `PR${String(p.id).padStart(3, '0')}`;
}

interface Hijo { nombre: string; edad?: string | number; nivelEstudios?: string; escolarizado?: boolean | null; }
function parseHijos(raw: string | null | undefined): Hijo[] {
  if (!raw) return [];
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
}

interface DocPreviewProps {
  ev: { id: number; nombreArchivo: string; mimeType: string | null; fileSize: number | null; version: number };
  blobUrl?: string;
}

function DocPreview({ ev, blobUrl }: DocPreviewProps) {
  const header = (
    <div style={{ padding: '6px 10px', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', gap: '7px', borderBottom: '1px solid #e5e7eb' }}>
      <span style={{ fontSize: '16px', lineHeight: 1 }}>{docIcon(ev.mimeType)}</span>
      <div>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#374151' }}>{ev.nombreArchivo}</div>
        <div style={{ fontSize: '8px', color: '#9ca3af' }}>
          {ev.mimeType ?? 'Desconocido'} · {fmtFileSize(ev.fileSize)} · v{ev.version}
        </div>
      </div>
    </div>
  );

  let body: React.ReactNode = null;

  if (isImage(ev.mimeType) && blobUrl) {
    body = (
      <img src={blobUrl} alt={ev.nombreArchivo}
        style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', display: 'block', backgroundColor: '#f3f4f6' }} />
    );
  } else if (isPdf(ev.mimeType) && blobUrl) {
    body = (
      <iframe
        src={blobUrl}
        title={ev.nombreArchivo}
        style={{ width: '100%', height: '600px', display: 'block', border: 'none' }}
      />
    );
  } else if ((isWord(ev.mimeType) || isExcel(ev.mimeType)) && blobUrl) {
    
    body = (
      <div style={{ padding: '16px 12px', backgroundColor: '#fafafa', textAlign: 'center' }}>
        <div style={{ fontSize: '32px', marginBottom: '6px' }}>{docIcon(ev.mimeType)}</div>
        <p style={{ fontSize: '10px', color: '#6b7280', margin: '0 0 8px' }}>
          Vista previa no disponible para este tipo de archivo
        </p>
        <a href={blobUrl} download={ev.nombreArchivo}
          style={{ fontSize: '10px', color: '#1A2B23', fontWeight: 700, textDecoration: 'underline' }}>
          Descargar para ver
        </a>
      </div>
    );
  } else if (!blobUrl) {
    body = (
      <div style={{ padding: '10px 12px', backgroundColor: '#fafafa', textAlign: 'center' }}>
        <span style={{ fontSize: '10px', color: '#9ca3af' }}>Cargando…</span>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
      {header}
      {body}
    </div>
  );
}

interface SectionProps { title: string; children: React.ReactNode; }
function Section({ title, children }: SectionProps) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ backgroundColor: '#1A2B23', color: '#fff', padding: '4px 10px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '4px', marginBottom: '10px' }}>
        {title}
      </div>
      {children}
    </div>
  );
}

interface RowProps { label: string; value: React.ReactNode; half?: boolean; }
function Row({ label, value, half }: RowProps) {
  return (
    <div style={{ display: 'inline-block', width: half ? '48%' : '100%', marginBottom: '6px', verticalAlign: 'top', paddingRight: half ? '2%' : '0' }}>
      <span style={{ fontSize: '8px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>{label}</span>
      <span style={{ fontSize: '11px', color: '#111827', display: 'block', marginTop: '1px' }}>{value || '—'}</span>
    </div>
  );
}

interface ReportContentProps {
  productor: Productor;
  familiares: FamiliarProductor[];
  parcelas: Parcela[];
  evidencias: Evidencia[];
  evidenciasFamiliares: EvidenciaFamiliar[];
  imageBlobUrls: Map<number, string>;
  familiarBlobUrls: Map<number, string>;
   
  pdfBlobUrls?: Map<number, string>;
   
  familiarPdfBlobUrls?: Map<number, string>;
  printDate: string;
   
  forExport?: boolean;
}

export type { ReportContentProps };
export function ReportContent({ productor, familiares, parcelas, evidencias, evidenciasFamiliares, imageBlobUrls, familiarBlobUrls, pdfBlobUrls, familiarPdfBlobUrls, printDate, forExport }: ReportContentProps) {
  const hijos = parseHijos(productor.hijosData);

  return (
    <div id="productor-export-content" style={{ fontFamily: 'system-ui, sans-serif', color: '#111827', lineHeight: 1.4, maxWidth: '780px', margin: '0 auto', padding: '0 8px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1A2B23', paddingBottom: '12px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Collective Bean" style={{ height: '42px', width: 'auto', objectFit: 'contain' }} />
          <div style={{ borderLeft: '2px solid #d1fae5', paddingLeft: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#374151' }}>Ficha del Productor</div>
            <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '1px' }}>Sistema de Gestión Agrícola</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '9px', color: '#6b7280' }}>Generado el {printDate}</div>
          <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '2px' }}>Código: {codigoProductor(productor)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'flex-start' }}>
        {productor.fotoUrl && (
          <img src={productor.fotoUrl} alt="foto" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e5e7eb', flexShrink: 0 }} />
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '17px', fontWeight: 900, color: '#111827' }}>
            {productor.apellido ? `${productor.nombre} ${productor.apellido}` : productor.nombre}
          </div>
          {productor.nroDocumento && (
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>DNI/RUC: {productor.nroDocumento}</div>
          )}
          <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: productor.esApto ? '#dcfce7' : '#fee2e2', color: productor.esApto ? '#166534' : '#991b1b', padding: '2px 8px', borderRadius: '999px', fontSize: '9px', fontWeight: 700 }}>
              {productor.esApto ? 'APTO' : 'NO APTO'}
            </span>
            {productor.tipoProducto && (
              <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '999px', fontSize: '9px', fontWeight: 700 }}>
                {TIPO_PRODUCTO_LABEL[productor.tipoProducto]}
              </span>
            )}
            <span style={{ backgroundColor: productor.campana ? '#ede9fe' : '#f3f4f6', color: productor.campana ? '#5b21b6' : '#9ca3af', padding: '2px 8px', borderRadius: '999px', fontSize: '9px', fontWeight: 600 }}>
              {productor.campana ? productor.campana.nombre : 'Sin campaña asociada'}
            </span>
          </div>
        </div>
      </div>

      <Section title="Datos de contacto">
        <div>
          <Row label="Fecha de registro" value={fmtDate(productor.fecha)} half />
          <Row label="Teléfono" value={productor.telefono} half />
          <Row label="Correo electrónico" value={productor.email} half />
          <Row label="Dirección" value={productor.direccion} half />
          {productor.descripcion && <Row label="Observaciones" value={productor.descripcion} />}
        </div>
      </Section>

      <Section title="Información familiar">
        <div>
          <Row label="Nombre en núcleo familiar" value={productor.familiarNombreProductor} half />
          <Row label="Edad" value={fmtNum(productor.familiarEdadProductor, ' años')} half />
          <Row label="Estado civil" value={productor.familiarEstadoCivil} half />
          <Row label="Grado de instrucción" value={productor.familiarGradoInstruccion} half />
        </div>

        {(productor.conyugeNombre || productor.conyugeEdad) && (
          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Cónyuge / Pareja</div>
            <Row label="Nombre" value={productor.conyugeNombre} half />
            <Row label="Edad" value={fmtNum(productor.conyugeEdad, ' años')} half />
            <Row label="Ocupación" value={productor.conyugeOcupacion} half />
            <Row label="Grado de instrucción" value={productor.conyugeGradoInstruccion} half />
          </div>
        )}

        {hijos.length > 0 && (
          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #f3f4f6' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: '#374151', marginBottom: '6px', textTransform: 'uppercase' }}>Hijos ({hijos.length})</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th style={thStyle}>Nombre</th>
                  <th style={thStyle}>Edad</th>
                  <th style={thStyle}>Nivel estudios</th>
                  <th style={thStyle}>Escolarizado</th>
                </tr>
              </thead>
              <tbody>
                {hijos.map((h, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={tdStyle}>{h.nombre || '—'}</td>
                    <td style={tdStyle}>{h.edad ? `${h.edad} años` : '—'}</td>
                    <td style={tdStyle}>{h.nivelEstudios || '—'}</td>
                    <td style={tdStyle}>{h.escolarizado === true ? 'Sí' : h.escolarizado === false ? 'No' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Salud y servicios básicos">
        <div>
          <Row label="Seguro médico" value={productor.seguroMedico} half />
          <Row label="Enfermedad especial" value={bool(productor.tieneEnfermedadEspecial)} half />
          {productor.tieneEnfermedadEspecial && productor.enfermedadesPreexistentes && (
            <Row label="Detalle de enfermedades" value={productor.enfermedadesPreexistentes} />
          )}
          {!productor.tieneEnfermedadEspecial && productor.enfermedadesPreexistentes && (
            <Row label="Enfermedades preexistentes" value={productor.enfermedadesPreexistentes} />
          )}
        </div>
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {([['tieneAgua', 'Agua'], ['tieneDesague', 'Desagüe'], ['tieneLuz', 'Luz'], ['tieneInternet', 'Internet'], ['tieneBanio', 'Baño']] as const).map(([key, lbl]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
              <span style={{ width: '14px', height: '14px', borderRadius: '3px', backgroundColor: productor[key] ? '#dcfce7' : '#fee2e2', color: productor[key] ? '#166534' : '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 700 }}>
                {productor[key] ? '✓' : '✗'}
              </span>
              <span style={{ color: '#374151' }}>{lbl}</span>
            </div>
          ))}
        </div>
      </Section>

      {familiares.length > 0 && (
        <Section title={`Familiares registrados (${familiares.length})`}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb' }}>
                <th style={thStyle}>Nombre completo</th>
                <th style={thStyle}>Parentesco</th>
                <th style={thStyle}>Documento</th>
                <th style={thStyle}>Sexo</th>
                <th style={thStyle}>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {familiares.filter(f => f.activo).map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={tdStyle}>{f.nombres} {f.apellidos}</td>
                  <td style={tdStyle}>{PARENTESCO_LABEL[f.parentesco]}</td>
                  <td style={tdStyle}>
                    {f.nroDocumento ? `${f.tipoDocumento ? TIPO_DOCUMENTO_LABEL[f.tipoDocumento] + ' ' : ''}${f.nroDocumento}` : '—'}
                  </td>
                  <td style={tdStyle}>{f.sexo ?? '—'}</td>
                  <td style={tdStyle}>{f.telefono ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {parcelas.filter(p => p.activo).map((parcela, idx) => (
        <Section key={parcela.id} title={`Parcela ${idx + 1}: ${parcela.nombre} (${parcela.codigo})`}>
          <div>
            <Row label="Nombre de la finca" value={parcela.nombreFinca} half />
            <Row label="Tipo de producto" value={parcela.tipoProducto ? TIPO_PRODUCTO_LABEL[parcela.tipoProducto as keyof typeof TIPO_PRODUCTO_LABEL] : null} half />
            <Row label="Fecha de registro" value={fmtDate(parcela.fechaRegistro)} half />
            <Row label="Descripción" value={parcela.descripcion} half />
          </div>

          {(parcela.areaTotalFinca || parcela.altitud || parcela.estadoPropiedad || parcela.inicioProduccionAnio) && (
            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#374151', marginBottom: '5px', textTransform: 'uppercase' }}>Historia y ubicación</div>
              <Row label="Área total" value={fmtNum(parcela.areaTotalFinca, ' ha')} half />
              <Row label="Altitud" value={fmtNum(parcela.altitud, ' msnm')} half />
              <Row label="Estado de propiedad" value={parcela.estadoPropiedad} half />
              <Row label="Año inicio producción" value={fmtNum(parcela.inicioProduccionAnio)} half />
              {parcela.breveHistoriaInicioProduccion && <Row label="Historia" value={parcela.breveHistoriaInicioProduccion} />}
            </div>
          )}

          {(parcela.hectareasTotales != null || parcela.hectareasCafe != null || parcela.variedadesCafe) && (
            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#374151', marginBottom: '5px', textTransform: 'uppercase' }}>Áreas</div>
              <Row label="Ha totales" value={fmtNum(parcela.hectareasTotales, ' ha')} half />
              <Row label="Ha café" value={fmtNum(parcela.hectareasCafe, ' ha')} half />
              <Row label="Ha renovación" value={fmtNum(parcela.hectareasRenovacion, ' ha')} half />
              <Row label="Ha purma" value={fmtNum(parcela.areaPurma, ' ha')} half />
              <Row label="Ha bosque" value={fmtNum(parcela.areaBosque, ' ha')} half />
              <Row label="Variedades de café" value={parcela.variedadesCafe} half />
              <Row label="Tipo árboles bosque" value={parcela.tipoArbolesBosque} half />
            </div>
          )}

          {(parcela.controlesBiologicos != null || parcela.practicaCultivo || parcela.metodoFertilizacion) && (
            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#374151', marginBottom: '5px', textTransform: 'uppercase' }}>Manejo agrícola</div>
              <Row label="Controles biológicos" value={bool(parcela.controlesBiologicos)} half />
              <Row label="Herbicidas en chala" value={bool(parcela.usoHerbicidasChala)} half />
              <Row label="Práctica de cultivo" value={parcela.practicaCultivo} half />
              <Row label="Método fertilización" value={parcela.metodoFertilizacion} half />
              {parcela.practicasConservacionAmbiental && <Row label="Conservación ambiental" value={parcela.practicasConservacionAmbiental} />}
            </div>
          )}

          {(parcela.tanqueTina != null || parcela.secadorSolar != null || parcela.compostera != null) && (
            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#374151', marginBottom: '5px', textTransform: 'uppercase' }}>Infraestructura</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {([['tanqueTina', 'Tanque tina'], ['pozoAguasMieles', 'Pozo aguas mieles'], ['timbosFermentacion', 'Timbos fermentación'], ['despulpadora', 'Despulpadora'], ['secadorSolar', 'Secador solar'], ['compostera', 'Compostera']] as [keyof typeof parcela, string][]).map(([key, lbl]) => (
                  parcela[key] != null && (
                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '9px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: parcela[key] ? '#dcfce7' : '#fee2e2', color: parcela[key] ? '#166534' : '#991b1b', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {parcela[key] ? '✓' : '✗'}
                      </span>
                      <span style={{ color: '#374151' }}>{lbl}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {(parcela.produccion2023 != null || parcela.tipoBeneficio || parcela.tipoSecado) && (
            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#374151', marginBottom: '5px', textTransform: 'uppercase' }}>Producción</div>
              <Row label="Producción 2023 (qq)" value={fmtNum(parcela.produccion2023)} half />
              <Row label="Tipo de beneficio" value={parcela.tipoBeneficio} half />
              <Row label="Tipo de secado" value={parcela.tipoSecado} half />
              <Row label="Período de cosecha" value={parcela.periodoCosecha} half />
              <Row label="Tiempo de secado (días)" value={fmtNum(parcela.tiempoSecadoDias, ' días')} half />
              <Row label="Temperatura promedio" value={fmtNum(parcela.temperaturaPromedio, ' °C')} half />
            </div>
          )}

          {(parcela.conoceTipoSuelo != null || parcela.densidadSombra || parcela.floraFauna) && (
            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#374151', marginBottom: '5px', textTransform: 'uppercase' }}>Condiciones</div>
              <Row label="Conoce tipo de suelo" value={bool(parcela.conoceTipoSuelo)} half />
              {parcela.conoceTipoSuelo && parcela.estudioSuelos && <Row label="Descripción del suelo" value={parcela.estudioSuelos} />}
              <Row label="Densidad de sombra" value={parcela.densidadSombra} half />
              {parcela.floraFauna && <Row label="Flora y fauna" value={parcela.floraFauna} />}
            </div>
          )}

          {(parcela.cosechaManejo || parcela.despulpado || parcela.fermentacion || parcela.secadoManejo || parcela.almacenaje || parcela.bienestarLaboral) && (
            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#374151', marginBottom: '5px', textTransform: 'uppercase' }}>Manejo de parcela y cultivo</div>
              {parcela.cosechaManejo && <Row label="Cosecha" value={parcela.cosechaManejo} />}
              {parcela.despulpado && <Row label="Despulpado" value={parcela.despulpado} />}
              {parcela.fermentacion && <Row label="Fermentación" value={parcela.fermentacion} />}
              {parcela.secadoManejo && <Row label="Secado" value={parcela.secadoManejo} />}
              {parcela.almacenaje && <Row label="Almacenaje" value={parcela.almacenaje} />}
              {parcela.bienestarLaboral && <Row label="Bienestar laboral" value={parcela.bienestarLaboral} />}
            </div>
          )}

          {parcela.coordenadas && parcela.coordenadas.length > 0 && (
            <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: '#374151', marginBottom: '8px', textTransform: 'uppercase' }}>Polígono de la parcela ({parcela.coordenadas.length} vértices)</div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <PolygonSVG coords={parcela.coordenadas} />
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                    {parcela.coordenadas.map((c, i) => (
                      <span key={i} style={{ fontFamily: 'monospace', fontSize: '8px', backgroundColor: '#f3f4f6', padding: '2px 5px', borderRadius: '4px', color: '#374151', whiteSpace: 'nowrap' }}>
                        {i + 1}. {c.lat.toFixed(5)}, {c.lng.toFixed(5)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Section>
      ))}

      {!forExport && evidencias.length > 0 && (
        <div data-evidence-section="true">
          <Section title={`Documentos adjuntos — Productor (${evidencias.length})`}>
            {evidencias.map(ev => (
              <DocPreview
                key={ev.id}
                ev={ev}
                blobUrl={imageBlobUrls.get(ev.id) ?? pdfBlobUrls?.get(ev.id)}
              />
            ))}
          </Section>
        </div>
      )}

      {!forExport && evidenciasFamiliares.length > 0 && (
        <div data-evidence-section="true">
          <Section title={`Documentos adjuntos — Familiares (${evidenciasFamiliares.length})`}>
            {evidenciasFamiliares.map(ev => (
              <DocPreview
                key={ev.id}
                ev={ev}
                blobUrl={familiarBlobUrls.get(ev.id) ?? familiarPdfBlobUrls?.get(ev.id)}
              />
            ))}
          </Section>
        </div>
      )}

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#9ca3af' }}>
        <span>Collective Bean — Sistema de Gestión Agrícola</span>
        <span>{codigoProductor(productor)} · {printDate}</span>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '5px 8px', fontSize: '8px', fontWeight: 700,
  color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em',
  borderBottom: '1px solid #e5e7eb',
};
const tdStyle: React.CSSProperties = {
  padding: '5px 8px', fontSize: '10px', color: '#374151', verticalAlign: 'top',
};

interface ProductorExportModalProps {
  productor: Productor;
  onClose: () => void;
}

export function ProductorExportModal({ productor, onClose }: ProductorExportModalProps) {
  const [familiares, setFamiliares]                   = useState<FamiliarProductor[]>([]);
  const [parcelas, setParcelas]                       = useState<Parcela[]>([]);
  const [evidencias, setEvidencias]                   = useState<Evidencia[]>([]);
  const [evidenciasFamiliares, setEvidenciasFamiliares] = useState<EvidenciaFamiliar[]>([]);
  const [imageBlobUrls, setImageBlobUrls]             = useState<Map<number, string>>(new Map());
  const [familiarBlobUrls, setFamiliarBlobUrls]       = useState<Map<number, string>>(new Map());
  const [pdfBlobUrls, setPdfBlobUrls]                 = useState<Map<number, string>>(new Map());
  const [familiarPdfBlobUrls, setFamiliarPdfBlobUrls] = useState<Map<number, string>>(new Map());
  const [loading, setLoading]                         = useState(true);
  const [downloading, setDownloading]                 = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const printDate = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  useEffect(() => {
    let cancelled = false;
    const blobUrls: string[] = [];

    async function load() {
      try {
        const [fams, parcs, evs, evFams] = await Promise.all([
          familiaresService.getAll(productor.id),
          parcelasService.getPage(1, 100, productor.id).then(r => r.data),
          evidenciasService.getByProductor(productor.id),
          evidenciasFamiliaresService.getByProductor(productor.id),
        ]);
        if (cancelled) return;
        setFamiliares(fams);
        setParcelas(parcs);
        setEvidencias(evs);
        setEvidenciasFamiliares(evFams);

        
        const imgMap  = new Map<number, string>();
        const pdfMap  = new Map<number, string>();
        const famImgMap = new Map<number, string>();
        const famPdfMap = new Map<number, string>();

        
        const needsBlob = (e: { mimeType: string | null; _pendiente?: boolean }) =>
          !e._pendiente && (isImage(e.mimeType) || isPdf(e.mimeType) || isWord(e.mimeType) || isExcel(e.mimeType));

        await Promise.all([
          ...evs.filter(needsBlob).map(async e => {
            const url = await fetchEvidenciaBlob(e.id, 'evidencias');
            if (!url) return;
            blobUrls.push(url);
            if (isImage(e.mimeType))               imgMap.set(e.id, url);
            else if (isPdf(e.mimeType))             pdfMap.set(e.id, url);
            else if (isWord(e.mimeType) || isExcel(e.mimeType)) pdfMap.set(e.id, url); 
          }),
          ...evFams.filter(needsBlob).map(async e => {
            const url = await fetchEvidenciaBlob(e.id, 'evidencias-familiares');
            if (!url) return;
            blobUrls.push(url);
            if (isImage(e.mimeType))               famImgMap.set(e.id, url);
            else if (isPdf(e.mimeType))             famPdfMap.set(e.id, url);
            else if (isWord(e.mimeType) || isExcel(e.mimeType)) famPdfMap.set(e.id, url);
          }),
        ]);

        if (!cancelled) {
          setImageBlobUrls(imgMap);
          setFamiliarBlobUrls(famImgMap);
          setPdfBlobUrls(pdfMap);
          setFamiliarPdfBlobUrls(famPdfMap);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
      blobUrls.forEach(u => URL.revokeObjectURL(u));
    };
  }, [productor.id]);

  async function handleDownloadPdf() {
    const content = printRef.current;
    if (!content || downloading) return;
    setDownloading(true);

    
    const evidenceSections = Array.from(
      content.querySelectorAll<HTMLElement>('[data-evidence-section]')
    );
    evidenceSections.forEach(el => { el.style.display = 'none'; });

    try {
      
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 5000,
      });

      
      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const pdfW = 210;
      const pageH = 297;
      const imgH = (canvas.height * pdfW) / canvas.width;
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

      let heightLeft = imgH;
      let position = 0;
      pdf.addImage(imgData, 'JPEG', 0, position, pdfW, imgH);
      heightLeft -= pageH;
      while (heightLeft > 0) {
        position = heightLeft - imgH;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfW, imgH);
        heightLeft -= pageH;
      }

      
      evidenceSections.forEach(el => { el.style.display = ''; });

      
      const mainArrayBuffer = pdf.output('arraybuffer') as ArrayBuffer;

      const fetchPdfBytes = async (id: number, base: 'evidencias' | 'evidencias-familiares') => {
        const token = storageService.getAccessToken();
        const resp = await fetch(`/api/${base}/${id}/download`, {
          headers: { Authorization: `Bearer ${token ?? ''}` },
        });
        return resp.ok ? resp.arrayBuffer() : null;
      };

      const attachedBytes: ArrayBuffer[] = [];
      await Promise.all([
        ...evidencias.filter(e => isPdf(e.mimeType) && !e._pendiente).map(async e => {
          const b = await fetchPdfBytes(e.id, 'evidencias');
          if (b) attachedBytes.push(b);
        }),
        ...evidenciasFamiliares.filter(e => isPdf(e.mimeType) && !e._pendiente).map(async e => {
          const b = await fetchPdfBytes(e.id, 'evidencias-familiares');
          if (b) attachedBytes.push(b);
        }),
      ]);

      const finalBlob = await mergePdfs(mainArrayBuffer, attachedBytes);
      const safeName = (productor.apellido ? `${productor.nombre}_${productor.apellido}` : productor.nombre)
        .replace(/[^a-zA-Z0-9_\-\s]/g, '').replace(/\s+/g, '_').substring(0, 60);
      downloadBlob(finalBlob, `${safeName}_${productor.id}.pdf`);
    } catch {
      evidenceSections.forEach(el => { el.style.display = ''; });
    } finally {
      setDownloading(false);
    }
  }

  function handlePrint() {
    const content = printRef.current;
    if (!content) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'print-export-style';
    styleEl.textContent = `
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
        body > *:not(#print-root-wrapper) { display: none !important; visibility: hidden !important; }
        #print-root-wrapper {
          display: block !important; visibility: visible !important;
          position: static !important; background: white !important;
          padding: 16px 20px !important; margin: 0 !important;
          width: 100% !important; font-size: 10px !important;
        }
        #print-root-wrapper img { max-width: 100% !important; }
        @page { margin: 10mm; size: A4 portrait; }
      }
    `;
    document.head.appendChild(styleEl);
    const wrapper = document.createElement('div');
    wrapper.id = 'print-root-wrapper';
    wrapper.innerHTML = content.innerHTML;
    document.body.appendChild(wrapper);
    requestAnimationFrame(() => {
      window.print();
      setTimeout(() => {
        if (document.head.contains(styleEl)) document.head.removeChild(styleEl);
        if (document.body.contains(wrapper)) document.body.removeChild(wrapper);
      }, 1500);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-4xl mx-4" style={{ height: 'min(calc(100vh - 48px), 900px)' }}>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#f9a8d4' }}>
              <svg className="w-4 h-4" style={{ color: '#9d174d' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-black text-gray-800 text-base tracking-tight">Vista previa — Ficha del Productor</h2>
              <p className="text-xs text-gray-400">
                {productor.apellido ? `${productor.nombre} ${productor.apellido}` : productor.nombre}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!loading && (
              <>
                <button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ backgroundColor: '#1A2B23' }}
                >
                  {downloading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                    </svg>
                  )}
                  {downloading ? 'Generando…' : 'Descargar PDF'}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
                  title="Imprimir en papel (sin documentos adjuntos PDF)"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5z"/>
                  </svg>
                  Imprimir
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <LoadingLogo compact />
              <p className="text-sm text-gray-500">Cargando datos del productor…</p>
            </div>
          ) : (
            <div ref={printRef} className="bg-white mx-auto my-6 shadow-sm rounded-xl border border-gray-100" style={{ maxWidth: '780px', padding: '28px 32px' }}>
              <ReportContent
                productor={productor}
                familiares={familiares}
                parcelas={parcelas}
                evidencias={evidencias}
                evidenciasFamiliares={evidenciasFamiliares}
                imageBlobUrls={imageBlobUrls}
                familiarBlobUrls={familiarBlobUrls}
                pdfBlobUrls={pdfBlobUrls}
                familiarPdfBlobUrls={familiarPdfBlobUrls}
                printDate={printDate}
              />
            </div>
          )}
        </div>

        {!loading && (
          <div className="px-6 py-3 border-t border-gray-100 shrink-0 text-center">
            <p className="text-xs text-gray-400"><strong>"Descargar PDF"</strong> incluye la ficha completa más todos los documentos adjuntos fusionados. <strong>"Imprimir"</strong> solo imprime la ficha.</p>
          </div>
        )}
      </div>
    </div>
  );
}
