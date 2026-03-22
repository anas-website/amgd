import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Line, Text, Edges, Grid } from '@react-three/drei';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import ARButton from './ARButton';
import { useI18n } from '../../i18n';
import part1StlUrl from '../../../Part1.STL?url';

/** SolidWorks-style shaded viewport: dark edge lines on light materials */
const CAD_EDGE = '#1a1a1a';

const GlassPanel = ({
    width,
    height,
    position,
    rotation = [0, 0, 0],
    showFrame,
    panelId,
    selectedEdgeKey,
    onSelectEdge,
    showEdges = false
}) => {
    const { t } = useI18n();
    const panelW = width / 100;
    const panelH = height / 100;
    const edgeDefs = [
        {
            key: `${panelId}-top`,
            label: 'Top Edge',
            mm: Math.round(width * 10),
            line: [[-panelW / 2, panelH / 2, 0.012], [panelW / 2, panelH / 2, 0.012]],
            hitboxPos: [0, panelH / 2, 0.012],
            hitboxArgs: [panelW, 0.035, 0.045],
            dimExtDir: [0, 1, 0],
            labelOffset: [0, 0.04, 0]
        },
        {
            key: `${panelId}-bottom`,
            label: 'Bottom Edge',
            mm: Math.round(width * 10),
            line: [[-panelW / 2, -panelH / 2, 0.012], [panelW / 2, -panelH / 2, 0.012]],
            hitboxPos: [0, -panelH / 2, 0.012],
            hitboxArgs: [panelW, 0.035, 0.045],
            dimExtDir: [0, -1, 0],
            labelOffset: [0, -0.04, 0]
        },
        {
            key: `${panelId}-left`,
            label: 'Left Edge',
            mm: Math.round(height * 10),
            line: [[-panelW / 2, -panelH / 2, 0.012], [-panelW / 2, panelH / 2, 0.012]],
            hitboxPos: [-panelW / 2, 0, 0.012],
            hitboxArgs: [0.035, panelH, 0.045],
            dimExtDir: [-1, 0, 0],
            labelOffset: [-0.04, 0, 0]
        },
        {
            key: `${panelId}-right`,
            label: 'Right Edge',
            mm: Math.round(height * 10),
            line: [[panelW / 2, -panelH / 2, 0.012], [panelW / 2, panelH / 2, 0.012]],
            hitboxPos: [panelW / 2, 0, 0.012],
            hitboxArgs: [0.035, panelH, 0.045],
            dimExtDir: [1, 0, 0],
            labelOffset: [0.04, 0, 0]
        }
    ];

    return (
    <group position={position} rotation={rotation}>
        {/* Glass */}
        <mesh castShadow receiveShadow>
            <boxGeometry args={[width / 100, height / 100, 0.01]} />
            <meshPhysicalMaterial
                color="#dce8f0"
                transmission={0.96}
                opacity={0.42}
                transparent
                roughness={0.06}
                metalness={0.02}
                ior={1.52}
                thickness={0.012}
                clearcoat={0.2}
                clearcoatRoughness={0.15}
                side={THREE.DoubleSide}
            />
            {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
        </mesh>

        {showFrame && (
            <>
                {/* Top Frame */}
                <mesh position={[0, (height / 200) + 0.01, 0]}>
                    <boxGeometry args={[(width / 100) + 0.04, 0.02, 0.02]} />
                    <meshStandardMaterial color="#1c1c1c" metalness={0.45} roughness={0.42} />
                    {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
                </mesh>
                {/* Bottom Frame */}
                <mesh position={[0, -(height / 200) - 0.01, 0]}>
                    <boxGeometry args={[(width / 100) + 0.04, 0.02, 0.02]} />
                    <meshStandardMaterial color="#1c1c1c" metalness={0.45} roughness={0.42} />
                    {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
                </mesh>
                {/* Left Frame */}
                <mesh position={[-(width / 200) - 0.01, 0, 0]}>
                    <boxGeometry args={[0.02, (height / 100), 0.02]} />
                    <meshStandardMaterial color="#1c1c1c" metalness={0.45} roughness={0.42} />
                    {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
                </mesh>
                {/* Right Frame */}
                <mesh position={[(width / 200) + 0.01, 0, 0]}>
                    <boxGeometry args={[0.02, (height / 100), 0.02]} />
                    <meshStandardMaterial color="#1c1c1c" metalness={0.45} roughness={0.42} />
                    {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
                </mesh>
            </>
        )}
        {edgeDefs.map((edge) => {
            const isSelected = selectedEdgeKey === edge.key;
            return (
                <group key={edge.key}>
                    <mesh
                        position={edge.hitboxPos}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelectEdge?.({
                                key: edge.key,
                                panelId,
                                label: edge.label,
                                mm: edge.mm
                            });
                        }}
                    >
                        <boxGeometry args={edge.hitboxArgs} />
                        <meshBasicMaterial transparent opacity={0} />
                    </mesh>

                    {isSelected && (
                        <DimensionWithExtensions
                            p1={edge.line[0]}
                            p2={edge.line[1]}
                            extDir={edge.dimExtDir}
                            extLength={0.06}
                            name={t('dim.edgeLength')}
                            label={`${edge.mm} mm`}
                            labelOffset={edge.labelOffset}
                        />
                    )}
                </group>
            );
        })}
    </group>
    );
};

const Door = ({
    width,
    height,
    position,
    rotation = [0, 0, 0],
    isOpen,
    handleType,
    frameColor,
    showFrame,
    panelId,
    selectedEdgeKey,
    onSelectEdge,
    hingeOnRight = false,
    showEdges = false,
    bottomGapMm = 10
}) => {
    const group = useRef();

    const openAngle = hingeOnRight ? -Math.PI / 2 : Math.PI / 2;
    useFrame((state, delta) => {
        if (group.current) {
            const targetRotation = isOpen ? openAngle : 0;
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation, delta * 2);
        }
    });

    const hingeColor = frameColor || 'silver';
    const fullH = height / 100;
    const topHingeY = fullH / 2 - 0.07;
    const bottomHingeY = -fullH / 2 + 0.07;
    const panelOffsetX = hingeOnRight ? -width / 200 : width / 200;
    const hingeX = hingeOnRight ? 0.008 : -0.008;
    const handleX = hingeOnRight ? -width / 100 + 0.05 : width / 100 - 0.05;
    const gapM = Math.max(0, (bottomGapMm || 0) / 1000);
    const leafHeightCm = Math.max(10, height - gapM * 100); // keep at least 10 cm
    const panelOffsetY = gapM / 2;
    const hingeHoleR = 0.013 / 2;
    const handleHoleR = 0.008 / 2;
    const handleHoleSpacing = 0.048;

    return (
        <group ref={group} position={position} rotation={rotation} userData={{ isDoor: true, openAngle }}>
            {/* Pivot is at hinge side (x=0); door geometry extends left or right depending on hingeOnRight */}
            <GlassPanel
                width={width}
                height={leafHeightCm}
                position={[panelOffsetX, panelOffsetY, 0]}
                showFrame={showFrame}
                panelId={`${panelId}-leaf`}
                selectedEdgeKey={selectedEdgeKey}
                onSelectEdge={onSelectEdge}
                showEdges={showEdges}
            />
            {/* 2 hinge holes (13 mm) for etch hinge - cylinder axis along Z through door */}
            <mesh position={[0, topHingeY, 0.006]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[hingeHoleR, hingeHoleR, 0.012, 24]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.85} metalness={0.08} />
                {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
            </mesh>
            <mesh position={[0, bottomHingeY, 0.006]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[hingeHoleR, hingeHoleR, 0.012, 24]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.85} metalness={0.08} />
                {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
            </mesh>
            {/* 2 handle holes (8 mm) */}
            <mesh position={[handleX, handleHoleSpacing, 0.006]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[handleHoleR, handleHoleR, 0.012, 24]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.85} metalness={0.08} />
                {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
            </mesh>
            <mesh position={[handleX, -handleHoleSpacing, 0.006]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[handleHoleR, handleHoleR, 0.012, 24]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.85} metalness={0.08} />
                {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
            </mesh>
            {/* Hinges on pivot edge */}
            <mesh position={[hingeX, topHingeY, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.012, 0.012, 0.03, 16]} />
                <meshStandardMaterial color={hingeColor} metalness={0.75} roughness={0.22} envMapIntensity={0.9} />
                {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
            </mesh>
            <mesh position={[hingeX, bottomHingeY, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.012, 0.012, 0.03, 16]} />
                <meshStandardMaterial color={hingeColor} metalness={0.75} roughness={0.22} envMapIntensity={0.9} />
                {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
            </mesh>
            {handleType === 'knob' ? (
                <mesh position={[handleX, 0, 0.02]} castShadow>
                    <sphereGeometry args={[0.025, 32, 32]} />
                    <meshStandardMaterial color={frameColor || "silver"} metalness={0.82} roughness={0.18} envMapIntensity={0.95} />
                    {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
                </mesh>
            ) : (
                <StlHandle
                    position={[handleX, 0, 0.02]}
                    color={frameColor || "silver"}
                    showEdges={showEdges}
                />
            )}
        </group>
    );
};

const StlHandle = ({ position, color, showEdges = false }) => {
    const rawGeometry = useLoader(STLLoader, part1StlUrl);

    const geometry = useMemo(() => {
        const cloned = rawGeometry.clone();
        cloned.computeVertexNormals();
        cloned.computeBoundingBox();
        const bbox = cloned.boundingBox;
        if (!bbox) return cloned;

        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const targetMaxDim = 0.15;
        const scale = targetMaxDim / maxDim;

        const center = new THREE.Vector3();
        bbox.getCenter(center);
        cloned.translate(-center.x, -center.y, -center.z);
        cloned.scale(scale, scale, scale);
        return cloned;
    }, [rawGeometry]);

    return (
        <mesh
            geometry={geometry}
            position={position}
            rotation={[0, Math.PI, 0]}
            castShadow
            receiveShadow
        >
            <meshStandardMaterial color={color} metalness={0.78} roughness={0.22} envMapIntensity={0.95} />
            {showEdges && <Edges threshold={15} color={CAD_EDGE} />}
        </mesh>
    );
};

/** CAD-style: extension lines from measured points to a parallel dimension line */
const DimensionWithExtensions = ({
    p1,
    p2,
    extDir,
    extLength = 0.07,
    label,
    /** Short label above the value (e.g. “Overall width”) */
    name: dimName,
    color = '#000000',
    labelOffset = [0, 0, 0],
    /** Draw above scene geometry (e.g. enclosure dims above glass) */
    renderOnTop = false,
}) => {
    const len = Math.sqrt(extDir[0] ** 2 + extDir[1] ** 2 + extDir[2] ** 2) || 1;
    const nx = extDir[0] / len;
    const ny = extDir[1] / len;
    const nz = extDir[2] / len;
    const e = [nx * extLength, ny * extLength, nz * extLength];
    const q1 = [p1[0] + e[0], p1[1] + e[1], p1[2] + e[2]];
    const q2 = [p2[0] + e[0], p2[1] + e[1], p2[2] + e[2]];
    const mid = [
        (q1[0] + q2[0]) / 2 + labelOffset[0],
        (q1[1] + q2[1]) / 2 + labelOffset[1],
        (q1[2] + q2[2]) / 2 + labelOffset[2],
    ];
    /** Name further out along extension direction; value slightly inward (drawing-style) */
    const nameLift = 0.048;
    const valueIn = 0.02;
    const namePos = [
        mid[0] + nx * nameLift,
        mid[1] + ny * nameLift,
        mid[2] + nz * nameLift,
    ];
    const valuePos = [
        mid[0] - nx * valueIn,
        mid[1] - ny * valueIn,
        mid[2] - nz * valueIn,
    ];

    const lineProps = renderOnTop
        ? { depthTest: false, renderOrder: 10 }
        : {};

    const textProps = {
        color,
        anchorX: 'center',
        depthTest: !renderOnTop,
        renderOrder: renderOnTop ? 11 : undefined,
    };

    return (
        <group renderOrder={renderOnTop ? 10 : undefined} userData={{ isDimension: true }}>
            <Line points={[p1, q1]} color={color} lineWidth={1} {...lineProps} />
            <Line points={[p2, q2]} color={color} lineWidth={1} {...lineProps} />
            <Line points={[q1, q2]} color={color} lineWidth={1} {...lineProps} />
            {dimName ? (
                <>
                    <Text position={namePos} fontSize={0.026} {...textProps} anchorY="middle">
                        {dimName}
                    </Text>
                    <Text position={valuePos} fontSize={0.036} {...textProps} anchorY="middle">
                        {label}
                    </Text>
                </>
            ) : (
                <Text position={mid} fontSize={0.042} {...textProps} anchorY="middle">
                    {label}
                </Text>
            )}
        </group>
    );
};

/** Smallest span = inner (short extension); largest = outer (long extension), like CAD drawings */
function linearExtLengths(n) {
    if (n <= 0) return [];
    if (n === 1) return [0.12];
    return Array.from({ length: n }, (_, i) => 0.055 + (i / (n - 1)) * (0.2 - 0.055));
}

function assignExtLengthsBySpan(entries) {
    const sorted = [...entries].sort((a, b) => {
        const d = a.span - b.span;
        if (Math.abs(d) > 1e-5) return d;
        return a.priority - b.priority;
    });
    const exts = linearExtLengths(sorted.length);
    sorted.forEach((e, i) => {
        e.extLength = exts[i];
    });
    return sorted;
}

/** Aligned box dimensions (cm) with extension lines; center + half-extents in meters */
/** Room-box dimensions only — red; all other dimensions use black */
const BoxDimensionsWithExtensions = ({ center, half, widthCm, heightCm, depthCm, color = '#dc2626' }) => {
    const { t } = useI18n();
    const [hx, hy, hz] = half;
    const [cx, cy, cz] = center;
    const blb = [cx - hx, cy - hy, cz - hz];
    const brb = [cx + hx, cy - hy, cz - hz];
    const blf = [cx - hx, cy - hy, cz + hz];
    const tlb = [cx - hx, cy + hy, cz - hz];
    const tiered = assignExtLengthsBySpan([
        { span: widthCm / 100, priority: 0, id: 'w' },
        { span: depthCm / 100, priority: 1, id: 'd' },
        { span: heightCm / 100, priority: 2, id: 'h' },
    ]);
    const extOf = (id) => tiered.find((r) => r.id === id)?.extLength ?? 0.075;
    return (
        <group>
            <DimensionWithExtensions
                p1={blb}
                p2={brb}
                extDir={[0, 0, -1]}
                extLength={extOf('w')}
                name={t('dim.boxWidth')}
                label={`${Math.round(widthCm)} cm`}
                color={color}
                labelOffset={[0, 0, -0.02]}
            />
            <DimensionWithExtensions
                p1={blb}
                p2={blf}
                extDir={[0, 1, 0]}
                extLength={extOf('d')}
                name={t('dim.boxDepth')}
                label={`${Math.round(depthCm)} cm`}
                color={color}
                labelOffset={[0, 0.03, 0]}
            />
            <DimensionWithExtensions
                p1={blb}
                p2={tlb}
                extDir={[-1, 0, 0]}
                extLength={extOf('h')}
                name={t('dim.boxHeight')}
                label={`${Math.round(heightCm)} cm`}
                color={color}
                labelOffset={[-0.025, 0, 0]}
            />
        </group>
    );
};

const OriginAxes = () => {
    const showOrigin = useConfiguratorStore((s) => s.showOrigin);
    if (!showOrigin) return null;
    return <axesHelper args={[1.5]} />;
};

const WALL_THICKNESS = 0.08;

const RoomWalls = ({
    width: roomW,
    depth: roomD,
    height: roomH,
    leftWallDepth: leftDepthCm,
    rightWallDepth: rightDepthCm,
    floorY = 0,
    wallOffsetCm = 0,
    wallPositionZCm = 0,
    showEdges = false,
    /** U = back + left + right (straight layout). L = back + left only (corner / L layouts). */
    wallShape = 'u',
}) => {
    const w = Math.max(0.5, roomW / 100);
    const leftD = Math.max(0.3, (leftDepthCm != null ? leftDepthCm : roomD) / 100);
    const rightD = Math.max(0.3, (rightDepthCm != null ? rightDepthCm : roomD) / 100);
    const maxLD = wallShape === 'l' ? leftD : Math.max(leftD, rightD);
    const h = Math.max(1, roomH / 100);
    const baseY = floorY + h / 2;
    const offsetM = (wallOffsetCm || 0) / 100;
    const positionZM = (wallPositionZCm || 0) / 100;
    const T = WALL_THICKNESS;

    const groupZ = -maxLD / 2 + positionZM;
    const backZ = -maxLD / 2 - T / 2 - offsetM;
    const leftX = -w / 2 - T / 2 - offsetM;
    const rightX = w / 2 + T / 2 + offsetM;
    const leftWallZ = (maxLD - leftD) / 2;
    const rightWallZ = (maxLD - rightD) / 2;

    const wallMat = <meshStandardMaterial color="#d6d6d6" roughness={0.88} metalness={0.04} />;
    const edgeLine = showEdges ? <Edges threshold={15} color={CAD_EDGE} /> : null;

    return (
        <group position={[0, baseY, groupZ]}>
            {/* Back wall — interior face at z = -maxLD/2 - offsetM */}
            <mesh position={[0, 0, backZ]} receiveShadow>
                <boxGeometry args={[w, h, T]} />
                {wallMat}
                {edgeLine}
            </mesh>
            {/* Left wall */}
            <mesh position={[leftX, 0, leftWallZ]} receiveShadow>
                <boxGeometry args={[T, h, leftD]} />
                {wallMat}
                {edgeLine}
            </mesh>
            {wallShape === 'u' && (
                <mesh position={[rightX, 0, rightWallZ]} receiveShadow>
                    <boxGeometry args={[T, h, rightD]} />
                    {wallMat}
                    {edgeLine}
                </mesh>
            )}
        </group>
    );
};

const RoomBoxes = ({
    roomDimensions,
    wallOffset,
    wallPositionZ,
    floorY,
    showEdges = false,
    showBoxLabels = false,
    wallShape = 'u',
}) => {
    const roomBoxes = useConfiguratorStore((s) => s.roomBoxes);
    const w = Math.max(0.5, roomDimensions.width / 100);
    const leftD = Math.max(0.3, (roomDimensions.leftWallDepth != null ? roomDimensions.leftWallDepth : roomDimensions.depth) / 100);
    const rightD = Math.max(0.3, (roomDimensions.rightWallDepth != null ? roomDimensions.rightWallDepth : roomDimensions.depth) / 100);
    const maxLD = wallShape === 'l' ? leftD : Math.max(leftD, rightD);
    const h = Math.max(1, roomDimensions.height / 100);
    const offsetM = (wallOffset || 0) / 100;
    const positionZM = (wallPositionZ || 0) / 100;
    const groupZ = -maxLD / 2 + positionZM;
    const baseY = floorY + h / 2;
    const T = WALL_THICKNESS;
    /** Interior faces: origin (0,0) on floor at back–left corner (x from left face, z from back face), cm in UI */
    const leftInnerX = -w / 2 - offsetM;
    const rightInnerX = w / 2 + offsetM;
    const backInnerZ = -maxLD / 2 - offsetM;

    const boxMat = <meshStandardMaterial color="#b8b0a8" roughness={0.72} metalness={0.12} />;
    const edgeLine = showEdges ? <Edges threshold={15} color={CAD_EDGE} /> : null;

    const renderBoxWithLabel = (box, mesh, dimCenter, dimHalf, dimCm) => (
        <group key={box.id}>
            {mesh}
            {showBoxLabels && dimCenter && dimHalf && dimCm && (
                <BoxDimensionsWithExtensions
                    center={dimCenter}
                    half={dimHalf}
                    widthCm={dimCm.w}
                    heightCm={dimCm.h}
                    depthCm={dimCm.d}
                />
            )}
        </group>
    );

    return (
        <group position={[0, baseY, groupZ]}>
            {roomBoxes.map((box) => {
                const bw = box.width / 100;
                const bh = box.height / 100;
                const bd = box.depth / 100;
                const xm = box.x / 100;
                const ym = box.y / 100;
                const zm = box.z / 100;

                if (box.place === 'floor') {
                    const pos = [
                        leftInnerX + xm + bw / 2,
                        floorY - baseY + bh / 2,
                        backInnerZ + zm + bd / 2,
                    ];
                    return renderBoxWithLabel(
                        box,
                        <mesh position={pos} castShadow receiveShadow>
                            <boxGeometry args={[bw, bh, bd]} />
                            {boxMat}
                            {edgeLine}
                        </mesh>,
                        pos,
                        [bw / 2, bh / 2, bd / 2],
                        { w: box.width, h: box.height, d: box.depth }
                    );
                }
                if (box.place === 'back') {
                    const pos = [leftInnerX + xm + bw / 2, floorY - baseY + ym + bh / 2, backInnerZ + bd / 2];
                    return renderBoxWithLabel(
                        box,
                        <mesh position={pos} castShadow receiveShadow>
                            <boxGeometry args={[bw, bh, bd]} />
                            {boxMat}
                            {edgeLine}
                        </mesh>,
                        pos,
                        [bw / 2, bh / 2, bd / 2],
                        { w: box.width, h: box.height, d: box.depth }
                    );
                }
                if (box.place === 'left') {
                    const pos = [leftInnerX + bd / 2 + xm, floorY - baseY + ym + bh / 2, backInnerZ + zm + bw / 2];
                    return renderBoxWithLabel(
                        box,
                        <mesh position={pos} castShadow receiveShadow>
                            <boxGeometry args={[bd, bh, bw]} />
                            {boxMat}
                            {edgeLine}
                        </mesh>,
                        pos,
                        [bd / 2, bh / 2, bw / 2],
                        { w: box.depth, h: box.height, d: box.width }
                    );
                }
                if (box.place === 'right' && wallShape === 'u') {
                    const pos = [rightInnerX - bd / 2 - xm, floorY - baseY + ym + bh / 2, backInnerZ + zm + bw / 2];
                    return renderBoxWithLabel(
                        box,
                        <mesh position={pos} castShadow receiveShadow>
                            <boxGeometry args={[bd, bh, bw]} />
                            {boxMat}
                            {edgeLine}
                        </mesh>,
                        pos,
                        [bd / 2, bh / 2, bw / 2],
                        { w: box.depth, h: box.height, d: box.width }
                    );
                }
                return null;
            })}
        </group>
    );
};

const RoomWidthMeasurement = ({ roomDimensions, wallPositionZ, floorY, wallShape = 'u' }) => {
    const { t } = useI18n();
    const w = roomDimensions.width / 100;
    const h = roomDimensions.height / 100;
    const leftD = Math.max(
        0.3,
        (roomDimensions.leftWallDepth != null ? roomDimensions.leftWallDepth : roomDimensions.depth) / 100
    );
    const rightD = Math.max(
        0.3,
        (roomDimensions.rightWallDepth != null ? roomDimensions.rightWallDepth : roomDimensions.depth) / 100
    );
    const maxLD = wallShape === 'l' ? leftD : Math.max(leftD, rightD);
    const positionZM = (wallPositionZ || 0) / 100;
    const groupZ = -maxLD / 2 + positionZM;
    const lineY = floorY + h / 4;
    const lineZ = groupZ - maxLD / 2;
    const p1 = [-w / 2, lineY, lineZ];
    const p2 = [w / 2, lineY, lineZ];
    return (
        <DimensionWithExtensions
            p1={p1}
            p2={p2}
            extDir={[0, 0, 1]}
            extLength={0.08}
            name={t('dim.roomWidth')}
            label={`${roomDimensions.width} cm`}
            labelOffset={[0, 0.04, 0]}
        />
    );
};

const Model = ({ selectedEdgeKey, onSelectEdge }) => {
    const {
        dimensions, glassType, isDoorOpen, toggleDoor,
        handleType, frameColor, showFrame, doorGapMm, showMeasurements,
        showWalls, roomDimensions, wallOffset, wallPositionZ, showEdges,
        showRoomWidthMeasurement, showBoxLabels,
        straightDoorWidthCm, doorBottomGapMm
    } = useConfiguratorStore();
    const { width, height, depth } = dimensions;
    const yPos = height / 200;
    const roomWallShape = glassType === 'straight' ? 'u' : 'l';
    const gapM = Math.max(0, (doorGapMm || 0) / 1000);
    const wM = width / 100;
    const hM = height / 100;
    const dM = depth / 100;

    const { t } = useI18n();

    const measurementItems = useMemo(() => {
        /** Attachment on actual glass: top edge y = hM/2; front face z = 0 for straight/corner; L-front run at zFrontL */
        const yTop = hM / 2;
        const zStraight = 0;
        const zFrontL = -(depth * 0.45) / 100;
        const minFixedW = 0.1;
        const rows = [];

        const heightRow = (zLeftFront) => ({
            key: 'meas-height',
            p1: [-wM / 2, -hM / 2, zLeftFront],
            p2: [-wM / 2, hM / 2, zLeftFront],
            extDir: [-1, 0, 0],
            extLength: 0.15,
            name: t('dim.height'),
            label: `${Math.round(height)} cm`,
            labelOffset: [-0.04, 0, 0],
            renderOnTop: true,
        });

        if (glassType === 'straight') {
            const totalW = wM;
            const availableW = Math.max(0.1, totalW - gapM);
            const doorW =
                straightDoorWidthCm != null
                    ? Math.min(Math.max(0.1, straightDoorWidthCm / 100), availableW - minFixedW)
                    : availableW * 0.6;
            const fixedW = Math.max(minFixedW, availableW - doorW);
            const leftX = -totalW / 2;
            const doorPivotX = leftX + fixedW + gapM;

            const tiered = assignExtLengthsBySpan([
                { span: doorW, priority: 0, id: 'door' },
                { span: wM, priority: 2, id: 'width' },
            ]);

            rows.push(
                {
                    key: 'meas-door',
                    p1: [doorPivotX, yTop, zStraight],
                    p2: [doorPivotX + doorW, yTop, zStraight],
                    extDir: [0, 1, 0],
                    extLength: tiered.find((r) => r.id === 'door')?.extLength ?? 0.08,
                    name: t('dim.doorWidth'),
                    label: `${Math.round(doorW * 100)} cm`,
                    labelOffset: [0, 0.035, 0],
                    renderOnTop: true,
                },
                {
                    key: 'meas-overall-width',
                    p1: [-wM / 2, yTop, zStraight],
                    p2: [wM / 2, yTop, zStraight],
                    extDir: [0, 1, 0],
                    extLength: tiered.find((r) => r.id === 'width')?.extLength ?? 0.16,
                    name: t('dim.overallWidth'),
                    label: `${Math.round(width)} cm`,
                    labelOffset: [0, 0.035, 0],
                    renderOnTop: true,
                },
                heightRow(zStraight)
            );
            return rows;
        }

        if (glassType === 'l-shape') {
            const totalFrontW = wM;
            const availableFrontW = Math.max(0.1, totalFrontW - gapM);
            const fixedFrontW = availableFrontW * 0.6;
            const doorFrontW = availableFrontW * 0.4;
            const frontLeftX = -totalFrontW / 2;
            const doorFrontPivotX = frontLeftX + fixedFrontW + gapM;

            const tiered = assignExtLengthsBySpan([
                { span: doorFrontW, priority: 0, id: 'door' },
                { span: dM, priority: 1, id: 'depth' },
                { span: wM, priority: 2, id: 'width' },
            ]);

            rows.push(
                {
                    key: 'meas-door',
                    p1: [doorFrontPivotX, yTop, zFrontL],
                    p2: [doorFrontPivotX + doorFrontW, yTop, zFrontL],
                    extDir: [0, 1, 0],
                    extLength: tiered.find((r) => r.id === 'door')?.extLength ?? 0.08,
                    name: t('dim.doorFront'),
                    label: `${Math.round(doorFrontW * 100)} cm`,
                    labelOffset: [0, 0.035, 0],
                    renderOnTop: true,
                },
                {
                    key: 'meas-depth',
                    p1: [-wM / 2, yTop, zStraight],
                    p2: [-wM / 2, yTop, -dM],
                    extDir: [0, 1, 0],
                    extLength: tiered.find((r) => r.id === 'depth')?.extLength ?? 0.12,
                    name: t('dim.depth'),
                    label: `${Math.round(depth)} cm`,
                    labelOffset: [-0.04, 0.035, 0],
                    renderOnTop: true,
                },
                {
                    key: 'meas-overall-width',
                    p1: [-wM / 2, yTop, zFrontL],
                    p2: [wM / 2, yTop, zFrontL],
                    extDir: [0, 1, 0],
                    extLength: tiered.find((r) => r.id === 'width')?.extLength ?? 0.16,
                    name: t('dim.overallWidth'),
                    label: `${Math.round(width)} cm`,
                    labelOffset: [0, 0.035, 0],
                    renderOnTop: true,
                },
                heightRow(zFrontL)
            );
            return rows;
        }

        if (glassType === 'corner') {
            const tiered = assignExtLengthsBySpan([
                { span: wM, priority: 0, id: 'door' },
                { span: dM, priority: 1, id: 'depth' },
                { span: wM, priority: 2, id: 'width' },
            ]);

            rows.push(
                {
                    key: 'meas-door-z',
                    p1: [0, yTop, 0],
                    p2: [0, yTop, wM],
                    extDir: [1, 0, 0],
                    extLength: tiered.find((r) => r.id === 'door')?.extLength ?? 0.08,
                    name: t('dim.doorWidth'),
                    label: `${Math.round(width)} cm`,
                    labelOffset: [0.05, 0, 0],
                    renderOnTop: true,
                },
                {
                    key: 'meas-depth',
                    p1: [-wM / 2, yTop, zStraight],
                    p2: [-wM / 2, yTop, -dM],
                    extDir: [0, 1, 0],
                    extLength: tiered.find((r) => r.id === 'depth')?.extLength ?? 0.12,
                    name: t('dim.depth'),
                    label: `${Math.round(depth)} cm`,
                    labelOffset: [-0.04, 0.035, 0],
                    renderOnTop: true,
                },
                {
                    key: 'meas-overall-width',
                    p1: [-wM / 2, yTop, zStraight],
                    p2: [wM / 2, yTop, zStraight],
                    extDir: [0, 1, 0],
                    extLength: tiered.find((r) => r.id === 'width')?.extLength ?? 0.16,
                    name: t('dim.overallWidth'),
                    label: `${Math.round(width)} cm`,
                    labelOffset: [0, 0.035, 0],
                    renderOnTop: true,
                },
                heightRow(zStraight)
            );
            return rows;
        }

        if (glassType === 'l-shape-2-doors') {
            const zFront = -(depth * 0.45) / 100;
            const doorFrontW = (width * 0.52) / 100;
            const pivotX = (width * 0.22) / 100;
            const sideDoorW = (depth * 0.52) / 100;
            const sidePx = -(width * 0.45) / 100;
            const sidePz = -(depth * 0.2) / 100;

            const tiered = assignExtLengthsBySpan([
                { span: doorFrontW, priority: 0, id: 'doorF' },
                { span: sideDoorW, priority: 1, id: 'doorS' },
                { span: dM, priority: 2, id: 'depth' },
                { span: wM, priority: 3, id: 'width' },
            ]);

            rows.push(
                {
                    key: 'meas-door-front',
                    p1: [pivotX, yTop, zFront],
                    p2: [pivotX + doorFrontW, yTop, zFront],
                    extDir: [0, 1, 0],
                    extLength: tiered.find((r) => r.id === 'doorF')?.extLength ?? 0.08,
                    name: t('dim.doorFront'),
                    label: `${Math.round(width * 0.52)} cm`,
                    labelOffset: [0, 0.035, 0],
                    renderOnTop: true,
                },
                {
                    key: 'meas-door-side',
                    p1: [sidePx, yTop, sidePz],
                    p2: [sidePx, yTop, sidePz - sideDoorW],
                    extDir: [1, 0, 0],
                    extLength: tiered.find((r) => r.id === 'doorS')?.extLength ?? 0.08,
                    name: t('dim.doorSide'),
                    label: `${Math.round(depth * 0.52)} cm`,
                    labelOffset: [0.05, 0, 0],
                    renderOnTop: true,
                },
                {
                    key: 'meas-depth',
                    p1: [-wM / 2, yTop, zStraight],
                    p2: [-wM / 2, yTop, -dM],
                    extDir: [0, 1, 0],
                    extLength: tiered.find((r) => r.id === 'depth')?.extLength ?? 0.12,
                    name: t('dim.depth'),
                    label: `${Math.round(depth)} cm`,
                    labelOffset: [-0.04, 0.035, 0],
                    renderOnTop: true,
                },
                {
                    key: 'meas-overall-width',
                    p1: [-wM / 2, yTop, zFront],
                    p2: [wM / 2, yTop, zFront],
                    extDir: [0, 1, 0],
                    extLength: tiered.find((r) => r.id === 'width')?.extLength ?? 0.16,
                    name: t('dim.overallWidth'),
                    label: `${Math.round(width)} cm`,
                    labelOffset: [0, 0.035, 0],
                    renderOnTop: true,
                },
                heightRow(zFront)
            );
            return rows;
        }

        return [];
    }, [glassType, wM, hM, dM, gapM, straightDoorWidthCm, width, height, depth, t]);

    return (
        <group position={[0, yPos, 0]} onClick={(e) => { e.stopPropagation(); toggleDoor(); }}>
            {showWalls && (
                <>
                    <RoomWalls
                        width={roomDimensions.width}
                        depth={roomDimensions.depth}
                        height={roomDimensions.height}
                        leftWallDepth={roomDimensions.leftWallDepth}
                        rightWallDepth={roomDimensions.rightWallDepth}
                        floorY={-yPos}
                        wallOffsetCm={wallOffset}
                        wallPositionZCm={wallPositionZ}
                        showEdges={showEdges}
                        wallShape={roomWallShape}
                    />
                    <RoomBoxes
                        roomDimensions={roomDimensions}
                        wallOffset={wallOffset}
                        wallPositionZ={wallPositionZ}
                        floorY={-yPos}
                        showEdges={showEdges}
                        showBoxLabels={showBoxLabels}
                        wallShape={roomWallShape}
                    />
                    {showRoomWidthMeasurement && (
                        <RoomWidthMeasurement
                            roomDimensions={roomDimensions}
                            wallPositionZ={wallPositionZ}
                            floorY={-yPos}
                            wallShape={roomWallShape}
                        />
                    )}
                </>
            )}
            {glassType === 'straight' && (
                <group>
                    {(() => {
                        const totalW = width / 100;
                        const availableW = Math.max(0.1, totalW - gapM);
                        const minFixedW = 0.1;
                        const doorW = straightDoorWidthCm != null
                            ? Math.min(Math.max(0.1, straightDoorWidthCm / 100), availableW - minFixedW)
                            : availableW * 0.6;
                        const fixedW = Math.max(minFixedW, availableW - doorW);
                        const leftX = -totalW / 2;
                        const fixedCenterX = leftX + (fixedW / 2);
                        const doorPivotX = leftX + fixedW + gapM;
                        return (
                            <>
                                <GlassPanel
                                    width={fixedW * 100}
                                    height={height}
                                    position={[fixedCenterX, 0, 0]}
                                    showFrame={showFrame}
                                    panelId="straight-fixed"
                                    selectedEdgeKey={selectedEdgeKey}
                                    onSelectEdge={onSelectEdge}
                                    showEdges={showEdges}
                                />
                                <Door
                                    width={doorW * 100}
                                    height={height}
                                    position={[doorPivotX, 0, 0]}
                                    isOpen={isDoorOpen}
                                    handleType={handleType}
                                    frameColor={frameColor}
                                    showFrame={showFrame}
                                    panelId="straight-door"
                                    selectedEdgeKey={selectedEdgeKey}
                                    onSelectEdge={onSelectEdge}
                                    showEdges={showEdges}
                                    bottomGapMm={doorBottomGapMm}
                                />
                            </>
                        );
                    })()}
                </group>
            )}

            {glassType === 'corner' && (
                <group>
                    <GlassPanel
                        width={depth}
                        height={height}
                        position={[0, 0, -depth / 200]}
                        rotation={[0, Math.PI / 2, 0]}
                        showFrame={showFrame}
                        panelId="corner-fixed"
                        selectedEdgeKey={selectedEdgeKey}
                        onSelectEdge={onSelectEdge}
                        showEdges={showEdges}
                    />
                    <Door
                        width={width}
                        height={height}
                        position={[0, 0, 0]}
                        rotation={[0, -Math.PI / 2, 0]}
                        isOpen={isDoorOpen}
                        handleType={handleType}
                        frameColor={frameColor}
                        showFrame={showFrame}
                        panelId="corner-door"
                        selectedEdgeKey={selectedEdgeKey}
                        onSelectEdge={onSelectEdge}
                        hingeOnRight
                        showEdges={showEdges}
                        bottomGapMm={doorBottomGapMm}
                    />
                </group>
            )}

            {glassType === 'l-shape' && (
                <group>
                    {(() => {
                        const totalFrontW = width / 100;
                        const availableFrontW = Math.max(0.1, totalFrontW - gapM);
                        const fixedFrontW = availableFrontW * 0.6;
                        const doorFrontW = availableFrontW * 0.4;
                        const frontLeftX = -totalFrontW / 2;
                        const fixedFrontCenterX = frontLeftX + (fixedFrontW / 2);
                        const doorFrontPivotX = frontLeftX + fixedFrontW + gapM;
                        return (
                            <>
                                <GlassPanel
                                    width={fixedFrontW * 100}
                                    height={height}
                                    position={[fixedFrontCenterX, 0, -(depth * 0.45) / 100]}
                                    rotation={[0, 0, 0]}
                                    showFrame={showFrame}
                                    panelId="lshape-front-fixed"
                                    selectedEdgeKey={selectedEdgeKey}
                                    onSelectEdge={onSelectEdge}
                                    showEdges={showEdges}
                                />
                                <Door
                                    width={doorFrontW * 100}
                                    height={height}
                                    position={[doorFrontPivotX, 0, -(depth * 0.45) / 100]}
                                    isOpen={isDoorOpen}
                                    handleType={handleType}
                                    frameColor={frameColor}
                                    showFrame={showFrame}
                                    panelId="lshape-front-door"
                                    selectedEdgeKey={selectedEdgeKey}
                                    onSelectEdge={onSelectEdge}
                                    showEdges={showEdges}
                                    bottomGapMm={doorBottomGapMm}
                                />
                            </>
                        );
                    })()}
                    <GlassPanel
                        width={depth * 0.55}
                        height={height}
                        position={[-(width * 0.5) / 100, 0, -(depth * 0.25) / 100]}
                        rotation={[0, Math.PI / 2, 0]}
                        showFrame={showFrame}
                        panelId="lshape-side-fixed"
                        selectedEdgeKey={selectedEdgeKey}
                        onSelectEdge={onSelectEdge}
                        showEdges={showEdges}
                    />
                </group>
            )}

            {glassType === 'l-shape-2-doors' && (
                <group>
                    <Door
                        width={width * 0.52}
                        height={height}
                        position={[(width * 0.22) / 100, 0, -(depth * 0.45) / 100]}
                        isOpen={isDoorOpen}
                        handleType={handleType}
                        frameColor={frameColor}
                        showFrame={showFrame}
                        panelId="lshape2-front-door"
                        selectedEdgeKey={selectedEdgeKey}
                        onSelectEdge={onSelectEdge}
                        bottomGapMm={doorBottomGapMm}
                    />
                    <Door
                        width={depth * 0.52}
                        height={height}
                        position={[-(width * 0.45) / 100, 0, -(depth * 0.2) / 100]}
                        rotation={[0, Math.PI / 2, 0]}
                        isOpen={isDoorOpen}
                        handleType={handleType}
                        frameColor={frameColor}
                        showFrame={showFrame}
                        panelId="lshape2-side-door"
                        selectedEdgeKey={selectedEdgeKey}
                        onSelectEdge={onSelectEdge}
                        bottomGapMm={doorBottomGapMm}
                    />
                    <GlassPanel
                        width={width * 0.2}
                        height={height}
                        position={[-(width * 0.05) / 100, 0, -(depth * 0.45) / 100]}
                        showFrame={showFrame}
                        panelId="lshape2-front-fixed"
                        selectedEdgeKey={selectedEdgeKey}
                        onSelectEdge={onSelectEdge}
                        showEdges={showEdges}
                    />
                    <GlassPanel
                        width={depth * 0.2}
                        height={height}
                        position={[-(width * 0.45) / 100, 0, -(depth * 0.05) / 100]}
                        rotation={[0, Math.PI / 2, 0]}
                        showFrame={showFrame}
                        panelId="lshape2-side-fixed"
                        selectedEdgeKey={selectedEdgeKey}
                        onSelectEdge={onSelectEdge}
                        showEdges={showEdges}
                    />
                </group>
            )}

            {showMeasurements &&
                measurementItems.map(({ key, ...dim }) => (
                    <DimensionWithExtensions key={key} {...dim} />
                ))}

        </group>
    );
};

const VIEW_PRESETS = {
    front: { position: [0, 0, 6], up: [0, 1, 0] },
    top: { position: [0, 6, 0], up: [0, 0, -1] },
    right: { position: [6, 0, 0], up: [0, 1, 0] },
};

const CameraAndView = () => {
    const viewPreset = useConfiguratorStore((s) => s.viewPreset);
    const perspective = useConfiguratorStore((s) => s.perspective);
    const { camera, size, set } = useThree();
    const controls = useThree((s) => s.controls);
    const orthoRef = useRef();
    const perspRef = useRef();

    React.useEffect(() => {
        const activeCamera = perspective ? perspRef.current : orthoRef.current;
        if (activeCamera) {
            set({ camera: activeCamera });
            activeCamera.position.set(2, 2, 4);
            activeCamera.lookAt(0, 0, 0);
            if (controls?.target) controls.target.set(0, 0, 0);
        }
    }, [perspective, set]);

    // Apply preset only once when view changes, then allow pan/orbit (no lock every frame)
    const lastPreset = useRef(viewPreset);
    useFrame(() => {
        if (viewPreset === 'free' || !VIEW_PRESETS[viewPreset]) return;
        if (lastPreset.current !== viewPreset) {
            lastPreset.current = viewPreset;
            const preset = VIEW_PRESETS[viewPreset];
            camera.position.set(...preset.position);
            camera.up.set(...preset.up);
            camera.lookAt(0, 0, 0);
            if (controls?.target) controls.target.set(0, 0, 0);
        }
    });

    const s = Math.max(1, Math.min(size.width || 800, size.height || 600) / 60);
    const aspect = size.width && size.height ? size.width / size.height : 16 / 9;

    return (
        <>
            <perspectiveCamera
                ref={perspRef}
                makeDefault={perspective}
                position={[2, 2, 4]}
                fov={45}
                near={0.1}
                far={1000}
            />
            <orthographicCamera
                ref={orthoRef}
                makeDefault={!perspective}
                position={[2, 2, 4]}
                near={0.1}
                far={1000}
                left={-s * aspect}
                right={s * aspect}
                top={s}
                bottom={-s}
            />
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
        </>
    );
};

const Visualizer3D = () => {
    const modelRef = useRef();
    const [selectedEdge, setSelectedEdge] = useState(null);
    const perspective = useConfiguratorStore((s) => s.perspective);
    const { t } = useI18n();

    return (
        <div className="w-full h-full overflow-hidden relative rounded-[inherit] bg-gradient-to-br from-[#e2e5ea] via-[#d4d8df] to-[#c5c9d2] ring-1 ring-black/5 shadow-inner">
            <ARButton sceneRef={modelRef} />

            <Canvas
                shadows={perspective}
                gl={{ preserveDrawingBuffer: true, antialias: true, alpha: true }}
                dpr={[1, Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1)]}
            >
                <color attach="background" args={['#c8c8c8']} />

                <CameraAndView />

                <hemisphereLight args={['#f5f5f5', '#909090']} intensity={0.55} />
                <ambientLight intensity={0.35} />
                <directionalLight
                    position={[4.5, 11, 6]}
                    intensity={1.15}
                    color="#ffffff"
                    castShadow={perspective}
                    shadow-mapSize={[2048, 2048]}
                    shadow-camera-near={0.5}
                    shadow-camera-far={40}
                    shadow-camera-left={-8}
                    shadow-camera-right={8}
                    shadow-camera-top={8}
                    shadow-camera-bottom={-8}
                    shadow-bias={-0.00015}
                />
                <directionalLight position={[-5, 5, -4]} intensity={0.45} color="#eef2f6" />
                <directionalLight position={[0, -2, 8]} intensity={0.2} color="#ffffff" />

                <group ref={modelRef}>
                    <Model selectedEdgeKey={selectedEdge?.key} onSelectEdge={setSelectedEdge} />
                </group>

                <OriginAxes />

                <ContactShadows
                    position={[0, 0, 0]}
                    opacity={0.28}
                    scale={14}
                    blur={2}
                    far={6}
                    color="#303030"
                />
                <Environment preset="studio" environmentIntensity={0.42} background={false} />
            </Canvas>

            <div className="absolute bottom-3 start-3 max-w-[min(100%-1.5rem,20rem)] p-3 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/80 text-xs text-slate-700 pointer-events-none z-10 shadow-lg shadow-slate-900/10">
                <p className="flex items-start gap-2 leading-snug">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mt-1 shrink-0" />
                    <span>
                        <span className="font-medium text-slate-900 block">{t('designer.hint.door')}</span>
                        <span className="text-slate-500">{t('designer.hint.orbit')}</span>
                    </span>
                </p>
            </div>
            {selectedEdge && (
                <div className="absolute bottom-3 end-3 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/10 text-xs text-white z-10 shadow-xl max-w-[14rem]">
                    <p className="font-semibold text-amber-400">{selectedEdge.label}</p>
                    <p className="text-slate-200">
                        {selectedEdge.mm} mm ({(selectedEdge.mm / 10).toFixed(1)} cm)
                    </p>
                </div>
            )}
        </div>
    );
};

export default Visualizer3D;
