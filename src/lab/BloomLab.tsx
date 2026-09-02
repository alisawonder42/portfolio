import { Leva, useControls } from 'leva'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {
  BloomScene,
  DEFAULT_DIRECTION,
  DIRECTIONS,
  GOLDEN_ANGLE,
  METAL_FINISHES,
  type BloomConfig,
  type DirectionKey,
  type MetalFinish,
  type PetalShape,
} from '@/bloom'

import styles from './BloomLab.module.css'

const RAD = 180 / Math.PI

/** Leva schema for one petal shape, with ranges that stay physically sensible. */
function petalSchema(p: PetalShape) {
  return {
    length: { value: p.length, min: 0.2, max: 1.6, step: 0.01 },
    width: { value: p.width, min: 0.05, max: 1.4, step: 0.01 },
    widthPeak: { value: p.widthPeak, min: 0.1, max: 0.9, step: 0.01 },
    baseWidth: { value: p.baseWidth, min: 0, max: 1, step: 0.01 },
    tipSharpness: { value: p.tipSharpness, min: 0.3, max: 4, step: 0.05 },
    curlDeg: { value: p.curl * RAD, min: -60, max: 180, step: 1, label: 'curl °' },
    curlBias: { value: p.curlBias, min: 0.5, max: 4, step: 0.05 },
    cup: { value: p.cup, min: -0.4, max: 0.9, step: 0.01 },
    flare: { value: p.flare, min: -1, max: 2.5, step: 0.05 },
    twistDeg: { value: p.twist * RAD, min: -90, max: 90, step: 1, label: 'twist °' },
    edgeWave: { value: p.edgeWave, min: 0, max: 0.4, step: 0.005 },
    edgeWaveFreq: { value: p.edgeWaveFreq, min: 1, max: 12, step: 1 },
    thickness: { value: p.thickness, min: 0.002, max: 0.05, step: 0.001 },
  }
}

type PetalControls = ReturnType<typeof petalSchema>
type PetalValues = { [K in keyof PetalControls]: number }

function toPetalShape(v: PetalValues): PetalShape {
  return {
    length: v.length,
    width: v.width,
    widthPeak: v.widthPeak,
    baseWidth: v.baseWidth,
    tipSharpness: v.tipSharpness,
    curl: v.curlDeg / RAD,
    curlBias: v.curlBias,
    cup: v.cup,
    flare: v.flare,
    twist: v.twistDeg / RAD,
    edgeWave: v.edgeWave,
    edgeWaveFreq: v.edgeWaveFreq,
    thickness: v.thickness,
  }
}

const FINISH_OPTIONS = Object.keys(METAL_FINISHES) as MetalFinish[]

/**
 * Initial lab state from the hash query, e.g. `#/lab?direction=lotus&bloom=0.8&spin=0`.
 * Lets a specific view be shared or captured deterministically.
 */
function readLabQuery() {
  const query = window.location.hash.split('?')[1] ?? ''
  const params = new URLSearchParams(query)
  const num = (key: string, fallback: number) => {
    const v = Number(params.get(key))
    return params.has(key) && Number.isFinite(v) ? v : fallback
  }
  const dir = params.get('direction')
  return {
    direction: dir && dir in DIRECTIONS ? (dir as DirectionKey) : DEFAULT_DIRECTION,
    finish: params.get('finish') as MetalFinish | null,
    bloom: num('bloom', 0.72),
    spin: num('spin', 0.06),
    pitchDeg: num('pitch', 54),
    distance: num('distance', 2.9),
    scale: num('scale', 0.58),
    parallax: num('parallax', 0.12),
    autoplay: params.get('autoplay') === '1',
  }
}

/**
 * Design lab for the Metal Bloom, reachable at `#/lab`. Every geometric,
 * layout and material parameter is live so directions can be compared and
 * tuned, then exported as JSON to become the shipped preset.
 */
export function BloomLab() {
  const [initial] = useState(readLabQuery)
  const [direction, setDirection] = useState<DirectionKey>(initial.direction)
  const preset = DIRECTIONS[direction]
  const [copied, setCopied] = useState(false)
  const latestConfig = useRef<BloomConfig | null>(null)

  const copyConfig = useCallback(() => {
    const cfg = latestConfig.current
    if (!cfg) return
    void navigator.clipboard.writeText(JSON.stringify(cfg, null, 2)).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    })
  }, [])

  useControls({
    direction: {
      value: direction,
      options: { Rose: 'rose', Lotus: 'lotus', Dahlia: 'dahlia' } as Record<string, DirectionKey>,
      onChange: (v: DirectionKey) => setDirection(v),
    },
  })

  const anim = useControls('Animation', {
    bloom: { value: initial.bloom, min: 0, max: 1, step: 0.01 },
    autoplay: initial.autoplay,
    cycleSeconds: { value: 7, min: 2, max: 20, step: 0.5 },
    spin: { value: initial.spin, min: 0, max: 0.6, step: 0.01, label: 'spin rad/s' },
    responsiveness: { value: 0.35, min: 0.05, max: 1.5, step: 0.01 },
  })

  const camera = useControls('Camera', {
    pitchDeg: { value: initial.pitchDeg, min: 0, max: 90, step: 1, label: 'pitch °' },
    distance: { value: initial.distance, min: 1.5, max: 6, step: 0.05 },
    scale: { value: initial.scale, min: 0.2, max: 1.2, step: 0.01 },
    parallax: { value: initial.parallax, min: 0, max: 0.5, step: 0.01 },
    environment: { value: 1, min: 0, max: 3, step: 0.05 },
  })

  const [finishCtl] = useControls(
    'Material',
    () => {
      const finish =
        initial.finish && initial.finish in METAL_FINISHES ? initial.finish : preset.finish
      const f = METAL_FINISHES[finish]
      return {
        finish: { value: finish, options: FINISH_OPTIONS },
        color: f.color,
        roughness: { value: f.roughness, min: 0, max: 1, step: 0.01 },
        clearcoat: { value: f.clearcoat, min: 0, max: 1, step: 0.01 },
        clearcoatRoughness: { value: f.clearcoatRoughness, min: 0, max: 1, step: 0.01 },
        iridescence: { value: f.iridescence, min: 0, max: 1, step: 0.01 },
        iridescenceIOR: { value: f.iridescenceIOR, min: 1, max: 2.333, step: 0.01 },
        anisotropy: { value: f.anisotropy, min: 0, max: 1, step: 0.01 },
        envMapIntensity: { value: f.envMapIntensity, min: 0, max: 3, step: 0.05 },
      }
    },
    { collapsed: true },
    [direction],
  )

  const [layout, setLayout] = useControls(
    'Layout',
    () => ({
      petalCount: { value: preset.layout.petalCount, min: 3, max: 140, step: 1 },
      divergenceDeg: {
        value: preset.layout.divergence * RAD,
        min: 90,
        max: 180,
        step: 0.1,
        label: 'divergence °',
      },
      radiusInner: { value: preset.layout.radiusInner, min: 0, max: 0.4, step: 0.005 },
      radiusOuter: { value: preset.layout.radiusOuter, min: 0.05, max: 1, step: 0.005 },
      heightInner: { value: preset.layout.heightInner, min: -0.3, max: 0.3, step: 0.005 },
      heightOuter: { value: preset.layout.heightOuter, min: -0.4, max: 0.3, step: 0.005 },
      scaleInner: { value: preset.layout.scaleInner, min: 0.1, max: 1.5, step: 0.01 },
      scaleOuter: { value: preset.layout.scaleOuter, min: 0.1, max: 1.5, step: 0.01 },
      closedTiltInnerDeg: {
        value: preset.layout.closedTiltInner * RAD,
        min: -20,
        max: 60,
        step: 1,
        label: 'closed tilt in °',
      },
      closedTiltOuterDeg: {
        value: preset.layout.closedTiltOuter * RAD,
        min: -20,
        max: 60,
        step: 1,
        label: 'closed tilt out °',
      },
      openTiltInnerDeg: {
        value: preset.layout.openTiltInner * RAD,
        min: 0,
        max: 120,
        step: 1,
        label: 'open tilt in °',
      },
      openTiltOuterDeg: {
        value: preset.layout.openTiltOuter * RAD,
        min: 0,
        max: 150,
        step: 1,
        label: 'open tilt out °',
      },
      stagger: { value: preset.layout.stagger, min: 0, max: 0.95, step: 0.01 },
      jitter: { value: preset.layout.jitter, min: 0, max: 0.3, step: 0.005 },
      shapeSteps: { value: preset.layout.shapeSteps, min: 1, max: 8, step: 1 },
    }),
    { collapsed: true },
    [direction],
  )

  const [outer] = useControls(
    'Petal · outer',
    () => petalSchema(preset.petalOuter),
    { collapsed: true },
    [direction],
  )
  const [inner] = useControls(
    'Petal · inner',
    () => petalSchema(preset.petalInner),
    { collapsed: true },
    [direction],
  )

  const [core] = useControls(
    'Core',
    () => ({
      style: { value: preset.core.style, options: ['beads', 'dome', 'none'] as const },
      radius: { value: preset.core.radius, min: 0.02, max: 0.4, step: 0.005 },
      beadCount: { value: preset.core.beadCount, min: 1, max: 300, step: 1 },
      beadRadius: { value: preset.core.beadRadius, min: 0.004, max: 0.06, step: 0.001 },
      beadHeight: { value: preset.core.beadHeight, min: -0.1, max: 0.3, step: 0.005 },
    }),
    { collapsed: true },
    [direction],
  )

  const config = useMemo<BloomConfig>(() => {
    const cfg: BloomConfig = {
      name: preset.name,
      description: preset.description,
      finish: finishCtl.finish as MetalFinish,
      layout: {
        petalCount: layout.petalCount,
        divergence: layout.divergenceDeg / RAD,
        radiusInner: layout.radiusInner,
        radiusOuter: layout.radiusOuter,
        heightInner: layout.heightInner,
        heightOuter: layout.heightOuter,
        scaleInner: layout.scaleInner,
        scaleOuter: layout.scaleOuter,
        closedTiltInner: layout.closedTiltInnerDeg / RAD,
        closedTiltOuter: layout.closedTiltOuterDeg / RAD,
        openTiltInner: layout.openTiltInnerDeg / RAD,
        openTiltOuter: layout.openTiltOuterDeg / RAD,
        stagger: layout.stagger,
        jitter: layout.jitter,
        shapeSteps: layout.shapeSteps,
      },
      petalInner: toPetalShape(inner as PetalValues),
      petalOuter: toPetalShape(outer as PetalValues),
      core: {
        style: core.style,
        radius: core.radius,
        beadCount: core.beadCount,
        beadRadius: core.beadRadius,
        beadHeight: core.beadHeight,
      },
    }
    return cfg
  }, [preset, finishCtl.finish, layout, inner, outer, core])

  useEffect(() => {
    latestConfig.current = config
  }, [config])

  const materialParams = useMemo(
    () => ({
      color: finishCtl.color,
      roughness: finishCtl.roughness,
      clearcoat: finishCtl.clearcoat,
      clearcoatRoughness: finishCtl.clearcoatRoughness,
      iridescence: finishCtl.iridescence,
      iridescenceIOR: finishCtl.iridescenceIOR,
      anisotropy: finishCtl.anisotropy,
      envMapIntensity: finishCtl.envMapIntensity,
    }),
    [finishCtl],
  )

  const animRef = useRef(anim)
  useEffect(() => {
    animRef.current = anim
  }, [anim])
  const getBloom = useCallback(() => {
    const a = animRef.current
    if (!a.autoplay) return a.bloom
    const t = performance.now() / 1000
    return 0.5 - 0.5 * Math.cos((t / a.cycleSeconds) * Math.PI * 2)
  }, [])

  return (
    <div className={styles.lab}>
      <Leva titleBar={{ title: 'Metal Bloom lab', filter: false }} collapsed={false} />
      <BloomScene
        className={styles.canvas}
        config={config}
        getBloom={getBloom}
        responsiveness={anim.responsiveness}
        idleSpin={anim.spin}
        materialParams={materialParams}
        pitch={camera.pitchDeg / RAD}
        distance={camera.distance}
        scale={camera.scale}
        parallax={camera.parallax}
        environmentIntensity={camera.environment}
      />
      <div className={styles.hud}>
        <a href="#" className={styles.back}>
          ← Back to site
        </a>
        <p className={styles.caption}>
          <strong>{preset.name}</strong> — {preset.description}
          <br />
          <span className={styles.hint}>
            Divergence {layout.divergenceDeg.toFixed(1)}°{' '}
            <button
              type="button"
              className={styles.inlineButton}
              onClick={() => setLayout({ divergenceDeg: GOLDEN_ANGLE * RAD })}
            >
              reset to golden angle
            </button>
          </span>
        </p>
        <button type="button" className={styles.copy} onClick={copyConfig}>
          {copied ? 'Copied' : 'Copy config JSON'}
        </button>
      </div>
    </div>
  )
}
