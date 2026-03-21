import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Droplets, Phone, Mail, MapPin, Instagram, Menu, X, Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import clsx from 'clsx';

const PublicLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();
  const location = useLocation();

  const nav = [
    { to: '/', label: t('nav.catalog') },
    { to: '/designer', label: t('nav.designer') },
    { to: '/admin', label: t('nav.admin') },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-[60] border-b border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-xl shadow-[var(--shadow-sm)]">
        <div className="container-app">
          <div className="flex items-center justify-between h-16 sm:h-[4.25rem] gap-3">
            <Link
              to="/"
              className="flex items-center gap-3 min-w-0 group"
              onClick={() => setMobileOpen(false)}
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 flex items-center justify-center shadow-lg shadow-blue-600/25 ring-1 ring-white/10 shrink-0 transition-transform group-hover:scale-[1.02]">
                <Droplets className="text-white" size={22} aria-hidden />
              </div>
              <div className="min-w-0 text-start">
                <span className="font-display text-lg sm:text-xl font-semibold text-[var(--text)] tracking-tight block truncate">
                  {t('brand.name')}
                </span>
                <span className="text-[10px] sm:text-xs text-[var(--text-muted)] uppercase tracking-[0.2em] hidden sm:block">
                  {t('catalog.hero.highlight')}
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {nav.map((item) =>
                item.to === '/admin' ? (
                  <a
                    key={item.to}
                    href="/admin"
                    className="px-3 py-2 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-elevated)] transition-colors"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={clsx(
                      'px-3 py-2 rounded-xl text-sm font-semibold transition-colors',
                      location.pathname === item.to
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-elevated)]'
                    )}
                  >
                    {item.label}
                  </Link>
                )
              )}
              <div className="ms-2 ps-3 border-s border-[var(--border)]">
                <LanguageSwitcher variant="light" />
              </div>
            </nav>

            <div className="flex md:hidden items-center gap-2 shrink-0">
              <LanguageSwitcher variant="light" />
              <button
                type="button"
                className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] min-h-11 min-w-11 inline-flex items-center justify-center"
                aria-expanded={mobileOpen}
                aria-label={t('common.menu')}
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden overflow-hidden border-t border-[var(--border)] bg-[var(--surface)]"
            >
              <div className="container-app py-4 flex flex-col gap-1">
                {nav.map((item) =>
                  item.to === '/admin' ? (
                    <a
                      key={item.to}
                      href="/admin"
                      className="min-h-12 px-4 rounded-xl flex items-center text-base font-semibold text-[var(--text)] hover:bg-[var(--surface-elevated)]"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={clsx(
                        'min-h-12 px-4 rounded-xl flex items-center text-base font-semibold',
                        location.pathname === item.to
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'text-[var(--text)] hover:bg-[var(--surface-elevated)]'
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
                <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center gap-2 text-sm text-[var(--text-muted)]">
                  <Sparkles size={16} className="text-amber-500 shrink-0" />
                  <span>{t('catalog.hero.sub').split('.')[0]}.</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 min-h-0">
        <Outlet />
      </main>

      <footer className="bg-slate-950 text-slate-300 mt-auto">
        <div className="container-app py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-14">
            <div className="lg:col-span-2 space-y-4">
              <Link to="/" className="inline-flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-900/40">
                  <Droplets className="text-white" size={20} />
                </div>
                <span className="text-lg font-display font-semibold text-white">{t('brand.name')}</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md">{t('footer.tagline')}</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                {t('footer.contact')}
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Phone size={16} className="text-blue-400 shrink-0" />
                  <span dir="ltr">+972 50 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={16} className="text-blue-400 shrink-0" />
                  <span>info@crystalclear.com</span>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin size={16} className="text-blue-400 shrink-0" />
                  <span>Tel Aviv, Israel</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
                {t('footer.follow')}
              </h4>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <Instagram size={18} />
                @crystalclear
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
            </p>
            <div className="flex gap-6 text-xs text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">
                {t('footer.privacy')}
              </a>
              <a href="#" className="hover:text-slate-300 transition-colors">
                {t('footer.terms')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
