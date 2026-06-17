import { useState, useEffect } from 'react';
import {
  IICTEData, CategoriaBase, DefectoEntry, SaborDescriptor,
  calcCalidadDefecto, calcPuntajeTotal, getInterpretacion,
  checkAmargorAstringenciaWarning, getCalidadColor, getCalidadLabel,
  INTENSIDAD_LABELS, INTENSIDAD_COLORS, DEFECTO_CATALOG,
  SABOR_DESCRIPTORES_CATALOG, PESOS, PUNTAJE_MAX,
  buildInitialIICTEData,
} from '@/utils/cacao-grading';

export type { IICTEData };

function IntensityPicker({
  value, onChange, disabled = false, size = 'md',
}: {
  value: number; onChange: (v: number) => void;
  disabled?: boolean; size?: 'sm' | 'md';
}) {
  const d = size === 'sm' ? 'w-6 h-6 text-[0.6rem]' : 'w-7 h-7 text-xs';
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1 flex-wrap">
        {[0, 1, 2, 3, 4, 5].map(i => {
          const active = value === i;
          return (
            <button
              key={i} type="button" disabled={disabled}
              onClick={() => onChange(i)}
              title={`${i} — ${INTENSIDAD_LABELS[i]}`}
              className={`${d} rounded-full font-bold border-2 transition-all duration-150 select-none shrink-0
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-110 active:scale-95'}`}
              style={active ? {
                backgroundColor: INTENSIDAD_COLORS[i],
                borderColor:     INTENSIDAD_COLORS[i],
                color:           i === 0 ? '#6B7280' : '#fff',
                transform:       'scale(1.18)',
                boxShadow:       `0 0 0 3px ${INTENSIDAD_COLORS[i]}44`,
              } : {
                backgroundColor: '#fff',
                borderColor:     '#E5E7EB',
                color:           '#9CA3AF',
              }}
            >{i}</button>
          );
        })}
        <span className="text-[0.65rem] text-gray-400 italic ml-1 truncate max-w-[130px]">
          {INTENSIDAD_LABELS[value]}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${(value / 5) * 100}%`, backgroundColor: INTENSIDAD_COLORS[value] }}
        />
      </div>
    </div>
  );
}

function QualityWidget({
  value, onChange, disabled = false, readOnly = false, readLabel,
}: {
  value: number; onChange?: (v: number) => void;
  disabled?: boolean; readOnly?: boolean; readLabel?: string;
}) {
  const color = getCalidadColor(value);
  const label = getCalidadLabel(value);
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {readOnly ? (
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-black" style={{ color }}>{value.toFixed(1)}</span>
            <span
              className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: color + '18', color }}
            >{label}</span>
            {readLabel && (
              <span className="text-[0.6rem] text-gray-400 italic">{readLabel}</span>
            )}
          </div>
        ) : (
          <>
            <input
              type="number" min={0} max={10} step={0.5}
              value={value || ''}
              placeholder="0"
              disabled={disabled}
              onChange={e => {
                const v = parseFloat(e.target.value);
                onChange?.(isNaN(v) ? 0 : Math.min(10, Math.max(0, v)));
              }}
              className="w-16 border-2 rounded-lg px-2 py-1 text-sm font-bold text-center focus:outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: value > 0 ? color + '80' : '#E5E7EB', color }}
            />
            <span
              className="text-[0.62rem] font-bold px-2 py-0.5 rounded-full transition-colors"
              style={{ backgroundColor: color + '15', color }}
            >{label}</span>
          </>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${value * 10}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function SectionHeader({ title, peso, score, scoreMax, note }: {
  title: string; peso: number; score: number; scoreMax: number; note?: string;
}) {
  const pct = scoreMax > 0 ? score / scoreMax : 0;
  const col = score > 0 ? (pct >= 0.7 ? '#059669' : pct >= 0.4 ? '#2563EB' : '#D97706') : '#9CA3AF';
  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-b border-gray-100"
      style={{ backgroundColor: '#F8FAFB' }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-gray-800 uppercase tracking-wider">{title}</span>
        <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full bg-gray-200 text-gray-500">
          ×{peso}
        </span>
        {note && (
          <span className="text-[0.55rem] text-gray-400 italic">{note}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-black" style={{ color: col }}>
          {score > 0 ? score.toFixed(1) : '—'}
        </span>
        <span className="text-[0.6rem] text-gray-300">/ {scoreMax}</span>
      </div>
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-gray-100" />
      <span className="text-[0.6rem] font-bold text-gray-300 uppercase tracking-widest shrink-0">{label}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function CategoryCard({
  label, peso, cat, onChange, disabled, warning,
}: {
  label:    string;
  peso:     number;
  cat:      CategoriaBase;
  onChange: (partial: Partial<CategoriaBase>) => void;
  disabled: boolean;
  warning?: string | null;
}) {
  const score    = cat.calidad * peso;
  const scoreMax = 10 * peso;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <SectionHeader title={label} peso={peso} score={score} scoreMax={scoreMax} />
      <div className="px-4 py-4 space-y-4">
        <div>
          <p className="text-[0.62rem] font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Intensidad
          </p>
          <IntensityPicker
            value={cat.intensidad}
            onChange={v => onChange({ intensidad: v })}
            disabled={disabled}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-[0.62rem] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Calidad (0 – 10)
            </p>
            <QualityWidget
              value={cat.calidad}
              onChange={v => onChange({ calidad: v })}
              disabled={disabled}
            />
          </div>
          <div>
            <p className="text-[0.62rem] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Comentario
            </p>
            <input
              type="text"
              value={cat.comentario}
              onChange={e => onChange({ comentario: e.target.value })}
              placeholder="Descriptor sensorial…"
              disabled={disabled}
              className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-700 placeholder-gray-300 bg-white focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-40"
            />
          </div>
        </div>
        {warning && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200">
            <svg className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            <p className="text-[0.65rem] text-amber-700 font-medium">{warning}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DefectosCard({
  defectos, onChange, disabled,
}: {
  defectos: DefectoEntry[];
  onChange: (next: DefectoEntry[]) => void;
  disabled: boolean;
}) {
  const calidadAuto = calcCalidadDefecto(defectos);
  const score       = calidadAuto * PESOS.defectos;
  const hasActive   = defectos.some(d => d.intensidad > 0);

  const updDefecto = (key: string, partial: Partial<DefectoEntry>) =>
    onChange(defectos.map(d => d.key === key ? { ...d, ...partial } : d));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <SectionHeader
        title="Defectos"
        peso={PESOS.defectos}
        score={score}
        scoreMax={20}
        note="calidad auto-calculada (inversa)"
      />

      
      <div
        className="mx-4 mt-4 px-4 py-3 rounded-xl border flex items-center justify-between"
        style={{
          backgroundColor: hasActive ? '#FFFBEB' : '#F0FDF4',
          borderColor:     hasActive ? '#FDE68A' : '#BBF7D0',
        }}
      >
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-widest text-gray-400">
            Calidad calculada
          </p>
          <p className="text-[0.65rem] text-gray-500 mt-0.5">
            {hasActive
              ? 'calidadDefecto = 10 − (intensidadPromedio × 2)'
              : 'Sin defectos detectados — calidad máxima'}
          </p>
        </div>
        <QualityWidget value={calidadAuto} readOnly readLabel="(auto)" />
      </div>

      
      <div className="px-4 pb-4 mt-3 space-y-3">
        {defectos.map(d => (
          <div
            key={d.key}
            className={`rounded-xl border p-3 transition-colors ${
              d.intensidad > 0
                ? 'border-red-200 bg-red-50'
                : 'border-gray-100 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold ${d.intensidad > 0 ? 'text-red-700' : 'text-gray-600'}`}>
                {d.nombre}
              </span>
              {d.intensidad > 0 && (
                <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                  Detectado
                </span>
              )}
            </div>
            <IntensityPicker
              value={d.intensidad}
              onChange={v => updDefecto(d.key, { intensidad: v })}
              disabled={disabled}
              size="sm"
            />
            {d.intensidad > 0 && (
              <input
                type="text"
                value={d.comentario}
                onChange={e => updDefecto(d.key, { comentario: e.target.value })}
                placeholder="Notas…"
                disabled={disabled}
                className="mt-2 w-full border border-red-200 rounded-lg px-2.5 py-1 text-xs text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:border-red-300 disabled:opacity-40"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SaborCard({
  saborCalidad, onCalidadChange,
  descriptores, onDescriptoresChange,
  disabled,
}: {
  saborCalidad:        number;
  onCalidadChange:     (v: number) => void;
  descriptores:        SaborDescriptor[];
  onDescriptoresChange:(next: SaborDescriptor[]) => void;
  disabled:            boolean;
}) {
  const score = saborCalidad * PESOS.sabor;
  const updDesc = (key: string, partial: Partial<SaborDescriptor>) =>
    onDescriptoresChange(descriptores.map(d => d.key === key ? { ...d, ...partial } : d));

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <SectionHeader title="Sabor" peso={PESOS.sabor} score={score} scoreMax={20} />
      <div className="px-4 pt-4 pb-3 space-y-2">
        <p className="text-[0.62rem] font-semibold text-gray-400 uppercase tracking-widest">
          Calidad general del sabor (0 – 10)
        </p>
        <QualityWidget value={saborCalidad} onChange={onCalidadChange} disabled={disabled} />
      </div>

      <div className="border-t border-gray-100 px-4 py-3">
        <p className="text-[0.62rem] font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Descriptores de sabor (perfil sensorial)
        </p>
        <div className="space-y-3">
          {descriptores.map(d => {
            const isActive = d.intensidad > 0;
            return (
              <div
                key={d.key}
                className={`rounded-xl border p-3 transition-colors ${
                  isActive ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold ${isActive ? 'text-amber-800' : 'text-gray-500'}`}>
                    {d.label}
                  </span>
                  {isActive && (
                    <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-700">
                      Detectado
                    </span>
                  )}
                </div>
                <IntensityPicker
                  value={d.intensidad}
                  onChange={v => updDesc(d.key, { intensidad: v })}
                  disabled={disabled}
                  size="sm"
                />
                {isActive && (
                  <input
                    type="text"
                    value={d.comentario}
                    onChange={e => updDesc(d.key, { comentario: e.target.value })}
                    placeholder={`Notas de ${d.label.toLowerCase()}…`}
                    disabled={disabled}
                    className="mt-2 w-full border border-amber-200 rounded-lg px-2.5 py-1 text-xs text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:border-amber-300 disabled:opacity-40"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ScoreBanner({ puntaje }: { puntaje: number }) {
  const interp = getInterpretacion(puntaje);
  const pct    = Math.min(100, (puntaje / PUNTAJE_MAX) * 100);

  return (
    <div
      className="rounded-2xl border p-4 space-y-3"
      style={{ backgroundColor: interp.bg, borderColor: interp.border }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.6rem] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
            Puntaje sensorial IICTE
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-black leading-none" style={{ color: interp.color }}>
              {puntaje.toFixed(1)}
            </span>
            <span className="text-sm text-gray-400 font-medium">/ {PUNTAJE_MAX}</span>
          </div>
          <p className="text-xs font-bold mt-1" style={{ color: interp.color }}>
            {interp.label}
          </p>
        </div>
        <div
          className="shrink-0 px-3 py-1.5 rounded-xl text-[0.65rem] font-bold text-center max-w-[160px]"
          style={{ backgroundColor: interp.color + '15', color: interp.color }}
        >
          {interp.descripcion}
        </div>
      </div>
      <div className="h-2.5 rounded-full bg-white/60 overflow-hidden border border-white/40">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: interp.color }}
        />
      </div>
    </div>
  );
}

function ScoreBreakdown({
  aroma, acidez, amargor, astringencia, posgusto,
  calidadDefecto, saborCalidad, puntosCatador,
}: {
  aroma: number; acidez: number; amargor: number; astringencia: number; posgusto: number;
  calidadDefecto: number; saborCalidad: number; puntosCatador: number;
}) {
  const items = [
    { label: 'Aroma',     score: aroma,                  max: 10, peso: 1 },
    { label: 'Acidez',    score: acidez,                  max: 10, peso: 1 },
    { label: 'Amargor',   score: amargor,                 max: 10, peso: 1 },
    { label: 'Astringen', score: astringencia,            max: 10, peso: 1 },
    { label: 'Defectos',  score: calidadDefecto * 2,      max: 20, peso: 2 },
    { label: 'Sabor',     score: saborCalidad * 2,        max: 20, peso: 2 },
    { label: 'Posgusto',  score: posgusto,                max: 10, peso: 1 },
    { label: 'Catador',   score: puntosCatador,           max: 10, peso: 1 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
      <p className="text-[0.62rem] font-bold text-gray-400 uppercase tracking-widest mb-4">
        Desglose del puntaje
      </p>
      <div className="space-y-2.5">
        {items.map(({ label, score, max }) => {
          const col = getCalidadColor(score / (max / 10));
          const pct = max > 0 ? (score / max) * 100 : 0;
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="text-[0.65rem] text-gray-500 font-medium w-16 shrink-0 truncate">{label}</span>
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: col }}
                />
              </div>
              <div className="flex items-baseline gap-0.5 w-12 text-right justify-end">
                <span className="text-xs font-bold" style={{ color: score > 0 ? col : '#D1D5DB' }}>
                  {score > 0 ? score.toFixed(1) : '—'}
                </span>
                <span className="text-[0.55rem] text-gray-300">/{max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Props {
  initialData?: Partial<IICTEData>;
  onDataChange: (d: IICTEData) => void;
  disabled?: boolean;
}

export function EvaluacionSensorialCacao({ initialData, onDataChange, disabled = false }: Props) {
  const defaults = buildInitialIICTEData();

  const [fecha,           setFecha]           = useState(initialData?.fecha             ?? defaults.fecha);
  const [evaluador,       setEvaluador]       = useState(initialData?.evaluador         ?? defaults.evaluador);
  const [aroma,           setAroma]           = useState<CategoriaBase>(initialData?.aroma             ?? defaults.aroma);
  const [acidez,          setAcidez]          = useState<CategoriaBase>(initialData?.acidez            ?? defaults.acidez);
  const [amargor,         setAmargor]         = useState<CategoriaBase>(initialData?.amargor           ?? defaults.amargor);
  const [astringencia,    setAstringencia]    = useState<CategoriaBase>(initialData?.astringencia      ?? defaults.astringencia);
  const [posgusto,        setPostgusto]       = useState<CategoriaBase>(initialData?.posgusto          ?? defaults.posgusto);
  const [defectos,        setDefectos]        = useState<DefectoEntry[]>(
    initialData?.defectos?.length
      ? initialData.defectos
      : defaults.defectos,
  );
  const [saborCalidad,    setSaborCalidad]    = useState(initialData?.saborCalidad      ?? defaults.saborCalidad);
  const [saborDesc,       setSaborDesc]       = useState<SaborDescriptor[]>(
    initialData?.saborDescriptores?.length
      ? initialData.saborDescriptores
      : defaults.saborDescriptores,
  );
  const [puntosCatador,   setPuntosCatador]   = useState(initialData?.puntosCatador     ?? defaults.puntosCatador);
  const [comentarios,     setComentarios]     = useState(initialData?.comentarios       ?? defaults.comentarios);

  const calidadDefecto = calcCalidadDefecto(defectos);

  const puntajeTotal = calcPuntajeTotal({
    fecha, evaluador, aroma, acidez, amargor, astringencia, posgusto,
    defectos, saborCalidad, saborDescriptores: saborDesc, puntosCatador, comentarios,
  });

  useEffect(() => {
    onDataChange({
      fecha, evaluador, aroma, acidez, amargor, astringencia, posgusto,
      defectos, saborCalidad, saborDescriptores: saborDesc, puntosCatador, comentarios,
      puntajeTotal,
    });
  }, [fecha, evaluador, aroma, acidez, amargor, astringencia, posgusto,
      defectos, saborCalidad, saborDesc, puntosCatador, comentarios, puntajeTotal, onDataChange]);

  const upd = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (partial: Partial<T>) => setter(prev => ({ ...prev, ...partial }));

  const warnAmargor      = checkAmargorAstringenciaWarning(amargor.intensidad,      amargor.calidad);
  const warnAstringencia = checkAmargorAstringenciaWarning(astringencia.intensidad, astringencia.calidad);

  const inputCls = 'w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-400 transition-colors disabled:opacity-40';

  return (
    <div className="space-y-4">

      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[0.62rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Fecha</label>
          <input type="date" value={fecha} disabled={disabled} onChange={e => setFecha(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="block text-[0.62rem] font-bold text-gray-400 uppercase tracking-widest mb-1">Catador</label>
          <input value={evaluador} disabled={disabled} onChange={e => setEvaluador(e.target.value)} placeholder="Nombre del catador" className={inputCls} />
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">

        
        <div className="space-y-3">
          <Divider label="Atributos sensoriales" />
          <CategoryCard label="Aroma"        peso={PESOS.aroma}        cat={aroma}        onChange={upd(setAroma)}        disabled={disabled} />
          <CategoryCard label="Acidez"       peso={PESOS.acidez}       cat={acidez}       onChange={upd(setAcidez)}       disabled={disabled} />
          <CategoryCard label="Amargor"      peso={PESOS.amargor}      cat={amargor}      onChange={upd(setAmargor)}      disabled={disabled} warning={warnAmargor} />
          <CategoryCard label="Astringencia" peso={PESOS.astringencia} cat={astringencia} onChange={upd(setAstringencia)} disabled={disabled} warning={warnAstringencia} />
          <CategoryCard label="Posgusto"     peso={PESOS.posgusto}     cat={posgusto}     onChange={upd(setPostgusto)}    disabled={disabled} />
        </div>

        
        <div className="space-y-3">
          <Divider label="Defectos" />
          <DefectosCard defectos={defectos} onChange={setDefectos} disabled={disabled} />

          <Divider label="Percepción global" />
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <SectionHeader title="Puntos del catador" peso={PESOS.puntosCatador} score={puntosCatador} scoreMax={10} note="subjetiva global" />
            <div className="px-4 py-4">
              <p className="text-[0.62rem] font-semibold text-gray-400 uppercase tracking-widest mb-2">Calidad (0 – 10)</p>
              <QualityWidget value={puntosCatador} onChange={setPuntosCatador} disabled={disabled} />
            </div>
          </div>

          <div>
            <label className="block text-[0.62rem] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Comentarios generales</label>
            <textarea
              value={comentarios} disabled={disabled}
              onChange={e => setComentarios(e.target.value)}
              rows={5}
              placeholder="Observaciones generales, condiciones de la cata, notas sobre el origen…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white placeholder-gray-300 focus:outline-none focus:border-gray-400 disabled:opacity-40 resize-none transition-colors"
            />
          </div>
        </div>
      </div>

      
      <Divider label="Sabor" />
      <SaborCard
        saborCalidad={saborCalidad}   onCalidadChange={setSaborCalidad}
        descriptores={saborDesc}       onDescriptoresChange={setSaborDesc}
        disabled={disabled}
      />

      
      <ScoreBreakdown
        aroma={aroma.calidad * PESOS.aroma}
        acidez={acidez.calidad * PESOS.acidez}
        amargor={amargor.calidad * PESOS.amargor}
        astringencia={astringencia.calidad * PESOS.astringencia}
        calidadDefecto={calidadDefecto}
        saborCalidad={saborCalidad}
        puntosCatador={puntosCatador}
        posgusto={posgusto.calidad * PESOS.posgusto}
      />
      <ScoreBanner puntaje={puntajeTotal} />
    </div>
  );
}
