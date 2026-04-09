import { NavLink, useLocation } from 'react-router-dom';
import { ChartBarIcon, CpuChipIcon, ArrowRightOnRectangleIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../../store/authStore';
import { useLogout } from '../../hooks/useAuth';
import { useI18n } from '../../i18n/context';
import LangToggle from '../ui/LangToggle';
import { clsx } from 'clsx';

export default function Sidebar() {
  const user   = useAuthStore((s) => s.user);
  const logout = useLogout();
  const { pathname } = useLocation();
  const { t } = useI18n();

  const NAV = [
    { to: '/devices',   label: t.nav.devices,   icon: CpuChipIcon },
    { to: '/dashboard', label: t.nav.dashboard, icon: ChartBarIcon },
    { to: '/docs',      label: t.nav.guide,     icon: BookOpenIcon },
  ];

  const initials = user?.email
    ? user.email.split('@')[0].slice(0, 2).toUpperCase()
    : 'U';

  return (
    <aside className="hidden md:flex flex-col w-60 h-full flex-shrink-0 text-mid"
      style={{ background: '#060b16', borderRight: '1px solid rgba(255,255,255,0.06)' }}>

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 h-16 px-5 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            boxShadow: '0 0 16px rgba(14,165,233,0.4)',
          }}>
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none">
            <path d="M9.5 2L4 9h4.5L6.5 14L12 7H7.5L9.5 2Z" fill="white" />
          </svg>
        </div>
        <span className="text-sm font-bold tracking-tight text-hi font-mono">ESP_MONITOR</span>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
        <p className="text-[9px] font-mono font-bold tracking-[0.2em] text-lo px-3 mb-2">
          {t.nav.navigation.toUpperCase()}
        </p>
        {NAV.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={clsx(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150',
                active ? 'text-hi' : 'hover:text-hi',
              )}
              style={active ? {
                background: 'rgba(14,165,233,0.10)',
                boxShadow: 'inset 0 0 0 1px rgba(14,165,233,0.15)',
              } : undefined}
            >
              {active && (
                <span className="absolute start-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-e-full"
                  style={{ background: '#0ea5e9', boxShadow: '0 0 8px rgba(14,165,233,0.7)' }} />
              )}
              <Icon className={clsx('w-4 h-4 flex-shrink-0', active ? 'text-primary' : '')} />
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div className="px-3 pb-5 pt-3 flex-shrink-0 flex flex-col gap-1"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {user?.email && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-hi flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0d1f3c 100%)', border: '1px solid rgba(14,165,233,0.2)' }}>
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-hi truncate font-mono">{user.email.split('@')[0]}</p>
              <p className="text-[10px] text-lo">{t.connected}</p>
            </div>
          </div>
        )}

        <LangToggle />

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-150 text-mid hover:text-red hover:bg-red-dim"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm font-medium">{t.nav.logout}</span>
        </button>
      </div>
    </aside>
  );
}
