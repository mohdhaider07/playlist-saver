"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Set up dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf9f8f4, 0.015);

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
    camera.position.set(0, 15, 35);
    camera.lookAt(0, 0, 0);

    // Create WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Particle Texture (Soft glowing circular gradient)
    const createParticleTexture = () => {
      const size = 64;
      const textureCanvas = document.createElement("canvas");
      textureCanvas.width = size;
      textureCanvas.height = size;
      const ctx = textureCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2,
        );
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.1, "rgba(197, 160, 89, 0.9)");
        grad.addColorStop(0.4, "rgba(197, 160, 89, 0.4)");
        grad.addColorStop(1, "rgba(197, 160, 89, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(textureCanvas);
    };

    const particleTexture = createParticleTexture();

    const particleCount = 1200;
    const basePositions = new Float32Array(particleCount * 3);
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount);

    const c1 = new THREE.Color(0xc5a059); // Nobel gold
    const c2 = new THREE.Color(0x78716c); // Stone
    const c3 = new THREE.Color(0x44403c); // Dark stone

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.pow(Math.random(), 1.5) * 25 + 1;
      const branchAngle = ((i % 5) * Math.PI * 2) / 5;
      const spin = radius * 0.4;
      const spread =
        (Math.random() - 0.5) * (30 / radius) + (Math.random() - 0.5) * 1.5;
      const angle = branchAngle + spin + spread;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(radius * 0.5 - spin) * 3 + (Math.random() - 0.5) * 2;
      const z = Math.sin(angle) * radius;

      const i3 = i * 3;
      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      randoms[i] = Math.random();

      let col = c1.clone();
      if (Math.random() > 0.6) col = c2.clone();
      if (Math.random() > 0.8) col = c3.clone();
      if (radius < 5) col.lerp(new THREE.Color(0xffffff), 0.5);

      colors[i3] = col.r;
      colors[i3 + 1] = col.g;
      colors[i3 + 2] = col.b;

      sizes[i] = Math.random() * 2 + 0.8;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        particleTexture: { value: particleTexture },
      },
      vertexShader: `
        attribute float size;
        attribute float aRandom;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          vec3 pos = position;
          pos.y += sin(time * 2.0 + aRandom * 10.0) * 0.5;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (35.0 / -mvPosition.z) * (1.0 + sin(time * 3.0 + aRandom * 20.0) * 0.3);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D particleTexture;
        varying vec3 vColor;
        void main() {
          vec4 texColor = texture2D(particleTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor, 1.0) * texColor;
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const particles = new THREE.Points(geometry, material);
    mainGroup.add(particles);

    const maxLines = 1500;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3),
    );
    lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.5,
      depthWrite: false,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    mainGroup.add(lines);

    // Mouse Tracking State globally on window to ignore pointer-events-none
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let targetX = 0;
    let targetY = 0;

    const planeGeo = new THREE.PlaneGeometry(200, 200);
    const planeMat = new THREE.MeshBasicMaterial({ visible: false });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    scene.add(plane);

    const mousePoint = new THREE.Vector3(-1000, -1000, -1000);

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize between -1 and 1
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      targetX = mouse.x * 0.4;
      targetY = mouse.y * 0.4;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Visibility management (to pause loop when off-screen)
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(container);

    // Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      material.uniforms.time.value = time;

      // Parallax smoothing effect
      mainGroup.rotation.y += (targetX - mainGroup.rotation.y) * delta * 2;
      mainGroup.rotation.x += (-targetY - mainGroup.rotation.x) * delta * 2;
      mainGroup.rotation.y += delta * 0.15;

      // Update pointer intersection in 3D
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(plane);
      if (intersects.length > 0) {
        mousePoint.copy(intersects[0].point);
      } else {
        mousePoint.set(-1000, -1000, -1000);
      }

      const posAttr = geometry.attributes.position;
      const posArr = posAttr.array as Float32Array;

      let lineCount = 0;
      for (let i = 0; i < maxLines * 6; i++) {
        linePositions[i] = 0;
      }

      const repulsionRadius = 7.0;
      const forceMultiplier = 18.0;
      const springFactor = 2.5;
      const dampening = 0.91;

      const localMousePoint = mousePoint.clone();
      mainGroup.worldToLocal(localMousePoint);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        let vx = velocities[i3];
        let vy = velocities[i3 + 1];
        let vz = velocities[i3 + 2];

        const cx = posArr[i3];
        const cy = posArr[i3 + 1];
        const cz = posArr[i3 + 2];

        const dx = cx - localMousePoint.x;
        const dy = cy - localMousePoint.y;
        const dz = cz - localMousePoint.z;
        const distSq = dx * dx + dy * dy + dz * dz;

        if (distSq < repulsionRadius * repulsionRadius) {
          const dist = Math.sqrt(distSq);
          const force = (repulsionRadius - dist) / repulsionRadius;
          vx += (dx / dist) * force * forceMultiplier * delta;
          vy += (dy / dist) * force * forceMultiplier * delta;
          vz += (dz / dist + 0.5) * force * forceMultiplier * delta;
        }

        const bx = basePositions[i3];
        const by = basePositions[i3 + 1];
        const bz = basePositions[i3 + 2];

        const driftX = bx + Math.sin(time * 0.5 + randoms[i] * 10) * 1.5;
        const driftY = by + Math.cos(time * 0.6 + randoms[i] * 10) * 1.5;
        const driftZ = bz + Math.sin(time * 0.7 + randoms[i] * 10) * 1.5;

        vx += (driftX - cx) * springFactor * delta;
        vy += (driftY - cy) * springFactor * delta;
        vz += (driftZ - cz) * springFactor * delta;

        vx *= dampening;
        vy *= dampening;
        vz *= dampening;

        velocities[i3] = vx;
        velocities[i3 + 1] = vy;
        velocities[i3 + 2] = vz;

        const nx = cx + vx;
        const ny = cy + vy;
        const nz = cz + vz;

        posArr[i3] = nx;
        posArr[i3 + 1] = ny;
        posArr[i3 + 2] = nz;

        if (i % 2 === 0 && lineCount < maxLines) {
          const speedSq = vx * vx + vy * vy + vz * vz;
          if (speedSq > 0.08) {
            for (let j = i + 1; j < particleCount; j += 3) {
              if (lineCount >= maxLines) break;

              const j3 = j * 3;
              const lx = nx - posArr[j3];
              const ly = ny - posArr[j3 + 1];
              const lz = nz - posArr[j3 + 2];
              const lDistSq = lx * lx + ly * ly + lz * lz;

              if (lDistSq < 15.0) {
                const lDist = Math.sqrt(lDistSq);
                const alpha = 1.0 - lDist / Math.sqrt(15.0);
                const idx = lineCount * 6;

                linePositions[idx] = nx;
                linePositions[idx + 1] = ny;
                linePositions[idx + 2] = nz;
                linePositions[idx + 3] = posArr[j3];
                linePositions[idx + 4] = posArr[j3 + 1];
                linePositions[idx + 5] = posArr[j3 + 2];

                const r = c1.r * alpha * 0.9;
                const g = c1.g * alpha * 0.9;
                const b = c1.b * alpha * 0.9;

                lineColors[idx] = r;
                lineColors[idx + 1] = g;
                lineColors[idx + 2] = b;
                lineColors[idx + 3] = r;
                lineColors[idx + 4] = g;
                lineColors[idx + 5] = b;

                lineCount++;
              }
            }
          }
        }
      }

      posAttr.needsUpdate = true;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      lines.geometry.setDrawRange(0, lineCount * 2);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      planeGeo.dispose();
      planeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-75 md:opacity-95"
      />
    </div>
  );
}
