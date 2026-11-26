import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Precision cursor paired with the reactive background canvas:
 * - Zero-lag 1:1 core dot driven directly via MotionValues
 * - Spring-damped outer reticle that scales cleanly over interactive targets
 * - Emits click waves into the StudioBackground dot matrix on mousedown
 */
function CursorSpotlight() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isTextInput, setIsTextInput] = useState(false);

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  const ringX = useSpring(mouseX, { stiffness: 360, damping: 28, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 360, damping: 28, mass: 0.4 });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const root = document.documentElement;
    const frame = requestAnimationFrame(() => {
      setEnabled(true);
      root.classList.add('custom-cursor-active');
    });

    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      const target = e.target;
      const textField = Boolean(
        target?.closest?.('input, textarea, [contenteditable="true"]')
      );
      setIsTextInput(textField);

      const interactiveTarget = target?.closest?.(
        'a, button, [role="button"], [role="tab"], .cursor-pointer'
      );
      setIsInteractive(Boolean(interactiveTarget));
    };

    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);

    const handleLeave = () => {
      setVisible(false);
      setIsInteractive(false);
      setIsPressed(false);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('mousedown', handleDown, { passive: true });
    window.addEventListener('mouseup', handleUp, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
    };
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  const showPointer = visible && !isTextInput;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[200] overflow-hidden"
    >
      {/* Spring Trailing Reticle Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          opacity: showPointer ? 1 : 0,
          width: isInteractive ? 38 : 26,
          height: isInteractive ? 38 : 26,
          scale: isPressed ? 0.82 : 1
        }}
        transition={{
          opacity: { duration: 0.15 },
          width: { type: 'spring', stiffness: 420, damping: 30 },
          height: { type: 'spring', stiffness: 420, damping: 30 },
          scale: { duration: 0.1 }
        }}
        className={`fixed top-0 left-0 rounded-full backdrop-blur-[1px] transition-colors duration-150 ${
          isInteractive
            ? 'border border-ink/75 bg-ink/[0.06]'
            : 'border border-ink/35 bg-transparent'
        }`}
      />

      {/* Zero-Lag 1:1 Core Precision Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%'
        }}
        animate={{
          opacity: showPointer ? 1 : 0,
          scale: isPressed ? 0.65 : isInteractive ? 0.7 : 1
        }}
        transition={{ duration: 0.1 }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-ink"
      />
    </div>
  );
}

export { CursorSpotlight };
