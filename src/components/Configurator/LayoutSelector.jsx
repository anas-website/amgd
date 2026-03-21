import React from 'react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { Box, LayoutPanelLeft, LayoutPanelTop, PanelsTopLeft } from 'lucide-react';
import { useI18n } from '../../i18n';
import clsx from 'clsx';

const LayoutSelector = () => {
  const { glassType, setGlassType } = useConfiguratorStore();
  const { t } = useI18n();

  const layouts = [
    { id: 'straight', labelKey: 'layout.straight', icon: LayoutPanelLeft },
    { id: 'corner', labelKey: 'layout.corner', icon: Box },
    { id: 'l-shape', labelKey: 'layout.lShape', icon: LayoutPanelTop },
    { id: 'l-shape-2-doors', labelKey: 'layout.lShape2', icon: PanelsTopLeft },
  ];

  return (
    <div className="glass-panel-dark p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-slate-100">{t('layout.title')}</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {layouts.map((layout) => {
          const Icon = layout.icon;
          const active = glassType === layout.id;
          return (
            <button
              key={layout.id}
              type="button"
              onClick={() => setGlassType(layout.id)}
              className={clsx(
                'glass-button flex flex-col items-center justify-center gap-2 p-3 sm:p-4 min-h-[5.5rem] sm:min-h-[7rem] touch-target text-center',
                active && 'active'
              )}
            >
              <Icon className="text-blue-400 shrink-0" size={22} strokeWidth={1.75} />
              <span className="text-xs sm:text-sm leading-tight text-slate-100">{t(layout.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LayoutSelector;
