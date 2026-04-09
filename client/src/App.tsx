import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useDevices } from './hooks/useDevices';
import { connectSocket } from './services/ws';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Devices from './pages/Devices';
import Dashboard from './pages/Dashboard';
import Docs from './pages/Docs';
import Spinner from './components/ui/Spinner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function DashboardRedirect() {
  const navigate = useNavigate();
  const { data: devices, isLoading } = useDevices();

  useEffect(() => {
    if (isLoading) return;
    if (devices && devices.length > 0) {
      navigate(`/dashboard/${devices[0]._id}`, { replace: true });
    } else {
      navigate('/devices', { replace: true });
    }
  }, [devices, isLoading, navigate]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function AppBootstrap() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    }
  }, [isAuthenticated]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardRedirect />} />
        <Route path="dashboard/:deviceId" element={<Dashboard />} />
        <Route path="devices" element={<Devices />} />
        <Route path="docs" element={<Docs />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppBootstrap;
