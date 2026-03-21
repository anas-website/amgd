import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import LayoutSelector from './LayoutSelector';
import { getDoorDimensions, exportDoorToDxf } from '../../utils/dxfDoorExport';
import { useI18n } from '../../i18n';
import clsx from 'clsx';

const inp =
  'w-full bg-black/35 border border-white/12 rounded-xl px-3 py-2.5 sm:py-2.5 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-500/40 outline-none touch-target';

const OptionsPanel = () => {
  const { t } = useI18n();
  const {
    dimensions,
    setDimensions,
    roomDimensions,
    setRoomDimensions,
    handleType,
    hingeType,
    frameColor,
    doorGapMm,
    doorBottomGapMm,
    showMeasurements,
    showWalls,
    wallOffset,
    wallPositionZ,
    showEdges,
    showOrigin,
    setAccessory,
    viewPreset,
    perspective,
    roomBoxes,
    addRoomBox,
    updateRoomBox,
    removeRoomBox,
    showRoomWidthMeasurement,
    showBoxLabels,
    glassType,
    straightDoorWidthCm,
  } = useConfiguratorStore();

  const handleChange = (e, key) => {
    setDimensions({ [key]: parseFloat(e.target.value) });
  };

  const handleRoomChange = (e, key) => {
    const v = e.target.value;
    if (key === 'leftWallDepth' || key === 'rightWallDepth')
      setRoomDimensions({ [key]: v === '' ? null : parseFloat(v) });
    else setRoomDimensions({ [key]: parseFloat(v) });
  };

  const wallShape = glassType === 'straight' ? 'U' : 'L';

  return (
    <div className="flex flex-col h-full min-h-0 overflow-y-auto pe-1 sm:pe-2 gap-4 sm:gap-5 pb-2">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-1">
          {t('opt.title')}
        </h2>
        <p className="text-xs text-slate-500">{t('designer.hint.orbit')}</p>
      </div>

      <LayoutSelector />

      <div className="glass-panel-dark p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-slate-100">{t('opt.dimensions')}</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">{t('opt.width')}</label>
            <input type="number" value={dimensions.width} onChange={(e) => handleChange(e, 'width')} className={inp} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">{t('opt.height')}</label>
            <input type="number" value={dimensions.height} onChange={(e) => handleChange(e, 'height')} className={inp} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">{t('opt.depth')}</label>
            <input type="number" value={dimensions.depth} onChange={(e) => handleChange(e, 'depth')} className={inp} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">{t('opt.doorGap')}</label>
            <input
              type="number"
              min="0"
              max="30"
              step="1"
              value={doorGapMm}
              onChange={(e) => setAccessory('doorGapMm', Math.max(0, parseFloat(e.target.value) || 0))}
              className={inp}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">{t('opt.doorBottomGap')}</label>
            <input
              type="number"
              min="0"
              max="50"
              step="1"
              value={doorBottomGapMm}
              onChange={(e) => setAccessory('doorBottomGapMm', Math.max(0, parseFloat(e.target.value) || 0))}
              className={inp}
            />
          </div>
          {glassType === 'straight' && (
            <div className="col-span-2">
              <label className="block text-sm text-slate-400 mb-1.5">{t('opt.doorWidthStraight')}</label>
              <input
                type="number"
                min="10"
                step="1"
                placeholder={String(Math.round((dimensions.width - doorGapMm / 10) * 0.6))}
                value={straightDoorWidthCm ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setAccessory('straightDoorWidthCm', v === '' ? null : Math.max(10, parseFloat(v) || 10));
                }}
                className={inp}
              />
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t('opt.doorWidthHelp')}</p>
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel-dark p-4 sm:p-6 space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-100">{t('opt.accessories')}</h3>

        <div className="flex items-center justify-between gap-3 py-1">
          <label className="text-sm text-slate-300">{t('opt.blackFrame')}</label>
          <input
            type="checkbox"
            checked={useConfiguratorStore((state) => state.showFrame)}
            onChange={(e) => setAccessory('showFrame', e.target.checked)}
            className="w-5 h-5 accent-blue-500 rounded cursor-pointer touch-target shrink-0"
          />
        </div>

        <div className="flex items-center justify-between gap-3 py-1">
          <label className="text-sm text-slate-300">{t('opt.showEdgeMs')}</label>
          <input
            type="checkbox"
            checked={showMeasurements}
            onChange={(e) => setAccessory('showMeasurements', e.target.checked)}
            className="w-5 h-5 accent-blue-500 rounded cursor-pointer touch-target shrink-0"
          />
        </div>

        <div className="flex items-center justify-between gap-3 py-1">
          <label className="text-sm text-slate-300">
            {t('opt.showWalls')} ({wallShape})
          </label>
          <input
            type="checkbox"
            checked={showWalls}
            onChange={(e) => setAccessory('showWalls', e.target.checked)}
            className="w-5 h-5 accent-blue-500 rounded cursor-pointer touch-target shrink-0"
          />
        </div>

        {showWalls && (
          <details className="designer-details group" open>
            <summary>
              <span>{t('opt.roomDims')}</span>
              <ChevronDown size={18} className="opacity-60 shrink-0 transition-transform group-open:rotate-180" />
            </summary>
            <div className="designer-details-body space-y-3 border-t border-white/[0.06]">
              <p className="text-xs text-slate-500 leading-relaxed">{t('opt.roomHelp')}</p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('opt.width')}</label>
                  <input
                    type="number"
                    min="80"
                    value={roomDimensions.width}
                    onChange={(e) => handleRoomChange(e, 'width')}
                    className={inp + ' text-sm py-2'}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('opt.depth')}</label>
                  <input
                    type="number"
                    min="60"
                    value={roomDimensions.depth}
                    onChange={(e) => handleRoomChange(e, 'depth')}
                    className={inp + ' text-sm py-2'}
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('opt.height')}</label>
                  <input
                    type="number"
                    min="200"
                    value={roomDimensions.height}
                    onChange={(e) => handleRoomChange(e, 'height')}
                    className={inp + ' text-sm py-2'}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('opt.wallOffset')}</label>
                <input
                  type="number"
                  value={wallOffset}
                  onChange={(e) => setAccessory('wallOffset', parseFloat(e.target.value) || 0)}
                  className={inp + ' text-sm py-2'}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('opt.wallZ')}</label>
                <input
                  type="number"
                  value={wallPositionZ}
                  onChange={(e) => setAccessory('wallPositionZ', parseFloat(e.target.value) || 0)}
                  className={inp + ' text-sm py-2'}
                />
              </div>
              <div className={clsx('grid gap-2', glassType === 'straight' ? 'grid-cols-2' : 'grid-cols-1')}>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('opt.leftWallLen')}</label>
                  <input
                    type="number"
                    min="30"
                    placeholder={String(roomDimensions.depth)}
                    value={roomDimensions.leftWallDepth ?? ''}
                    onChange={(e) => handleRoomChange(e, 'leftWallDepth')}
                    className={inp + ' text-sm py-2'}
                  />
                </div>
                {glassType === 'straight' && (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">{t('opt.rightWallLen')}</label>
                    <input
                      type="number"
                      min="30"
                      placeholder={String(roomDimensions.depth)}
                      value={roomDimensions.rightWallDepth ?? ''}
                      onChange={(e) => handleRoomChange(e, 'rightWallDepth')}
                      className={inp + ' text-sm py-2'}
                    />
                  </div>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-2">{t('opt.boxesTitle')}</h4>
                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <select
                    id="add-box-place"
                    className={inp + ' text-sm py-2 flex-1'}
                  >
                    <option value="floor">{t('opt.floor')}</option>
                    <option value="back">{t('opt.backWall')}</option>
                    <option value="left">{t('opt.leftWall')}</option>
                    {glassType === 'straight' && <option value="right">{t('opt.rightWall')}</option>}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const sel = document.getElementById('add-box-place');
                      addRoomBox(sel?.value || 'floor');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium touch-target shrink-0"
                  >
                    {t('opt.add')}
                  </button>
                </div>
                {roomBoxes.length > 0 && (
                  <ul className="space-y-2 max-h-36 overflow-y-auto">
                    {roomBoxes.map((box) => (
                      <li key={box.id} className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-black/25 text-xs">
                        <span className="text-slate-400 capitalize shrink-0">{box.place}</span>
                        <input type="number" placeholder="x" className="w-12 bg-black/40 rounded px-1 py-1 text-white border border-white/10" value={box.x} onChange={(e) => updateRoomBox(box.id, { x: parseFloat(e.target.value) || 0 })} />
                        <input type="number" placeholder="y" className="w-12 bg-black/40 rounded px-1 py-1 text-white border border-white/10" value={box.y} onChange={(e) => updateRoomBox(box.id, { y: parseFloat(e.target.value) || 0 })} />
                        <input type="number" placeholder="z" className="w-12 bg-black/40 rounded px-1 py-1 text-white border border-white/10" value={box.z} onChange={(e) => updateRoomBox(box.id, { z: parseFloat(e.target.value) || 0 })} />
                        <input type="number" placeholder="W" className="w-12 bg-black/40 rounded px-1 py-1 text-white border border-white/10" value={box.width} onChange={(e) => updateRoomBox(box.id, { width: parseFloat(e.target.value) || 10 })} />
                        <input type="number" placeholder="H" className="w-12 bg-black/40 rounded px-1 py-1 text-white border border-white/10" value={box.height} onChange={(e) => updateRoomBox(box.id, { height: parseFloat(e.target.value) || 10 })} />
                        <input type="number" placeholder="D" className="w-12 bg-black/40 rounded px-1 py-1 text-white border border-white/10" value={box.depth} onChange={(e) => updateRoomBox(box.id, { depth: parseFloat(e.target.value) || 10 })} />
                        <button type="button" onClick={() => removeRoomBox(box.id)} className="text-red-400 hover:text-red-300 shrink-0 min-w-8 min-h-8">
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-slate-400">{t('opt.showRoomWidth')}</label>
                <input
                  type="checkbox"
                  checked={showRoomWidthMeasurement}
                  onChange={(e) => setAccessory('showRoomWidthMeasurement', e.target.checked)}
                  className="w-5 h-5 accent-blue-500 rounded cursor-pointer touch-target shrink-0"
                />
              </div>
              <div className="flex items-center justify-between gap-3">
                <label className="text-sm text-slate-400">{t('opt.showBoxLabels')}</label>
                <input
                  type="checkbox"
                  checked={showBoxLabels}
                  onChange={(e) => setAccessory('showBoxLabels', e.target.checked)}
                  className="w-5 h-5 accent-blue-500 rounded cursor-pointer touch-target shrink-0"
                />
              </div>
            </div>
          </details>
        )}

        <details className="designer-details group">
          <summary>
            <span>{t('opt.advancedView')}</span>
            <ChevronDown size={18} className="opacity-60 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <div className="designer-details-body space-y-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-slate-300">{t('opt.showEdges')}</label>
              <input
                type="checkbox"
                checked={showEdges}
                onChange={(e) => setAccessory('showEdges', e.target.checked)}
                className="w-5 h-5 accent-blue-500 rounded cursor-pointer touch-target shrink-0"
              />
            </div>
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-slate-300">{t('opt.showOrigin')}</label>
              <input
                type="checkbox"
                checked={showOrigin}
                onChange={(e) => setAccessory('showOrigin', e.target.checked)}
                className="w-5 h-5 accent-blue-500 rounded cursor-pointer touch-target shrink-0"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">{t('opt.view')}</label>
              <select
                value={viewPreset}
                onChange={(e) => setAccessory('viewPreset', e.target.value)}
                className={inp}
              >
                <option value="free">{t('opt.view.free')}</option>
                <option value="front">{t('opt.view.front')}</option>
                <option value="top">{t('opt.view.top')}</option>
                <option value="right">{t('opt.view.right')}</option>
              </select>
            </div>
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-slate-300">{t('opt.perspective')}</label>
              <input
                type="checkbox"
                checked={perspective}
                onChange={(e) => setAccessory('perspective', e.target.checked)}
                className="w-5 h-5 accent-blue-500 rounded cursor-pointer touch-target shrink-0"
              />
            </div>
          </div>
        </details>

        <div className="space-y-4 pt-2 border-t border-white/[0.08]">
          <div>
            <label className="block text-sm text-slate-400 mb-2">{t('opt.handle')}</label>
            <select
              value={handleType}
              onChange={(e) => setAccessory('handleType', e.target.value)}
              className={inp}
            >
              <option value="modern">{t('opt.handle.modern')}</option>
              <option value="round">{t('opt.handle.round')}</option>
              <option value="knob">{t('opt.handle.knob')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">{t('opt.hinge')}</label>
            <select
              value={hingeType}
              onChange={(e) => setAccessory('hingeType', e.target.value)}
              className={inp}
            >
              <option value="standard">{t('opt.hinge.standard')}</option>
              <option value="pivot">{t('opt.hinge.pivot')}</option>
              <option value="glass-glass">{t('opt.hinge.gg')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-3">{t('opt.frameColor')}</label>
            <div className="flex flex-wrap gap-3">
              {['#000000', '#C0C0C0', '#D4AF37'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAccessory('frameColor', color)}
                  className={clsx(
                    'w-11 h-11 rounded-full border-2 touch-target transition-transform',
                    frameColor === color ? 'border-blue-400 scale-105 ring-2 ring-blue-500/30' : 'border-white/20'
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.08]">
          <label className="block text-sm text-slate-400 mb-2">{t('opt.export')}</label>
          <button
            type="button"
            onClick={() => {
              const { widthMm, heightMm } = getDoorDimensions(
                glassType,
                dimensions,
                doorGapMm,
                straightDoorWidthCm,
                doorBottomGapMm
              );
              exportDoorToDxf(widthMm, heightMm, `door-${widthMm}x${heightMm}mm.dxf`);
            }}
            className="w-full px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold touch-target shadow-lg shadow-emerald-900/20"
          >
            {t('opt.exportDxf')}
          </button>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">{t('opt.exportHelp')}</p>
        </div>
      </div>
    </div>
  );
};

export default OptionsPanel;
