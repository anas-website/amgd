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
    const [phase, setPhase] = useState('idle'); // idle | preparing_export | preparing_viewer | ready
    const [blobUrl, setBlobUrl] = useState(null);
    const viewerRef = useRef(null);
    const prepareGenRef = useRef(0);

    const dimensions = useConfiguratorStore((s) => s.dimensions);
    const glassType = useConfiguratorStore((s) => s.glassType);
    const isDoorOpen = useConfiguratorStore((s) => s.isDoorOpen);

    // Reset state and cleanup blob when configuration changes
    useEffect(() => {
        prepareGenRef.current += 1;
        setPhase('idle');
        if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
            setBlobUrl(null);
        }
    }, [dimensions, glassType, isDoorOpen]);

    // Clean up blob URL on unmount
    useEffect(() => {
        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [blobUrl]);

    // Attach listeners to model-viewer
    useEffect(() => {
        const mv = viewerRef.current;
        if (!mv) return;

        const handleLoad = () => {
            setPhase((p) => (p === 'preparing_viewer' ? 'ready' : p));
        };
        
        const handleError = (e) => {
            console.error('model-viewer error', e);
            setPhase((p) => {
                if (p === 'preparing_viewer') {
                    alert(t('designer.ar.exportFailed'));
                    return 'idle';
                }
                return p;
            });
        };

        mv.addEventListener('load', handleLoad);
        mv.addEventListener('error', handleError);

        // In case it already loaded before the effect ran
        if (mv.loaded) {
            handleLoad();
        }

        return () => {
            mv.removeEventListener('load', handleLoad);
            mv.removeEventListener('error', handleError);
        };
    }, [blobUrl, t]);

    const prepareModel = useCallback(async () => {
        const scene = sceneRef?.current;
        if (!scene) return;

        const gen = prepareGenRef.current;
        setPhase('preparing_export');

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
        setBlobUrl(url);
        setPhase('preparing_viewer');
    }, [sceneRef, t]);

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
                    });
                }
                // We keep phase as 'ready' so the user can re-open AR without re-exporting
            } else {
                alert(t('designer.ar.unsupported'));
            }
        } catch (e) {
            console.error('activateAR failed', e);
            alert(t('designer.ar.unsupported'));
        }
    }, [t]);

    const handleClick = async () => {
        if (phase === 'preparing_export' || phase === 'preparing_viewer') return;

        if (phase === 'ready') {
            launchAr();
            return;
        }

        await prepareModel();
    };

    const isPreparing = phase === 'preparing_export' || phase === 'preparing_viewer';
    const label = isPreparing
        ? t('designer.ar.preparing')
        : phase === 'ready'
            ? t('designer.ar.openAr')
            : t('designer.ar.viewInAr');

    return (
        <>
            <button
                type="button"
                onClick={handleClick}
                disabled={isPreparing}
                className={`glass-button flex items-center gap-2 absolute top-4 right-4 z-20 ${
                    isPreparing ? 'opacity-50 cursor-wait' : ''
                }`}
            >
                <Smartphone size={20} />
                <span>{label}</span>
            </button>
            
            {/* 
              Render model-viewer natively in React.
              loading="eager" is crucial: it forces the model to load even if it's visually hidden,
              bypassing the IntersectionObserver lazy-loading.
            */}
            {blobUrl && (
                <model-viewer
                    ref={viewerRef}
                    src={blobUrl}
                    ar="true"
                    ar-modes="webxr scene-viewer quick-look"
                    ar-placement="floor"
                    loading="eager"
                    style={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        opacity: 0.001,
                        pointerEvents: 'none',
                        zIndex: -1
                    }}
                />
            )}
        </>
    );
};

export default ARButton;
