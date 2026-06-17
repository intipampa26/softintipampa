import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { CampanaProvider } from '@/contexts/CampanaContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { syncService } from '@/services/sync.service';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { justReconnected } = useNetworkStatus();

  
  
  useEffect(() => {
    if (justReconnected) {
      syncService.flush().catch(() => {});
    }
  }, [justReconnected]);

  return (
    <CampanaProvider>
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <OfflineIndicator />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <header
          className="md:hidden flex items-center justify-between px-4 py-3 shrink-0 border-b border-white/10"
          style={{ backgroundColor: '#1A2B23' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <img
            src="/logo.png"
            alt="Collective Bean"
            style={{ height: '28px', filter: 'brightness(0) invert(1)' }}
          />

          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
    </CampanaProvider>
  );
}
