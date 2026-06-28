import { useEffect, useRef } from "react";
import * as THREE from "three";

type PointerState = {
  x: number;
  y: number;
};

const SHARD_COLORS = [0xf7fbff, 0x9cbcff, 0xd3c4ff, 0xffd98a];

function distortGeometry(geometry: THREE.BufferGeometry, strength: number) {
  const position = geometry.getAttribute("position");
  const vector = new THREE.Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vector.fromBufferAttribute(position, index);
    const pulse =
      Math.sin(vector.x * 4.4 + vector.y * 1.8) *
      Math.cos(vector.z * 3.2 - vector.y * 0.7);
    vector.multiplyScalar(1 + pulse * strength);
    position.setXYZ(index, vector.x, vector.y, vector.z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

function createShard(radius: number, detail: number, color: number) {
  const geometry = new THREE.TetrahedronGeometry(radius, detail);
  distortGeometry(geometry, 0.12);

  const material = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.22,
    metalness: 0.08,
    transmission: 0.18,
    thickness: 0.8,
    transparent: true,
    opacity: 0.54,
    clearcoat: 0.72,
    clearcoatRoughness: 0.22,
    emissive: color,
    emissiveIntensity: 0.16,
  });

  const mesh = new THREE.Mesh(geometry, material);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 18),
    new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
    }),
  );

  mesh.add(edges);
  return mesh;
}

function createParticleField(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();

  for (let index = 0; index < count; index += 1) {
    const radius = 2.8 + Math.random() * 9.2;
    const theta = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 8.5;
    const base = index * 3;

    positions[base] = Math.cos(theta) * radius + (Math.random() - 0.5) * 1.4;
    positions[base + 1] = height;
    positions[base + 2] = Math.sin(theta) * radius - Math.random() * 3.2;

    color.setHSL(0.61 + Math.random() * 0.1, 0.42, 0.72 + Math.random() * 0.22);
    colors[base] = color.r;
    colors[base + 1] = color.g;
    colors[base + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.026,
      vertexColors: true,
      transparent: true,
      opacity: 0.62,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
}

function createAperture() {
  const aperture = new THREE.Group();

  for (let index = 0; index < 5; index += 1) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.18 + index * 0.28, 0.006 + index * 0.0015, 8, 180),
      new THREE.MeshBasicMaterial({
        color: index % 2 === 0 ? 0xffffff : 0x9cbcff,
        transparent: true,
        opacity: 0.24 - index * 0.028,
        blending: THREE.AdditiveBlending,
      }),
    );

    ring.rotation.x = Math.PI / 2 + index * 0.055;
    ring.rotation.y = index * 0.16;
    aperture.add(ring);
  }

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.018, 0.05, 4.8, 28, 1, true),
    new THREE.MeshBasicMaterial({
      color: 0xf7fbff,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  beam.rotation.z = -0.18;
  aperture.add(beam);

  return aperture;
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
    return;
  }

  material.dispose();
}

export function DarkScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const pointer: PointerState = { x: 0, y: 0 };
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030305, 0.045);

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.22, 8.4);

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      canvas.classList.add("is-hidden");
      return undefined;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const root = new THREE.Group();
    const shardCluster = new THREE.Group();
    const aperture = createAperture();
    const particles = createParticleField(1100);
    const ambient = new THREE.HemisphereLight(0xf8fbff, 0x030305, 0.72);
    const key = new THREE.DirectionalLight(0xffffff, 2.8);
    const blue = new THREE.PointLight(0x78a7ff, 2.4, 12);
    const gold = new THREE.PointLight(0xffd98a, 1.1, 9);

    key.position.set(-3.6, 3.4, 4.4);
    blue.position.set(2.6, -1.2, 2.6);
    gold.position.set(-2.4, 1.2, 2.2);
    aperture.position.set(0, -0.14, -0.28);
    aperture.rotation.z = -0.12;

    for (let index = 0; index < 9; index += 1) {
      const color = SHARD_COLORS[index % SHARD_COLORS.length];
      const mesh = createShard(0.34 + (index % 3) * 0.08, 2, color);
      const angle = index * 1.18;
      const distance = 1.15 + index * 0.16;

      mesh.position.set(
        Math.cos(angle) * distance,
        Math.sin(index * 0.86) * 1.05,
        Math.sin(angle) * distance - index * 0.18,
      );
      mesh.rotation.set(index * 0.44, angle * 0.5, index * 0.24);
      shardCluster.add(mesh);
    }

    root.add(particles, aperture, shardCluster);
    scene.add(root, ambient, key, blue, gold);

    const positionRoot = () => {
      root.position.x = window.innerWidth < 840 ? 0.18 : 2.2;
      root.position.y = window.innerWidth < 840 ? -0.42 : -0.08;
      root.scale.setScalar(window.innerWidth < 840 ? 0.82 : 1);
    };

    positionRoot();

    const startTime = performance.now();
    let animationFrame = 0;

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      positionRoot();
    };

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      const motion = prefersReducedMotion ? 0.18 : 1;

      root.rotation.y = elapsed * 0.035 * motion + pointer.x * 0.035;
      root.rotation.x = pointer.y * 0.024;
      particles.rotation.y = -elapsed * 0.024 * motion;
      particles.rotation.x = pointer.y * 0.018;
      aperture.rotation.z = -0.12 + elapsed * 0.08 * motion;
      aperture.scale.setScalar(1 + Math.sin(elapsed * 0.82) * 0.018 * motion);
      shardCluster.rotation.y = elapsed * 0.18 * motion;
      shardCluster.rotation.z = Math.sin(elapsed * 0.32) * 0.04 * motion;

      camera.position.x += (pointer.x * 0.18 - camera.position.x) * 0.035;
      camera.position.y += (0.22 - pointer.y * 0.12 - camera.position.y) * 0.035;
      camera.lookAt(root.position.x * 0.22, 0, 0);

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onResize);
    render();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(animationFrame);

      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Points ||
          object instanceof THREE.LineSegments
        ) {
          object.geometry.dispose();
          disposeMaterial(object.material);
        }
      });

      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="dark-scene" aria-hidden="true" />;
}

export default DarkScene;
