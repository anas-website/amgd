import React, { useState, useEffect } from 'react';
import { tables, DATABASE_ID, TABLE_PRICING_LOCATIONS, TABLE_PRICING_FLOORS } from '../../appwrite/config';
import { Calculator as CalcIcon, Maximize2, Ruler, MapPin, Layers, ChevronDown, Loader2 } from 'lucide-react';
import { useI18n } from '../../i18n';

const Calculator = ({ product }) => {
  const { t } = useI18n();
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(200);
  const [location, setLocation] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [floor, setFloor] = useState(0);

  const [locations, setLocations] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const locRes = await tables.listDocuments(DATABASE_ID, TABLE_PRICING_LOCATIONS);
        const floorRes = await tables.listDocuments(DATABASE_ID, TABLE_PRICING_FLOORS);
        setLocations(locRes.documents);
        setFloors(floorRes.documents);
      } catch (error) {
        console.error('Error fetching pricing dependencies from tables:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  const calculatePrice = () => {
    if (!product) return 0;

    const area = (width / 100) * (height / 100);
    let basePrice = area * product.pricePerM2;

    if (location) {
      if (location.pricingMode === 'fixed') {
        basePrice += location.value;
      } else {
        basePrice *= location.value;
      }
    }

    const floorRule = floors.find((f) => floor >= f.minFloor && (!f.maxFloor || floor <= f.maxFloor));
    if (floorRule) {
      basePrice += floorRule.value;
    }

    return Math.round(basePrice);
  };

  const handleLocationChange = (e) => {
    const id = e.target.value;
    setSelectedLocationId(id);
    const loc = locations.find((l) => l.$id === id);
    setLocation(loc);
  };

  if (loading)
    return (
      <div className="p-8 ui-card animate-pulse flex items-center justify-center min-h-[120px]">
        <Loader2 className="animate-spin text-[var(--accent)]" size={36} />
      </div>
    );

  return (
    <div className="ui-card p-6 sm:p-8 relative overflow-hidden">
      <div className="absolute -top-20 -end-20 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
          <CalcIcon size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-[var(--text)]">{t('calc.title')}</h3>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">{t('calc.sub')}</p>
        </div>
      </div>

      <div className="relative space-y-8">
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-muted)] flex items-center gap-2">
              <Maximize2 size={16} className="shrink-0 opacity-70" /> {t('calc.width')}
            </label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="ui-input font-mono tabular-nums"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--text-muted)] flex items-center gap-2">
              <Ruler size={16} className="shrink-0 opacity-70" /> {t('calc.height')}
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="ui-input font-mono tabular-nums"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[var(--text-muted)] flex items-center gap-2">
            <MapPin size={16} className="shrink-0 opacity-70" /> {t('calc.location')}
          </label>
          <div className="relative">
            <select
              value={selectedLocationId}
              onChange={handleLocationChange}
              className="ui-input appearance-none pe-12"
            >
              <option value="">{t('calc.locationPlaceholder')}</option>
              {locations.map((loc) => (
                <option key={loc.$id} value={loc.$id}>
                  {loc.name}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute end-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"
              size={20}
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold text-[var(--text-muted)] flex items-center gap-2">
            <Layers size={16} className="shrink-0 opacity-70" /> {t('calc.floor')}
          </label>
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[0, 1, 2, 3, 4].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFloor(f)}
                className={`py-3 rounded-xl border transition-all font-bold touch-target min-h-12 ${
                  floor === f
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-blue-500/20'
                    : 'bg-slate-50 border-[var(--border)] text-[var(--text-muted)] hover:bg-slate-100'
                }`}
              >
                {f === 0 ? t('calc.floor.ground') : f}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-[var(--border)]">
          <div className="flex flex-col sm:flex-row justify-between gap-6 sm:items-end">
            <div>
              <p className="text-[var(--text-muted)] font-medium mb-1 uppercase tracking-tighter text-xs">
                {t('calc.total')}
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-[var(--text)] flex items-baseline gap-2 tabular-nums">
                {calculatePrice()}
                <span className="text-2xl font-bold text-[var(--accent)] not-italic">{t('calc.currency')}</span>
              </h2>
            </div>
            <button
              type="button"
              className="ui-btn ui-btn-primary min-h-12 px-8 rounded-2xl text-sm uppercase tracking-wide w-full sm:w-auto"
            >
              {t('calc.book')}
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-4 leading-relaxed">{t('calc.disclaimer')}</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
