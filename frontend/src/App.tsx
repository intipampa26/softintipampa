import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { FlowProvider } from '@/contexts/FlowContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { CampanasPage } from '@/pages/CampanasPage';
import { GestionPage } from '@/pages/GestionPage';
import { ConfiguracionPage } from '@/pages/ConfiguracionPage';
import { ComingSoonPage } from '@/pages/ComingSoonPage';
import { ProductoresPage } from '@/pages/ProductoresPage';
import { LotesPage } from '@/pages/LotesPage';
import { LoteDetallePage } from '@/pages/LoteDetallePage';
import { LotesFinalesPage } from '@/pages/LotesFinalesPage';
import { MuestrasPage } from '@/pages/MuestrasPage';
import { ExportarMuestrasPage } from '@/pages/ExportarMuestrasPage';
import { ImportarMuestrasPage } from '@/pages/ImportarMuestrasPage';
import { GeoMapsPage } from '@/pages/GeoMapsPage';
import { ClientesPage } from '@/pages/ClientesPage';
import { EvidenciasPage } from '@/pages/EvidenciasPage';
import { EvidenciasFamiliaresPage } from '@/pages/EvidenciasFamiliaresPage';
import { FamiliaPage } from '@/pages/FamiliaPage';
import { KardexPage } from '@/pages/KardexPage';
import EmpresaInfoPage from '@/pages/EmpresaInfoPage';
import { ReportesPage } from '@/pages/ReportesPage';
import { MermasPage }          from '@/pages/MermasPage';
import { OperacionesPage } from '@/pages/OperacionesPage';
import { RegistroMuestraPage } from '@/pages/RegistroMuestraPage';
import { EvaluacionCafeVerdePage } from '@/pages/EvaluacionCafeVerdePage';
import { DashboardIndicadores } from '@/pages/DashboardIndicadores';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <FlowProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="campanas"      element={<CampanasPage />} />
            <Route path="productores"   element={<ProductoresPage />} />
            <Route path="productores/:productorId/geomaps"     element={<GeoMapsPage />} />
            <Route path="productores/:productorId/evidencias" element={<EvidenciasPage />} />
            <Route path="productores/:productorId/evidencias-familiares" element={<EvidenciasFamiliaresPage />} />
            <Route path="productores/:productorId/familia" element={<FamiliaPage />} />
            <Route path="productores/:id/empresa-info" element={<EmpresaInfoPage />} />
            <Route path="clientes"      element={<ClientesPage />} />
            <Route path="lotes"              element={<LotesPage />} />
            <Route path="lotes/:id"          element={<LoteDetallePage />} />
            <Route path="lotes-finales"      element={<LotesFinalesPage />} />
            <Route path="muestras"          element={<MuestrasPage />} />
            <Route path="muestras/exportar" element={<ExportarMuestrasPage />} />
            <Route path="muestras/importar"  element={<ImportarMuestrasPage />} />
            <Route path="muestras/registro"           element={<RegistroMuestraPage />} />
            <Route path="muestras/evaluacion-cafe-verde" element={<EvaluacionCafeVerdePage />} />
            <Route path="gestion"       element={<GestionPage />} />
            <Route path="operaciones"   element={<OperacionesPage />} />
            <Route path="mermas"        element={<MermasPage />} />
            <Route path="kardex"        element={<KardexPage />} />
            <Route path="indicadores"   element={<DashboardIndicadores />} />
            <Route path="reportes"      element={<ReportesPage />} />
            <Route path="configuracion" element={<ConfiguracionPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        </FlowProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
