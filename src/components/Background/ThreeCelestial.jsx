import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeCelestial() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer, scene, camera, animationFrameId;
    let sphereGeo, sphereMat, ringGeo, ringMat;
    let icoGeo, icoMat, wireGeo, wireMat;
    let debrisGeo, debrisMat;

    try {
      // Check for reduced motion or low performance mobile
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.innerWidth < 768;

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // Scene & Camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 24;

      // WebGL Renderer with safe context detection
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // Ambient & Directional Lighting
      const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
      scene.add(ambientLight);

      const purpleLight = new THREE.PointLight(0xa855f7, 4, 50);
      purpleLight.position.set(-15, 10, 10);
      scene.add(purpleLight);

      const cyanLight = new THREE.PointLight(0x00d2ff, 5, 50);
      cyanLight.position.set(15, 8, 10);
      scene.add(cyanLight);

      // 1. TOP-LEFT PURPLE GLOWING SPHERE
      sphereGeo = new THREE.SphereGeometry(2.6, 32, 32);
      sphereMat = new THREE.MeshStandardMaterial({
        color: 0x6b21a8,
        emissive: 0x3b0764,
        emissiveIntensity: 0.8,
        roughness: 0.4,
        metalness: 0.7,
      });
      const purpleSphere = new THREE.Mesh(sphereGeo, sphereMat);
      purpleSphere.position.set(-16, 7.5, 2);
      scene.add(purpleSphere);

      // Outer Glow Ring for Sphere
      ringGeo = new THREE.TorusGeometry(3.1, 0.04, 16, 80);
      ringMat = new THREE.MeshBasicMaterial({
        color: 0xc084fc,
        transparent: true,
        opacity: 0.4,
      });
      const sphereRing = new THREE.Mesh(ringGeo, ringMat);
      sphereRing.rotation.x = Math.PI / 3;
      purpleSphere.add(sphereRing);

      // 2. TOP-RIGHT CYAN FACETED ICOSAHEDRON
      icoGeo = new THREE.IcosahedronGeometry(2.4, 0);
      icoMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.5,
        flatShading: true,
        transparent: true,
        opacity: 0.85,
      });
      const cyanPolyhedron = new THREE.Mesh(icoGeo, icoMat);
      cyanPolyhedron.position.set(16, 8, 1);
      scene.add(cyanPolyhedron);

      // Wireframe Cage overlay
      wireGeo = new THREE.IcosahedronGeometry(2.45, 0);
      wireMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.9,
      });
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      cyanPolyhedron.add(wireMesh);

      // Floating Geometric Debris
      const debrisGroup = new THREE.Group();
      const debrisCount = isMobile ? 6 : 14;
      debrisGeo = new THREE.TetrahedronGeometry(0.25, 0);
      debrisMat = new THREE.MeshBasicMaterial({
        color: 0x00d2ff,
        wireframe: true,
        opacity: 0.6,
        transparent: true,
      });

      for (let i = 0; i < debrisCount; i++) {
        const debris = new THREE.Mesh(debrisGeo, debrisMat);
        debris.position.set(
          (Math.random() - 0.5) * 36,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10
        );
        debris.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        debrisGroup.add(debris);
      }
      scene.add(debrisGroup);

      // Mouse Parallax
      let targetMouseX = 0;
      let targetMouseY = 0;
      let currentMouseX = 0;
      let currentMouseY = 0;

      const handleMouseMove = (e) => {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      const handleResize = () => {
        if (!container || !camera || !renderer) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);

        const aspect = w / h;
        if (aspect < 1.2) {
          purpleSphere.position.set(-8, 9, -2);
          cyanPolyhedron.position.set(8, 9, -2);
        } else {
          purpleSphere.position.set(-16, 7.5, 2);
          cyanPolyhedron.position.set(16, 8, 1);
        }
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      const startTime = performance.now();
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const elapsedTime = (performance.now() - startTime) * 0.001;

        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;

        camera.position.x = currentMouseX * 1.5;
        camera.position.y = currentMouseY * 1.5;
        camera.lookAt(0, 0, 0);

        if (!prefersReducedMotion) {
          purpleSphere.rotation.y = elapsedTime * 0.2;
          purpleSphere.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;
          purpleSphere.position.y = 7.5 + Math.sin(elapsedTime * 0.8) * 0.6;

          cyanPolyhedron.rotation.x = elapsedTime * 0.35;
          cyanPolyhedron.rotation.y = elapsedTime * 0.45;
          cyanPolyhedron.position.y = 8 + Math.cos(elapsedTime * 0.9) * 0.7;

          debrisGroup.children.forEach((item, index) => {
            item.rotation.x += 0.01 * (index % 2 === 0 ? 1 : -1);
            item.rotation.y += 0.015;
            item.position.y += Math.sin(elapsedTime + index) * 0.005;
          });
        }

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        if (renderer) renderer.dispose();
        if (sphereGeo) sphereGeo.dispose();
        if (sphereMat) sphereMat.dispose();
        if (ringGeo) ringGeo.dispose();
        if (ringMat) ringMat.dispose();
        if (icoGeo) icoGeo.dispose();
        if (icoMat) icoMat.dispose();
        if (wireGeo) wireGeo.dispose();
        if (wireMat) wireMat.dispose();
        if (debrisGeo) debrisGeo.dispose();
        if (debrisMat) debrisMat.dispose();
        if (container && renderer && renderer.domElement) {
          container.removeChild(renderer.domElement);
        }
      };
    } catch (e) {
      console.warn('Three.js celestial canvas initialized in fallback mode:', e);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-[1] overflow-hidden"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
