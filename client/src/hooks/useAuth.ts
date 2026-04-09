import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import { connectSocket, disconnectSocket } from '../services/ws';
import toast from 'react-hot-toast';
import { useI18n } from '../i18n/context';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const { t } = useI18n();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => api.post('/auth/login', data),
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.accessToken);
      connectSocket();
      navigate('/dashboard');
    },
    onError: () => toast.error(t.login.error),
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => api.post('/auth/register', data),
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.accessToken);
      connectSocket();
      navigate('/dashboard');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? 'Registration failed');
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();
  return async () => {
    await api.post('/auth/logout').catch(() => {});
    disconnectSocket();
    clearAuth();
    navigate('/login');
  };
}
