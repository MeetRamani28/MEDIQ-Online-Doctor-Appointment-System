import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeCanvas = ({ className = "" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 18;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Interactive 3D Particle Molecule / Sphere
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color("#2563eb"); // Blue
    const color2 = new THREE.Color("#4f46e5"); // Indigo
    const color3 = new THREE.Color("#06b6d4"); // Cyan

    for (let i = 0; i < particleCount; i++) {
      // Sphere distribution
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 7 + (Math.random() - 0.5) * 2;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const mixedColor = i % 3 === 0 ? color1 : i % 3 === 1 ? color2 : color3;
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Material with vertex colors
    const material = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // 3. Connective Wireframe Inner Sphere
    const wireframeGeo = new THREE.IcosahedronGeometry(6.2, 2);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeo, wireframeMat);
    scene.add(wireframeMesh);

    // 4. Mouse Interactive Parallax
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / container.clientHeight) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 5. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Rotation
      particleSystem.rotation.y = elapsedTime * 0.08;
      particleSystem.rotation.x = elapsedTime * 0.05;

      wireframeMesh.rotation.y = -elapsedTime * 0.1;
      wireframeMesh.rotation.z = elapsedTime * 0.04;

      // Mouse Parallax Effect
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // 6. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[300px] relative pointer-events-none ${className}`}
    />
  );
};

export default ThreeCanvas;
