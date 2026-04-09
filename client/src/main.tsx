import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App';
import { I18nProvider } from './i18n/context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#0d1424',
                color: '#f0f4ff',
                border: '1px solid rgba(255,255,255,0.10)',
                fontFamily: "'IBM Plex Sans', 'Tajawal', sans-serif",
                fontSize: '13px',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#0d1424' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#0d1424' } },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </I18nProvider>
  </StrictMode>
);
