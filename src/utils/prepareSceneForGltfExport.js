/**
 * GLTFExporter cannot serialize ShaderMaterial (drei Text, Line2/LineMaterial, etc.).
 * Clone the subtree and remove those objects so AR export stays clean and quiet.
 */
export function prepareSceneForGltfExport(root) {
    const prepared = root.clone(true);
    const toRemove = [];
    prepared.traverse((obj) => {
        if (!obj.material) return;
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        if (mats.some((m) => m && (m.isShaderMaterial || m.isRawShaderMaterial))) {
            toRemove.push(obj);
        }
    });
    for (const o of toRemove) {
        o.parent?.remove(o);
    }
    return prepared;
}

export function disposeClonedScene(root) {
    root.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach((m) => m?.dispose?.());
        }
    });
}
