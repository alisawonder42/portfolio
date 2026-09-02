import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

export interface SculptureMaterials {
  /** Brushed aluminium members. */
  stem: THREE.MeshStandardMaterial
  /** Dark graphite articulation. */
  joint: THREE.MeshStandardMaterial
  /** Satin silver panels. */
  satin: THREE.MeshStandardMaterial
  /** Polished collars, rims and edges. */
  polished: THREE.MeshStandardMaterial
  graphite: THREE.MeshStandardMaterial
  /** Pale, cool bloom interiors. */
  interior: THREE.MeshStandardMaterial
  leaf: THREE.MeshStandardMaterial
}

export function useSculptureMaterials(): SculptureMaterials {
  const materials = useMemo<SculptureMaterials>(
    () => ({
      stem: new THREE.MeshStandardMaterial({
        color: '#b4bac0',
        metalness: 0.52,
        roughness: 0.46,
        envMapIntensity: 1.15,
      }),
      joint: new THREE.MeshStandardMaterial({
        color: '#4b5158',
        metalness: 0.76,
        roughness: 0.3,
        envMapIntensity: 1.35,
      }),
      satin: new THREE.MeshStandardMaterial({
        color: '#c4cad0',
        metalness: 0.56,
        roughness: 0.36,
        envMapIntensity: 1.3,
        side: THREE.DoubleSide,
      }),
      polished: new THREE.MeshStandardMaterial({
        color: '#d6dbe0',
        metalness: 0.82,
        roughness: 0.14,
        envMapIntensity: 1.5,
      }),
      graphite: new THREE.MeshStandardMaterial({
        color: '#666d74',
        metalness: 0.66,
        roughness: 0.52,
        envMapIntensity: 0.95,
      }),
      interior: new THREE.MeshStandardMaterial({
        color: '#aebac0',
        metalness: 0.3,
        roughness: 0.66,
        emissive: '#8fb3bd',
        emissiveIntensity: 0.09,
        envMapIntensity: 0.55,
        side: THREE.DoubleSide,
      }),
      leaf: new THREE.MeshStandardMaterial({
        color: '#a9b0b7',
        metalness: 0.5,
        roughness: 0.5,
        envMapIntensity: 1,
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
