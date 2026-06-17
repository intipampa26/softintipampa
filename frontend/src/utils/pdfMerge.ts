import { PDFDocument } from 'pdf-lib';

 
export async function mergePdfs(
  main: ArrayBuffer,
  attached: ArrayBuffer[],
): Promise<Blob> {
  if (attached.length === 0) {
    return new Blob([main], { type: 'application/pdf' });
  }

  try {
    const merged = await PDFDocument.load(main);

    for (const bytes of attached) {
      try {
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const indices = doc.getPageIndices();
        const copied = await merged.copyPages(doc, indices);
        copied.forEach(page => merged.addPage(page));
      } catch {
        
      }
    }

    const saved = await merged.save();
    
    
    const cleanBuffer = new Uint8Array(saved).buffer as ArrayBuffer;
    return new Blob([cleanBuffer], { type: 'application/pdf' });
  } catch {
    return new Blob([main], { type: 'application/pdf' });
  }
}

 
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
