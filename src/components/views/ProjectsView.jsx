import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiGithub } from 'react-icons/fi';
import data from '../../data/portfolio.json';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SmoothImage } from '@/components/ui/smooth-image';
import { cn } from '@/lib/utils';

const ProjectsView = ({ id, onOpenProject }) => {
  const scrollRef = useRef(null);
  const [activeTag, setActiveTag] = useState('All');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0, moved: false });

  const tags = useMemo(() => {
    const tagSet = new Set();
    data.projects.forEach((p) => (p.tags || []).forEach((t) => tagSet.add(t)));
    return ['All', ...Array.from(tagSet)];
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeTag === 'All') return data.projects;
    return data.projects.filter((p) => p.tags?.includes(activeTag));
  }, [activeTag]);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardWidth = el.firstElementChild?.offsetWidth || 430;
    const gap = 24;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setCurrentIndex(Math.max(0, Math.min(Math.max(filteredProjects.length - 1, 0), index)));
  }, [filteredProjects.length]);

  const handleSelectTag = (tag) => {
    setActiveTag(tag);
    setCurrentIndex(0);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    const handleWheel = (e) => {
      if (e.shiftKey) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 0) return;

      const isAtLeftEdge = container.scrollLeft <= 5;
      const isAtRightEdge = Math.ceil(container.scrollLeft) >= maxScrollLeft - 5;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if ((e.deltaY < 0 && !isAtLeftEdge) || (e.deltaY > 0 && !isAtRightEdge)) {
          e.stopPropagation();
          e.preventDefault();
          container.scrollBy({
            left: e.deltaY * 1.5,
            behavior: 'auto'
          });
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('scroll', updateScrollState);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scrollDirection = (dir) => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.offsetWidth || 430;
    const gap = 24;
    const amount = cardWidth + gap;

    container.scrollBy({
      left: dir === 'next' ? amount : -amount,
      behavior: 'smooth'
    });
  };

  const scrollToProject = (index) => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.offsetWidth || 430;
    const gap = 24;
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    });
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    const container = scrollRef.current;
    if (!container) return;

    setIsMouseDown(true);
    dragStart.current = {
      x: e.pageX,
      scrollLeft: container.scrollLeft,
      moved: false
    };
  };

  const handleMouseMove = (e) => {
    if (!isMouseDown) return;
    const container = scrollRef.current;
    if (!container) return;

    const deltaX = e.pageX - dragStart.current.x;
    if (Math.abs(deltaX) > 6) {
      dragStart.current.moved = true;
      setIsDragging(true);
    }

    if (dragStart.current.moved) {
      e.preventDefault();
      container.scrollLeft = dragStart.current.scrollLeft - deltaX * 1.4;
    }
  };

  const handleMouseUpOrLeave = () => {
    if (!isMouseDown) return;
    setIsMouseDown(false);
    setTimeout(() => {
      setIsDragging(false);
      dragStart.current.moved = false;
    }, 60);
  };

  const handleCardClick = (project) => {
    if (dragStart.current.moved || isDragging) return;
    onOpenProject(project);
  };

  return (
    <section
      id={id}
      className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative"
    >
      <div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 pt-10 pb-24">
        <div className="max-w-[1400px] w-full mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-4 select-none">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Selected Work
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Projects & Systems
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-xs font-mono text-muted-foreground bg-card/85 backdrop-blur-md border border-border px-3 py-1.5 rounded-lg">
                <span className="text-foreground font-semibold">
                  {String(currentIndex + 1).padStart(2, '0')}
                </span>
                <span className="opacity-40 mx-1.5">/</span>
                <span>{String(filteredProjects.length).padStart(2, '0')}</span>
              </div>

              <div className="flex items-center gap-1 bg-card/85 backdrop-blur-md border border-border p-1 rounded-lg">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => scrollDirection('prev')}
                  disabled={!canScrollLeft}
                  aria-label="Previous project"
                  className="rounded-md cursor-pointer"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => scrollDirection('next')}
                  disabled={!canScrollRight}
                  aria-label="Next project"
                  className="rounded-md cursor-pointer"
                >
                  <FiChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div
            className="flex gap-1.5 overflow-x-auto hide-scrollbar mb-6 pb-1"
            style={{ scrollbarWidth: 'none' }}
          >
            {tags.map((tag) => (
              <Button
                key={tag}
                type="button"
                size="xs"
                variant={activeTag === tag ? 'default' : 'outline'}
                onClick={() => handleSelectTag(tag)}
                className="rounded-md px-3 py-1.5 h-7 text-xs whitespace-nowrap cursor-pointer"
              >
                {tag}
              </Button>
            ))}
          </div>

          <div className="relative">
            <div
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className={cn(
                'flex gap-6 overflow-x-auto pt-1 pb-5 hide-scrollbar',
                isMouseDown ? 'cursor-grabbing select-none' : 'cursor-grab'
              )}
              style={{
                scrollbarWidth: 'none',
                scrollBehavior: isDragging ? 'auto' : 'smooth'
              }}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.3, delay: index * 0.04, ease: 'easeOut' }}
                  className="shrink-0"
                >
                  <Card
                    onClick={() => handleCardClick(project)}
                    className="rounded-2xl w-[320px] sm:w-[390px] md:w-[430px] h-[440px] cursor-pointer group select-none overflow-hidden hover:border-line-strong"
                  >
                    <div className="w-full h-48 shrink-0 relative border-b border-border overflow-hidden">
                      {project.gallery?.[0]?.src && (
                        <SmoothImage
                          src={project.gallery[0].src}
                          alt={project.title}
                          wrapperClassName="w-full h-full"
                          className="w-full h-full object-cover object-top group-hover:scale-[1.03] pointer-events-none"
                        />
                      )}
                      {project.status === 'In Development' && (
                        <Badge
                          variant="outline"
                          className="absolute top-3 left-3 text-[10px] font-mono bg-surface-solid/90 backdrop-blur-md uppercase tracking-wider"
                        >
                          Active
                        </Badge>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-grow min-h-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="min-w-0">
                          <h3 className="text-xl font-semibold text-foreground truncate">
                            {project.title}
                          </h3>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            {project.period.start}
                            {project.period.start !== project.period.end ? ` – ${project.period.end}` : ''}
                          </span>
                        </div>

                        {project.links?.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`${project.title} GitHub repository`}
                            className={cn(
                              buttonVariants({ variant: 'outline', size: 'icon-sm' }),
                              'rounded-md shrink-0'
                            )}
                          >
                            <FiGithub className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      <p className="text-ink-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
                        {project.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4 overflow-hidden max-h-14 content-start">
                        {project.skills.slice(0, 4).map((skillId) => {
                          const skill = data.skills.find((s) => s.id === skillId);
                          return skill ? (
                            <Badge
                              key={skillId}
                              variant="secondary"
                              className="text-[11px] font-mono rounded-md px-2 py-0.5 h-auto"
                            >
                              {skill.name}
                            </Badge>
                          ) : null;
                        })}
                        {project.skills.length > 4 && (
                          <span className="text-[11px] font-mono px-1.5 py-0.5 text-muted-foreground">
                            +{project.skills.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors mt-auto pt-3 border-t border-border">
                        <span>Read case study</span>
                        <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-1">
              {filteredProjects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => scrollToProject(idx)}
                  aria-label={`Jump to project ${p.title}`}
                  className={cn(
                    'h-1 rounded-full transition-all duration-300 cursor-pointer',
                    currentIndex === idx ? 'w-7 bg-foreground' : 'w-2 bg-line-strong opacity-60 hover:opacity-100'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsView;
