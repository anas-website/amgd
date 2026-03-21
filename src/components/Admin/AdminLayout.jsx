import React, { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, LogOut, ChevronRight, Calculator, MapPin, Layers, Menu, X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import clsx from 'clsx';

const AdminLayout = () => {
  const { user, isAdmin, loading, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  if (loading) return null;
  if (!user || !isAdmin) return null;

  const menuItems = [
    { name: t('admin.menu.dashboard'), path: '/admin', icon: LayoutDashboard },
    { name: t('admin.menu.showerTypes'), path: '/admin/shower-types', icon: Layers },
    { name: t('admin.menu.pricing'), path: '/admin/pricing', icon: Calculator },
    { name: t('admin.menu.locations'), path: '/admin/locations', icon: MapPin },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          'fixed lg:static inset-y-0 z-50 w-[min(100%,280px)] sm:w-64 border-[var(--border)] bg-[var(--surface)] shadow-xl lg:shadow-none flex flex-col transform transition-transform duration-300 ease-out',
          'start-0 border-e',
          'lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full'
        )}
      >
        <div className="p-4 lg:p-6 border-b border-[var(--border)] flex items-center justify-between gap-2">
          <h2 className="text-lg font-display font-semibold text-[var(--text)]">{t('admin.panel')}</h2>
          <div className="flex items-center gap-2">
            <LanguageSwitcher variant="light" className="hidden sm:block" />
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-xl hover:bg-slate-100 lg:hidden text-[var(--text-muted)] min-h-10 min-w-10 inline-flex items-center justify-center"
              aria-label={t('common.close')}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-xl transition-all touch-target min-h-12',
                  isActive
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-blue-100/80'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-slate-50'
                )}
              >
                <Icon size={20} className="shrink-0" />
                <span className="font-medium">{item.name}</span>
                {isActive && <ChevronRight size={16} className="ms-auto rtl:rotate-180 shrink-0" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--border)] space-y-3">
          <div className="sm:hidden">
            <LanguageSwitcher variant="light" className="w-full [&>button]:w-full [&>button]:justify-center" />
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all touch-target min-h-12"
          >
            <LogOut size={20} />
            <span className="font-medium">{t('admin.logout')}</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-auto lg:ms-0">
        <header className="h-14 sm:h-16 border-b border-[var(--border)] bg-[var(--surface)] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ms-2 rounded-xl hover:bg-slate-100 lg:hidden text-[var(--text-muted)] min-h-11 min-w-11 inline-flex items-center justify-center"
            aria-label={t('common.menu')}
          >
            <Menu size={24} />
          </button>
          <h1 className="text-base sm:text-lg font-display font-semibold text-[var(--text)] capitalize flex-1 text-center lg:text-start lg:ps-0 truncate">
            {menuItems.find((m) => m.path === location.pathname)?.name ?? t('admin.menu.dashboard')}
          </h1>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-xs sm:text-sm text-[var(--text-muted)] truncate max-w-[100px] sm:max-w-none">
              {user.email}
            </span>
            <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user.email[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1 bg-[var(--bg)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
