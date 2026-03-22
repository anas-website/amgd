import * as THREE from 'three';

/**
 * GLTFExporter cannot serialize ShaderMaterial (drei Text, Line2/LineMaterial, etc.).
 * Clone the subtree and remove those objects so AR export stays clean and quiet.
 */
export function prepareSceneForGltfExport(root) {
    const prepared = root.clone(true);
    const toRemove = [];
    const doorTracks = [];

    prepared.traverse((obj) => {
        if (obj.userData?.isDimension) {
            toRemove.push(obj);
            return;
        }

        if (obj.userData?.isDoor) {
            if (!obj.name) {
                obj.name = `Door_${obj.uuid}`;
            }
            const openAngle = obj.userData.openAngle || (Math.PI / 2);
            const times = [0, 1, 2]; // 0s: closed, 1s: open, 2s: closed
            
            obj.rotation.y = 0;
            obj.updateMatrix();

            const qClosed = new THREE.Quaternion().setFromEuler(new THREE.Euler(obj.rotation.x, 0, obj.rotation.z));
            const qOpen = new THREE.Quaternion().setFromEuler(new THREE.Euler(obj.rotation.x, openAngle, obj.rotation.z));

            const values = [
                qClosed.x, qClosed.y, qClosed.z, qClosed.w,
                qOpen.x, qOpen.y, qOpen.z, qOpen.w,
                qClosed.x, qClosed.y, qClosed.z, qClosed.w
            ];

            const trackName = `${obj.name}.quaternion`;
            const track = new THREE.QuaternionKeyframeTrack(trackName, times, values);
            doorTracks.push(track);
        }

        if (!obj.material) return;
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        if (mats.some((m) => m && (m.isShaderMaterial || m.isRawShaderMaterial))) {
            toRemove.push(obj);
        }
    });

    for (const o of toRemove) {
        o.parent?.remove(o);
    }

    const animations = [];
    if (doorTracks.length > 0) {
        const combinedClip = new THREE.AnimationClip('ToggleDoors', 2, doorTracks);
        animations.push(combinedClip);
    }

    return { prepared, animations };
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
