import React from 'react';
import { ChevronDown, FileText, X } from 'lucide-react';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import LayoutSelector from './LayoutSelector';
import { getDoorDimensions, exportDoorToDxf } from '../../utils/dxfDoorExport';
import { exportConfiguratorPdfReport } from '../../utils/pdfReportExport';
import { useI18n } from '../../i18n';
import clsx from 'clsx';

const inp =
  'w-full bg-black/35 border border-white/12 rounded-xl px-3 py-2.5 sm:py-2.5 text-white placeholder:text-slate-500 focus:border-blue-400 focus:ring-1 focus:ring-blue-500/40 outline-none touch-target';

const LAYOUT_LABEL_KEYS = {
  straight: 'layout.straight',
  corner: 'layout.corner',
  'l-shape': 'layout.lShape',
  'l-shape-2-doors': 'layout.lShape2',
};

const OptionsPanel = () => {
  const { t } = useI18n();
  const getViewerSnapshot = useConfiguratorStore((s) => s.getViewerSnapshot);
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
    showFrame,
  } = useConfiguratorStore();

  const handleChange = (e, key) => {
    const val = e.target.value;
    setDimensions({ [key]: val === '' ? '' : parseFloat(val) });
  };

  const handleRoomChange = (e, key) => {
    const v = e.target.value;
    if (key === 'leftWallDepth' || key === 'rightWallDepth')
      setRoomDimensions({ [key]: v === '' ? null : parseFloat(v) });
    else setRoomDimensions({ [key]: v === '' ? '' : parseFloat(v) });
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
            <input type="number" step="any" value={dimensions.width} onChange={(e) => handleChange(e, 'width')} className={inp} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">{t('opt.height')}</label>
            <input type="number" step="any" value={dimensions.height} onChange={(e) => handleChange(e, 'height')} className={inp} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">{t('opt.depth')}</label>
            <input type="number" step="any" value={dimensions.depth} onChange={(e) => handleChange(e, 'depth')} className={inp} />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">{t('opt.doorGap')}</label>
            <input
              type="number"
              min="0"
              max="30"
              step="any"
              value={doorGapMm}
              onChange={(e) => setAccessory('doorGapMm', e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
              className={inp}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">{t('opt.doorBottomGap')}</label>
            <input
              type="number"
              min="0"
              max="50"
              step="any"
              value={doorBottomGapMm}
              onChange={(e) => setAccessory('doorBottomGapMm', e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value)))}
              className={inp}
            />
          </div>
          {glassType === 'straight' && (
            <div className="col-span-2">
              <label className="block text-sm text-slate-400 mb-1.5">{t('opt.doorWidthStraight')}</label>
              <input
                type="number"
                min="10"
                step="any"
                placeholder={String(Math.round((dimensions.width - doorGapMm / 10) * 0.6))}
                value={straightDoorWidthCm ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  setAccessory('straightDoorWidthCm', v === '' ? null : Math.max(10, parseFloat(v)));
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
                    step="any"
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
                    step="any"
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
                    step="any"
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
                  step="any"
                  value={wallOffset}
                  onChange={(e) => setAccessory('wallOffset', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className={inp + ' text-sm py-2'}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">{t('opt.wallZ')}</label>
                <input
                  type="number"
                  step="any"
                  value={wallPositionZ}
                  onChange={(e) => setAccessory('wallPositionZ', e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className={inp + ' text-sm py-2'}
                />
              </div>
              <div className={clsx('grid gap-2', glassType === 'straight' ? 'grid-cols-2' : 'grid-cols-1')}>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">{t('opt.leftWallLen')}</label>
                  <input
                    type="number"
                    step="any"
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
                      step="any"
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
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {roomBoxes.map((box) => (
                      <li key={box.id} className="flex flex-col gap-2 p-2.5 rounded-lg bg-black/25 border border-white/5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-300 capitalize font-medium">{box.place}</span>
                          <button type="button" onClick={() => removeRoomBox(box.id)} className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-400/10 transition-colors">
                            <X size={14} />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 w-3 text-center">X</span>
                            <input type="number" step="any" className="w-full bg-black/40 rounded px-1.5 py-1 text-white border border-white/10 focus:border-blue-400 outline-none" value={box.x} onChange={(e) => updateRoomBox(box.id, { x: e.target.value === '' ? '' : parseFloat(e.target.value) })} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 w-3 text-center">Y</span>
                            <input type="number" step="any" className="w-full bg-black/40 rounded px-1.5 py-1 text-white border border-white/10 focus:border-blue-400 outline-none" value={box.y} onChange={(e) => updateRoomBox(box.id, { y: e.target.value === '' ? '' : parseFloat(e.target.value) })} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 w-3 text-center">Z</span>
                            <input type="number" step="any" className="w-full bg-black/40 rounded px-1.5 py-1 text-white border border-white/10 focus:border-blue-400 outline-none" value={box.z} onChange={(e) => updateRoomBox(box.id, { z: e.target.value === '' ? '' : parseFloat(e.target.value) })} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 w-3 text-center">W</span>
                            <input type="number" step="any" className="w-full bg-black/40 rounded px-1.5 py-1 text-white border border-white/10 focus:border-blue-400 outline-none" value={box.width} onChange={(e) => updateRoomBox(box.id, { width: e.target.value === '' ? '' : parseFloat(e.target.value) })} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 w-3 text-center">H</span>
                            <input type="number" step="any" className="w-full bg-black/40 rounded px-1.5 py-1 text-white border border-white/10 focus:border-blue-400 outline-none" value={box.height} onChange={(e) => updateRoomBox(box.id, { height: e.target.value === '' ? '' : parseFloat(e.target.value) })} />
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 w-3 text-center">D</span>
                            <input type="number" step="any" className="w-full bg-black/40 rounded px-1.5 py-1 text-white border border-white/10 focus:border-blue-400 outline-none" value={box.depth} onChange={(e) => updateRoomBox(box.id, { depth: e.target.value === '' ? '' : parseFloat(e.target.value) })} />
                          </div>
                        </div>
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

        <div className="pt-4 border-t border-white/[0.08] space-y-3">
          <label className="block text-sm text-slate-400 mb-2">{t('opt.export')}</label>
          <button
            type="button"
            onClick={async () => {
              const snap = getViewerSnapshot?.();
              if (!snap) {
                alert(t('opt.exportPdfNoView'));
                return;
              }
              if (snap.error) {
                alert(`Export error: ${snap.error}`);
                return;
              }
              if (!snap.dataUrl) {
                alert(t('opt.exportPdfNoView'));
                return;
              }
              const layoutKey = LAYOUT_LABEL_KEYS[glassType] || 'layout.straight';
              const hingeMsgKey = hingeType === 'glass-glass' ? 'opt.hinge.gg' : `opt.hinge.${hingeType}`;
              const specLines = [
                `${t('layout.title')}: ${t(layoutKey)}`,
                `${t('opt.width')} / ${t('opt.height')} / ${t('opt.depth')}: ${dimensions.width} × ${dimensions.height} × ${dimensions.depth} cm`,
                `${t('opt.doorGap')}: ${doorGapMm} mm — ${t('opt.doorBottomGap')}: ${doorBottomGapMm} mm`,
                `${t('opt.handle')}: ${t(`opt.handle.${handleType}`)} — ${t('opt.hinge')}: ${t(hingeMsgKey)}`,
                `${t('opt.frameColor')}: ${frameColor}`,
              ];
              if (showFrame) specLines.push(`${t('opt.blackFrame')}: ${t('opt.pdfYes')}`);
              try {
                exportConfiguratorPdfReport({
                  snapshotDataUrl: snap.dataUrl,
                  imageWidth: snap.width,
                  imageHeight: snap.height,
                  title: t('opt.pdfReportTitle'),
                  subtitleLines: [new Date().toLocaleString(), t('opt.pdfViewSubtitle')],
                  specLines,
                  filename: `shower-config-${Date.now()}.pdf`,
                });
              } catch (e) {
                console.error(e);
                alert(t('opt.exportPdfFailed'));
              }
            }}
            className="w-full px-4 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold touch-target shadow-lg shadow-black/20 flex items-center justify-center gap-2"
          >
            <FileText size={18} className="opacity-90 shrink-0" />
            {t('opt.exportPdf')}
          </button>
          <p className="text-xs text-slate-500 leading-relaxed">{t('opt.exportPdfHelp')}</p>
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
          <p className="text-xs text-slate-500 leading-relaxed">{t('opt.exportHelp')}</p>
        </div>
      </div>
    </div>
  );
};

export default OptionsPanel;
