import React from 'react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { Box, LayoutPanelLeft, LayoutPanelTop, PanelsTopLeft } from 'lucide-react';

const LayoutSelector = () => {
    const { glassType, setGlassType } = useConfiguratorStore();

    const layouts = [
        { id: 'straight', label: 'Straight', icon: <LayoutPanelLeft /> },
        { id: 'corner', label: 'Corner', icon: <Box /> },
        { id: 'l-shape', label: 'L-Shape', icon: <LayoutPanelTop /> },
        { id: 'l-shape-2-doors', label: 'L-Shape 2 Doors', icon: <PanelsTopLeft /> },
    ];

    return (
        <div className="glass-panel p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Select Layout</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                {layouts.map((layout) => (
                    <button
                        key={layout.id}
                        onClick={() => setGlassType(layout.id)}
                        className={`glass-button flex flex-col items-center justify-center gap-1 sm:gap-2 p-3 sm:p-4 h-24 sm:h-32 touch-target ${glassType === layout.id ? 'active' : ''
                            }`}
                    >
                        <div className="text-accent-color">{layout.icon}</div>
                        <span>{layout.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LayoutSelector;
