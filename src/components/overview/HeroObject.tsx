"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type HeroObjectProps = {
  /** false = the design (edges only), true = the build (solid body). */
  built: boolean;
  /** Becomes true when the intro has left; the object then grows in. */
  started: boolean;
  reducedMotion: boolean;
  ink: string;
  accent: string;
  onSpin?: () => void;
};

const damp = THREE.MathUtils.damp;

/** The classic pointer arrow's corners. Units: about 1.8 tall. */
const ARROW: [number, number][] = [
  [0, 0],
  [0, -1.62],
  [0.4, -1.24],
  [0.66, -1.82],
  [0.92, -1.7],
  [0.66, -1.13],
  [1.18, -1.13],
];
const DEPTH = 0.34;

function arrowShape() {
  const s = new THREE.Shape();
  ARROW.forEach(([x, y], i) => (i === 0 ? s.moveTo(x, y) : s.lineTo(x, y)));
  s.closePath();
  return s;
}

/** Blueprint lines: the outline on the front and back faces, and the corners joining them. */
function arrowEdges(offset: THREE.Vector3) {
  const pts: number[] = [];
  const n = ARROW.length;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = ARROW[i];
    const [x2, y2] = ARROW[(i + 1) % n];
    for (const z of [0, DEPTH]) pts.push(x1, y1, z, x2, y2, z);
    pts.push(x1, y1, 0, x1, y1, DEPTH);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  g.translate(offset.x, offset.y, offset.z);
  return g;
}

/** Studio light baked from three's RoomEnvironment: no HDR file to download. */
function RoomLight() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    const { gl, scene } = get();
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04).texture;
    scene.environment = env;
    room.dispose();
    pmrem.dispose();
    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [get]);
  return null;
}

function Arrow({ built, started, reducedMotion, ink, accent, onSpin }: HeroObjectProps) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const shapes = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(arrowShape(), {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.07,
      bevelSegments: 6,
      curveSegments: 4,
    });
    g.computeBoundingBox();
    const offset = g.boundingBox!.getCenter(new THREE.Vector3()).negate();
    g.translate(offset.x, offset.y, offset.z);
    return { solid: g, edges: arrowEdges(offset) };
  }, []);
  const solidRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const linesRef = useRef<THREE.LineBasicMaterial>(null);

  // Geometry made here is passed in as a prop, so fiber won't dispose it (the JSX materials it does).
  useEffect(
    () => () => {
      shapes.solid.dispose();
      shapes.edges.dispose();
    },
    [shapes],
  );

  // Page-wide pointer, so the arrow looks toward the cursor wherever it is.
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const state = useRef({ appear: 0, build: 0, spin: 0, spinTarget: 0, hover: 0, rx: 0, ry: 0 });

  useFrame(({ clock }, delta) => {
    const g = group.current;
    if (!g) return;
    const s = state.current;
    const dt = Math.min(delta, 1 / 30);
    const t = clock.elapsedTime;

    if (reducedMotion) {
      s.appear = started ? 1 : 0;
      s.build = built ? 1 : 0;
    } else {
      s.appear = damp(s.appear, started ? 1 : 0, 3.2, dt);
      s.build = damp(s.build, built ? 1 : 0, 5, dt);
      s.spin = damp(s.spin, s.spinTarget, 4, dt);
      s.hover = damp(s.hover, hovered ? 1 : 0, 8, dt);
      s.rx = damp(s.rx, pointer.current.y * 0.35, 3, dt);
      s.ry = damp(s.ry, pointer.current.x * 0.55, 3, dt);
    }

    // Grows in from 85%, never from nothing.
    g.scale.setScalar((0.85 + 0.15 * s.appear) * (1 + 0.06 * s.hover));
    g.position.y = reducedMotion ? 0 : Math.sin(t * 1.1) * 0.08;
    g.rotation.set(s.rx + 0.15, s.ry - 0.35 + s.spin, -0.28);

    const solid = solidRef.current;
    const lines = linesRef.current;
    if (solid) {
      solid.opacity = s.build * s.appear;
      solid.depthWrite = solid.opacity > 0.98;
    }
    if (lines) lines.opacity = (1 - 0.75 * s.build) * s.appear;
  });

  return (
    <group
      ref={group}
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
        if (!reducedMotion) state.current.spinTarget += Math.PI * 2;
        onSpin?.();
      }}
    >
      <mesh geometry={shapes.solid}>
        <meshPhysicalMaterial
          ref={solidRef}
          color={accent}
          roughness={0.28}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          transparent
          opacity={0}
        />
      </mesh>
      <lineSegments geometry={shapes.edges}>
        <lineBasicMaterial ref={linesRef} color={ink} transparent opacity={0} />
      </lineSegments>
    </group>
  );
}

/** Hero 3D object: a chunky cursor arrow, drawn as edges (design) that fill into a glossy solid (build). */
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
        frameloop={visible ? "always" : "never"}
        flat
        dpr={[1, 2]}
        camera={{ position: [0, 0, 6.2], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
        onPointerLeave={() => (document.body.style.cursor = "")}
      >
        <RoomLight />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <Arrow {...props} />
      </Canvas>
    </div>
  );
}
