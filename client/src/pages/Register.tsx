import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useRegister } from '../hooks/useAuth';
import { useI18n } from '../i18n/context';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LangToggle from '../components/ui/LangToggle';

export default function Register() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const register = useRegister();
  const { t } = useI18n();

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError(t.register.errorMismatch); return; }
    if (password.length < 6)  { setError(t.register.errorShort); return; }
    setError('');
    register.mutate({ email, password });
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
          <div className="flex items-center gap-3 flex-shrink-0 animate-slide-left">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', boxShadow: '0 0 28px rgba(14,165,233,0.45)' }}>
              <svg viewBox="0 0 16 16" className="w-[18px] h-[18px]" fill="none">
                <path d="M9.5 2L4 9h4.5L6.5 14L12 7H7.5L9.5 2Z" fill="white" />
              </svg>
            </div>
            <span className="text-base font-bold text-hi font-mono tracking-tight">ESP_MONITOR</span>
          </div>

          <div className="flex-1 flex flex-col justify-center py-12">
            <p className="text-[10px] font-mono tracking-[0.25em] text-primary mb-5 flex items-center gap-3 animate-fade-up"
              style={{ animationDelay: '0.05s' }}>
              <span className="w-8 h-px inline-block" style={{ background: 'linear-gradient(90deg, #0ea5e9, transparent)' }} />
              {t.register.tagline}
            </p>
            <h1 className="font-bold text-hi leading-[1.15] mb-6 animate-fade-up whitespace-pre-line"
              style={{ fontSize: 'clamp(2rem, 3vw, 3rem)', fontFamily: "'JetBrains Mono', monospace", animationDelay: '0.1s' }}>
              {t.register.headline.split('\n').map((line, i, arr) =>
                i === arr.length - 1
                  ? <span key={i} style={{ color: '#0ea5e9', textShadow: '0 0 40px rgba(14,165,233,0.6)' }}>{line}</span>
                  : <span key={i}>{line}<br /></span>
              )}
            </h1>
            <p className="text-sm text-mid leading-relaxed max-w-[28ch] animate-fade-up"
              style={{ animationDelay: '0.15s' }}>{t.register.subtext}</p>
          </div>

          <div className="flex flex-col gap-2.5 flex-shrink-0 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {t.register.features.map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: '#0ea5e9', boxShadow: '0 0 6px rgba(14,165,233,0.6)' }} />
                <span className="text-[11px] text-mid">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative" style={{ background: '#080d1a' }}>

        {/* Lang toggle top-right */}
        <div className="absolute top-5 end-5">
          <LangToggle />
        </div>

        <div className="w-full max-w-sm">
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
            <h2 className="text-2xl font-bold text-hi mb-1.5">{t.register.title}</h2>
            <p className="text-sm text-mid">{t.register.subtitle}</p>
          </div>

          <form onSubmit={handle} className="flex flex-col gap-5 animate-fade-up" style={{ animationDelay: '0.05s' }}>
            <Input label={t.register.emailLabel} type="email" placeholder={t.register.emailPlaceholder}
              value={email} onChange={(e) => setEmail(e.target.value)}
              icon={<EnvelopeIcon className="w-4 h-4" />} required />
            <Input label={t.register.passwordLabel} type="password" placeholder={t.register.passwordPlaceholder}
              value={password} onChange={(e) => setPassword(e.target.value)}
              icon={<LockClosedIcon className="w-4 h-4" />} required />
            <Input label={t.register.confirmLabel} type="password" placeholder={t.register.confirmPlaceholder}
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              icon={<LockClosedIcon className="w-4 h-4" />} error={error} required />
            <Button type="submit" variant="primary" size="lg" loading={register.isPending} className="w-full mt-2">
              {t.register.submit}
            </Button>
          </form>

          <div className="mt-8 pt-6 text-center animate-fade-up"
            style={{ animationDelay: '0.1s', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-sm text-mid">
              {t.register.hasAccount}{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-sky-400 transition-colors">
                {t.register.signIn}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
