import React, { useState } from 'react';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter';
import { Smartphone } from 'lucide-react';
import '@google/model-viewer';

const ARButton = ({ sceneRef }) => {
    const [loading, setLoading] = useState(false);

    const handleARClick = async () => {
        if (!sceneRef.current) return;
        setLoading(true);

        const exporter = new GLTFExporter();
        exporter.parse(
            sceneRef.current,
            (gltf) => {
                const blob = new Blob([gltf], { type: 'model/gltf-binary' });
                const url = URL.createObjectURL(blob);

                const modelViewer = document.createElement('model-viewer');
                modelViewer.src = url;
                modelViewer.ar = true;
                modelViewer.arModes = 'webxr scene-viewer quick-look';
                modelViewer.style.display = 'none';
                document.body.appendChild(modelViewer);

                // Give it a moment to initialize then activate
                setTimeout(() => {
                    if (modelViewer.canActivateAR) {
                        modelViewer.activateAR();
                    } else {
                        alert("AR not supported on this device/browser.");
                    }
                    setLoading(false);
                }, 100);
            },
            (error) => {
                console.error('An error happened during GLTF export', error);
                setLoading(false);
            },
            { binary: true }
        );
    };

    return (
        <button
            onClick={handleARClick}
            disabled={loading}
            className={`glass-button flex items-center gap-2 absolute top-4 right-4 z-20 ${loading ? 'opacity-50 cursor-wait' : ''}`}
        >
            <Smartphone size={20} />
            <span>{loading ? 'Preparing AR...' : 'View in AR'}</span>
        </button>
    );
};

export default ARButton;
