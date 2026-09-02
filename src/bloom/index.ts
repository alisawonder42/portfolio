export { BloomScene, type BloomSceneProps } from './BloomScene'
export { MetalBloom, type MetalBloomProps } from './MetalBloom'
export { StudioEnvironment } from './StudioEnvironment'
export { useMetalMaterial } from './MetalMaterial'
export {
  computePlacements,
  petalOpenAmount,
  GOLDEN_ANGLE,
  type BloomLayout,
  type PetalPlacement,
} from './bloomLayout'
export {
  createPetalGeometry,
  lerpPetalShape,
  widthProfile,
  DEFAULT_TESSELLATION,
  type PetalShape,
  type PetalTessellation,
} from './petalGeometry'
export {
  DIRECTIONS,
  DEFAULT_DIRECTION,
  METAL_FINISHES,
  ROSE,
  LOTUS,
  DAHLIA,
  deriveBudShape,
  type BloomConfig,
  type CoreParams,
  type DirectionKey,
  type MetalFinish,
  type MetalMaterialParams,
} from './presets'
