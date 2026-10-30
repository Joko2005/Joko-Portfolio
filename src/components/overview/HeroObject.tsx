"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type HeroObjectProps = {
  /** false = the design (blueprint outline), true = the build (solid character). */
  built: boolean;
  /** Becomes true when the intro has left; Folio then grows in and waves. */
  started: boolean;
  reducedMotion: boolean;
  ink: string;
};

const damp = THREE.MathUtils.damp;

// Folio's own colours, from the character sheet. The limbs lift on the dark theme so they don't vanish into black.
const PAPER = "#f4efe3";
const FOLD = "#2457f5";
const CREASE = "#cfcbc0";
const MARK = "#8c8a83";
const FACE = "#111111";
const LIMB_ON_LIGHT = "#141414";
const LIMB_ON_DARK = "#4a4a4c";

const W = 1; // half width
const H = 1.25; // half height
const CUT: [number, number][] = [
  [1 * W, 0.45],
  [0.2, H],
];
const DEPTH = 0.24;
const BEVEL = 0.05;
const FRONT = DEPTH / 2 + BEVEL;

/** The page: rounded corners with the top-right corner cut away for the fold. */
function pageShape() {
  const r = 0.2;
  const s = new THREE.Shape();
  s.moveTo(-W + r, -H);
  s.lineTo(W - r, -H);
  s.quadraticCurveTo(W, -H, W, -H + r);
  s.lineTo(...CUT[0]);
  s.lineTo(...CUT[1]);
  s.lineTo(-W + r, H);
  s.quadraticCurveTo(-W, H, -W, H - r);
  s.lineTo(-W, -H + r);
  s.quadraticCurveTo(-W, -H, -W + r, -H);
  return s;
}

function polygon(points: [number, number][]) {
  const s = new THREE.Shape();
  points.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
  s.closePath();
  return s;
}

function extrude(shape: THREE.Shape, depth = DEPTH, bevel = BEVEL) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 3,
    curveSegments: 6,
  });
  g.translate(0, 0, -depth / 2);
  return g;
}

/** A shape's outline on the front and back faces, joined at its corners: the blueprint of the page. */
function outline(shape: THREE.Shape) {
  const points = shape.getPoints(4);
  const pts: number[] = [];
  points.forEach((a, i) => {
    const b = points[(i + 1) % points.length];
    for (const z of [FRONT, -FRONT]) pts.push(a.x, a.y, z, b.x, b.y, z);
    if (i % 5 === 0) pts.push(a.x, a.y, FRONT, a.x, a.y, -FRONT);
  });
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
}

type Materials = Record<"paper" | "fold" | "crease" | "limb" | "face" | "mark", THREE.Material> & { lines: THREE.Material };

function setFade({ lines, ...solids }: Materials, solid: number, outlined: number) {
  for (const m of Object.values(solids)) {
    m.opacity = solid;
    m.depthWrite = solid > 0.98;
    m.visible = solid > 0.005;
  }
  lines.opacity = outlined;
  lines.visible = outlined > 0.005;
}

/** Closed loops of points as line pairs, all on one z. */
function loops(rings: THREE.Vector2[][], z = 0) {
  const pts: number[] = [];
  for (const ring of rings) {
    ring.forEach((a, i) => {
      const b = ring[(i + 1) % ring.length];
      pts.push(a.x, a.y, z, b.x, b.y, z);
    });
  }
  return new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
}

function ellipse(x: number, y: number, rx: number, ry: number) {
  return new THREE.EllipseCurve(x, y, rx, ry).getPoints(24).slice(0, -1);
}

/** A capsule's silhouette from top to bottom, drawn flat. */
function stadium(r: number, top: number, bottom: number) {
  const s = new THREE.Shape();
  s.absarc(0, top, r, 0, Math.PI, false);
  s.absarc(0, bottom, r, Math.PI, Math.PI * 2, false);
  return s.getPoints(8);
}

/** Poses are joint angles. Arms hang at 0: + swings Folio's right-of-screen arm out, - swings the left one out. */
type Pose = { tilt: number; lean: number; armL: number; armR: number; frontL: number; legL: number; legR: number };

const POSES = {
  think: { tilt: -0.1, lean: 0.06, armL: 1.5, armR: 0.28, frontL: 1, legL: 0.04, legR: -0.04 },
  build: { tilt: -0.08, lean: 0, armL: 1.25, armR: 2.0, frontL: 1, legL: 0.1, legR: 0 },
  welcome: { tilt: 0.02, lean: 0, armL: -2.45, armR: 0.3, frontL: 0, legL: 0.05, legR: -0.05 },
  success: { tilt: 0.14, lean: 0, armL: -2.3, armR: 2.3, frontL: 0, legL: 0.5, legR: -0.4 },
} satisfies Record<string, Pose>;

const WAVE_MS = 2200;
const HOP_MS = 800;

function Folio({ built, started, reducedMotion, ink }: HeroObjectProps) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const card = useRef<THREE.Group>(null);
  const invalidate = useThree((s) => s.invalidate);
  const [hovered, setHovered] = useState(false);

  const parts = useMemo(() => {
    const page = pageShape();
    const armLen = 0.5;
    const geometries = {
      page: extrude(page),
      fold: extrude(
        polygon([
          [0.2, H],
          [0.6, H + 0.02],
          [W + 0.04, 0.8],
          [W, 0.45],
        ]),
        DEPTH,
        BEVEL,
      ),
      crease: new THREE.ShapeGeometry(
        polygon([
          [0.56, 0.89],
          [W, 0.45],
          [W, 0.06],
        ]),
      ),
      pageLines: outline(page),
      arm: new THREE.CapsuleGeometry(0.12, armLen, 4, 12).translate(0, -armLen / 2 - 0.05, 0),
      hand: new THREE.SphereGeometry(0.17, 16, 12).translate(0, -armLen - 0.14, 0),
      leg: new THREE.CapsuleGeometry(0.15, 0.32, 4, 12).translate(0, -0.2, 0),
      foot: new THREE.SphereGeometry(0.2, 16, 12).scale(1.35, 0.72, 1.1).translate(0, -0.48, 0.05),
      eye: new THREE.CapsuleGeometry(0.065, 0.18, 4, 10),
      smile: new THREE.TorusGeometry(0.1, 0.021, 6, 16, Math.PI),
      cardBase: new THREE.BoxGeometry(1.05, 0.74, 0.05),
      cardBar: new THREE.BoxGeometry(0.42, 0.11, 0.06),
      cardBlock: new THREE.BoxGeometry(0.28, 0.25, 0.06),
      cardLine: new THREE.BoxGeometry(0.4, 0.06, 0.06),
    };
    // The blueprint: limbs, fold and face drawn as flat outlines.
    const armWire = loops([stadium(0.12, -0.05, -armLen - 0.05), ellipse(0, -armLen - 0.14, 0.17, 0.17)]);
    const legWire = loops([stadium(0.15, -0.04, -0.36), ellipse(0, -0.48, 0.27, 0.144)]);
    const foldWire = loops(
      [[new THREE.Vector2(0.2, H), new THREE.Vector2(0.6, H + 0.02), new THREE.Vector2(W + 0.04, 0.8), new THREE.Vector2(W, 0.45)]],
      FRONT,
    );
    const eyeWire = loops([
      stadium(0.065, 0.09, -0.09).map((v) => v.clone().setX(v.x - 0.34)),
      stadium(0.065, 0.09, -0.09).map((v) => v.clone().setX(v.x + 0.34)),
    ]);
    const smileWire = new THREE.BufferGeometry().setFromPoints(
      new THREE.EllipseCurve(0, 0, 0.1, 0.1, Math.PI, 0, false)
        .getPoints(12)
        .flatMap((v, i, all) => (i ? [all[i - 1], v] : []))
        .map((v) => new THREE.Vector3(v.x, v.y, 0)),
    );
    const matte = (color: string) => new THREE.MeshStandardMaterial({ color, roughness: 0.62, transparent: true, opacity: 0 });
    const materials = {
      paper: matte(PAPER),
      fold: matte(FOLD),
      crease: matte(CREASE),
      limb: matte(LIMB_ON_DARK),
      face: matte(FACE),
      mark: matte(MARK),
      lines: new THREE.LineBasicMaterial({ transparent: true, opacity: 0 }),
    };
    return { geometries, wires: { armWire, legWire, foldWire, eyeWire, smileWire }, materials };
  }, []);

  // Geometry and materials made here are passed in as props, so fiber won't dispose them.
  useEffect(
    () => () => {
      Object.values(parts.geometries).forEach((g) => g.dispose());
      Object.values(parts.wires).forEach((g) => g.dispose());
      Object.values(parts.materials).forEach((m) => m.dispose());
    },
    [parts],
  );

  // Follow the theme: the outline in ink, and limbs that stay visible on black.
  useEffect(() => {
    parts.materials.lines.color.set(ink);
    parts.materials.limb.color.set(ink.toLowerCase() === "#ffffff" ? LIMB_ON_DARK : LIMB_ON_LIGHT);
    invalidate();
  }, [ink, parts, invalidate]);

  // Page-wide pointer, so Folio looks toward the cursor wherever it is.
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const s = useRef({
    appear: 0,
    build: 0,
    spin: 0,
    spinTarget: 0,
    hop: 0,
    hover: 0,
    rx: 0,
    ry: 0,
    pose: { ...POSES.welcome } as Pose,
    waveUntil: 0,
    hopUntil: 0,
    nextBlink: 3,
  });
  const settled = useRef(false);

  // Wave hello once when Folio arrives.
  useEffect(() => {
    if (started && !reducedMotion) s.current.waveUntil = performance.now() + WAVE_MS;
  }, [started, reducedMotion]);

  // Rendering on demand: every frame while something is changing, 30 a second for the idle breath,
  // and not at all under reduced motion once at rest.
  useEffect(() => {
    let frame = 0;
    let last = 0;
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      if (settled.current && (reducedMotion || now - last < 33)) return;
      last = now;
      invalidate();
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [invalidate, reducedMotion]);

  useFrame(({ clock }, delta) => {
    if (!root.current || !body.current) return;
    const st = s.current;
    const dt = Math.min(delta, 1 / 30);
    const t = clock.elapsedTime;
    const now = performance.now();
    const waving = !reducedMotion && (hovered || now < st.waveUntil);
    const hopping = now < st.hopUntil;
    const target: Pose = hopping ? POSES.success : waving ? POSES.welcome : built ? POSES.build : POSES.think;

    let moving = waving || hopping;
    const ease = (from: number, to: number, speed: number) => {
      if (reducedMotion) return to;
      if (Math.abs(from - to) > 0.002) moving = true;
      return damp(from, to, speed, dt);
    };
    st.appear = ease(st.appear, started ? 1 : 0, 3.2);
    st.build = ease(st.build, built ? 1 : 0, 5);
    st.spin = ease(st.spin, st.spinTarget, 4);
    st.hop = ease(st.hop, hopping ? 1 : 0, 9);
    st.hover = ease(st.hover, hovered ? 1 : 0, 8);
    st.rx = ease(st.rx, pointer.current.y * 0.22, 3);
    st.ry = ease(st.ry, pointer.current.x * 0.4, 3);
    for (const key of Object.keys(target) as (keyof Pose)[]) st.pose[key] = ease(st.pose[key], target[key], 7);
    settled.current = !moving;

    // Grows in from 85%, never from nothing.
    root.current.scale.setScalar(0.8 * (0.85 + 0.15 * st.appear) * (1 + 0.04 * st.hover));
    root.current.rotation.set(st.rx + 0.04, st.ry - 0.22 + st.spin, 0);
    const breath = reducedMotion ? 0 : Math.sin(t * 1.6) * 0.012;
    root.current.position.y = 0.3 + breath + st.hop * 0.42;
    body.current.rotation.set(st.pose.lean, 0, st.pose.tilt);
    body.current.scale.set(1 - breath * 0.5, 1 + breath, 1);

    const wave = waving ? Math.sin(t * 9) * 0.26 : 0;
    armL.current?.rotation.set(0, 0, st.pose.armL + wave);
    armL.current?.position.setZ(0.02 + st.pose.frontL * 0.28);
    armR.current?.rotation.set(0, 0, st.pose.armR + (reducedMotion ? 0 : Math.sin(t * 1.6) * 0.02));
    legL.current?.rotation.set(0, 0, st.pose.legL);
    legR.current?.rotation.set(0, 0, st.pose.legR);

    // A quick blink every few seconds.
    if (eyes.current && !reducedMotion) {
      if (t > st.nextBlink + 0.13) st.nextBlink = t + 2.6 + (Math.sin(t * 7.3) + 1) * 1.4;
      const closing = t > st.nextBlink;
      eyes.current.scale.y = closing ? 0.12 : 1;
    }

    // The card rises into Folio's hand on Build.
    if (card.current) {
      card.current.visible = st.build > 0.02;
      card.current.scale.setScalar(0.8 + 0.2 * st.build);
      card.current.position.y = 0.25 + 0.25 * st.build;
    }

    // Fade between the blueprint and the solid; the solid isn't drawn at all until it's needed.
    const solid = st.build * st.appear;
    setFade(parts.materials, solid, (1 - st.build) * st.appear);
  });

  const { geometries: g, wires, materials: m } = parts;

  return (
    <group
      ref={root}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (reducedMotion) return;
        // A happy hop and a full turn, showing off the back of the page.
        s.current.hopUntil = performance.now() + HOP_MS;
        s.current.spinTarget += Math.PI * 2;
      }}
    >
      <group ref={body}>
        <mesh geometry={g.page} material={m.paper} />
        <mesh geometry={g.fold} material={m.fold} />
        <mesh geometry={g.crease} material={m.crease} position={[0, 0, FRONT + 0.002]} />
        <lineSegments geometry={g.pageLines} material={m.lines} />
        <lineSegments geometry={wires.foldWire} material={m.lines} />

        <group position={[0, 0.03, FRONT + 0.004]}>
          <group ref={eyes} position={[0, 0.05, 0]}>
            <mesh geometry={g.eye} material={m.face} position={[-0.34, 0, 0]} />
            <mesh geometry={g.eye} material={m.face} position={[0.34, 0, 0]} />
            <lineSegments geometry={wires.eyeWire} material={m.lines} />
          </group>
          <lineSegments geometry={wires.smileWire} material={m.lines} position={[0, -0.13, 0]} />
          <mesh geometry={g.smile} material={m.face} position={[0, -0.13, 0]} rotation={[0, 0, Math.PI]} />
        </group>

        <group ref={armL} position={[-W - 0.02, -0.28, 0.02]}>
          <mesh geometry={g.arm} material={m.limb} />
          <mesh geometry={g.hand} material={m.limb} />
          <lineSegments geometry={wires.armWire} material={m.lines} />
        </group>
        <group ref={armR} position={[W + 0.02, -0.28, 0.02]}>
          <mesh geometry={g.arm} material={m.limb} />
          <mesh geometry={g.hand} material={m.limb} />
          <lineSegments geometry={wires.armWire} material={m.lines} />
        </group>

        {/* The interface Folio built, held up on Build. */}
        <group ref={card} position={[1.64, 0.5, 0.2]} rotation={[0, -0.18, -0.09]} visible={false}>
          <mesh geometry={g.cardBase} material={m.crease} />
          <mesh geometry={g.cardBar} material={m.fold} position={[-0.22, 0.2, 0.02]} />
          <mesh geometry={g.cardBlock} material={m.mark} position={[-0.29, -0.11, 0.02]} />
          <mesh geometry={g.cardLine} material={m.mark} position={[0.2, -0.05, 0.02]} />
          <mesh geometry={g.cardLine} material={m.mark} position={[0.2, -0.17, 0.02]} />
        </group>
      </group>

      <group ref={legL} position={[-0.42, -H, 0]}>
        <mesh geometry={g.leg} material={m.limb} />
        <mesh geometry={g.foot} material={m.limb} />
        <lineSegments geometry={wires.legWire} material={m.lines} />
      </group>
      <group ref={legR} position={[0.42, -H, 0]}>
        <mesh geometry={g.leg} material={m.limb} />
        <mesh geometry={g.foot} material={m.limb} />
        <lineSegments geometry={wires.legWire} material={m.lines} />
      </group>
    </group>
  );
}

/**
 * Studio light baked from three's RoomEnvironment: no HDR file to download.
 * Baked a frame after the canvas starts, so context creation and the bake land in separate tasks.
 */
function RoomLight() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    let env: THREE.Texture | null = null;
    const frame = requestAnimationFrame(() => {
      const { gl, scene, camera } = get();
      const pmrem = new THREE.PMREMGenerator(gl);
      const room = new RoomEnvironment();
      env = pmrem.fromScene(room, 0.04).texture;
      scene.environment = env;
      scene.environmentIntensity = 0.42;
      room.dispose();
      pmrem.dispose();
      // Compile the materials now, so flipping to Build doesn't stall on its shaders.
      gl.compile(scene, camera);
    });
    return () => {
      cancelAnimationFrame(frame);
      get().scene.environment = null;
      env?.dispose();
    };
  }, [get]);
  return null;
}

/** Hero mascot: Folio, a page drawn as a blueprint (design) that fills into a solid character (build). */
export default function HeroObject(props: HeroObjectProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // Render only while the hero is on screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "demand" : "never"}
        flat
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.2], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        onPointerLeave={() => (document.body.style.cursor = "")}
      >
        <RoomLight />
        <ambientLight intensity={0.35} />
        <directionalLight position={[2.5, 3, 5]} intensity={1.5} />
        <directionalLight position={[-4, 1, 3]} intensity={0.25} />
        <Folio {...props} />
      </Canvas>
    </div>
  );
}
