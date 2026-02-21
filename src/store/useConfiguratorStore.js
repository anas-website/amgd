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
    showMeasurements: true,

    // Interactive State
    isDoorOpen: false,
    doorAngle: 0,

    // Actions
    setGlassType: (type) => set({ glassType: type }),
    setDimensions: (dims) => set((state) => ({ dimensions: { ...state.dimensions, ...dims } })),
    setAccessory: (key, value) => set({ [key]: value }),
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
            showMeasurements: true,
            isDoorOpen: false,
            doorAngle: 0,
        }),
}));
