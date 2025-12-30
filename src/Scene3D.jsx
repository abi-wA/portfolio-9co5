import React, { Suspense, useEffect, useRef } from 'react'
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
        obj.material.emissiveIntensity = 0.85

        obj.material.opacity = 0.01;
        
      }
    })
  }, [actions, animations, scene])

  // On utilise <Center> pour réinitialiser les coordonnées internes du modèle à 0,0,0
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}


function Rig({ scrollY }) {
    const group = useRef()
    
    useFrame((state) => {
        // 1. Définir la cible : on mappe le scroll sur une plage de zoom (ex: de 1.5 à 4)
        const targetZoom = MathUtils.mapLinear(scrollY, 0, 1, 0.1, 100)
        
        
        // 2. L'INTERPOLATION (Le secret de la fluidité)
        // state.camera.position.z va glisser vers targetZoom avec un facteur de 0.1 par frame
        state.camera.position.z = MathUtils.lerp(
            state.camera.position.z, 
            targetZoom, 
            0.08 // Plus ce chiffre est bas, plus c'est "smooth" et lent
        )
        
        // Optionnel : Ajouter une très légère rotation automatique pour donner de la vie
        state.camera.lookAt(0, 0, 0)
    })

    return <group ref={group} />
}


export default function Scene3D({ scrollY }) {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0 }}>
        <Canvas flat camera={{ position: [0, 0, 5] }}>
            <color attach="background" args={['#000']} />
            
            {/* On retire adjustCamera de Stage car on gère la caméra nous-mêmes dans Rig */}
            <Stage intensity={0.5} environment="night" adjustCamera={false}>
                <Model />
            </Stage>

            <Rig scrollY={scrollY} />

            <EffectComposer>
                <Bloom luminanceThreshold={0.4} mipmapBlur intensity={1.5} radius={0.4} />
            </EffectComposer>
        </Canvas>
        </div>
    )
}