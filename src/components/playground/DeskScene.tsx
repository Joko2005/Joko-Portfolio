"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Line, OrbitControls, RoundedBox } from "@react-three/drei";
import type { DeskObjectId } from "@/content/playground";

export type DeskPalette = {
  clay: string;
  mat: string;
  screen: string;
  line: string;
  accent: string;
  hues: [string, string, string, string];
  dark: boolean;
};

type SceneProps = {
  palette: DeskPalette;
  selected: DeskObjectId | null;
  hovered: DeskObjectId | null;
  onSelect: (id: DeskObjectId) => void;
  onHover: (id: DeskObjectId | null) => void;
  reducedMotion: boolean;
  orbit: boolean;
};

/* ---- Spring (bounce ~0.15, Playground only) ---- */

type Spring = { x: number; v: number };
const STIFFNESS = 260;
const DAMPING = 2 * 0.85 * Math.sqrt(STIFFNESS);

/** Steps a spring toward target. Returns true while it is still moving. */
function step(s: Spring, target: number, dt: number) {
  s.v += (-STIFFNESS * (s.x - target) - DAMPING * s.v) * dt;
  s.x += s.v * dt;
  if (Math.abs(s.x - target) < 1e-4 && Math.abs(s.v) < 1e-4) {
    s.x = target;
    s.v = 0;
    return false;
  }
  return true;
}

/** Eases a color toward target. Returns true while it is still changing. */
function ease(c: THREE.Color, target: THREE.Color, dt: number) {
  c.lerp(target, 1 - Math.exp(-dt * 14));
  const d = Math.abs(c.r - target.r) + Math.abs(c.g - target.g) + Math.abs(c.b - target.b);
  if (d < 0.002) {
    c.copy(target);
    return false;
  }
  return true;
}

type PickState = { lift: Spring; sel: Spring };

type PickableProps = {
  id: DeskObjectId;
  position: [number, number, number];
  rotation?: number;
  scene: SceneProps;
  children: (material: THREE.MeshStandardMaterial) => React.ReactNode;
};

/** One desk object: lifts on hover/select, takes the accent color, reports clicks. */
function Pickable({ id, position, rotation = 0, scene, children }: PickableProps) {
  const { palette, selected, hovered, onSelect, onHover, reducedMotion } = scene;
  const group = useRef<THREE.Group>(null);
  const material = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.78 }), []);
  const state = useRef<PickState>({ lift: { x: 0, v: 0 }, sel: { x: 0, v: 0 } });
  const invalidate = useThree((s) => s.invalidate);

  const isSelected = selected === id;
  const isHovered = hovered === id;

  const target = useMemo(() => {
    const clay = new THREE.Color(palette.clay);
    const accent = new THREE.Color(palette.accent);
    if (isSelected) return accent;
    if (isHovered) return clay.lerp(accent, 0.35);
    return clay;
  }, [palette, isSelected, isHovered]);

  // First paint uses the resting color directly, no fade from black.
  useEffect(() => {
    material.color.set(palette.clay);
  }, [material, palette.clay]);

  // Passed in through props, so fiber won't dispose it on unmount.
  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => invalidate(), [invalidate, target, isSelected, isHovered]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const s = state.current;
    const liftTarget = reducedMotion ? 0 : isSelected ? 0.38 : isHovered ? 0.12 : 0;
    const selTarget = isSelected ? 1 : 0;
    let moving: boolean;
    if (reducedMotion) {
      s.lift.x = 0;
      s.sel.x = selTarget;
      material.color.copy(target);
      moving = false;
    } else {
      moving = step(s.lift, liftTarget, dt);
      moving = step(s.sel, selTarget, dt) || moving;
      moving = ease(material.color, target, dt) || moving;
    }
    if (group.current) group.current.position.y = position[1] + s.lift.x;
    if (moving) invalidate();
  });

  const fine = (e: ThreeEvent<PointerEvent>) => e.pointerType === "mouse";

  return (
    <group
      ref={group}
      position={position}
      rotation={[0, rotation, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!fine(e)) return;
        onHover(id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        if (!fine(e)) return;
        onHover(null);
        document.body.style.cursor = "";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {children(material)}
    </group>
  );
}

/* ---- Objects ---- */

function useStatic(color: string) {
  const m = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.6 }), []);
  useEffect(() => {
    m.color.set(color);
  }, [m, color]);
  useEffect(() => () => m.dispose(), [m]);
  return m;
}

/** Draw-in progress for a selected object's screen (0 → 1), restarted on select; stays complete under reduced motion. */
function useDrawIn(active: boolean, reducedMotion: boolean) {
  const t = useRef(1);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (active && !reducedMotion) {
      t.current = 0;
      invalidate();
    }
  }, [active, reducedMotion, invalidate]);
  return t;
}

const easeOut = (x: number) => 1 - Math.pow(1 - THREE.MathUtils.clamp(x, 0, 1), 3);

function Laptop({ scene }: { scene: SceneProps }) {
  const screen = useStatic(scene.palette.screen);
  const active = scene.selected === "laptop";
  const code = active ? scene.palette.accent : scene.palette.line;
  // Widths of the "code" lines on the screen; they type themselves in when the laptop is picked.
  const lines = [1.3, 0.9, 1.6, 0.7, 1.1, 1.4];
  const rows = useRef<(THREE.Group | null)[]>([]);
  const drawRef = useDrawIn(active, scene.reducedMotion);
  const invalidate = useThree((s) => s.invalidate);

  useFrame((_, delta) => {
    if (drawRef.current >= 1) return;
    drawRef.current = Math.min(1, drawRef.current + Math.min(delta, 1 / 30) / 0.7);
    rows.current.forEach((g, i) => {
      if (g) g.scale.x = Math.max(0.001, easeOut((drawRef.current - i * 0.1) / 0.4));
    });
    invalidate();
  });

  return (
    <Pickable id="laptop" position={[-1.05, 0, -0.55]} rotation={0.12} scene={scene}>
      {(material) => (
        <>
          <RoundedBox args={[2.6, 0.1, 1.75]} radius={0.045} position={[0, 0.05, 0]} material={material} />
          <mesh position={[0, 0.101, 0.45]} rotation={[-Math.PI / 2, 0, 0]} material={screen}>
            <planeGeometry args={[0.8, 0.5]} />
          </mesh>
          <group position={[0, 0.1, -0.87]} rotation={[-1.9, 0, 0]}>
            <RoundedBox args={[2.6, 0.06, 1.75]} radius={0.028} position={[0, 0.03, 0.875]} material={material} />
            <mesh position={[0, -0.002, 0.875]} rotation={[Math.PI / 2, 0, 0]} material={screen}>
              <planeGeometry args={[2.42, 1.58]} />
            </mesh>
            {lines.map((w, i) => (
              <group key={i} ref={(g) => void (rows.current[i] = g)} position={[-1.0, -0.004, 0.3 + i * 0.2]}>
                <mesh position={[w / 2, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
                  <planeGeometry args={[w, 0.06]} />
                  <meshBasicMaterial color={code} toneMapped={false} />
                </mesh>
              </group>
            ))}
          </group>
        </>
      )}
    </Pickable>
  );
}

// A loose, hand-drawn signature for the phone screen (AVERA verifies signatures).
const SIGNATURE: [number, number, number][] = (() => {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    const x = -0.26 + t * 0.52;
    const z = 0.08 * Math.sin(t * Math.PI * 5.2) * (1 - t * 0.4) + 0.04 * Math.sin(t * Math.PI * 1.3);
    pts.push([x, 0, z]);
  }
  return pts;
})();
const SIGNATURE_SEGMENTS = SIGNATURE.length - 1;

function Phone({ scene }: { scene: SceneProps }) {
  const screen = useStatic(scene.palette.screen);
  const active = scene.selected === "phone";
  const ink = active ? scene.palette.accent : scene.palette.line;
  const line = useRef<{ geometry: THREE.InstancedBufferGeometry } | null>(null);
  const drawRef = useDrawIn(active, scene.reducedMotion);
  const invalidate = useThree((s) => s.invalidate);

  // The signature writes itself when the phone is picked.
  useFrame((_, delta) => {
    const geometry = line.current?.geometry;
    if (!geometry) return;
    if (drawRef.current < 1) {
      drawRef.current = Math.min(1, drawRef.current + Math.min(delta, 1 / 30) / 0.65);
      invalidate();
    }
    geometry.instanceCount = Math.max(1, Math.round(easeOut(drawRef.current) * SIGNATURE_SEGMENTS));
  });

  return (
    <Pickable id="phone" position={[0.75, 0, 1.25]} rotation={-0.35} scene={scene}>
      {(material) => (
        <>
          <RoundedBox args={[0.78, 0.08, 1.6]} radius={0.04} position={[0, 0.04, 0]} material={material} />
          <mesh position={[0, 0.082, 0]} rotation={[-Math.PI / 2, 0, 0]} material={screen}>
            <planeGeometry args={[0.68, 1.46]} />
          </mesh>
          <Line
            ref={line as never}
            points={SIGNATURE}
            color={ink}
            lineWidth={2.2}
            position={[0, 0.085, 0.05]}
            toneMapped={false}
          />
          <mesh position={[0, 0.085, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.5, 0.012]} />
            <meshBasicMaterial color={scene.palette.line} toneMapped={false} />
          </mesh>
        </>
      )}
    </Pickable>
  );
}

function Bag({ scene }: { scene: SceneProps }) {
  return (
    <Pickable id="bag" position={[2.85, 0, -0.45]} rotation={-0.45} scene={scene}>
      {(material) => (
        <>
          <RoundedBox args={[1.1, 1.25, 0.55]} radius={0.08} smoothness={5} position={[0, 0.625, 0]} material={material} />
          {[0.16, -0.16].map((z) => (
            <mesh key={z} position={[0, 1.22, z]} material={material}>
              <torusGeometry args={[0.24, 0.03, 10, 28, Math.PI]} />
            </mesh>
          ))}
        </>
      )}
    </Pickable>
  );
}

function Sketchbook({ scene }: { scene: SceneProps }) {
  const band = useStatic(scene.palette.screen);
  return (
    <Pickable id="sketchbook" position={[-2.45, 0, 1.3]} rotation={0.28} scene={scene}>
      {(material) => (
        <>
          <RoundedBox args={[1.5, 0.12, 1.9]} radius={0.05} smoothness={5} position={[0, 0.06, 0]} material={material} />
          <mesh position={[0.58, 0.061, 0]} material={band}>
            <boxGeometry args={[0.04, 0.125, 1.92]} />
          </mesh>
          <group position={[-0.1, 0.16, 0.1]} rotation={[0, 0.6, Math.PI / 2]}>
            <mesh material={material}>
              <cylinderGeometry args={[0.04, 0.04, 1.4, 6]} />
            </mesh>
            <mesh position={[0, -0.78, 0]} rotation={[Math.PI, 0, 0]} material={band}>
              <coneGeometry args={[0.04, 0.16, 6]} />
            </mesh>
          </group>
        </>
      )}
    </Pickable>
  );
}

function Swatches({ scene }: { scene: SceneProps }) {
  const { palette, reducedMotion } = scene;
  const blades = useMemo(() => palette.hues.map(() => new THREE.MeshStandardMaterial({ roughness: 0.5 })), [palette.hues]);
  const groups = useRef<(THREE.Group | null)[]>([]);
  const clay = useMemo(() => new THREE.Color(palette.clay), [palette.clay]);
  const hues = useMemo(() => palette.hues.map((h) => new THREE.Color(h)), [palette.hues]);
  const open = useRef<Spring>({ x: 0, v: 0 });
  const invalidate = useThree((s) => s.invalidate);
  const isOpen = scene.selected === "swatches";

  useEffect(() => invalidate(), [invalidate, isOpen]);
  useEffect(() => () => blades.forEach((m) => m.dispose()), [blades]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    let moving = false;
    if (reducedMotion) open.current.x = isOpen ? 1 : 0;
    else moving = step(open.current, isOpen ? 1 : 0, dt);
    const t = THREE.MathUtils.clamp(open.current.x, 0, 1);
    blades.forEach((m, i) => {
      m.color.copy(clay).lerp(hues[i], t);
      const g = groups.current[i];
      // Fans away from the phone, toward the open corner of the mat.
      if (g) g.rotation.y = 0.15 - i * (0.08 + 0.3 * open.current.x);
    });
    if (moving) invalidate();
  });

  return (
    <Pickable id="swatches" position={[2.15, 0, 1.45]} rotation={-0.2} scene={scene}>
      {(material) => (
        <>
          {blades.map((m, i) => (
            <group key={i} ref={(g) => void (groups.current[i] = g)} position={[0, 0.02 + i * 0.03, 0]}>
              <RoundedBox args={[0.34, 0.025, 1.45]} radius={0.01} position={[0, 0, -0.62]} material={m} />
            </group>
          ))}
          <mesh position={[0, 0.08, 0]} material={material}>
            <cylinderGeometry args={[0.06, 0.06, 0.16, 16]} />
          </mesh>
        </>
      )}
    </Pickable>
  );
}

// Mug profile (radius, height), lathed: a base, a slightly flared wall with thickness, and a rim.
const MUG_PROFILE = [
  [0, 0],
  [0.32, 0],
  [0.335, 0.03],
  [0.36, 0.82],
  [0.35, 0.845],
  [0.325, 0.83],
  [0.305, 0.08],
  [0, 0.08],
].map(([x, y]) => new THREE.Vector2(x, y));

function Mug({ scene }: { scene: SceneProps }) {
  const coffee = useStatic(scene.palette.screen);
  return (
    <Pickable id="mug" position={[1.15, 0, -1.15]} scene={scene}>
      {(material) => (
        <>
          <mesh material={material}>
            <latheGeometry args={[MUG_PROFILE, 48]} />
          </mesh>
          <mesh position={[0, 0.7, 0]} rotation={[-Math.PI / 2, 0, 0]} material={coffee}>
            <circleGeometry args={[0.318, 40]} />
          </mesh>
          <mesh position={[0.38, 0.44, 0]} material={material}>
            <torusGeometry args={[0.19, 0.045, 12, 28]} />
          </mesh>
        </>
      )}
    </Pickable>
  );
}

// Everything that must stay in frame: the mat's corners plus the tops of the tallest objects.
const DESK_BOUNDS = [
  ...[-3.8, 3.8].flatMap((x) => [-2.2, 2.4].map((z) => new THREE.Vector3(x, 0, z))),
  new THREE.Vector3(-1.05, 1.0, -1.25), // laptop lid
  new THREE.Vector3(2.85, 1.55, -0.45), // bag handles
];
const VIEW_DIRECTION = new THREE.Vector3(0, 0.66, 0.75).normalize();
const FILL = 0.94; // fraction of the canvas the desk may use, in NDC

/** Fits the camera to the desk on every canvas size, keeping both edges clear and the desk centered. */
function Framing() {
  const get = useThree((s) => s.get);
  const controls = useThree((s) => s.controls) as unknown as { target: THREE.Vector3; update: () => void } | null;
  const { width, height } = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const camera = get().camera as THREE.PerspectiveCamera;
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    const target = new THREE.Vector3(0, 0.4, 0.1);
    const v = new THREE.Vector3();

    const measure = (d: number) => {
      camera.position.copy(target).addScaledVector(VIEW_DIRECTION, d);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      let x = 0;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const c of DESK_BOUNDS) {
        v.copy(c).project(camera);
        x = Math.max(x, Math.abs(v.x));
        minY = Math.min(minY, v.y);
        maxY = Math.max(maxY, v.y);
      }
      return { x, minY, maxY };
    };

    const fit = () => {
      let lo = 4;
      let hi = 40;
      for (let i = 0; i < 24; i++) {
        const mid = (lo + hi) / 2;
        const m = measure(mid);
        if (Math.max(m.x, Math.abs(m.minY), Math.abs(m.maxY)) > FILL) lo = mid;
        else hi = mid;
      }
      return hi;
    };

    // Fit, center vertically, then fit again around the new center.
    let d = fit();
    const m = measure(d);
    const up = new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld, 1);
    target.addScaledVector(up, ((m.minY + m.maxY) / 2) * d * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
    d = fit();
    measure(d);

    if (controls) {
      controls.target.copy(target);
      controls.update();
    }
    invalidate();
  }, [get, controls, width, height, invalidate]);

  return null;
}

export default function DeskScene(props: SceneProps) {
  const { palette, orbit, onHover } = props;
  return (
    <Canvas
      frameloop="demand"
      flat
      dpr={[1, 2]}
      camera={{ position: [0, 6.2, 7.1], fov: 30 }}
      gl={{ antialias: true, alpha: true }}
      onPointerLeave={() => {
        onHover(null);
        document.body.style.cursor = "";
      }}
      fallback={null}
    >
      <Framing />
      {/* Soft key, low ambient and a rim from behind so form reads in both themes. */}
      <ambientLight intensity={palette.dark ? 0.75 : 0.8} />
      <directionalLight position={[3, 7, 4]} intensity={palette.dark ? 2.6 : 2.2} />
      <directionalLight position={[-4, 3, -2]} intensity={palette.dark ? 0.5 : 0.4} />
      <directionalLight position={[-2, 4, -6]} intensity={palette.dark ? 1.3 : 0.4} />

      <RoundedBox args={[7.6, 0.06, 4.6]} radius={0.03} position={[0, -0.03, 0.1]}>
        <meshStandardMaterial color={palette.mat} roughness={0.95} />
      </RoundedBox>

      <Laptop scene={props} />
      <Phone scene={props} />
      <Bag scene={props} />
      <Sketchbook scene={props} />
      <Swatches scene={props} />
      <Mug scene={props} />

      <ContactShadows position={[0, 0.003, 0.1]} scale={[8, 5]} far={1.6} blur={2} opacity={palette.dark ? 0.85 : 0.55} resolution={512} />

      {orbit && (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          makeDefault
          enableDamping
          minPolarAngle={0.5}
          maxPolarAngle={1.1}
          minAzimuthAngle={-0.65}
          maxAzimuthAngle={0.65}
        />
      )}
    </Canvas>
  );
}
