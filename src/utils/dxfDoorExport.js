/**
 * Get door dimensions in mm for the current layout's primary door.
 * @param {string} glassType - 'straight' | 'corner' | 'l-shape' | 'l-shape-2-doors'
 * @param {{ width: number, height: number, depth: number }} dimensions - in cm
 * @param {number} doorGapMm - door gap in mm
 * @param {number|null} straightDoorWidthCm - straight layout only: door width in cm; null = 60% of available
 * @param {number} doorBottomGapMm - door bottom clearance in mm (door shorter than full height)
 * @returns {{ widthMm: number, heightMm: number }}
 */
export function getDoorDimensions(glassType, dimensions, doorGapMm = 5, straightDoorWidthCm = null, doorBottomGapMm = 10) {
    const w = dimensions.width * 10; // cm to mm
    const h = dimensions.height * 10 - (doorBottomGapMm || 0); // door is shorter from bottom
    const gap = doorGapMm || 0;
    switch (glassType) {
        case 'straight': {
            const available = w - gap;
            const doorW = straightDoorWidthCm != null ? Math.min(Math.max(10, straightDoorWidthCm * 10), available - 10) : available * 0.6;
            return { widthMm: Math.round(doorW), heightMm: Math.round(h) };
        }
        case 'corner':
            return { widthMm: Math.round(w), heightMm: Math.round(h) };
        case 'l-shape': {
            const available = w - gap;
            const doorW = available * 0.4;
            return { widthMm: Math.round(doorW), heightMm: Math.round(h) };
        }
        case 'l-shape-2-doors': {
            const doorW = w * 0.52;
            return { widthMm: Math.round(doorW), heightMm: Math.round(h) };
        }
        default:
            return { widthMm: Math.round(w * 0.6), heightMm: Math.round(h) };
    }
}

const HINGE_HOLE_DIA_MM = 13;
const HANDLE_HOLE_DIA_MM = 8;
const HINGE_MARGIN_MM = 15;
const HINGE_OFFSET_TOP_BOTTOM_MM = 100;
const HANDLE_MARGIN_MM = 15;
const HANDLE_HOLES_SPACING_MM = 96; // center-to-center

/** DXF group code and value - each on own line, no leading spaces */
function gc(code, value) {
    return `${code}\n${value}\n`;
}

/**
 * Build DXF R12 content for door outline and holes (2 hinge + 2 handle).
 * Door origin: bottom-left (0,0), X right, Y up. Units: mm.
 * Follows minimal valid DXF structure (Paul Bourke / AutoCAD R12).
 */
function buildDxfContent(widthMm, heightMm) {
    const hingeR = HINGE_HOLE_DIA_MM / 2;
    const handleR = HANDLE_HOLE_DIA_MM / 2;
    const hingeX = HINGE_MARGIN_MM;
    const hingeY1 = heightMm - HINGE_OFFSET_TOP_BOTTOM_MM;
    const hingeY2 = HINGE_OFFSET_TOP_BOTTOM_MM;
    const handleX = widthMm - HANDLE_MARGIN_MM;
    const handleY1 = heightMm / 2 + HANDLE_HOLES_SPACING_MM / 2;
    const handleY2 = heightMm / 2 - HANDLE_HOLES_SPACING_MM / 2;

    const line = (x1, y1, x2, y2) =>
        gc(0, 'LINE') +
        gc(8, '1') +
        gc(10, x1) + gc(20, y1) + gc(30, 0) +
        gc(11, x2) + gc(21, y2) + gc(31, 0);

    const circle = (cx, cy, r) =>
        gc(0, 'CIRCLE') +
        gc(8, '1') +
        gc(10, cx) + gc(20, cy) + gc(30, 0) +
        gc(40, r);

    const entities = [
        line(0, 0, widthMm, 0),
        line(widthMm, 0, widthMm, heightMm),
        line(widthMm, heightMm, 0, heightMm),
        line(0, heightMm, 0, 0),
        circle(hingeX, hingeY1, hingeR),
        circle(hingeX, hingeY2, hingeR),
        circle(handleX, handleY1, handleR),
        circle(handleX, handleY2, handleR),
    ].join('');

    const header =
        gc(999, 'Door DXF export') +
        gc(0, 'SECTION') +
        gc(2, 'HEADER') +
        gc(9, '$ACADVER') + gc(1, 'AC1006') +
        gc(9, '$INSBASE') + gc(10, 0) + gc(20, 0) + gc(30, 0) +
        gc(9, '$EXTMIN') + gc(10, 0) + gc(20, 0) +
        gc(9, '$EXTMAX') + gc(10, widthMm) + gc(20, heightMm) +
        gc(0, 'ENDSEC');

    const tables =
        gc(0, 'SECTION') +
        gc(2, 'TABLES') +
        gc(0, 'TABLE') + gc(2, 'LTYPE') + gc(70, 1) +
        gc(0, 'LTYPE') + gc(2, 'CONTINUOUS') + gc(70, 64) + gc(3, 'Solid line') + gc(72, 65) + gc(73, 0) + gc(40, '0.0') +
        gc(0, 'ENDTAB') +
        gc(0, 'TABLE') + gc(2, 'LAYER') + gc(70, 1) +
        gc(0, 'LAYER') + gc(2, '1') + gc(70, 64) + gc(62, 7) + gc(6, 'CONTINUOUS') +
        gc(0, 'ENDTAB') +
        gc(0, 'TABLE') + gc(2, 'STYLE') + gc(70, 0) +
        gc(0, 'ENDTAB') +
        gc(0, 'ENDSEC');

    const blocks =
        gc(0, 'SECTION') +
        gc(2, 'BLOCKS') +
        gc(0, 'ENDSEC');

    const entitiesSection =
        gc(0, 'SECTION') +
        gc(2, 'ENTITIES') +
        entities +
        gc(0, 'ENDSEC');

    const eof = gc(0, 'EOF');

    return header + tables + blocks + entitiesSection + eof;
}

/**
 * Export door to DXF and trigger download.
 */
export function exportDoorToDxf(widthMm, heightMm, filename = 'door.dxf') {
    const content = buildDxfContent(widthMm, heightMm);
    const blob = new Blob([content], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
