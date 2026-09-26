import { useEffect, useRef, useState } from 'react';

const HorizontalContainer = ({ children }) => {
  const containerRef = useRef(null);

  // Allow mouse wheel to scroll horizontally
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      let target = e.target;
      let canScrollVertically = false;

      // Check if we are hovering over an element that needs and can scroll vertically
      while (target && target !== container) {
        const style = window.getComputedStyle(target);
        if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
          if (target.scrollHeight > target.clientHeight) {
            const isAtTop = target.scrollTop === 0;
            const isAtBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <= 1;

            if (e.deltaY > 0 && !isAtBottom) {
              canScrollVertically = true;
              break;
            } else if (e.deltaY < 0 && !isAtTop) {
              canScrollVertically = true;
              break;
            }
          }
        }
        target = target.parentNode;
      }

      if (canScrollVertically) {
        // Allow native vertical scroll
        return;
      }

      // Translate vertical scroll to horizontal scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-row overflow-x-auto overflow-y-hidden h-screen w-screen snap-x snap-mandatory scroll-smooth hide-scrollbar relative"
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
