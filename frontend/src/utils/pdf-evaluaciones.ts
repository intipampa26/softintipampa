import jsPDF from 'jspdf';

export interface PdfMuestraInfo {
  codigo: string;
  productorNombre?: string | null;
  campana?: string | null;
  lote?: string | null;
  fecha?: string | null;
  variedad?: string | null;
  proceso?: string | null;
  planta?: string | null;
  parcela?: string | null;
  rendimiento?: string | null;
  humedad?: string | null;
  base?: string | null;
  cantidadKg?: string | null;
  añoCosecha?: string | null;
  region?: string | null;
  pais?: string | null;
}

function drawPdfHeader(pdf: jsPDF, info: PdfMuestraInfo): number {
  const pageW = pdf.internal.pageSize.getWidth();
  const sc    = pdf.internal.scaleFactor;
  let y = 12;

  const badgeFontSize = 9;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(badgeFontSize);
  const codigoW = pdf.getStringUnitWidth(info.codigo) * badgeFontSize / sc;
  pdf.setFillColor(26, 43, 35);
  pdf.roundedRect(10, y - 4.5, codigoW + 6, 7.5, 1.5, 1.5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.text(info.codigo, 13, y + 1);

  if (info.productorNombre) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(31, 41, 55);
    pdf.text(info.productorNombre, 10 + codigoW + 9, y + 1);
  }

  y += 11;

  const fields: [string, string][] = [
    ['Campaña',    info.campana],
    ['Lote',       info.lote],
    ['Fecha',      info.fecha],
    ['Variedad',   info.variedad],
    ['Proceso',    info.proceso],
    ['Planta',     info.planta],
    ['Parcela',    info.parcela],
    ['Rendimiento',info.rendimiento],
    ['Humedad',    info.humedad],
    ['Base',       info.base],
    ['Cant. (kg)', info.cantidadKg],
    ['Año cosecha',info.añoCosecha],
    ['Región',     info.region],
    ['País',       info.pais],
  ].filter(([, v]) => v != null && v !== '') as [string, string][];

  const fieldFontSize = 7.5;
  const lineH  = 5;
  const numCols = 3;
  const colW   = (pageW - 20) / numCols;

  pdf.setFontSize(fieldFontSize);
  let col = 0, row = 0;
  for (const [k, v] of fields) {
    const x     = 10 + col * colW;
    const textY = y + row * lineH;
    const label = `${k}: `;

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(55, 65, 81);
    pdf.text(label, x, textY);

    const lW = pdf.getStringUnitWidth(label) * fieldFontSize / sc;
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(85, 85, 85);
    pdf.text(v, x + lW, textY);

    col++;
    if (col >= numCols) { col = 0; row++; }
  }

  const totalRows = Math.max(1, Math.ceil(fields.length / numCols));
  y += totalRows * lineH + 4;

  pdf.setDrawColor(26, 43, 35);
  pdf.setLineWidth(0.6);
  pdf.line(10, y, pageW - 10, y);
  y += 5;

  return y;
}

// ─── Helper: draw a bordered cell ─────────────────────────────────────────────

function cell(
  pdf: jsPDF,
  x: number, y: number, w: number, h: number,
  text: string,
  opts: {
    fontSize?: number;
    bold?: boolean;
    bg?: [number, number, number];
    color?: [number, number, number];
    align?: 'left' | 'center' | 'right';
    pad?: number;
  } = {},
) {
  const { fontSize = 7, bold = false, bg, color = [30, 30, 30], align = 'left', pad = 1.5 } = opts;
  if (bg) { pdf.setFillColor(bg[0], bg[1], bg[2]); pdf.rect(x, y, w, h, 'F'); }
  pdf.setDrawColor(180, 180, 180);
  pdf.setLineWidth(0.2);
  pdf.rect(x, y, w, h, 'S');
  pdf.setFontSize(fontSize);
  pdf.setFont('helvetica', bold ? 'bold' : 'normal');
  pdf.setTextColor(color[0], color[1], color[2]);
  const sc = pdf.internal.scaleFactor;
  const ty = y + h / 2 + (fontSize / sc) * 0.35;
  const maxW = w - pad * 2;
  if (align === 'center') pdf.text(text, x + w / 2, ty, { align: 'center', maxWidth: maxW });
  else if (align === 'right') pdf.text(text, x + w - pad, ty, { align: 'right', maxWidth: maxW });
  else pdf.text(text, x + pad, ty, { maxWidth: maxW });
}

// ─── CAT1 / CAT2 (mirrors EvaluacionFisicaContent.tsx) ────────────────────────

const CAT1 = [
  { key: 'negroCompleto',  label: 'Negro completo',               factor: 1 },
  { key: 'agrioCompleto',  label: 'Agrio completo',               factor: 1 },
  { key: 'cerezaSeca',     label: 'Cereza seca / Capulín',        factor: 1 },
  { key: 'danoHongos',     label: 'Daño de hongos',               factor: 1 },
  { key: 'materiaExtrana', label: 'Materia extraña',              factor: 1 },
  { key: 'brocaSevera',    label: 'Broca severa',                 factor: 1 },
];

const CAT2 = [
  { key: 'negroParcial',  label: 'Negro parcial',               factor: 3  },
  { key: 'agrioPartial',  label: 'Agrio parcial',               factor: 3  },
  { key: 'pergamino',     label: 'Pergamino',                   factor: 5  },
  { key: 'flotador',      label: 'Flotador',                    factor: 5  },
  { key: 'inmaduro',      label: 'Inmaduro',                    factor: 5  },
  { key: 'averanado',     label: 'Averanado / marchito',        factor: 5  },
  { key: 'conchas',       label: 'Conchas',                     factor: 5  },
  { key: 'rotosPartidos', label: 'Rotos / mordidos / partidos', factor: 5  },
  { key: 'cascaras',      label: 'Cáscaras',                    factor: 5  },
  { key: 'brocaLeve',     label: 'Broca leve',                  factor: 10 },
];

// ─── Sensorial PDF (Café SCA) ──────────────────────────────────────────────────

export function buildSensorialCafePdfDirect(info: PdfMuestraInfo, scaData: any): Blob {
  const pdf = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
  const M  = 10;
  const TW = 297 - M * 2;
  const sc = pdf.internal.scaleFactor;

  let y = drawPdfHeader(pdf, info);

  // Subtitle
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8.5);
  pdf.setTextColor(26, 43, 35);
  pdf.text('FORMULARIO DE CATACIÓN — PROTOCOLO SCA', M, y);
  y += 7;

  const h = scaData?.header ?? {};
  const s = scaData?.sample ?? {};
  const toBoolArr = (v: unknown): boolean[] =>
    Array.isArray(v) ? (v as boolean[]) : [true, true, true, true, true];

  // Header info row (Nombre / Fecha / Mesa / Sesión)
  const hFields: [string, string][] = [
    ['Nombre', h.nombre  || '—'],
    ['Fecha',  h.fecha   || '—'],
    ['Mesa',   h.mesa    || '—'],
    ['Sesión', h.session || '—'],
  ];
  const hColW = TW / hFields.length;
  let hx = M;
  for (const [k, v] of hFields) {
    cell(pdf, hx, y, hColW, 6, `${k}: ${v}`, { fontSize: 7, bg: [240, 244, 241] });
    hx += hColW;
  }
  y += 9;

  // ── Column definitions ──
  const COL_DEFS = [
    { hdr: ['Muestra #', 'Nivel Tueste'], w: 18 },
    { hdr: ['Fragancia', '/ Aroma'],      w: 30 },
    { hdr: ['Sabor'],                      w: 20 },
    { hdr: ['Sabor', 'Residual'],          w: 20 },
    { hdr: ['Acidez'],                     w: 22 },
    { hdr: ['Cuerpo'],                     w: 22 },
    { hdr: ['Uniformidad'],                w: 22 },
    { hdr: ['Balance'],                    w: 20 },
    { hdr: ['Taza', 'Limpia'],             w: 22 },
    { hdr: ['Dulzor'],                     w: 22 },
    { hdr: ['Puntaje', 'Catador'],         w: 20 },
    { hdr: ['Defectos', '(sustraer)'],     w: 22 },
    { hdr: ['Suma'],                       w: 17 },
  ];
  const rawTW   = COL_DEFS.reduce((a, c) => a + c.w, 0);
  const colW    = COL_DEFS.map(c => (c.w / rawTW) * TW);

  // ── Table header row ──
  const HDR_H = 8;
  let cx = M;
  for (let i = 0; i < COL_DEFS.length; i++) {
    pdf.setFillColor(26, 43, 35);
    pdf.setDrawColor(60, 60, 60);
    pdf.setLineWidth(0.3);
    pdf.rect(cx, y, colW[i], HDR_H, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(5.5);
    pdf.setTextColor(255, 255, 255);
    const lines = COL_DEFS[i].hdr;
    const ls = 3.3;
    const sy = y + (HDR_H - lines.length * ls) / 2 + ls * 0.75;
    for (let li = 0; li < lines.length; li++) {
      pdf.text(lines[li], cx + colW[i] / 2, sy + li * ls, { align: 'center', maxWidth: colW[i] - 2 });
    }
    cx += colW[i];
  }
  y += HDR_H;

  // ── Score values ──
  const fragTotal     = +(s.fragTotal     ?? 6);
  const sabor         = +(s.sabor         ?? 6);
  const saborResidual = +(s.saborResidual ?? 6);
  const acidez        = +(s.acidez        ?? 6);
  const cuerpo        = +(s.cuerpo        ?? 6);
  const balance       = +(s.balance       ?? 6);
  const puntosCatador = +(s.puntosCatador ?? 6);
  const unifArr       = toBoolArr(s.uniformidad);
  const tazaArr       = toBoolArr(s.tazaLimpia);
  const dulzorArr     = toBoolArr(s.dulzor);
  const unifTotal     = unifArr.filter(Boolean).length * 2;
  const tazaTotal     = tazaArr.filter(Boolean).length * 2;
  const dulzorTotal   = dulzorArr.filter(Boolean).length * 2;
  const defectoTazas  = +(s.defectoTazas ?? 0);
  const defMult       = s.defectoTipo === 'rechazo' ? 4 : 2;
  const def           = defectoTazas * defMult;
  const suma          = fragTotal + sabor + saborResidual + acidez + cuerpo
    + unifTotal + balance + tazaTotal + dulzorTotal + puntosCatador;
  const finalScore    = suma - def;

  const ROW_H = 46;

  // ── Per-cell drawing helpers (closures over pdf & sc) ──

  function cellBg(x: number, ry: number, w: number) {
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(60, 60, 60);
    pdf.setLineWidth(0.3);
    pdf.rect(x, ry, w, ROW_H, 'FD');
  }

  // Returns the y position after the last drawn element
  function drawScaSlider(x: number, ry: number, w: number, value: number, extraLines?: string[]): number {
    const pad = 1.5;
    let cy = ry + 2;

    // "Total:" label + value box
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(5.5);
    pdf.setTextColor(55, 65, 81);
    pdf.text('Total:', x + pad, cy + 2.5);
    const lw = pdf.getStringUnitWidth('Total:') * 5.5 / sc;

    const vbX = x + pad + lw + 0.8;
    const vbW = w - pad - lw - pad - 0.8;
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.25);
    pdf.rect(vbX, cy, vbW, 3.5, 'S');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.setTextColor(0, 0, 0);
    pdf.text(value.toFixed(2), vbX + vbW / 2, cy + 2.5, { align: 'center' });

    cy += 5.5;

    // Slider track
    const tx1 = x + pad + 1;
    const tx2 = x + w - pad - 1;
    const tw  = tx2 - tx1;
    const fillW = Math.max(0, Math.min(tw, ((value - 6) / 4) * tw));

    pdf.setFillColor(210, 210, 210);
    pdf.rect(tx1, cy + 0.5, tw, 1.5, 'F');
    if (fillW > 0) {
      pdf.setFillColor(26, 43, 35);
      pdf.rect(tx1, cy + 0.5, fillW, 1.5, 'F');
    }
    // Thumb circle
    pdf.setFillColor(26, 43, 35);
    pdf.circle(tx1 + fillW, cy + 1.25, 1.5, 'F');

    cy += 4;

    // Tick marks 6 7 8 9 10
    for (const tick of [6, 7, 8, 9, 10]) {
      const tickX = tx1 + ((tick - 6) / 4) * tw;
      pdf.setDrawColor(160, 160, 160);
      pdf.setLineWidth(0.2);
      pdf.line(tickX, cy, tickX, cy + 1.5);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(3.5);
      pdf.setTextColor(140, 140, 140);
      pdf.text(String(tick), tickX, cy + 3.5, { align: 'center' });
    }

    cy += 5.5;

    // Extra text lines (Seco, Espuma, etc.)
    if (extraLines) {
      for (const line of extraLines) {
        if (!line) continue;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(4.8);
        pdf.setTextColor(70, 70, 70);
        pdf.text(line, x + pad, cy + 2.5, { maxWidth: w - pad * 2 });
        cy += 4;
      }
    }
    return cy;
  }

  function drawChecks5(x: number, ry: number, w: number, values: boolean[], total: number) {
    const pad = 1.5;
    let cy = ry + 2;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(5.5);
    pdf.setTextColor(55, 65, 81);
    pdf.text('Total:', x + pad, cy + 2.5);
    const lw = pdf.getStringUnitWidth('Total:') * 5.5 / sc;

    const vbX = x + pad + lw + 0.8;
    const vbW = w - pad - lw - pad - 0.8;
    pdf.setFillColor(245, 245, 245);
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.25);
    pdf.rect(vbX, cy, vbW, 3.5, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.setTextColor(0, 0, 0);
    pdf.text(String(total), vbX + vbW / 2, cy + 2.5, { align: 'center' });

    cy += 7;

    const n      = 5;
    const boxSz  = Math.min(3.8, (w - pad * 2) / n - 0.8);
    const gap    = (w - pad * 2 - n * boxSz) / (n - 1);
    let bx       = x + pad;

    for (let i = 0; i < n; i++) {
      const checked = values[i] ?? true;
      if (checked) {
        pdf.setFillColor(0, 0, 0);
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.2);
        pdf.rect(bx, cy, boxSz, boxSz, 'F');
        // White checkmark
        pdf.setDrawColor(255, 255, 255);
        pdf.setLineWidth(0.55);
        pdf.line(bx + boxSz * 0.15, cy + boxSz * 0.55, bx + boxSz * 0.42, cy + boxSz * 0.82);
        pdf.line(bx + boxSz * 0.42, cy + boxSz * 0.82, bx + boxSz * 0.88, cy + boxSz * 0.2);
      } else {
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);
        pdf.rect(bx, cy, boxSz, boxSz, 'FD');
      }
      bx += boxSz + gap;
    }
  }

  function drawToggle(x: number, ry: number, w: number, label: string, value: 'alto' | 'bajo' | '') {
    const pad = 1.5;
    let cy = ry;

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(4.5);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${label}:`, x + pad, cy + 3);
    cy += 4;

    const btnW = (w - pad * 2 - 0.5) / 2;
    for (const [i, opt] of (['alto', 'bajo'] as const).entries()) {
      const active = value === opt;
      const bx = x + pad + i * (btnW + 0.5);
      if (active) {
        pdf.setFillColor(26, 43, 35);
        pdf.setDrawColor(26, 43, 35);
        pdf.rect(bx, cy, btnW, 3.5, 'F');
        pdf.setTextColor(255, 255, 255);
      } else {
        pdf.setFillColor(255, 255, 255);
        pdf.setDrawColor(100, 100, 100);
        pdf.setLineWidth(0.2);
        pdf.rect(bx, cy, btnW, 3.5, 'FD');
        pdf.setTextColor(80, 80, 80);
      }
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(4.5);
      pdf.text(opt.toUpperCase(), bx + btnW / 2, cy + 2.5, { align: 'center' });
    }
  }

  // ── Data row ──
  cx = M;

  // Col 0 — Muestra # / Nivel Tueste
  {
    const cw = colW[0];
    cellBg(cx, y, cw);
    const pad = 1.5;
    let cy = y + 2;

    // # + value box
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(5.5);
    pdf.setTextColor(100, 100, 100);
    pdf.text('#', cx + pad, cy + 2.5);
    const hashW = pdf.getStringUnitWidth('#') * 5.5 / sc;
    const nbX = cx + pad + hashW + 0.8;
    const nbW = cw - pad - hashW - pad - 0.8;
    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.25);
    pdf.rect(nbX, cy, nbW, 3.5, 'S');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.setTextColor(0, 0, 0);
    pdf.text(s.numero || '—', nbX + nbW / 2, cy + 2.5, { align: 'center' });

    cy += 7;

    // 5 roast-level squares
    const ROAST_HEX = ['D4B07A', 'B8783A', '8C5120', '5E2F0A', '2D1200'];
    const sqSz = Math.min(3.8, (cw - pad * 2) / 5 - 0.5);
    const sqGap = (cw - pad * 2 - 5 * sqSz) / 4;
    let bx = cx + pad;
    const nivelTueste = s.nivelTueste ?? 2;
    for (let i = 0; i < 5; i++) {
      const hex = ROAST_HEX[i];
      pdf.setFillColor(parseInt(hex.slice(0,2),16), parseInt(hex.slice(2,4),16), parseInt(hex.slice(4,6),16));
      if (nivelTueste === i) {
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.7);
        pdf.rect(bx - 0.4, cy - 0.4, sqSz + 0.8, sqSz + 0.8, 'FD');
      } else {
        pdf.setDrawColor(160, 160, 160);
        pdf.setLineWidth(0.2);
        pdf.rect(bx, cy, sqSz, sqSz, 'FD');
      }
      bx += sqSz + sqGap;
    }
    cx += cw;
  }

  // Col 1 — Fragancia / Aroma
  {
    const cw = colW[1];
    cellBg(cx, y, cw);
    drawScaSlider(cx, y, cw, fragTotal, [
      `Seco: ${s.fragSeco || '—'}`,
      `Cualid.: ${s.fragCualidades || '—'}`,
      `Espuma: ${s.fragEspuma || '—'}`,
    ]);
    cx += cw;
  }

  // Col 2 — Sabor
  { const cw = colW[2]; cellBg(cx, y, cw); drawScaSlider(cx, y, cw, sabor); cx += cw; }

  // Col 3 — Sabor Residual
  { const cw = colW[3]; cellBg(cx, y, cw); drawScaSlider(cx, y, cw, saborResidual); cx += cw; }

  // Col 4 — Acidez
  {
    const cw = colW[4];
    cellBg(cx, y, cw);
    const afterSlider = drawScaSlider(cx, y, cw, acidez);
    drawToggle(cx, afterSlider, cw, 'Intensidad', s.acidezIntensidad || '');
    cx += cw;
  }

  // Col 5 — Cuerpo
  {
    const cw = colW[5];
    cellBg(cx, y, cw);
    const afterSlider = drawScaSlider(cx, y, cw, cuerpo);
    drawToggle(cx, afterSlider, cw, 'Nivel', s.cuerpoNivel || '');
    cx += cw;
  }

  // Col 6 — Uniformidad
  { const cw = colW[6]; cellBg(cx, y, cw); drawChecks5(cx, y, cw, unifArr, unifTotal); cx += cw; }

  // Col 7 — Balance
  { const cw = colW[7]; cellBg(cx, y, cw); drawScaSlider(cx, y, cw, balance); cx += cw; }

  // Col 8 — Taza Limpia
  { const cw = colW[8]; cellBg(cx, y, cw); drawChecks5(cx, y, cw, tazaArr, tazaTotal); cx += cw; }

  // Col 9 — Dulzor
  { const cw = colW[9]; cellBg(cx, y, cw); drawChecks5(cx, y, cw, dulzorArr, dulzorTotal); cx += cw; }

  // Col 10 — Puntaje Catador
  { const cw = colW[10]; cellBg(cx, y, cw); drawScaSlider(cx, y, cw, puntosCatador); cx += cw; }

  // Col 11 — Defectos
  {
    const cw = colW[11];
    cellBg(cx, y, cw);
    const pad = 1.5;
    let cy = y + 2;

    // Radio buttons: ligero / rechazo
    for (const opt of ['ligero', 'rechazo'] as const) {
      const selected = (s.defectoTipo ?? 'ligero') === opt;
      const rr = 1.3;
      const rx = cx + pad + rr;

      pdf.setDrawColor(80, 80, 80);
      pdf.setLineWidth(0.3);
      if (selected) {
        pdf.setFillColor(26, 43, 35);
        pdf.circle(rx, cy + rr, rr, 'FD');
        pdf.setFillColor(255, 255, 255);
        pdf.circle(rx, cy + rr, 0.5, 'F');
      } else {
        pdf.setFillColor(255, 255, 255);
        pdf.circle(rx, cy + rr, rr, 'FD');
      }
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(4.8);
      pdf.setTextColor(50, 50, 50);
      const mult = opt === 'ligero' ? 2 : 4;
      pdf.text(`${opt.charAt(0).toUpperCase()}${opt.slice(1)} = ${mult}`, rx + rr + 1, cy + rr + 0.8);
      cy += rr * 2 + 2;
    }
    cy += 2;

    // # tazas × intensidad = total
    const bw3 = (cw - pad * 2) / 3;
    const bh  = 4.5;

    // Column labels
    for (const [i, lbl] of ['# Tazas', '×', 'Total'].entries()) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(4);
      pdf.setTextColor(120, 120, 120);
      pdf.text(lbl, cx + pad + i * bw3 + bw3 / 2, cy + 2, { align: 'center' });
    }
    cy += 3;

    for (let i = 0; i < 3; i++) {
      const val = [String(defectoTazas), String(defMult), String(def)][i];
      const bx  = cx + pad + i * bw3;
      if (i === 1) {
        // × separator
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(6);
        pdf.setTextColor(100, 100, 100);
        pdf.text('×', bx + bw3 / 2, cy + 3.2, { align: 'center' });
      } else {
        const isTot = i === 2;
        pdf.setFillColor(isTot && def > 0 ? 255 : 255, isTot && def > 0 ? 235 : 255, isTot && def > 0 ? 235 : 255);
        pdf.setDrawColor(100, 100, 100);
        pdf.setLineWidth(0.25);
        pdf.rect(bx, cy, bw3, bh, 'FD');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(6.5);
        pdf.setTextColor(isTot && def > 0 ? 160 : 0, 0, 0);
        pdf.text(val, bx + bw3 / 2, cy + 3.2, { align: 'center' });
      }
    }
    cx += cw;
  }

  // Col 12 — Suma
  {
    const cw = colW[12];
    pdf.setFillColor(240, 248, 244);
    pdf.setDrawColor(60, 60, 60);
    pdf.setLineWidth(0.3);
    pdf.rect(cx, y, cw, ROW_H, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.setTextColor(20, 20, 20);
    pdf.text(suma.toFixed(2), cx + cw / 2, y + ROW_H / 2 + 3, { align: 'center' });
    cx += cw;
  }

  y += ROW_H + 3;

  // ── Notes + Final Score section ──
  const sectionH = 32;
  const scoreW   = 50;
  const notesW   = TW - scoreW;

  pdf.setFillColor(250, 252, 250);
  pdf.setDrawColor(160, 160, 160);
  pdf.setLineWidth(0.3);
  pdf.rect(M, y, notesW, sectionH, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(26, 43, 35);
  pdf.text('Notas de catación', M + 2, y + 4);

  const noteItems: [string, string][] = [
    ['Nota Sabor',          s.notaSabor        || '—'],
    ['Nota Sabor Residual', s.notaSaborResidual || '—'],
    ['Nota Acidez',         s.notaAcidez        || '—'],
    ['Notas',               s.notas             || '—'],
  ];
  let ny = y + 9;
  for (const [k, v] of noteItems) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.5);
    pdf.setTextColor(55, 65, 81);
    const kw = pdf.getStringUnitWidth(`${k}: `) * 6.5 / sc;
    pdf.text(`${k}: `, M + 2, ny);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(85, 85, 85);
    pdf.text(String(v), M + 2 + kw, ny, { maxWidth: notesW - kw - 4 });
    ny += 5.5;
  }

  // Score box
  const scoreX = M + notesW;
  pdf.setFillColor(26, 43, 35);
  pdf.rect(scoreX, y, scoreW, sectionH, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(7);
  pdf.setTextColor(255, 255, 255);
  pdf.text('PUNTAJE FINAL', scoreX + scoreW / 2, y + 6, { align: 'center' });

  pdf.setFontSize(24);
  pdf.text(finalScore.toFixed(2), scoreX + scoreW / 2, y + 18, { align: 'center' });

  const clasif = finalScore >= 90 ? 'Extraordinario' : finalScore >= 85 ? 'Excelente' : finalScore >= 80 ? 'Muy Bueno' : 'No especialidad';
  pdf.setFontSize(7.5);
  pdf.text(clasif, scoreX + scoreW / 2, y + 24, { align: 'center' });

  if (def > 0) {
    pdf.setFontSize(5.5);
    pdf.setTextColor(180, 220, 200);
    pdf.text(`${suma.toFixed(2)} − ${def} def.`, scoreX + scoreW / 2, y + 29, { align: 'center' });
  }

  return pdf.output('blob');
}

// ─── Física PDF (Café Verde SCA) ───────────────────────────────────────────────

export function buildFisicaCafePdfDirect(info: PdfMuestraInfo, evaluacionFisica: any): Blob {
  const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
  const M  = 10;
  const TW = 210 - M * 2;

  let y = drawPdfHeader(pdf, info);

  const DARK:  [number, number, number] = [26, 43, 35];
  const SECBG: [number, number, number] = [240, 245, 242];
  const WHITE: [number, number, number] = [255, 255, 255];

  const camposJson   = (evaluacionFisica as any)?.camposJson ?? {};
  const humedadGrano   = camposJson.cafeHumedadGrano;
  const actividadGrano = camposJson.cafeActividadGrano;
  let det: any = {};
  try { det = JSON.parse(camposJson.cafeVerdeDetalle ?? '{}'); } catch {}

  const cat1Det = det.cat1   ?? {};
  const cat2Det = det.cat2   ?? {};
  const tostado = det.tostado ?? {};
  const fecha   = (evaluacionFisica as any)?.fecha ?? (evaluacionFisica as any)?.fechaEvaluacion ?? '';
  const obs     = (evaluacionFisica as any)?.observaciones ?? '';

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(26, 43, 35);
  pdf.text('EVALUACIÓN FÍSICA DE CAFÉ VERDE — PROTOCOLO SCA', M, y);
  y += 7;

  function secTitle(title: string) {
    pdf.setFillColor(DARK[0], DARK[1], DARK[2]);
    pdf.rect(M, y, TW, 5.5, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(255, 255, 255);
    pdf.text(title, M + 2, y + 3.8);
    y += 5.5;
  }

  // 1. Datos Generales
  secTitle('1. DATOS GENERALES');
  const genRows: [string, string][] = [
    ['Nombre',        det.nombre    || '—'],
    ['Evaluador',     det.evaluador || '—'],
    ['Fecha',         fecha         || '—'],
    ['Humedad grano', humedadGrano  != null ? `${humedadGrano}%` : '—'],
    ['Act. de agua',  actividadGrano != null ? String(actividadGrano) : '—'],
    ['Observaciones', obs           || '—'],
  ];
  const lW = TW * 0.35;
  const vW = TW * 0.65;
  for (const [k, v] of genRows) {
    cell(pdf, M,      y, lW, 5.5, k, { fontSize: 7, bold: true, bg: SECBG });
    cell(pdf, M + lW, y, vW, 5.5, v, { fontSize: 7,             bg: WHITE });
    y += 5.5;
  }
  y += 4;

  // 2. Análisis de Tostado
  secTitle('2. ANÁLISIS DE TOSTADO');
  const tostCols = ['Muestra #', 'Color', 'Olor', 'Quakers', 'Grado'];
  const tostVals = [
    tostado.muestraNo || '—',
    tostado.color     || '—',
    tostado.olor      || '—',
    tostado.quakers   != null ? String(tostado.quakers) : '—',
    tostado.grado     || '—',
  ];
  const tcW = TW / tostCols.length;
  let tx = M;
  for (const hdr of tostCols) {
    cell(pdf, tx, y, tcW, 5.5, hdr, { fontSize: 6.5, bold: true, bg: SECBG, align: 'center' });
    tx += tcW;
  }
  y += 5.5;
  tx = M;
  for (const v of tostVals) {
    cell(pdf, tx, y, tcW, 5.5, v, { fontSize: 7, bg: WHITE, align: 'center' });
    tx += tcW;
  }
  y += 7;

  // Defect table helper
  const dCols = [
    { w: TW * 0.46 },
    { w: TW * 0.14 },
    { w: TW * 0.20 },
    { w: TW * 0.20 },
  ];
  const dHdrs = ['Defecto', 'Factor', 'Granos', 'Equivalentes'];

  function drawDefectTable(rows: typeof CAT1, catData: any): number {
    let dx = M;
    for (let i = 0; i < dCols.length; i++) {
      cell(pdf, dx, y, dCols[i].w, 5.5, dHdrs[i], { fontSize: 6.5, bold: true, bg: SECBG, align: 'center' });
      dx += dCols[i].w;
    }
    y += 5.5;
    let subtotal = 0;
    for (const row of rows) {
      const granos = Number(catData[row.key]?.granos ?? 0);
      const equiv  = granos > 0 ? Math.ceil(granos / row.factor) : 0;
      subtotal += equiv;
      dx = M;
      cell(pdf, dx, y, dCols[0].w, 5, row.label,                          { fontSize: 6.5, bg: WHITE }); dx += dCols[0].w;
      cell(pdf, dx, y, dCols[1].w, 5, String(row.factor),                 { fontSize: 6.5, bg: WHITE, align: 'center' }); dx += dCols[1].w;
      cell(pdf, dx, y, dCols[2].w, 5, granos > 0 ? String(granos) : '—', { fontSize: 6.5, bg: WHITE, align: 'center' }); dx += dCols[2].w;
      cell(pdf, dx, y, dCols[3].w, 5, equiv > 0  ? String(equiv)  : '—', { fontSize: 6.5, bg: WHITE, align: 'center' });
      y += 5;
    }
    const stW = dCols[0].w + dCols[1].w + dCols[2].w;
    cell(pdf, M,       y, stW,        5.5, 'Subtotal', { fontSize: 7, bold: true, bg: SECBG });
    cell(pdf, M + stW, y, dCols[3].w, 5.5, String(subtotal), { fontSize: 7, bold: true, bg: SECBG, align: 'center' });
    y += 5.5;
    return subtotal;
  }

  secTitle('3. DEFECTOS CATEGORÍA 1  (factor: 1 grano = 1 equivalente)');
  const sub1 = drawDefectTable(CAT1, cat1Det);
  y += 3;

  secTitle('4. DEFECTOS CATEGORÍA 2');
  const sub2 = drawDefectTable(CAT2, cat2Det);
  y += 4;

  // Total
  const total   = sub1 + sub2;
  const stW     = dCols[0].w + dCols[1].w + dCols[2].w;
  cell(pdf, M,       y, stW,        7, 'TOTAL DEFECTOS', { fontSize: 8, bold: true, bg: DARK, color: WHITE });
  cell(pdf, M + stW, y, dCols[3].w, 7, String(total),    { fontSize: 9, bold: true, bg: SECBG, align: 'center' });
  y += 10;

  // Grade
  const grade      = det.grado      ?? '—';
  const gradeLabel = det.gradoLabel  ?? '';
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(26, 43, 35);
  pdf.text(`Grado: ${grade}${gradeLabel ? `  —  ${gradeLabel}` : ''}`, M, y);

  return pdf.output('blob');
}
