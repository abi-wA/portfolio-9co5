import React, { useEffect, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, Stage, Center } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { MathUtils } from 'three'
import { useIsMobile } from './isMobile'

function Model({ isMobile }) {
    const { scene, animations } = useGLTF('/3d_hologram2.glb')
    const { actions } = useAnimations(animations, scene)

    useEffect(() => {
        if (animations.length > 0) actions[animations[0].name].play()

        scene.traverse((obj) => {
            if (obj.isMesh && obj.material) {
                obj.material.transparent = true
                obj.material.blending = THREE.AdditiveBlending
                obj.material.depthWrite = false
                obj.material.emissiveIntensity = isMobile ? 1.0 : 0.5
            }
        })
    }, [actions, animations, scene, isMobile])

    return (
        <Center>
            <primitive object={scene} />
        </Center>
    )
}


function Rig({ scrollRef }) {
    useFrame((state, delta) => {
        const currentScroll = scrollRef.current        
        const targetZoom = MathUtils.mapLinear(currentScroll, 0, 1, 0.01, 70)        
        const safeDelta = Math.min(delta, 0.1) 
        
        state.camera.position.z = MathUtils.lerp(
            state.camera.position.z, 
            targetZoom, 
            5.0 * safeDelta
        )
        
        state.camera.lookAt(0, 0, 0)
    })

    return null
}


export default function Scene3D({ scrollRef }) {
    const isMobile = useIsMobile();

    return (
        <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, zIndex: -1 }}>
            <Canvas 
                flat 
                camera={{ position: [0, 0, 0] }}
                dpr={isMobile ? 1.4 : [1, 2]} 
                gl={{ 
                    antialias: false, 
                    powerPreference: "high-performance",
                    // precision: isMobile ? "lowp" : "highp",
                    stencil: false,
                    depth: true
                }}
            >
                <color attach="background" args={['#000']} />
                
                <Suspense fallback={null}>
                    {isMobile ? (
                        <>
                            <ambientLight intensity={0.8} />
                            <pointLight position={[10, 10, 10]} intensity={1} />
                            <Model isMobile={isMobile} />
                        </>
                    ) : (
                        <Stage intensity={0.5} environment="night" adjustCamera={false}>
                            <Model isMobile={isMobile} />
                        </Stage>
                    )}
                </Suspense>

                <Rig scrollRef={scrollRef} />

                {!isMobile && (
                    <EffectComposer disableNormalPass>
                        <Bloom 
                            luminanceThreshold={0.4} 
                            mipmapBlur 
                            intensity={1} 
                            radius={0.6} 
                        />
                    </EffectComposer>
                )}
            </Canvas>
        </div>
    )
}