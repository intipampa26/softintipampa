import jsPDF from 'jspdf';
import type { Muestra } from '@/services/muestras.service';

const LABEL_W  = 62;
const LABEL_H  = 29;
const COL_GAP  = 3;
const ROW_GAP  = 3;
const MARGIN_X = 7;
const MARGIN_Y = 12;
const COLS     = 3;

export function generateEtiquetasMuestrasPdf(muestras: Muestra[]): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  let col = 0;
  let row = 0;

  muestras.forEach((m, idx) => {
    if (idx > 0 && col === 0 && row === 0) doc.addPage();

    const x = MARGIN_X + col * (LABEL_W + COL_GAP);
    const y = MARGIN_Y + row * (LABEL_H + ROW_GAP);

    // Border
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.2);
    doc.rect(x, y, LABEL_W, LABEL_H);

    // Header strip
    doc.setFillColor(26, 43, 35);
    doc.rect(x, y, LABEL_W, 5, 'F');

    // Brand + código
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(4.5);
    doc.setTextColor(255, 255, 255);
    doc.text('COLLECTIVE BEAN', x + 2, y + 3.2);
    doc.setFontSize(5);
    doc.text(m.codigo ?? '', x + LABEL_W - 2, y + 3.2, { align: 'right' });

    // Body text
    doc.setTextColor(30, 30, 30);
    let lineY = y + 8;
    const lineH = 3.8;

    const productor = m.productor
      ? `${m.productor.nombre} ${m.productor.apellido ?? ''}`.trim()
      : '';
    const campana   = (m as any).campana?.nombre ?? '';
    const lote      = (m as any).lote?.codigo ?? (m as any).loteFinal?.codigo ?? '';
    const variedad  = m.variedad ?? '';
    const proceso   = m.proceso  ?? '';
    const tipo      = m.tipoMuestra ?? '';
    const rawFecha  = m.fecha ?? m.createdAt ?? '';
    const fecha     = rawFecha ? rawFecha.slice(0, 10) : '';
    const kg        = m.cantidadKg != null ? `${Number(m.cantidadKg).toFixed(1)} kg` : '';
    const planta    = m.planta ?? '';

    const rows: [string, string][] = [
      ['PRODUCTOR', productor],
      ['CAMPAÑA', campana + (lote ? `  ·  LOTE: ${lote}` : '')],
      ['VARIEDAD', variedad + (proceso ? `  ·  ${proceso}` : '')],
      ['TIPO', tipo.toUpperCase() + (planta ? `  ·  ${planta}` : '')],
      ['FECHA', fecha ? fecha + (kg ? `  ·  ${kg}` : '') : kg],
    ];

    rows.forEach(([label, value]) => {
      if (!value) return;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(4);
      doc.setTextColor(100, 100, 100);
      doc.text(label, x + 2, lineY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(4.8);
      doc.setTextColor(20, 20, 20);
      const maxW = LABEL_W - 22;
      const truncated = doc.splitTextToSize(value, maxW)[0] as string;
      doc.text(truncated, x + 18, lineY);
      lineY += lineH;
    });

    col++;
    if (col >= COLS) { col = 0; row++; }
    const rowsPerPage = Math.floor((297 - 2 * MARGIN_Y + ROW_GAP) / (LABEL_H + ROW_GAP));
    if (row >= rowsPerPage) { row = 0; col = 0; }
  });

  const filename = `etiquetas-muestras-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
