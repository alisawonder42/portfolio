import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

export interface SculptureMaterials {
  stem: THREE.MeshPhysicalMaterial
  joint: THREE.MeshPhysicalMaterial
  silver: THREE.MeshPhysicalMaterial
  graphite: THREE.MeshPhysicalMaterial
  interior: THREE.MeshPhysicalMaterial
  leaf: THREE.MeshPhysicalMaterial
}

export function useSculptureMaterials(): SculptureMaterials {
  const materials = useMemo<SculptureMaterials>(
    () => ({
      stem: new THREE.MeshPhysicalMaterial({
        color: '#8a8e94',
        metalness: 0.88,
        roughness: 0.44,
        anisotropy: 0.72,
        anisotropyRotation: Math.PI * 0.5,
        envMapIntensity: 0.62,
        clearcoat: 0.08,
        clearcoatRoughness: 0.55,
      }),
      joint: new THREE.MeshPhysicalMaterial({
        color: '#3b3e43',
        metalness: 0.94,
        roughness: 0.22,
        envMapIntensity: 0.78,
        clearcoat: 0.18,
        clearcoatRoughness: 0.28,
      }),
      silver: new THREE.MeshPhysicalMaterial({
        color: '#c9ced4',
        metalness: 0.9,
        roughness: 0.32,
        envMapIntensity: 0.7,
        clearcoat: 0.22,
        clearcoatRoughness: 0.35,
      }),
      graphite: new THREE.MeshPhysicalMaterial({
        color: '#5c6066',
        metalness: 0.9,
        roughness: 0.38,
        envMapIntensity: 0.64,
      }),
      interior: new THREE.MeshPhysicalMaterial({
        color: '#d7e6ea',
        metalness: 0.28,
        roughness: 0.58,
        emissive: '#8fb8c2',
        emissiveIntensity: 0.08,
        envMapIntensity: 0.35,
        side: THREE.DoubleSide,
      }),
      leaf: new THREE.MeshPhysicalMaterial({
        color: '#b7bcc2',
        metalness: 0.82,
        roughness: 0.4,
        envMapIntensity: 0.55,
        side: THREE.DoubleSide,
      }),
    }),
    [],
  )

  useEffect(
    () => () => {
      for (const material of Object.values(materials)) material.dispose()
    },
    [materials],
  )

  return materials
}
