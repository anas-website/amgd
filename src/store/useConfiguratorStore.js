import { create } from 'zustand';

export const useConfiguratorStore = create((set) => ({
    // Glass Configuration
    glassType: 'straight', // straight, corner, l-shape, l-shape-2-doors
    dimensions: { width: 100, height: 200, depth: 90 },
    glassThickness: 10, // mm
    glassTexture: 'clear', // clear, frosted, rain

    // Accessories
    handleType: 'modern',
    hingeType: 'standard',
    frameColor: '#000000', // chrome, black, gold
    showFrame: false,
    doorGapMm: 5,
    straightDoorWidthCm: null, // straight layout: door width in cm; null = auto (60% of available)
    doorBottomGapMm: 10, // door bottom clearance in mm (shorter than floor)
    showMeasurements: true,

    // Room walls — interior dimensions default to straight layout (dimensions.width/depth/height)
    showWalls: false,
    roomDimensions: { width: 100, depth: 90, height: 200, leftWallDepth: null, rightWallDepth: null }, // cm; left/right null = use depth
    wallOffset: 0, // cm, positive = walls outward, negative = inward
    wallPositionZ: 0, // cm, move entire room on Z (positive = toward camera)
    roomBoxes: [], // { id, place: 'floor'|'back'|'left'|'right', x, y, z, width, height, depth } in cm
    showRoomWidthMeasurement: false,
    showBoxLabels: false,

    // Display
    showEdges: true,
    showOrigin: false,
    viewPreset: 'free', // 'free' | 'front' | 'top' | 'right'
    perspective: true,

    // Interactive State
    isDoorOpen: false,
    doorAngle: 0,

    /** @type {null | (() => { dataUrl?: string; width?: number; height?: number; error?: string })} — downscaled JPEG for PDF, from Visualizer3D */
    getViewerSnapshot: null,

    // Actions
    setViewerSnapshotGetter: (fn) => set({ getViewerSnapshot: fn }),
    setGlassType: (type) => set({ glassType: type }),
    setDimensions: (dims) => set((state) => ({ dimensions: { ...state.dimensions, ...dims } })),
    setRoomDimensions: (dims) => set((state) => ({ roomDimensions: { ...state.roomDimensions, ...dims } })),
    setAccessory: (key, value) => set({ [key]: value }),
    addRoomBox: (place, defaults = {}) => set((state) => ({
        roomBoxes: [...state.roomBoxes, { id: `box-${Date.now()}`, place, x: 0, y: 0, z: 0, width: 30, height: 20, depth: 25, ...defaults }]
    })),
    updateRoomBox: (id, props) => set((state) => ({
        roomBoxes: state.roomBoxes.map((b) => (b.id === id ? { ...b, ...props } : b))
    })),
    removeRoomBox: (id) => set((state) => ({ roomBoxes: state.roomBoxes.filter((b) => b.id !== id) })),
    toggleDoor: () => set((state) => ({ isDoorOpen: !state.isDoorOpen })),
    setDoorAngle: (angle) => set({ doorAngle: angle }),
    resetConfigurator: () =>
        set({
            glassType: 'straight',
            dimensions: { width: 100, height: 200, depth: 90 },
            handleType: 'modern',
            hingeType: 'standard',
            frameColor: '#000000',
            showFrame: false,
            doorGapMm: 5,
            straightDoorWidthCm: null,
            doorBottomGapMm: 10,
            showMeasurements: true,
            showWalls: false,
            roomDimensions: { width: 100, depth: 90, height: 200, leftWallDepth: null, rightWallDepth: null },
            wallOffset: 0,
            wallPositionZ: 0,
            roomBoxes: [],
            showRoomWidthMeasurement: false,
            showBoxLabels: false,
            showEdges: true,
            showOrigin: false,
            viewPreset: 'free',
            perspective: true,
            isDoorOpen: false,
            doorAngle: 0,
            getViewerSnapshot: null,
        }),
}));
