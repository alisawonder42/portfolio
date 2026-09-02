import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

import { METAL_FINISHES, type MetalFinish, type MetalMaterialParams } from './presets'

export function resolveMetalParams(
  finish: MetalFinish,
  overrides?: Partial<MetalMaterialParams>,
): MetalMaterialParams {
  return { ...METAL_FINISHES[finish], ...overrides }
}

export function applyMetalParams(
  material: THREE.MeshPhysicalMaterial,
  p: MetalMaterialParams,
): void {
  material.color.set(p.color)
  material.roughness = p.roughness
  material.metalness = p.metalness
  material.clearcoat = p.clearcoat
  material.clearcoatRoughness = p.clearcoatRoughness
  material.iridescence = p.iridescence
  material.iridescenceIOR = p.iridescenceIOR
  material.iridescenceThicknessRange = [...p.iridescenceThicknessRange]
  material.envMapIntensity = p.envMapIntensity
  material.anisotropy = p.anisotropy
  material.anisotropyRotation = p.anisotropyRotation
  material.needsUpdate = true
}

/**
 * One shared physical material for the whole bloom. A single instance keeps
 * uniform uploads to one per frame regardless of petal count, and the physical
 * model covers polished chrome, brushed brass and thin-film titanium without
 * swapping shaders.
 */
export function useMetalMaterial(
  finish: MetalFinish,
  overrides?: Partial<MetalMaterialParams>,
): THREE.MeshPhysicalMaterial {
  const material = useMemo(() => new THREE.MeshPhysicalMaterial(), [])
  const params = resolveMetalParams(finish, overrides)
  const key = JSON.stringify(params)

  useEffect(() => {
    applyMetalParams(material, params)
    // `key` captures every field of `params`; re-running on the object identity
    // would re-apply on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [material, key])

  useEffect(() => () => material.dispose(), [material])

  return material
}
