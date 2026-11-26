import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCommand, FiSun, FiMoon } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const Navigation = ({
  sections,
  activeIndex,
  isLocked = false,
  theme = 'dark',
  onToggleTheme,
  onOpenPalette
}) => {
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          aria-label="Primary sections"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 select-none max-w-[95vw]"
        >
          <div className="flex items-center gap-1 bg-dock-bg backdrop-blur-xl px-2 py-1.5 rounded-full border border-border shadow-[0_10px_30px_rgba(0,0,0,0.18)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => goToSection(activeIndex - 1)}
              disabled={!hasPrev}
              aria-label="Previous section"
              className="w-7 h-7 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <FiChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-0.5 sm:gap-1">
              {sections.map((section, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => goToSection(index)}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'relative px-2.5 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                      isActive ? 'text-primary-foreground' : 'text-ink-secondary hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-pill"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 bg-primary rounded-full -z-10"
                      />
                    )}
                    <span className="hidden sm:inline">{section.name}</span>
                    <span className="sm:hidden">
                      {section.name === 'Certifications' ? 'Creds' : section.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => goToSection(activeIndex + 1)}
              disabled={!hasNext}
              aria-label="Next section"
              className="w-7 h-7 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <FiChevronRight className="w-4 h-4" />
            </Button>

            <Separator orientation="vertical" className="h-4 mx-1" />

            {onToggleTheme && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="w-7 h-7 rounded-full text-ink-secondary hover:text-foreground cursor-pointer"
              >
                {theme === 'dark' ? <FiSun className="w-3.5 h-3.5" /> : <FiMoon className="w-3.5 h-3.5" />}
              </Button>
            )}

            {onOpenPalette && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={onOpenPalette}
                aria-label="Open command palette"
                title="Quick jump (Ctrl+K / Cmd+K)"
                className="hidden sm:inline-flex rounded-full px-2.5 h-7 font-mono text-[11px] text-ink-secondary hover:text-foreground gap-1 cursor-pointer"
              >
                <FiCommand className="w-3 h-3" />
                <span>K</span>
              </Button>
            )}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navigation;
