

const DEFAULT_LIMIT_OPTIONS = [5, 10, 20];

interface TablePaginationProps {
  total: number;
  page: number;
  lastPage: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limitOptions?: number[];
}

export function TablePagination({
  total,
  page,
  lastPage,
  limit,
  onPageChange,
  onLimitChange,
  limitOptions = DEFAULT_LIMIT_OPTIONS,
}: TablePaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to   = Math.min(page * limit, total);

  
  const pages: (number | '…')[] = [];
  if (lastPage <= 7) {
    for (let i = 1; i <= lastPage; i++) pages.push(i);
  } else {
    const all = Array.from({ length: lastPage }, (_, i) => i + 1)
      .filter((p) => p === 1 || p === lastPage || Math.abs(p - page) <= 1);
    all.forEach((p, idx) => {
      if (idx > 0 && p - (all[idx - 1] as number) > 1) pages.push('…');
      pages.push(p);
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3 border-t border-gray-100 bg-gray-50">

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span>
          {total === 0 ? '0 resultados' : `${from}–${to} de ${total}`}
        </span>
        <span className="text-gray-300">|</span>
        <span className="flex items-center gap-1.5">
          Filas:
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-1.5 py-0.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
          >
            {limitOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={page === 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Primera página"
        >
          «
        </button>
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ‹
        </button>

        {pages.map((item, idx) =>
          item === '…' ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-7 h-7 flex items-center justify-center text-xs text-gray-400"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item as number)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition-colors"
              style={
                item === page
                  ? { backgroundColor: '#1A2B23', color: '#fff' }
                  : { color: '#6b7280' }
              }
              onMouseEnter={(e) => {
                if (item !== page)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (item !== page)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
              }}
            >
              {item}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === lastPage}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ›
        </button>
        <button
          onClick={() => onPageChange(lastPage)}
          disabled={page === lastPage}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Última página"
        >
          »
        </button>
      </div>
    </div>
  );
}
