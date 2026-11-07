import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

export interface SculptureMaterials {
  /** Brushed aluminium members. */
  stem: THREE.MeshPhysicalMaterial
  /** Dark graphite articulation. */
  joint: THREE.MeshPhysicalMaterial
  /** Satin silver panels. */
  satin: THREE.MeshPhysicalMaterial
  /** Polished collars, rims and edges. */
  polished: THREE.MeshPhysicalMaterial
  graphite: THREE.MeshPhysicalMaterial
  /** Pale, cool bloom interiors. */
  interior: THREE.MeshPhysicalMaterial
  leaf: THREE.MeshPhysicalMaterial
}

export function useSculptureMaterials(): SculptureMaterials {
  const materials = useMemo<SculptureMaterials>(
    () => ({
      stem: new THREE.MeshPhysicalMaterial({
        color: '#b4bac0',
        metalness: 0.92,
        roughness: 0.28,
        clearcoat: 0.18,
        clearcoatRoughness: 0.24,
        envMapIntensity: 1.15,
      }),
      joint: new THREE.MeshPhysicalMaterial({
        color: '#4b5158',
        metalness: 0.76,
        roughness: 0.3,
        envMapIntensity: 1.35,
      }),
      satin: new THREE.MeshPhysicalMaterial({
        color: '#c4cad0',
        metalness: 0.94,
        roughness: 0.25,
        clearcoat: 0.22,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.3,
        side: THREE.DoubleSide,
      }),
      polished: new THREE.MeshPhysicalMaterial({
        color: '#d6dbe0',
        metalness: 1,
        roughness: 0.12,
        clearcoat: 0.3,
        clearcoatRoughness: 0.12,
        envMapIntensity: 1.5,
      }),
      graphite: new THREE.MeshPhysicalMaterial({
        color: '#666d74',
        metalness: 0.66,
        roughness: 0.52,
        envMapIntensity: 0.95,
      }),
      interior: new THREE.MeshPhysicalMaterial({
        color: '#aebac0',
        metalness: 0.85,
        roughness: 0.32,
        clearcoat: 0.15,
        clearcoatRoughness: 0.25,
        emissive: '#8fb3bd',
        emissiveIntensity: 0.16,
        envMapIntensity: 1.15,
        side: THREE.DoubleSide,
      }),
      leaf: new THREE.MeshPhysicalMaterial({
        color: '#a9b0b7',
        metalness: 0.9,
        roughness: 0.3,
        clearcoat: 0.15,
        clearcoatRoughness: 0.25,
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
