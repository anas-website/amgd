/** Max width/height for PDF snapshot — smaller bitmaps avoid browser limits on data URLs / decoding. */
const MAX_EXPORT_PX = 1280;

/**
 * Copy the current WebGL frame into a 2D canvas (downscaled) and return a JPEG data URL.
 * @param {import('three').WebGLRenderer} gl
 * @returns {{ dataUrl?: string; width?: number; height?: number; error?: string }}
 */
export function getViewportJpegUrl(gl) {
    const source = gl.domElement;
    const sw = gl.drawingBufferWidth || source.width;
    const sh = gl.drawingBufferHeight || source.height;
    if (!sw || !sh) return { error: 'WebGL canvas has no size.' };

    let dw = sw;
    let dh = sh;
    const maxDim = Math.max(sw, sh);
    if (maxDim > MAX_EXPORT_PX) {
        const scale = MAX_EXPORT_PX / maxDim;
        dw = Math.round(sw * scale);
        dh = Math.round(sh * scale);
    }

    const canvas = document.createElement('canvas');
    canvas.width = dw;
    canvas.height = dh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { error: 'Could not create 2D context.' };

    try {
        // WebGL canvas might be transparent, fill with the scene's background color
        ctx.fillStyle = '#c8c8c8';
        ctx.fillRect(0, 0, dw, dh);
        ctx.drawImage(source, 0, 0, sw, sh, 0, 0, dw, dh);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        return { dataUrl, width: dw, height: dh };
    } catch (e) {
        console.error('Canvas export error:', e);
        return { error: e.message || String(e) };
    }
}
