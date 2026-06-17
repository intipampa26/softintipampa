import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const IconCampanas = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="3" y="4" width="18" height="18" rx="3"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <circle cx="8"  cy="15" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="15" r="1.2" fill="currentColor" stroke="none"/>
    <circle cx="16" cy="15" r="1.2" fill="currentColor" stroke="none"/>
  </svg>
);

const IconProductores = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="2" y="3" width="20" height="18" rx="3"/>
    <circle cx="9" cy="10" r="2.5"/>
    <path d="M5 19c0-2.2 1.8-4 4-4s4 1.8 4 4"/>
    <line x1="15" y1="8" x2="19" y2="8"/><line x1="15" y1="12" x2="19" y2="12"/>
    <line x1="15" y1="16" x2="17" y2="16"/>
  </svg>
);

const IconClientes = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <circle cx="12" cy="10" r="3"/>
    <path d="M6 20c0-2.8 2.7-5 6-5s6 2.2 6 5"/>
  </svg>
);

const IconLotes = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const IconMuestras = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M17 8h1a4 4 0 010 8h-1"/>
    <path d="M3 8h14v9a4 4 0 01-4 4H7a4 4 0 01-4-4V8z"/>
    <line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/>
    <line x1="14" y1="2" x2="14" y2="4"/>
  </svg>
);

const IconGestion = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="2" y="7" width="20" height="14" rx="3"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);

const IconKardex = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M3 6h18"/><path d="M3 6l2 13h14l2-13"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    <line x1="6" y1="11" x2="18" y2="11"/>
    <line x1="7" y1="15" x2="17" y2="15"/>
  </svg>
);

const IconReportes = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="3" y="3" width="18" height="18" rx="3"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="9" x2="9" y2="21"/>
    <polyline points="13 13 16 16 21 11"/>
  </svg>
);

const IconConfiguracion = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);

const NAV_ITEMS = [
  { label: 'CAMPAÑAS',       to: '/dashboard/campanas',       Icon: IconCampanas       },
  { label: 'PRODUCTORES',    to: '/dashboard/productores',    Icon: IconProductores    },
  { label: 'CLIENTES',       to: '/dashboard/clientes',       Icon: IconClientes       },
  { label: 'LOTES',          to: '/dashboard/lotes',          Icon: IconLotes          },
  { label: 'MUESTRAS',       to: '/dashboard/muestras',       Icon: IconMuestras       },
  { label: 'GESTIÓN',        to: '/dashboard/gestion',        Icon: IconGestion        },
  { label: 'KARDEX',         to: '/dashboard/kardex',         Icon: IconKardex         },
  { label: 'REPORTES',       to: '/dashboard/reportes',       Icon: IconReportes       },
  { label: 'CONFIGURACIÓN',  to: '/dashboard/configuracion',  Icon: IconConfiguracion  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside
      className={[
        
        'fixed inset-y-0 left-0 z-40 flex flex-col h-full w-64 shrink-0 overflow-y-auto',
        'transition-transform duration-300 ease-in-out',
        
        isOpen ? 'translate-x-0' : '-translate-x-full',
        
        'md:relative md:translate-x-0 md:sticky md:top-0 md:h-screen md:w-56',
      ].join(' ')}
      style={{ backgroundColor: '#1A2B23' }}
    >
      <div className="px-6 pt-8 pb-6 flex items-center justify-between">
        <img
          src="/logo.png"
          alt="Collective Bean"
          onClick={() => { navigate('/dashboard'); onClose(); }}
          style={{ width: '130px', filter: 'brightness(0) invert(1)', cursor: 'pointer' }}
        />
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Cerrar menú"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="mx-8 mb-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <nav className="flex-1 flex flex-col px-4 gap-0.5">
        {NAV_ITEMS.map(({ label, to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              ['nav-item', isActive ? 'nav-item--active' : ''].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-green-400" />
                )}

                <span
                  className="nav-icon shrink-0"
                  style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.38)' }}
                >
                  <Icon />
                </span>

                <span
                  className="nav-label font-semibold tracking-[0.16em]"
                  style={{
                    fontSize: '0.67rem',
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.38)',
                  }}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mx-5 mt-4 mb-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <div className="px-4 pb-6">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center gap-3 px-3 py-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm uppercase"
              style={{ backgroundColor: 'rgba(163,230,53,0.15)', color: '#a3e635' }}
            >
              {user?.username?.[0] ?? '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate capitalize">
                {user?.username ?? 'Usuario'}
              </p>
              <p
                className="text-[0.62rem] font-medium uppercase tracking-wider truncate"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                {user?.role ?? 'admin'}
              </p>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.06)' }} />

          <button
            onClick={() => { logout(); navigate('/login', { replace: true }); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold transition-all duration-150 hover:bg-red-500/10 active:scale-[0.98]"
            style={{ color: 'rgba(248,113,113,0.75)' }}
          >
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
