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

    // Create camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 12;

    // Create WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Texture (Soft glowing circular gradient)
    const createCircleTexture = () => {
      const size = 32;
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
          size / 2
        );
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.2, "rgba(197, 160, 89, 0.8)");
        grad.addColorStop(0.5, "rgba(197, 160, 89, 0.2)");
        grad.addColorStop(1, "rgba(197, 160, 89, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(textureCanvas);
    };

    const particleTexture = createCircleTexture();

    // Create parent group to apply rotations (for mouse parallax)
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    // Initialize particles variables
    const particleCount = 100;
    const boxSize = 8; // Bounding box width/height/depth
    const positions = new Float32Array(particleCount * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      // Random coordinates inside the cube bounds
      positions[i * 3] = (Math.random() - 0.5) * boxSize;
      positions[i * 3 + 1] = (Math.random() - 0.5) * boxSize;
      positions[i * 3 + 2] = (Math.random() - 0.5) * boxSize;

      // Random slow velocity
      velocities.push({
        x: (Math.random() - 0.5) * 0.006,
        y: (Math.random() - 0.5) * 0.006,
        z: (Math.random() - 0.5) * 0.006,
      });
    }

    // Particle Geometry & Material
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.28,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xc5a059, // Nobel Gold
    });

    const particleSystem = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    worldGroup.add(particleSystem);

    // Lines Connecting Particles
    // Maximum possible connections is (N * (N-1)) / 2, but we'll cap lineSegments buffer size
    const maxLineSegments = 300;
    const linePositions = new Float32Array(maxLineSegments * 2 * 3);
    const lineColors = new Float32Array(maxLineSegments * 2 * 3);

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );
    lineGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(lineColors, 3)
    );

    // Vertex coloring enabled line material
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1,
    });

    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    worldGroup.add(lineSegments);

    // Mouse Tracking State
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize between -1 and 1
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
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
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const posAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
      const posArray = posAttr.array as Float32Array;

      // Update positions
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArray[i3] += velocities[i].x;
        posArray[i3 + 1] += velocities[i].y;
        posArray[i3 + 2] += velocities[i].z;

        // Bouncing logic at bounding box edge
        const limit = boxSize / 2;
        if (posArray[i3] > limit || posArray[i3] < -limit) velocities[i].x *= -1;
        if (posArray[i3 + 1] > limit || posArray[i3 + 1] < -limit) velocities[i].y *= -1;
        if (posArray[i3 + 2] > limit || posArray[i3 + 2] < -limit) velocities[i].z *= -1;
      }
      posAttr.needsUpdate = true;

      // Calculate connections
      let lineIndex = 0;
      const linePosAttr = lineGeometry.attributes.position as THREE.BufferAttribute;
      const linePosArray = linePosAttr.array as Float32Array;
      const lineColAttr = lineGeometry.attributes.color as THREE.BufferAttribute;
      const lineColArray = lineColAttr.array as Float32Array;

      // Connection threshold distance
      const maxDistance = 2.0;
      const goldColor = new THREE.Color(0xc5a059);
      const stoneColor = new THREE.Color(0x78716c);

      for (let i = 0; i < particleCount; i++) {
        const x1 = posArray[i * 3];
        const y1 = posArray[i * 3 + 1];
        const z1 = posArray[i * 3 + 2];

        for (let j = i + 1; j < particleCount; j++) {
          const x2 = posArray[j * 3];
          const y2 = posArray[j * 3 + 1];
          const z2 = posArray[j * 3 + 2];

          // Compute distance squared first (faster)
          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const distSq = dx * dx + dy * dy + dz * dz;

          if (distSq < maxDistance * maxDistance) {
            const dist = Math.sqrt(distSq);
            // Calculate connection intensity (fades out near the threshold)
            const alpha = 1.0 - dist / maxDistance;

            // Cap lines to prevent Buffer overflow
            if (lineIndex < maxLineSegments) {
              const segStart = lineIndex * 6;

              // Node 1 position
              linePosArray[segStart] = x1;
              linePosArray[segStart + 1] = y1;
              linePosArray[segStart + 2] = z1;

              // Node 2 position
              linePosArray[segStart + 3] = x2;
              linePosArray[segStart + 4] = y2;
              linePosArray[segStart + 5] = z2;

              // Interpolate colors between gold and stone, fade with transparency
              const col = goldColor.clone().lerp(stoneColor, dist / maxDistance);
              const r = col.r * alpha * 0.45;
              const g = col.g * alpha * 0.45;
              const b = col.b * alpha * 0.45;

              // Color node 1
              lineColArray[segStart] = r;
              lineColArray[segStart + 1] = g;
              lineColArray[segStart + 2] = b;

              // Color node 2
              lineColArray[segStart + 3] = r;
              lineColArray[segStart + 4] = g;
              lineColArray[segStart + 5] = b;

              lineIndex++;
            }
          }
        }
      }

      // Reset remaining points to 0 to hide unused segments
      const totalPoints = maxLineSegments * 2;
      const activePoints = lineIndex * 2;
      for (let i = activePoints; i < totalPoints; i++) {
        const i3 = i * 3;
        linePosArray[i3] = 0;
        linePosArray[i3 + 1] = 0;
        linePosArray[i3 + 2] = 0;

        lineColArray[i3] = 0;
        lineColArray[i3 + 1] = 0;
        lineColArray[i3 + 2] = 0;
      }

      linePosAttr.needsUpdate = true;
      lineColAttr.needsUpdate = true;

      // Mouse Parallax Easing
      targetRotationY += (mouseX * 0.25 - targetRotationY) * 0.05;
      targetRotationX += (-mouseY * 0.25 - targetRotationX) * 0.05;

      // Slowly rotate world group continuously
      worldGroup.rotation.y = targetRotationY + clock.getElapsedTime() * 0.02;
      worldGroup.rotation.x = targetRotationX + clock.getElapsedTime() * 0.01;

      // Render
      renderer.render(scene, camera);
    };

    // Start loop
    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();

      // Dispose Three.js objects
      particleTexture.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
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
