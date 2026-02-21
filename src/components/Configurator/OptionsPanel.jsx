import React from 'react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import LayoutSelector from './LayoutSelector';

const OptionsPanel = () => {
    const {
        dimensions, setDimensions,
        handleType, hingeType, frameColor, doorGapMm, showMeasurements,
        setAccessory
    } = useConfiguratorStore();

    const handleChange = (e, key) => {
        setDimensions({ [key]: parseFloat(e.target.value) });
    };

    return (
        <div className="flex flex-col h-full min-h-0 overflow-y-auto pr-1 sm:pr-2">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Design Your Shower
            </h2>

            <LayoutSelector />

            <div className="glass-panel p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Dimensions (cm)</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Width</label>
                        <input
                            type="number"
                            value={dimensions.width}
                            onChange={(e) => handleChange(e, 'width')}
                            className="w-full bg-black/30 border border-white/10 rounded px-3 py-2.5 sm:py-2 text-white focus:border-blue-500 outline-none touch-target"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Height</label>
                        <input
                            type="number"
                            value={dimensions.height}
                            onChange={(e) => handleChange(e, 'height')}
                            className="w-full bg-black/30 border border-white/10 rounded px-3 py-2.5 sm:py-2 text-white focus:border-blue-500 outline-none touch-target"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Depth</label>
                        <input
                            type="number"
                            value={dimensions.depth}
                            onChange={(e) => handleChange(e, 'depth')}
                            className="w-full bg-black/30 border border-white/10 rounded px-3 py-2.5 sm:py-2 text-white focus:border-blue-500 outline-none touch-target"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Door Gap (mm)</label>
                        <input
                            type="number"
                            min="0"
                            max="30"
                            step="1"
                            value={doorGapMm}
                            onChange={(e) => setAccessory('doorGapMm', Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full bg-black/30 border border-white/10 rounded px-3 py-2.5 sm:py-2 text-white focus:border-blue-500 outline-none touch-target"
                        />
                    </div>
                </div>
            </div>

            <div className="glass-panel p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Accessories</h3>

                <div className="mb-4 flex items-center justify-between">
                    <label className="text-sm text-gray-400">Add Black Frame</label>
                    <input
                        type="checkbox"
                        checked={useConfiguratorStore(state => state.showFrame)}
                        onChange={(e) => setAccessory('showFrame', e.target.checked)}
                        className="w-5 h-5 accent-blue-500 rounded cursor-pointer touch-target"
                    />
                </div>

                <div className="mb-4 flex items-center justify-between">
                    <label className="text-sm text-gray-400">Show Edge Measurements</label>
                    <input
                        type="checkbox"
                        checked={showMeasurements}
                        onChange={(e) => setAccessory('showMeasurements', e.target.checked)}
                        className="w-5 h-5 accent-blue-500 rounded cursor-pointer touch-target"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Handle Style</label>
                    <select
                        value={handleType}
                        onChange={(e) => setAccessory('handleType', e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2.5 sm:py-2 text-white focus:border-blue-500 outline-none touch-target"
                    >
                        <option value="modern">Modern Square</option>
                        <option value="round">Classic Round</option>
                        <option value="knob">Minimalist Knob</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Hinge Style</label>
                    <select
                        value={hingeType}
                        onChange={(e) => setAccessory('hingeType', e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded px-3 py-2.5 sm:py-2 text-white focus:border-blue-500 outline-none touch-target"
                    >
                        <option value="standard">Standard Wall Mount</option>
                        <option value="pivot">Pivot</option>
                        <option value="glass-glass">Glass-to-Glass</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-2">Frame Color</label>
                    <div className="flex gap-3">
                        {['#000000', '#C0C0C0', '#D4AF37'].map((color) => (
                            <button
                                key={color}
                                onClick={() => setAccessory('frameColor', color)}
                                className={`w-10 h-10 sm:w-10 sm:h-10 rounded-full border-2 touch-target ${frameColor === color ? 'border-blue-500 scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: color }}
                                aria-label={color}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OptionsPanel;
