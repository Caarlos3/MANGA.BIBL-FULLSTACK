import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';

const ParticleLayer = ({ count, color, speed, zOffset, parallaxFactor, wireframe }) => {
    const [particles] = useState(() => {
        return new Array(count).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 35, // Amplio radio x
                (Math.random() - 0.5) * 35, // Amplio radio y
                (Math.random() - 0.5) * 15 - zOffset // Profundidad
            ],
            scale: Math.random() * 0.2 + 0.05,
            rotationIntensity: Math.random() * 3,
            floatIntensity: Math.random() * 4,
            speed: Math.random() * 1.5 + speed,
        }));
    });

    const groupRef = useRef();

    useFrame((state) => {
        if (!groupRef.current) return;
        // Efecto Parallax basado en el cursor
        const targetX = (state.pointer.x * 6) * parallaxFactor;
        const targetY = (state.pointer.y * 6) * parallaxFactor;

        // Lerp suave hacia la posición
        groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.02;
        groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.02;
    });

    return (
        <group ref={groupRef}>
            {particles.map((data, i) => (
                <Float
                    key={i}
                    speed={data.speed}
                    rotationIntensity={data.rotationIntensity}
                    floatIntensity={data.floatIntensity}
                    position={data.position}
                >
                    <mesh scale={data.scale}>
                        {/* Usamos octaedros para un look afilado tipo manga / cristal de energía */}
                        <octahedronGeometry args={[1, 0]} />
                        <meshBasicMaterial
                            color={color}
                            wireframe={wireframe}
                            transparent
                            opacity={wireframe ? 0.3 : 0.8}
                        />
                    </mesh>
                </Float>
            ))}
        </group>
    );
};

export default function MangaBackground() {
    const defaultEventSource = typeof window !== 'undefined' ? document.getElementById('root') : null;



    return (
        <div className="manga-canvas-container">
            <Canvas
                camera={{ position: [0, 0, 15], fov: 60 }}
                dpr={[1, 1.5]} // Optimización modesta para móviles y monitores HD sin sobrecarga
                gl={{ antialias: false, alpha: true }}
                eventSource={defaultEventSource} // Para que state.pointer funcione a pesar del pointer-events: none
            >
                <ambientLight intensity={1} />
                {/* Capa de fondo 1: Cristales de tinta (negros, más grandes, lentos, mueven menos con el ratón) */}
                <ParticleLayer count={40} color="#000000" speed={1} zOffset={10} parallaxFactor={0.3} wireframe={true} />

                {/* Capa media 2: Energía roja shonen (medianos, más rápidos, mueven medio) */}
                <ParticleLayer count={50} color="#e63946" speed={1.5} zOffset={5} parallaxFactor={0.8} wireframe={false} />

                {/* Capa frontal 3: Destellos de impacto blancos (pequeños, muy rápidos, rebotan mucho con el ratón) */}
                <ParticleLayer count={30} color="#ffffff" speed={2.5} zOffset={0} parallaxFactor={1.5} wireframe={false} />
            </Canvas>
        </div>
    );
}
