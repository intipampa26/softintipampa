interface Props { title: string }

export function ComingSoonPage({ title }: Props) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm max-w-xs">
        Este módulo está en desarrollo y estará disponible próximamente.
      </p>
      <span className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
        Próximamente
      </span>
    </div>
  );
}
