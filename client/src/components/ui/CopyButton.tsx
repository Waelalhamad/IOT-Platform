import { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { useI18n } from '../../i18n/context';

interface CopyButtonProps { text: string; className?: string; }

export default function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useI18n();

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      title={t.copy}
      className={clsx(
        'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150',
        copied
          ? 'text-green bg-green-dim border border-green/20'
          : 'text-mid hover:text-primary hover:bg-primary-dim border border-transparent hover:border-primary/20',
        className,
      )}
    >
      {copied ? <CheckIcon className="w-3.5 h-3.5" /> : <ClipboardDocumentIcon className="w-3.5 h-3.5" />}
    </button>
  );
}
