import { useEffect, useRef } from 'react';

const HorizontalContainer = ({ children, isLocked = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (isLocked) return;
    const container = containerRef.current;
    if (!container) return;

    let isTransitioning = false;
    let wheelAccumulator = 0;
    let wheelResetTimer = null;

    const handleWheel = (e) => {
      // 1. Check if hovering over an element that has its own scroll (vertical or horizontal)
      let target = e.target;
      let innerCanScroll = false;

      while (target && target !== container) {
        const style = window.getComputedStyle(target);

        // Check vertical scrollability
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          if (target.scrollHeight > target.clientHeight) {
            const isAtTop = target.scrollTop <= 1;
            const isAtBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <= 2;

            if (e.deltaY > 0 && !isAtBottom) {
              innerCanScroll = true;
              break;
            } else if (e.deltaY < 0 && !isAtTop) {
              innerCanScroll = true;
              break;
            }
          }
        }

        // Check horizontal scrollability (e.g. Selected Work projects carousel)
        if (style.overflowX === 'auto' || style.overflowX === 'scroll') {
          if (target.scrollWidth > target.clientWidth) {
            const isAtLeft = target.scrollLeft <= 2;
            const isAtRight = Math.ceil(target.scrollLeft) >= target.scrollWidth - target.clientWidth - 2;

            if ((e.deltaY > 0 || e.deltaX > 0) && !isAtRight) {
              innerCanScroll = true;
              break;
            } else if ((e.deltaY < 0 || e.deltaX < 0) && !isAtLeft) {
              innerCanScroll = true;
              break;
            }
          }
        }

        target = target.parentNode;
      }

      if (innerCanScroll) {
        return; // Let the inner scrollable element handle it
      }

      // If already animating between sections, prevent default to avoid jumpiness
      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      const isDiscreteMouse = Math.abs(e.deltaY) >= 30 || Number.isInteger(e.deltaY);

      if (isDiscreteMouse && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        wheelAccumulator += e.deltaY;

        clearTimeout(wheelResetTimer);
        wheelResetTimer = setTimeout(() => {
          wheelAccumulator = 0;
        }, 200);

        // Threshold for intentional section transition
        if (Math.abs(wheelAccumulator) >= 50) {
          const dir = wheelAccumulator > 0 ? 1 : -1;
          wheelAccumulator = 0;

          const sectionWidth = container.clientWidth;
          const currentIndex = Math.round(container.scrollLeft / sectionWidth);
          const totalSections = container.children.length;
          const targetIndex = Math.max(0, Math.min(totalSections - 1, currentIndex + dir));

          if (targetIndex !== currentIndex) {
            isTransitioning = true;
            container.scrollTo({
              left: targetIndex * sectionWidth,
              behavior: 'smooth'
            });

            setTimeout(() => {
              isTransitioning = false;
            }, 600);
          }
        }
      } else if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // Trackpad continuous vertical scroll translated to horizontal
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    // Keyboard navigation (Arrow keys, PageUp/PageDown)
    const handleKeyDown = (e) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable) {
        return;
      }

      const sectionWidth = container.clientWidth;
      const currentIndex = Math.round(container.scrollLeft / sectionWidth);
      const totalSections = container.children.length;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentIndex < totalSections - 1) {
          e.preventDefault();
          container.scrollTo({
            left: (currentIndex + 1) * sectionWidth,
            behavior: 'smooth'
          });
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentIndex > 0) {
          e.preventDefault();
          container.scrollTo({
            left: (currentIndex - 1) * sectionWidth,
            behavior: 'smooth'
          });
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(wheelResetTimer);
    };
  }, [isLocked]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-row ${isLocked ? 'overflow-hidden pointer-events-none' : 'overflow-x-auto'} overflow-y-hidden h-screen w-screen snap-x snap-mandatory scroll-smooth hide-scrollbar relative`}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {children}
    </div>
  );
};

export default HorizontalContainer;
