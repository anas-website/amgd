import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Line, Text } from '@react-three/drei';
import { useConfiguratorStore } from '../../store/useConfiguratorStore';
import * as THREE from 'three';
import ARButton from './ARButton';

const GlassPanel = ({
    width,
    height,
    position,
    rotation = [0, 0, 0],
    showFrame,
    panelId,
    selectedEdgeKey,
    onSelectEdge
}) => {
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
            labelOffset: [0, 0.05, 0]
        },
        {
            key: `${panelId}-bottom`,
            label: 'Bottom Edge',
            mm: Math.round(width * 10),
            line: [[-panelW / 2, -panelH / 2, 0.012], [panelW / 2, -panelH / 2, 0.012]],
            hitboxPos: [0, -panelH / 2, 0.012],
            hitboxArgs: [panelW, 0.035, 0.045],
            labelOffset: [0, -0.05, 0]
        },
        {
            key: `${panelId}-left`,
            label: 'Left Edge',
            mm: Math.round(height * 10),
            line: [[-panelW / 2, -panelH / 2, 0.012], [-panelW / 2, panelH / 2, 0.012]],
            hitboxPos: [-panelW / 2, 0, 0.012],
            hitboxArgs: [0.035, panelH, 0.045],
            labelOffset: [-0.05, 0, 0]
        },
        {
            key: `${panelId}-right`,
            label: 'Right Edge',
            mm: Math.round(height * 10),
            line: [[panelW / 2, -panelH / 2, 0.012], [panelW / 2, panelH / 2, 0.012]],
            hitboxPos: [panelW / 2, 0, 0.012],
            hitboxArgs: [0.035, panelH, 0.045],
            labelOffset: [0.05, 0, 0]
        }
    ];

    return (
    <group position={position} rotation={rotation}>
        {/* Glass */}
        <mesh castShadow receiveShadow>
            <boxGeometry args={[width / 100, height / 100, 0.01]} />
            <meshPhysicalMaterial
                color="#e0f7fa"
                transmission={0.95}
                opacity={0.6}
                transparent
                roughness={0.05}
                metalness={0.1}
                clearcoat={1}
                clearcoatRoughness={0.1}
                side={THREE.DoubleSide}
            />
        </mesh>

        {/* Frame */}
        {showFrame && (
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[(width / 100) + 0.02, (height / 100) + 0.02, 0.012]} />
                {/* Cutout using a material trick or just simple borders? 
                Simple borders using 4 meshes is better for performance/logic 
                than CSG in this simple case, but for now let's use a slightly larger box behind 
                or just 4 boxes. Let's do 4 boxes for a proper frame.
            */}
            </mesh>
        )}

        {showFrame && (
            <>
                {/* Top Frame */}
                <mesh position={[0, (height / 200) + 0.01, 0]}>
                    <boxGeometry args={[(width / 100) + 0.04, 0.02, 0.02]} />
                    <meshStandardMaterial color="black" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Bottom Frame */}
                <mesh position={[0, -(height / 200) - 0.01, 0]}>
                    <boxGeometry args={[(width / 100) + 0.04, 0.02, 0.02]} />
                    <meshStandardMaterial color="black" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Left Frame */}
                <mesh position={[-(width / 200) - 0.01, 0, 0]}>
                    <boxGeometry args={[0.02, (height / 100), 0.02]} />
                    <meshStandardMaterial color="black" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Right Frame */}
                <mesh position={[(width / 200) + 0.01, 0, 0]}>
                    <boxGeometry args={[0.02, (height / 100), 0.02]} />
                    <meshStandardMaterial color="black" metalness={0.8} roughness={0.2} />
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
                        <MeasurementLine
                            start={edge.line[0]}
                            end={edge.line[1]}
                            label={`${edge.mm} mm`}
                            color="#f59e0b"
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
    onSelectEdge
}) => {
    const group = useRef();

    useFrame((state, delta) => {
        if (group.current) {
            const targetRotation = isOpen ? Math.PI / 2 : 0;
            group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotation, delta * 2);
        }
    });

    return (
        <group ref={group} position={position} rotation={rotation}>
            {/* Pivot is at hinge side (x=0); door geometry extends to the right */}
            <GlassPanel
                width={width}
                height={height}
                position={[width / 200, 0, 0]}
                showFrame={showFrame}
                panelId={`${panelId}-leaf`}
                selectedEdgeKey={selectedEdgeKey}
                onSelectEdge={onSelectEdge}
            />

            <mesh position={[width / 100 - 0.05, 0, 0.02]} castShadow>
                {handleType === 'knob' ? (
                    <sphereGeometry args={[0.025, 32, 32]} />
                ) : (
                    <boxGeometry args={[0.02, 0.15, 0.04]} />
                )}
                <meshStandardMaterial color={frameColor || "silver"} metalness={0.9} roughness={0.1} />
            </mesh>
        </group>
    );
};

const MeasurementLine = ({ start, end, label, color = '#38bdf8', labelOffset = [0, 0.04, 0] }) => {
    const mid = [
        (start[0] + end[0]) / 2 + labelOffset[0],
        (start[1] + end[1]) / 2 + labelOffset[1],
        (start[2] + end[2]) / 2 + labelOffset[2],
    ];

    return (
        <group>
            <Line points={[start, end]} color={color} lineWidth={1} />
            <Text
                position={mid}
                fontSize={0.05}
                color={color}
                anchorX="center"
                anchorY="middle"
            >
                {label}
            </Text>
        </group>
    );
};

const Model = ({ selectedEdgeKey, onSelectEdge }) => {
    const {
        dimensions, glassType, isDoorOpen, toggleDoor,
        handleType, frameColor, showFrame, doorGapMm, showMeasurements
    } = useConfiguratorStore();
    const { width, height, depth } = dimensions;
    const yPos = height / 200;
    const gapM = Math.max(0, (doorGapMm || 0) / 1000);
    const wM = width / 100;
    const hM = height / 100;
    const dM = depth / 100;

    return (
        <group position={[0, yPos, 0]} onClick={(e) => { e.stopPropagation(); toggleDoor(); }}>
            {glassType === 'straight' && (
                <group>
                    {(() => {
                        const totalW = width / 100;
                        const availableW = Math.max(0.1, totalW - gapM);
                        const fixedW = availableW * 0.4;
                        const doorW = availableW * 0.6;
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
                    />
                    <Door
                        width={width}
                        height={height}
                        position={[width / 200, 0, 0]}
                        rotation={[0, -Math.PI / 2, 0]}
                        isOpen={isDoorOpen}
                        handleType={handleType}
                        frameColor={frameColor}
                        showFrame={showFrame}
                        panelId="corner-door"
                        selectedEdgeKey={selectedEdgeKey}
                        onSelectEdge={onSelectEdge}
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
                    />
                    <GlassPanel
                        width={width * 0.2}
                        height={height}
                        position={[-(width * 0.05) / 100, 0, -(depth * 0.45) / 100]}
                        showFrame={showFrame}
                        panelId="lshape2-front-fixed"
                        selectedEdgeKey={selectedEdgeKey}
                        onSelectEdge={onSelectEdge}
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
                    />
                </group>
            )}

            {showMeasurements && (
                <group>
                    {/* Width + height shown on every layout */}
                    <MeasurementLine
                        start={[-wM / 2, -hM / 2 - 0.08, 0.12]}
                        end={[wM / 2, -hM / 2 - 0.08, 0.12]}
                        label={`${Math.round(width)} cm`}
                    />
                    <MeasurementLine
                        start={[-wM / 2 - 0.08, -hM / 2, 0.12]}
                        end={[-wM / 2 - 0.08, hM / 2, 0.12]}
                        label={`${Math.round(height)} cm`}
                        labelOffset={[-0.04, 0, 0]}
                    />

                    {/* Depth for non-straight layouts */}
                    {glassType !== 'straight' && (
                        <MeasurementLine
                            start={[-wM / 2 - 0.08, -hM / 2 - 0.02, 0]}
                            end={[-wM / 2 - 0.08, -hM / 2 - 0.02, -dM]}
                            label={`${Math.round(depth)} cm`}
                            labelOffset={[-0.04, 0.02, 0]}
                        />
                    )}

                    {/* Door gap indicator (straight + L-shape front) */}
                    {(glassType === 'straight' || glassType === 'l-shape') && gapM > 0 && (
                        <MeasurementLine
                            start={[-gapM / 2, -hM / 2 + 0.03, 0.14]}
                            end={[gapM / 2, -hM / 2 + 0.03, 0.14]}
                            label={`${Math.round(doorGapMm)} mm`}
                            color="#f59e0b"
                            labelOffset={[0, 0.035, 0]}
                        />
                    )}
                </group>
            )}

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -yPos, 0]} receiveShadow>
                <circleGeometry args={[2, 64]} />
                <meshStandardMaterial color="#111" roughness={0.8} />
            </mesh>
            <gridHelper args={[5, 10, 0x444444, 0x222222]} position={[0, -yPos + 0.01, 0]} />
        </group>
    );
};

const Visualizer3D = () => {
    const modelRef = useRef();
    const [selectedEdge, setSelectedEdge] = useState(null);

    return (
        <div className="w-full h-full glass-panel overflow-hidden relative bg-gradient-to-br from-gray-900 to-black">
            <ARButton sceneRef={modelRef} />

            <Canvas shadows camera={{ position: [2, 2, 4], fov: 45 }}>
                <fog attach="fog" args={['#101010', 5, 20]} />
                <color attach="background" args={['#101010']} />

                <ambientLight intensity={0.4} />
                <spotLight
                    position={[5, 10, 5]}
                    angle={0.4}
                    penumbra={1}
                    intensity={2}
                    castShadow
                    shadow-bias={-0.0001}
                />
                <pointLight position={[-10, 0, -10]} intensity={0.5} color="blue" />

                <group ref={modelRef}>
                    <Model selectedEdgeKey={selectedEdge?.key} onSelectEdge={setSelectedEdge} />
                </group>

                <ContactShadows position={[0, 0, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="black" />
                <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
                <Environment preset="city" />
            </Canvas>

            <div className="absolute bottom-4 left-4 p-4 glass-panel text-xs text-secondary pointer-events-none z-10 flex items-center gap-3">
                <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span> Click door to toggle</p>
            </div>
            {selectedEdge && (
                <div className="absolute bottom-4 right-4 p-3 glass-panel text-xs text-white z-10">
                    <p className="font-semibold text-amber-400">{selectedEdge.label}</p>
                    <p>{selectedEdge.mm} mm ({(selectedEdge.mm / 10).toFixed(1)} cm)</p>
                </div>
            )}
        </div>
    );
};

export default Visualizer3D;
