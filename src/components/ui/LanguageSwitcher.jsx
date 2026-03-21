import React, { useId, useRef, useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useI18n } from '../../i18n';
import { localeNames, locales } from '../../i18n/translations';
import clsx from 'clsx';

/**
 * Compact language switcher: accessible, touch-friendly, works in LTR/RTL.
 */
export function LanguageSwitcher({ className, variant = 'light' }) {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    const onDoc = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, []);

  const baseBtn =
    variant === 'dark'
      ? 'bg-white/10 border-white/15 text-white hover:bg-white/15'
      : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-elevated)]';

  return (
    <div className={clsx('relative', className)} ref={wrapRef}>
      <button
        type="button"
        className={clsx(
          'inline-flex items-center gap-2 min-h-11 px-3 rounded-xl border text-sm font-medium shadow-sm transition-colors',
          baseBtn
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
      >
        <Globe size={18} className="opacity-80 shrink-0" aria-hidden />
        <span className="truncate max-w-[7rem]">{localeNames[locale]}</span>
        <ChevronDown
          size={16}
          className={clsx('opacity-70 transition-transform shrink-0', open && 'rotate-180')}
        />
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          className={clsx(
            'absolute z-[80] mt-2 min-w-[11rem] max-h-64 overflow-auto rounded-xl border py-1 shadow-xl backdrop-blur-md',
            variant === 'dark'
              ? 'bg-[#141420]/95 border-white/10 text-white'
              : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)]',
            'end-0 start-auto'
          )}
        >
          {locales.map((code) => (
            <li key={code} role="option" aria-selected={locale === code}>
              <button
                type="button"
                className={clsx(
                  'w-full text-start px-4 py-3 text-sm transition-colors min-h-11',
                  locale === code
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-semibold'
                    : 'hover:bg-black/5 dark:hover:bg-white/10'
                )}
                onClick={() => {
                  setLocale(code);
                  setOpen(false);
                }}
              >
                {localeNames[code]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
