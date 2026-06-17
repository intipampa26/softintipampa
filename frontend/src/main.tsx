import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { migrateLegacyQueue } from '@/services/db.service';
import App from './App';
import './index.css';

migrateLegacyQueue().catch(() => {});

registerSW({
  onNeedRefresh() {
    
    
    console.info('[PWA] New content available — refresh to update.');
  },
  onOfflineReady() {
    console.info('[PWA] App is ready to work offline.');
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
