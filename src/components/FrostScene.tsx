import { useEffect, useRef } from "react";
import * as THREE from "three";

type PointerState = {
  x: number;
  y: number;
};

const ICE_COLORS = [0xd8f5ff, 0xb8dfff, 0xf4fbff, 0x9fd1da];

function distortGeometry(geometry: THREE.BufferGeometry, strength: number) {
  const position = geometry.getAttribute("position");
  const vector = new THREE.Vector3();

  for (let index = 0; index < position.count; index += 1) {
    vector.fromBufferAttribute(position, index);
    const ripple =
      Math.sin(vector.x * 3.1 + vector.y * 1.7) *
      Math.cos(vector.z * 2.4 - vector.y);
    vector.multiplyScalar(1 + ripple * strength);
    position.setXYZ(index, vector.x, vector.y, vector.z);
  }

  position.needsUpdate = true;
  geometry.computeVertexNormals();
}

function createIceMass(radius: number, detail: number, color: number) {
  const geometry = new THREE.IcosahedronGeometry(radius, detail);
  distortGeometry(geometry, 0.095);

  const material = new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.18,
    metalness: 0,
    transmission: 0.48,
    thickness: 1.6,
    transparent: true,
    opacity: 0.72,
    clearcoat: 0.86,
    clearcoatRoughness: 0.16,
    ior: 1.31,
    attenuationColor: new THREE.Color(0xcceeff),
    attenuationDistance: 2.8,
  });

  const mesh = new THREE.Mesh(geometry, material);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 20),
    new THREE.LineBasicMaterial({
      color: 0xf7fdff,
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
    const radius = 4 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const base = index * 3;

    positions[base] = radius * Math.sin(phi) * Math.cos(theta);
    positions[base + 1] = radius * Math.cos(phi) * 0.5 + (Math.random() - 0.5);
    positions[base + 2] = radius * Math.sin(phi) * Math.sin(theta);

    color.setHSL(0.52 + Math.random() * 0.08, 0.35, 0.72 + Math.random() * 0.24);
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
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.64,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
}

export function FrostScene() {
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
    scene.fog = new THREE.FogExp2(0x071014, 0.045);

    const camera = new THREE.PerspectiveCamera(
      38,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.28, 8.5);

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
    const iceCluster = new THREE.Group();
    const particles = createParticleField(900);
    const ambient = new THREE.HemisphereLight(0xe9fdff, 0x061018, 1.1);
    const key = new THREE.DirectionalLight(0xffffff, 3.4);
    const cyan = new THREE.PointLight(0x79ffe4, 2.7, 12);
    const frostRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.85, 0.012, 8, 160),
      new THREE.MeshBasicMaterial({
        color: 0xdffaff,
        transparent: true,
        opacity: 0.22,
      }),
    );
    const scanRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.2, 0.006, 8, 180),
      new THREE.MeshBasicMaterial({
        color: 0x6ef7d9,
        transparent: true,
        opacity: 0.12,
      }),
    );

    key.position.set(-3.6, 3.4, 4.8);
    cyan.position.set(2.8, -1.2, 2.6);
    frostRing.rotation.x = Math.PI / 2.35;
    frostRing.position.y = -1.2;
    scanRing.rotation.x = Math.PI / 2.18;
    scanRing.position.y = -1.38;

    ICE_COLORS.forEach((color, index) => {
      const mesh = createIceMass(index === 0 ? 1.42 : 0.44 + index * 0.08, 3, color);
      const angle = index * 1.9;
      const distance = index === 0 ? 0 : 2.15 + index * 0.42;

      mesh.position.set(
        Math.cos(angle) * distance,
        index === 0 ? 0 : Math.sin(index) * 0.6,
        Math.sin(angle) * distance - index * 0.28,
      );
      mesh.rotation.set(index * 0.42, angle * 0.5, index * 0.32);
      iceCluster.add(mesh);
    });

    root.add(particles, frostRing, scanRing, iceCluster);
    scene.add(root, ambient, key, cyan);

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
    };

    const render = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      const motion = prefersReducedMotion ? 0.22 : 1;

      iceCluster.rotation.y = elapsed * 0.12 * motion;
      iceCluster.rotation.x =
        Math.sin(elapsed * 0.18) * 0.08 * motion + pointer.y * 0.04;
      iceCluster.position.x = pointer.x * 0.16;
      iceCluster.position.y = Math.sin(elapsed * 0.3) * 0.08 * motion;

      particles.rotation.y = -elapsed * 0.035 * motion;
      particles.rotation.x = pointer.y * 0.025;
      frostRing.rotation.z = elapsed * 0.1 * motion;
      scanRing.rotation.z = -elapsed * 0.075 * motion;
      scanRing.scale.setScalar(1 + Math.sin(elapsed * 0.9) * 0.016 * motion);

      camera.position.x += (pointer.x * 0.25 - camera.position.x) * 0.035;
      camera.position.y += (0.28 - pointer.y * 0.14 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

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
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();

          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="frost-scene" aria-hidden="true" />;
}

export default FrostScene;
