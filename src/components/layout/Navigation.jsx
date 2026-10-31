import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Navigation = ({ sections, activeIndex, isLocked = false }) => {
  const goToSection = (index) => {
    if (isLocked) return;
    if (index >= 0 && index < sections.length) {
      const el = document.getElementById(sections[index].id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex < sections.length - 1;

  return (
    <AnimatePresence>
      {!isLocked && (
        <motion.nav
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 select-none"
        >
          <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/15 shadow-2xl">
            {/* Prev Chevron */}
            <button
              onClick={() => goToSection(activeIndex - 1)}
              disabled={!hasPrev}
              aria-label="Previous section"
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                hasPrev
                  ? 'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer'
                  : 'text-white/20 cursor-not-allowed'
              }`}
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            <div className="w-[1px] h-4 bg-white/10" />

            {/* Dots & Labels */}
            <div className="flex items-center gap-3 px-1">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center group cursor-pointer shrink-0"
                  onClick={() => goToSection(index)}
                >
                  <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
                    {/* The dot */}
                    <div
                      className={`rounded-full transition-all duration-300 shrink-0 ${
                        index === activeIndex
                          ? 'w-2.5 h-2.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-110'
                          : 'w-2 h-2 bg-white/30 group-hover:bg-white/60'
                      }`}
                    />

                    {/* Label (visible on hover or active) */}
                    <div
                      className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono transition-all duration-200 whitespace-nowrap px-2 py-0.5 rounded bg-black/80 border border-white/10 ${
                        index === activeIndex
                          ? 'opacity-100 text-white scale-100'
                          : 'opacity-0 group-hover:opacity-100 text-white/70 scale-95'
                      }`}
                    >
                      {section.name}
                    </div>
                  </div>

                  {/* Connecting line */}
                  {index < sections.length - 1 && (
                    <div className="w-6 h-[1px] bg-white/10 mx-1.5 shrink-0" />
                  )}
                </div>
              ))}
            </div>

            <div className="w-[1px] h-4 bg-white/10" />

            {/* Next Chevron */}
            <button
              onClick={() => goToSection(activeIndex + 1)}
              disabled={!hasNext}
              aria-label="Next section"
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                hasNext
                  ? 'text-white/70 hover:text-white hover:bg-white/10 cursor-pointer'
                  : 'text-white/20 cursor-not-allowed'
              }`}
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navigation;
