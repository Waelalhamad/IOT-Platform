import { NavLink, useLocation } from 'react-router-dom';
import { ChartBarIcon, CpuChipIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useI18n } from '../../i18n/context';
import { clsx } from 'clsx';

export default function MobileNav() {
  const { pathname } = useLocation();
  const { t, lang, setLang } = useI18n();

  const NAV = [
    { to: '/devices',   label: t.nav.devices,   icon: CpuChipIcon },
    { to: '/dashboard', label: t.nav.dashboard, icon: ChartBarIcon },
    { to: '/docs',      label: t.nav.guide,     icon: BookOpenIcon },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
      style={{
        background: '#060b16',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname.startsWith(to);
        return (
          <NavLink
            key={to}
            to={to}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors"
            style={active ? { color: '#0ea5e9' } : { color: '#3d5070' }}
          >
            <Icon className={clsx('w-5 h-5', active && 'drop-shadow-[0_0_6px_rgba(14,165,233,0.7)]')} />
            <span className={clsx('text-[10px] font-bold tracking-wide', active ? 'text-primary' : 'text-lo')}>
              {label}
            </span>
          </NavLink>
        );
      })}

      {/* Language toggle as last tab */}
      <button
        onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors text-lo hover:text-mid"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
        <span className="text-[10px] font-bold tracking-wide text-lo">
          {lang === 'en' ? 'عربي' : 'EN'}
        </span>
      </button>
    </nav>
  );
}
