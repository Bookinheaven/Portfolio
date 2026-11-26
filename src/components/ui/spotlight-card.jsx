import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * SpotlightCard tracks cursor position to render a subtle, silky radial highlight
 * on hover without harsh edges. Works in both Dark and Light palettes.
 */
function SpotlightCard({ children, className, onClick, ...props }) {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true
    });
  };

  const handleMouseLeave = () => {
    setPos((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card/85 text-card-foreground backdrop-blur-md shadow-xs transition-colors duration-200 hover:border-line-strong",
        className
      )}
      {...props}
    >
      {/* Subtle radial cursor glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: pos.active ? 1 : 0,
          background: `radial-gradient(360px circle at ${pos.x}px ${pos.y}px, var(--spotlight), transparent 70%)`
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

export { SpotlightCard };
