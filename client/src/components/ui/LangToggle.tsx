import { useI18n } from '../../i18n/context';

export default function LangToggle() {
  const { lang, setLang } = useI18n();
  const next = lang === 'en' ? 'ar' : 'en';

  return (
    <button
      onClick={() => setLang(next)}
      title={next === 'ar' ? 'Switch to Arabic' : 'Switch to English'}
      className="flex items-center gap-2 w-full px-3 py-2 rounded-xl transition-all duration-150 text-mid hover:text-hi"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      {/* Globe icon */}
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
      <span className="text-xs font-medium flex-1 text-start">
        {lang === 'en' ? 'العربية' : 'English'}
      </span>
      {/* Active lang badge */}
      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
        style={{ background: 'rgba(14,165,233,0.15)', color: '#0ea5e9' }}>
        {lang.toUpperCase()}
      </span>
    </button>
  );
}
