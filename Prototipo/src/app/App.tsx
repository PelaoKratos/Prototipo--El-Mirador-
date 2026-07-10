import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Toaster } from './components/ui/sonner';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ResidentsPage } from './pages/admin/ResidentsPage';
import { DepartmentsPage } from './pages/admin/DepartmentsPage';
import { ExpensesPage } from './pages/admin/ExpensesPage';
import { PaymentsPage } from './pages/admin/PaymentsPage';
import { DelinquentsPage } from './pages/admin/DelinquentsPage';
import { ClaimsPage } from './pages/admin/ClaimsPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { ConfigurationPage } from './pages/admin/ConfigurationPage';
import { OwnerDashboard } from './pages/owner/OwnerDashboard';
import { OwnerPaymentsPage } from './pages/owner/OwnerPaymentsPage';
import { OwnerReceiptsPage } from './pages/owner/OwnerReceiptsPage';
import { OwnerClaimsPage } from './pages/owner/OwnerClaimsPage';
import { TenantDashboard } from './pages/tenant/TenantDashboard';
import { TenantReceiptsPage } from './pages/tenant/TenantReceiptsPage';
import { MessagesPage } from './pages/shared/MessagesPage';
import { AnnouncementsPage } from './pages/shared/AnnouncementsPage';

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user?.role || '')) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  const defaultRedirect =
    user?.role === 'admin' ? '/admin' : user?.role === 'owner' ? '/propietario' : '/arrendatario';

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={defaultRedirect} replace /> : <Login />}
      />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/residentes" element={<ProtectedRoute allowedRoles={['admin']}><ResidentsPage /></ProtectedRoute>} />
      <Route path="/admin/departamentos" element={<ProtectedRoute allowedRoles={['admin']}><DepartmentsPage /></ProtectedRoute>} />
      <Route path="/admin/gastos" element={<ProtectedRoute allowedRoles={['admin']}><ExpensesPage /></ProtectedRoute>} />
      <Route path="/admin/pagos" element={<ProtectedRoute allowedRoles={['admin']}><PaymentsPage /></ProtectedRoute>} />
      <Route path="/admin/morosos" element={<ProtectedRoute allowedRoles={['admin']}><DelinquentsPage /></ProtectedRoute>} />
      <Route path="/admin/informes" element={<ProtectedRoute allowedRoles={['admin']}><ReportsPage /></ProtectedRoute>} />
      <Route path="/admin/reclamos" element={<ProtectedRoute allowedRoles={['admin']}><ClaimsPage /></ProtectedRoute>} />
      <Route path="/admin/avisos" element={<ProtectedRoute allowedRoles={['admin']}><AnnouncementsPage /></ProtectedRoute>} />
      <Route path="/admin/configuracion" element={<ProtectedRoute allowedRoles={['admin']}><ConfigurationPage /></ProtectedRoute>} />

      {/* Owner */}
      <Route path="/propietario" element={<ProtectedRoute allowedRoles={['owner']}><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/propietario/pagos" element={<ProtectedRoute allowedRoles={['owner']}><OwnerPaymentsPage /></ProtectedRoute>} />
      <Route path="/propietario/recibos" element={<ProtectedRoute allowedRoles={['owner']}><OwnerReceiptsPage /></ProtectedRoute>} />
      <Route path="/propietario/reclamos" element={<ProtectedRoute allowedRoles={['owner']}><OwnerClaimsPage /></ProtectedRoute>} />

      {/* Tenant */}
      <Route path="/arrendatario" element={<ProtectedRoute allowedRoles={['tenant']}><TenantDashboard /></ProtectedRoute>} />
      <Route path="/arrendatario/pagos" element={<ProtectedRoute allowedRoles={['tenant']}><TenantDashboard /></ProtectedRoute>} />
      <Route path="/arrendatario/recibos" element={<ProtectedRoute allowedRoles={['tenant']}><TenantReceiptsPage /></ProtectedRoute>} />

      {/* Shared (all roles) */}
      <Route path="/mensajes" element={<ProtectedRoute allowedRoles={['admin', 'owner', 'tenant']}><MessagesPage /></ProtectedRoute>} />
      <Route path="/avisos" element={<ProtectedRoute allowedRoles={['owner', 'tenant']}><AnnouncementsPage /></ProtectedRoute>} />

      {/* Default */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to={defaultRedirect} replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster />
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
