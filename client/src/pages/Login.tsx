import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useLogin } from '../hooks/useAuth';
import { useI18n } from '../i18n/context';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LangToggle from '../components/ui/LangToggle';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const { t } = useI18n();

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#080d1a' }}>

      {/* ── Left brand panel ── */}
      <div className="hidden lg:flex flex-col flex-none w-2/5 max-w-md relative overflow-hidden"
        style={{ background: '#060b16', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(14,165,233,0.18) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />
        <div className="scan-line" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col h-full px-10 py-12">
          <div className="flex items-center gap-3 mb-auto animate-slide-left">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', boxShadow: '0 0 28px rgba(14,165,233,0.45)' }}>
              <svg viewBox="0 0 16 16" className="w-[18px] h-[18px]" fill="none">
                <path d="M9.5 2L4 9h4.5L6.5 14L12 7H7.5L9.5 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-base font-bold text-hi font-mono tracking-tight">ESP_MONITOR</span>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <p className="text-[10px] font-mono tracking-[0.25em] text-primary mb-6 flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: '0.05s' }}>
              <span className="w-8 h-px inline-block" style={{ background: 'linear-gradient(90deg, #0ea5e9, transparent)' }} />
              {t.login.tagline}
            </p>
            <h1 className="font-bold text-hi leading-[1.15] mb-6 animate-fade-up whitespace-pre-line"
              style={{ fontSize: 'clamp(2.2rem, 3vw, 3.2rem)', fontFamily: "'JetBrains Mono', monospace", animationDelay: '0.1s' }}>
              {t.login.headline.split('\n').map((line, i, arr) =>
                i === arr.length - 1
                  ? <span key={i} style={{ color: '#0ea5e9', textShadow: '0 0 40px rgba(14,165,233,0.6)' }}>{line}</span>
                  : <span key={i}>{line}<br /></span>
              )}
            </h1>
            <p className="text-sm text-mid leading-relaxed max-w-[28ch] animate-fade-up"
              style={{ animationDelay: '0.15s' }}>{t.login.subtext}</p>
          </div>

          <div className="flex gap-8 mt-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {([['<100ms', t.login.stats.latency], ['MQTT', t.login.stats.protocol], ['5+', t.login.stats.widgets]] as [string, string][]).map(([val, lbl]) => (
              <div key={lbl}>
                <p className="text-base font-bold text-hi font-mono" style={{ textShadow: '0 0 20px rgba(14,165,233,0.4)' }}>{val}</p>
                <p className="text-[9px] font-mono tracking-widest text-lo mt-0.5">{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 relative" style={{ background: '#080d1a' }}>

        {/* Lang toggle top-right */}
        <div className="absolute top-5 end-5">
          <LangToggle />
        </div>

        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', boxShadow: '0 0 16px rgba(14,165,233,0.4)' }}>
              <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
                <path d="M9.5 2L4 9h4.5L6.5 14L12 7H7.5L9.5 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-sm font-bold text-hi font-mono tracking-tight">ESP_MONITOR</span>
          </div>

          <div className="mb-8 animate-fade-up">
            <h2 className="text-2xl font-bold text-hi mb-1.5">{t.login.title}</h2>
            <p className="text-sm text-mid">{t.login.subtitle}</p>
          </div>

          <form onSubmit={handle} className="flex flex-col gap-4 animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <Input
              label={t.login.emailLabel}
              type="email"
              placeholder={t.login.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<EnvelopeIcon className="w-4 h-4" />}
              required
            />
            <Input
              label={t.login.passwordLabel}
              type="password"
              placeholder={t.login.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<LockClosedIcon className="w-4 h-4" />}
              required
            />
            {login.isError && (
              <p className="text-sm text-red text-center">{t.login.error}</p>
            )}
            <div className="pt-1">
              <Button type="submit" variant="primary" size="lg" loading={login.isPending} className="w-full">
                {t.login.submit}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 text-center animate-fade-up"
            style={{ animationDelay: '0.1s', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-sm text-mid">
              {t.login.noAccount}{' '}
              <Link to="/register" className="font-semibold text-primary hover:text-sky-400 transition-colors">
                {t.login.createOne}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
