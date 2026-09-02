import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

export interface SculptureMaterials {
  stem: THREE.MeshStandardMaterial
  joint: THREE.MeshStandardMaterial
  silver: THREE.MeshStandardMaterial
  graphite: THREE.MeshStandardMaterial
  interior: THREE.MeshStandardMaterial
  leaf: THREE.MeshStandardMaterial
}

export function useSculptureMaterials(): SculptureMaterials {
  const materials = useMemo<SculptureMaterials>(
    () => ({
      stem: new THREE.MeshStandardMaterial({
        color: '#4a5158',
        metalness: 0.66,
        roughness: 0.48,
        envMapIntensity: 0.55,
      }),
      joint: new THREE.MeshStandardMaterial({
        color: '#2c3034',
        metalness: 0.78,
        roughness: 0.22,
        envMapIntensity: 0.7,
      }),
      silver: new THREE.MeshStandardMaterial({
        color: '#8e969f',
        metalness: 0.64,
        roughness: 0.36,
        envMapIntensity: 0.62,
      }),
      graphite: new THREE.MeshStandardMaterial({
        color: '#2f3338',
        metalness: 0.72,
        roughness: 0.44,
        envMapIntensity: 0.42,
      }),
      interior: new THREE.MeshStandardMaterial({
        color: '#c9d6db',
        metalness: 0.18,
        roughness: 0.58,
        emissive: '#8eacb4',
        emissiveIntensity: 0.07,
        envMapIntensity: 0.28,
        side: THREE.DoubleSide,
      }),
      leaf: new THREE.MeshStandardMaterial({
        color: '#5c636a',
        metalness: 0.6,
        roughness: 0.5,
        envMapIntensity: 0.4,
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
