import React, { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations, Stage, Center } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { MathUtils } from 'three'

function Model() {
    const { scene, animations } = useGLTF('/3d_hologram2.glb')
    const { actions } = useAnimations(animations, scene)

    useEffect(() => {
        if (animations.length > 0) actions[animations[0].name].play()

        scene.traverse((obj) => {
        if (obj.isMesh && obj.material) {
            obj.material.transparent = true
            obj.material.blending = THREE.AdditiveBlending
            obj.material.depthWrite = false
            obj.material.emissiveIntensity = 0.5
        }
        })
    }, [actions, animations, scene])

    return (
        <Center>
            <primitive object={scene} />
        </Center>
    )
}


function Rig({ scrollY }) {
    const group = useRef()
    
    useFrame((state) => {
        const targetZoom = MathUtils.mapLinear(scrollY, 0, 1, 0.1, 100)
        
        state.camera.position.z = MathUtils.lerp(
            state.camera.position.z, 
            targetZoom, 
            0.08 
        )
        state.camera.lookAt(0, 0, 0)
    })

    return <group ref={group} />
}


export default function Scene3D({ scrollY }) {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0 }}>
        <Canvas flat camera={{ position: [0, 0, 5] }}>
            <color attach="background" args={['#000']} />
            
            <Stage intensity={0.5} environment="night" adjustCamera={false}>
                <Model />
            </Stage>

            <Rig scrollY={scrollY} />

            <EffectComposer>
                <Bloom luminanceThreshold={0.4} mipmapBlur intensity={1} radius={0.6} />
            </EffectComposer>
        </Canvas>
        </div>
    )
}