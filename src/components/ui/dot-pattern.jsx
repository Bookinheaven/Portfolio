import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Interactive Google-style reactive dot-matrix background canvas.
 * - Dots gently illuminate, scale, and shift with magnetic spring physics near the cursor
 * - Mouse clicks send expanding ripple waves through the dot field
 * - Adapts automatically to Dark (#030304 + white/ice dots) and Light (#f8f8f6 + slate/cobalt dots)
 */
function StudioBackground({ className }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const SPACING = 26;
    const INFLUENCE_RADIUS = 175;
    const MAX_DISPLACEMENT = 7.5;

    let cols = 0;
    let rows = 0;
    let dots = [];

    const pointer = {
      targetX: -9999,
      targetY: -9999,
      x: -9999,
      y: -9999,
      active: false
    };

    const ripples = [];

    let isDark = document.documentElement.classList.contains("dark");
    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });

    const buildGrid = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / SPACING) + 1;
      rows = Math.ceil(height / SPACING) + 1;

      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;

      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const hx = offsetX + c * SPACING;
          const hy = offsetY + r * SPACING;
          dots.push({
            hx,
            hy,
            x: hx,
            y: hy,
            vx: 0,
            vy: 0
          });
        }
      }
    };

    buildGrid();

    const handleResize = () => buildGrid();

    const handleMouseMove = (e) => {
      pointer.targetX = e.clientX;
      pointer.targetY = e.clientY;
      if (!pointer.active) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
      }
    };

    const handleMouseLeave = () => {
      pointer.active = false;
      pointer.targetX = -9999;
      pointer.targetY = -9999;
    };

    const handleMouseDown = (e) => {
      if (reducedMotion) return;
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 340,
        speed: 7.5
      });
      if (ripples.length > 4) ripples.shift();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    let rafId = 0;
    let time = 0;

    const render = () => {
      time += 0.018;
      ctx.clearRect(0, 0, width, height);

      // Smooth pointer interpolation
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * 0.18;
        pointer.y += (pointer.targetY - pointer.y) * 0.18;
      } else {
        pointer.x += (pointer.targetX - pointer.x) * 0.08;
        pointer.y += (pointer.targetY - pointer.y) * 0.08;
      }

      // Advance click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].radius += ripples[i].speed;
        if (ripples[i].radius > ripples[i].maxRadius) {
          ripples.splice(i, 1);
        }
      }

      const cx = width * 0.5;
      const cy = height * 0.42;
      const rx = Math.max(width * 0.56, 1);
      const ry = Math.max(height * 0.54, 1);

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Elliptical edge fade mask so pattern blends smoothly at screen borders
        const nx = (dot.hx - cx) / rx;
        const ny = (dot.hy - cy) / ry;
        const edgeDist = Math.sqrt(nx * nx + ny * ny);
        const edgeMask = Math.max(0, 1 - Math.pow(Math.min(edgeDist, 1.15) / 1.15, 2.2));
        if (edgeMask <= 0.01) continue;

        let targetOffsetX = 0;
        let targetOffsetY = 0;
        let energy = 0;

        // Cursor magnetic repulsion & radial glow
        if (!reducedMotion && pointer.active) {
          const dx = dot.hx - pointer.x;
          const dy = dot.hy - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < INFLUENCE_RADIUS && dist > 0.001) {
            const falloff = 1 - dist / INFLUENCE_RADIUS;
            const smooth = falloff * falloff;
            energy = Math.max(energy, smooth);

            const push = smooth * MAX_DISPLACEMENT;
            targetOffsetX += (dx / dist) * push;
            targetOffsetY += (dy / dist) * push;
          }
        }

        // Expanding click ripple waves across the grid
        for (let rIdx = 0; rIdx < ripples.length; rIdx++) {
          const rip = ripples[rIdx];
          const rdx = dot.hx - rip.x;
          const rdy = dot.hy - rip.y;
          const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
          const bandWidth = 52;
          const delta = Math.abs(rDist - rip.radius);

          if (delta < bandWidth && rDist > 0.001) {
            const bandFalloff = 1 - delta / bandWidth;
            const lifeFade = 1 - rip.radius / rip.maxRadius;
            const waveEnergy = bandFalloff * lifeFade;
            energy = Math.min(1, energy + waveEnergy * 0.9);

            const wavePush = waveEnergy * 8;
            targetOffsetX += (rdx / rDist) * wavePush;
            targetOffsetY += (rdy / rDist) * wavePush;
          }
        }

        // Spring physics back to home coordinate
        if (!reducedMotion) {
          const destX = dot.hx + targetOffsetX;
          const destY = dot.hy + targetOffsetY;
          dot.vx = (dot.vx + (destX - dot.x) * 0.16) * 0.72;
          dot.vy = (dot.vy + (destY - dot.y) * 0.16) * 0.72;
          dot.x += dot.vx;
          dot.y += dot.vy;
        }

        // Subtle organic idle wave
        const idlePulse = reducedMotion
          ? 0
          : (Math.sin(dot.hx * 0.012 + dot.hy * 0.012 - time) + 1) * 0.5;

        const baseAlpha = (isDark ? 0.085 : 0.095) + idlePulse * 0.025;
        const alpha = Math.min(0.85, (baseAlpha + energy * 0.58) * edgeMask);
        const radius = 0.95 + idlePulse * 0.15 + energy * 1.45;

        // Google-inspired subtle cool blue-white highlight on excited dots
        if (isDark) {
          const r = Math.round(255 - energy * 55);
          const g = Math.round(255 - energy * 25);
          const b = 255;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        } else {
          const r = Math.round(15 + energy * 22);
          const g = Math.round(23 + energy * 76);
          const b = Math.round(42 + energy * 193);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      themeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={cn("fixed inset-0 pointer-events-none z-0 overflow-hidden", className)}
    >
      {/* Smooth overhead radial wash */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, var(--spotlight), transparent 72%)"
        }}
      />

      {/* Interactive Cursor-Linked Dot Matrix Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Subtle bottom horizon fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-40"
        style={{
          background: "linear-gradient(to top, var(--canvas) 8%, transparent 100%)"
        }}
      />

      {/* Faint film grain for gradient smoothness */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}

export { StudioBackground };
