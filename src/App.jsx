import React, { useEffect, useMemo } from 'react';
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
import { Droplets, Settings } from 'lucide-react';
import { useConfiguratorStore } from './store/useConfiguratorStore';

const ConfiguratorPage = () => {
  const [searchParams] = useSearchParams();
  const { setGlassType, setDimensions, resetConfigurator } = useConfiguratorStore();

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
      return `Model: ${modelName} | Price: ${modelPrice} ILS/m²`;
    }
    if (sourceModelId) {
      return `Model: ${modelName}`;
    }
    return 'Create your own shower glass design';
  }, [modelName, modelPrice, sourceModelId]);

  return (
  <div className="min-h-screen bg-[#0a0a0b] text-white p-4 sm:p-6 lg:p-8 flex flex-col">
    <header className="flex items-center justify-between mb-4 sm:mb-6 px-2 shrink-0">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <Droplets className="text-white" size={18} />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight truncate">Crystal Clear 3D Designer</h1>
          <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest truncate">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={resetConfigurator}
          className="px-3 py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 rounded-lg"
          title="Reset to custom design"
        >
          Custom
        </button>
        <Link
          to="/"
          className="px-3 py-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 rounded-lg"
          title="Back to Catalog"
        >
          Catalog
        </Link>
        <a
          href="/admin"
          className="p-2.5 sm:p-2 hover:bg-white/10 rounded-full transition-colors touch-target shrink-0"
          title="Admin Panel"
          aria-label="Admin Panel"
        >
          <Settings size={20} className="text-gray-400 hover:text-white" />
        </a>
      </div>
    </header>

    <main className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6 min-h-0">
      <div className="h-[40vh] sm:h-[50vh] lg:h-full lg:col-span-2 min-h-[240px] sm:min-h-[280px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative shrink-0">
        <Visualizer3D />
      </div>
      <div className="flex-1 lg:flex-initial min-h-0 overflow-y-auto rounded-2xl sm:rounded-3xl border border-white/5 p-4 sm:p-6 lg:p-0 lg:border-0">
        <OptionsPanel />
      </div>
    </main>
  </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Header & Footer */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Catalog />} />
          <Route path="product/:id" element={<ProductDetails />} />
        </Route>
        <Route path="/designer" element={<ConfiguratorPage />} />
        <Route path="/admin/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<div className="p-4 sm:p-8 text-gray-600 text-center sm:text-left"><p className="text-xl sm:text-2xl font-display font-semibold text-gray-900 mb-2">Welcome to the Manager Panel</p><p className="text-sm">Select a section from the sidebar to manage your shop.</p></div>} />
          <Route path="shower-types" element={<ShowerTypesManager />} />
          <Route path="pricing" element={<PricingManager />} />
          <Route path="locations" element={<PricingManager />} /> {/* Reusing PricingManager as it handles both */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
