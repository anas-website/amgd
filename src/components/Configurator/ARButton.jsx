import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { Smartphone } from 'lucide-react';
import '@google/model-viewer';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import { useI18n } from '../../i18n';
import { prepareSceneForGltfExport, disposeClonedScene } from '../../utils/prepareSceneForGltfExport';

/**
 * AR needs a fresh user gesture when calling activateAR() (WebXR / Scene Viewer).
 * Async GLTF export consumes the first tap’s activation, so we use two steps:
 * 1) Build GLB + load in a hidden model-viewer
 * 2) User taps again to launch AR
 */
const ARButton = ({ sceneRef }) => {
    const { t } = useI18n();
    const [phase, setPhase] = useState('idle'); // idle | preparing | ready
    const viewerRef = useRef(null);
    const blobUrlRef = useRef(null);
    const prepareGenRef = useRef(0);

    const dimensions = useConfiguratorStore((s) => s.dimensions);
    const glassType = useConfiguratorStore((s) => s.glassType);
    const isDoorOpen = useConfiguratorStore((s) => s.isDoorOpen);

    useEffect(() => {
        prepareGenRef.current += 1;
        setPhase('idle');
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
        if (viewerRef.current?.parentNode) {
            viewerRef.current.parentNode.removeChild(viewerRef.current);
            viewerRef.current = null;
        }
    }, [dimensions, glassType, isDoorOpen]);

    const cleanupViewer = useCallback(() => {
        if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
        }
        if (viewerRef.current?.parentNode) {
            viewerRef.current.parentNode.removeChild(viewerRef.current);
            viewerRef.current = null;
        }
    }, []);

    useEffect(() => () => cleanupViewer(), [cleanupViewer]);

    const prepareModel = useCallback(async () => {
        const scene = sceneRef?.current;
        if (!scene) return;

        const gen = prepareGenRef.current;
        cleanupViewer();
        setPhase('preparing');

        const exporter = new GLTFExporter();
        const exportRoot = prepareSceneForGltfExport(scene);
        let buffer;
        try {
            buffer = await exporter.parseAsync(exportRoot, { binary: true });
        } catch (e) {
            console.error('GLTF export for AR failed', e);
            if (gen === prepareGenRef.current) {
                alert(t('designer.ar.exportFailed'));
                setPhase('idle');
            }
            return;
        } finally {
            disposeClonedScene(exportRoot);
        }

        if (gen !== prepareGenRef.current) return;

        const blob = new Blob([buffer], { type: 'model/gltf-binary' });
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;

        // Configure before connect so Lit runs one update on attach (avoids "scheduled an update after an update completed").
        const modelViewer = document.createElement('model-viewer');
        modelViewer.setAttribute('ar', '');
        modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
        modelViewer.setAttribute('ar-placement', 'floor');
        modelViewer.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;';
        modelViewer.setAttribute('src', url);

        const onLoad = () => {
            modelViewer.removeEventListener('load', onLoad);
            modelViewer.removeEventListener('error', onError);
            if (gen !== prepareGenRef.current) return;
            setPhase('ready');
        };
        const onError = () => {
            modelViewer.removeEventListener('load', onLoad);
            modelViewer.removeEventListener('error', onError);
            if (gen === prepareGenRef.current) {
                alert(t('designer.ar.exportFailed'));
                cleanupViewer();
                setPhase('idle');
            }
        };

        modelViewer.addEventListener('load', onLoad);
        modelViewer.addEventListener('error', onError);
        document.body.appendChild(modelViewer);
        viewerRef.current = modelViewer;
    }, [sceneRef, cleanupViewer, t]);

    const launchAr = useCallback(() => {
        const mv = viewerRef.current;
        if (!mv) {
            setPhase('idle');
            return;
        }
        try {
            if (mv.canActivateAR) {
                // Call synchronously to ensure it's within the user gesture call stack
                const res = mv.activateAR();
                if (res && res.catch) {
                    res.catch((e) => {
                        console.error('activateAR failed', e);
                        alert(t('designer.ar.unsupported'));
                        cleanupViewer();
                    });
                }
                // Do not cleanup immediately; the external AR viewer needs time to fetch the blob URL.
                setPhase('idle');
            } else {
                alert(t('designer.ar.unsupported'));
                setPhase('idle');
                cleanupViewer();
            }
        } catch (e) {
            console.error('activateAR failed', e);
            alert(t('designer.ar.unsupported'));
            setPhase('idle');
            cleanupViewer();
        }
    }, [cleanupViewer, t]);

    const handleClick = async () => {
        if (phase === 'preparing') return;

        if (phase === 'ready') {
            launchAr();
            return;
        }

        await prepareModel();
    };

    const label =
        phase === 'preparing'
            ? t('designer.ar.preparing')
            : phase === 'ready'
              ? t('designer.ar.openAr')
              : t('designer.ar.viewInAr');

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={phase === 'preparing'}
            className={`glass-button flex items-center gap-2 absolute top-4 right-4 z-20 ${
                phase === 'preparing' ? 'opacity-50 cursor-wait' : ''
            }`}
        >
            <Smartphone size={20} />
            <span>{label}</span>
        </button>
    );
};

export default ARButton;
