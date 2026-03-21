import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useSearchParams } from 'react-router-dom';
import Login from './components/Admin/Login';
import AdminLayout from './components/Admin/AdminLayout';
import ShowerTypesManager from './components/Admin/ShowerTypesManager';
import PricingManager from './components/Admin/PricingManager';
import Catalog from './components/Client/Catalog';
import ProductDetails from './components/Client/ProductDetails';
import PublicLayout from './components/Layout/PublicLayout';
import OptionsPanel from './components/Configurator/OptionsPanel';
import Visualizer3D from './components/Configurator/Visualizer3D';
import { Droplets, Settings, X, SlidersHorizontal } from 'lucide-react';
import { useConfiguratorStore } from './store/useConfiguratorStore';
import { useI18n } from './i18n';
import { LanguageSwitcher } from './components/ui/LanguageSwitcher';
import clsx from 'clsx';

function AdminHome() {
  const { t } = useI18n();
  return (
    <div className="max-w-2xl mx-auto text-center lg:text-start p-4 sm:p-8">
      <p className="text-xl sm:text-2xl font-display font-semibold text-[var(--text)] mb-2">
        {t('admin.welcome.title')}
      </p>
      <p className="text-sm text-[var(--text-muted)]">{t('admin.welcome.sub')}</p>
    </div>
  );
}

const ConfiguratorPage = () => {
  const [searchParams] = useSearchParams();
  const { setGlassType, setDimensions, resetConfigurator } = useConfiguratorStore();
  const { t } = useI18n();
  const [sheetOpen, setSheetOpen] = useState(false);

  const modelName = searchParams.get('modelName') || 'Custom Design';
  const sourceModelId = searchParams.get('modelId');
  const modelPrice = searchParams.get('pricePerM2');

  useEffect(() => {
    const layout = searchParams.get('layout');
    const validLayouts = ['straight', 'corner', 'l-shape', 'l-shape-2-doors'];
    if (layout && validLayouts.includes(layout)) {
      setGlassType(layout);
    }

    const width = Number(searchParams.get('width'));
    const height = Number(searchParams.get('height'));
    const depth = Number(searchParams.get('depth'));
    const nextDimensions = {};
    if (Number.isFinite(width) && width > 0) nextDimensions.width = width;
    if (Number.isFinite(height) && height > 0) nextDimensions.height = height;
    if (Number.isFinite(depth) && depth > 0) nextDimensions.depth = depth;
    if (Object.keys(nextDimensions).length > 0) {
      setDimensions(nextDimensions);
    }
  }, [searchParams, setDimensions, setGlassType]);

  const subtitle = useMemo(() => {
    if (sourceModelId && modelPrice) {
      return `${t('designer.sub.model')}: ${modelName} · ${t('designer.sub.price')}: ${modelPrice} ${t('common.ilsPerM2')}`;
    }
    if (sourceModelId) {
      return `${t('designer.sub.model')}: ${modelName}`;
    }
    return t('designer.sub.custom');
  }, [modelName, modelPrice, sourceModelId, t]);

  return (
    <div className="min-h-[100dvh] bg-[#07070a] text-slate-100 flex flex-col pb-[env(safe-area-inset-bottom)]">
      <header className="shrink-0 border-b border-white/[0.07] bg-[#07070a]/90 backdrop-blur-xl z-40">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-blue-900/30 shrink-0 ring-1 ring-white/10">
              <Droplets className="text-white" size={20} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-semibold tracking-tight text-white truncate">
                {t('designer.title')}
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-[0.18em] truncate">
                {subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSwitcher variant="dark" className="hidden sm:block" />
            <button
              type="button"
              onClick={resetConfigurator}
              className="hidden sm:inline-flex px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/10 transition-colors min-h-10 items-center"
            >
              {t('designer.reset')}
            </button>
            <Link
              to="/"
              className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/10 transition-colors min-h-10 inline-flex items-center"
            >
              {t('nav.catalog')}
            </Link>
            <a
              href="/admin"
              className="p-2.5 sm:p-2 hover:bg-white/10 rounded-xl transition-colors touch-target inline-flex items-center justify-center border border-transparent hover:border-white/10"
              title={t('nav.admin')}
              aria-label={t('nav.admin')}
            >
              <Settings size={20} className="text-slate-400 hover:text-white" />
            </a>
          </div>
        </div>
        <div className="sm:hidden px-4 pb-3">
          <LanguageSwitcher variant="dark" className="w-full [&>button]:w-full [&>button]:justify-center" />
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-5 gap-0 lg:gap-6 min-h-0 max-w-[1600px] w-full mx-auto px-0 lg:px-8 pb-24 lg:pb-0">
        <section
          className={clsx(
            'relative flex-1 min-h-[46vh] sm:min-h-[50vh] lg:min-h-0 lg:h-full lg:col-span-3',
            'border-b lg:border-b-0 border-white/[0.06]'
          )}
        >
          <div className="absolute inset-0 p-3 sm:p-4 lg:p-0 lg:pt-4">
            <div className="h-full min-h-[min(54vh,600px)] lg:min-h-[calc(100vh-8rem)] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/40">
              <Visualizer3D />
            </div>
          </div>
        </section>

        {/* Desktop options */}
        <aside className="hidden lg:flex lg:col-span-2 flex-col min-h-0 py-4">
          <div className="flex-1 min-h-0 overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#0c0c10]/80 backdrop-blur-xl p-6 shadow-xl">
            <OptionsPanel />
          </div>
        </aside>

        {/* Mobile / tablet sheet */}
        <div
          className={clsx(
            'lg:hidden fixed inset-x-0 bottom-0 z-50 flex flex-col max-h-[min(88vh,820px)] rounded-t-3xl border border-white/10 bg-[#0b0b10]/95 backdrop-blur-2xl shadow-[0_-20px_60px_rgba(0,0,0,0.55)] transition-transform duration-300 ease-out',
            sheetOpen ? 'translate-y-0' : 'translate-y-full pointer-events-none'
          )}
          aria-hidden={!sheetOpen}
        >
          <div className="flex items-center justify-between gap-3 px-4 pt-3 pb-2 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center gap-2 text-slate-100 font-semibold">
              <SlidersHorizontal size={18} className="text-blue-400" />
              {t('designer.configure')}
            </div>
            <button
              type="button"
              className="p-2.5 rounded-xl hover:bg-white/10 min-h-11 min-w-11 inline-flex items-center justify-center"
              onClick={() => setSheetOpen(false)}
              aria-label={t('common.close')}
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
            <OptionsPanel />
          </div>
        </div>

        {sheetOpen && (
          <button
            type="button"
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            aria-label={t('common.close')}
            onClick={() => setSheetOpen(false)}
          />
        )}
      </main>

      {/* Mobile configure bar */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 pointer-events-none">
        <div
          className="pointer-events-auto mx-3 mb-[max(0.5rem,env(safe-area-inset-bottom))] p-2 rounded-2xl bg-[#0f0f16]/90 border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <button
            type="button"
            className="w-full min-h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 active:scale-[0.99] transition-transform"
            onClick={() => setSheetOpen(true)}
          >
            <SlidersHorizontal size={18} />
            {t('designer.configure')}
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Catalog />} />
          <Route path="product/:id" element={<ProductDetails />} />
        </Route>
        <Route path="/designer" element={<ConfiguratorPage />} />
        <Route path="/admin/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="shower-types" element={<ShowerTypesManager />} />
          <Route path="pricing" element={<PricingManager />} />
          <Route path="locations" element={<PricingManager />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
