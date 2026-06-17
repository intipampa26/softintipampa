import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { Productor } from '@/services/productores.service';
import { familiaresService } from '@/services/familiares.service';
import { parcelasService } from '@/services/parcelas.service';
import { evidenciasService, Evidencia } from '@/services/evidencias.service';
import { evidenciasFamiliaresService, EvidenciaFamiliar } from '@/services/evidencias-familiares.service';
import { storageService } from '@/services/storage.service';
import { ReportContent } from '@/pages/ProductorExportModal';
import { mergePdfs } from './pdfMerge';

function sanitizeName(name: string): string {
  return name
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .trim()
    .substring(0, 80);
}

const IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

async function fetchBlob(id: number, base: string): Promise<string | null> {
  try {
    const token = storageService.getAccessToken();
    const resp = await fetch(`/api/${base}/${id}/download`, {
      headers: { Authorization: `Bearer ${token ?? ''}` },
    });
    if (!resp.ok) return null;
    return URL.createObjectURL(await resp.blob());
  } catch { return null; }
}

async function fetchBytes(id: number, base: string): Promise<ArrayBuffer | null> {
  try {
    const token = storageService.getAccessToken();
    const resp = await fetch(`/api/${base}/${id}/download`, {
      headers: { Authorization: `Bearer ${token ?? ''}` },
    });
    if (!resp.ok) return null;
    return resp.arrayBuffer();
  } catch { return null; }
}

async function renderProducerToPDF(
  productor: Productor,
  printDate: string,
): Promise<{ blob: Blob; blobUrls: string[] }> {
  const blobUrls: string[] = [];

  const [familiares, parcelas, evidencias, evidenciasFamiliares] = await Promise.all([
    familiaresService.getAll(productor.id),
    parcelasService.getPage(1, 100, productor.id).then(r => r.data),
    evidenciasService.getByProductor(productor.id),
    evidenciasFamiliaresService.getByProductor(productor.id),
  ]);

  const imageBlobUrls = new Map<number, string>();
  const familiarBlobUrls = new Map<number, string>();

  await Promise.all([
    ...(evidencias as Evidencia[])
      .filter(e => e.mimeType && IMAGE_TYPES.has(e.mimeType) && !e._pendiente)
      .map(async e => {
        const url = await fetchBlob(e.id, 'evidencias');
        if (url) { imageBlobUrls.set(e.id, url); blobUrls.push(url); }
      }),
    ...(evidenciasFamiliares as EvidenciaFamiliar[])
      .filter(e => e.mimeType && IMAGE_TYPES.has(e.mimeType) && !e._pendiente)
      .map(async e => {
        const url = await fetchBlob(e.id, 'evidencias-familiares');
        if (url) { familiarBlobUrls.set(e.id, url); blobUrls.push(url); }
      }),
  ]);

  
  
  const container = document.createElement('div');
  container.style.cssText = [
    'position:absolute',
    'left:-9999px',
    'top:0',
    'width:820px',
    'background:white',
    'padding:28px 32px',
    'pointer-events:none',
    'overflow:visible',
    'z-index:-1',
  ].join(';');
  document.body.appendChild(container);

  const root = createRoot(container);

  
  await new Promise<void>(resolve => {
    root.render(
      React.createElement(ReportContent, {
        productor,
        familiares,
        parcelas,
        evidencias,
        evidenciasFamiliares,
        imageBlobUrls,
        familiarBlobUrls,
        printDate,
        forExport: true,
      }),
    );
    
    requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 600)));
  });

  
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>(res => {
            img.onload  = () => res();
            img.onerror = () => res();
            setTimeout(res, 3000);
          }),
    ),
  );

  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 8000,
    windowWidth: 820,
  });

  root.unmount();
  document.body.removeChild(container);

  
  const imgData   = canvas.toDataURL('image/jpeg', 0.92);
  const pdfW      = 210;  
  const pageH     = 297;
  const imgH      = (canvas.height * pdfW) / canvas.width;
  const pdf       = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  let heightLeft  = imgH;
  let position    = 0;
  pdf.addImage(imgData, 'JPEG', 0, position, pdfW, imgH);
  heightLeft -= pageH;

  while (heightLeft > 0) {
    position = heightLeft - imgH;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, pdfW, imgH);
    heightLeft -= pageH;
  }

  
  const mainArrayBuffer = await (pdf.output('blob') as Blob).arrayBuffer();

  
  const pdfEvs = [
    ...(evidencias as Evidencia[])
      .filter(e => e.mimeType === 'application/pdf' && !e._pendiente)
      .map(e => ({ id: e.id, base: 'evidencias' as const })),
    ...(evidenciasFamiliares as EvidenciaFamiliar[])
      .filter(e => e.mimeType === 'application/pdf' && !e._pendiente)
      .map(e => ({ id: e.id, base: 'evidencias-familiares' as const })),
  ];

  const attachedBytes: ArrayBuffer[] = [];
  await Promise.all(
    pdfEvs.map(async ({ id, base }) => {
      const bytes = await fetchBytes(id, base);
      if (bytes) attachedBytes.push(bytes);
    }),
  );

  const finalBlob = await mergePdfs(mainArrayBuffer, attachedBytes);
  return { blob: finalBlob, blobUrls };
}

export interface BulkExportProgress {
  current: number;
  total: number;
  name: string;
}

export async function bulkExportProductoresPDF(
  productores: Productor[],
  onProgress?: (p: BulkExportProgress) => void,
): Promise<void> {
  const today     = new Date().toISOString().split('T')[0];
  const folderName = `productores_${today}`;
  const printDate  = new Date().toLocaleDateString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });

  const zip        = new JSZip();
  const rootFolder = zip.folder(folderName)!;
  const allBlobUrls: string[] = [];

  for (let i = 0; i < productores.length; i++) {
    const prod     = productores[i];
    const fullName = [prod.nombre, prod.apellido].filter(Boolean).join(' ');
    const safeName = sanitizeName(fullName) || `productor_${prod.id}`;

    onProgress?.({ current: i + 1, total: productores.length, name: fullName });

    try {
      const { blob, blobUrls } = await renderProducerToPDF(prod, printDate);
      allBlobUrls.push(...blobUrls);

      const folder = rootFolder.folder(safeName)!;
      folder.file(`${safeName}.pdf`, blob);
    } catch (err) {
      console.error(`Error exportando ${fullName}:`, err);
    }
  }

  
  allBlobUrls.forEach(u => URL.revokeObjectURL(u));

  const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  const url     = URL.createObjectURL(zipBlob);
  const a       = document.createElement('a');
  a.href        = url;
  a.download    = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
