import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import data from '../../data/portfolio.json';
import { FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProjectsView = ({ id, onOpenProject }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0, moved: false });

  // Update scroll boundaries & active card index
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate approximate active card index
    const cardWidth = el.firstElementChild?.offsetWidth || 480;
    const gap = 24;
    const index = Math.round(scrollLeft / (cardWidth + gap));
    setCurrentIndex(Math.max(0, Math.min(data.projects.length - 1, index)));
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    // Smooth mouse wheel translation
    const handleWheel = (e) => {
      // If user is holding shift, browser handles native horizontal scroll
      if (e.shiftKey) return;

      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      if (maxScrollLeft <= 0) return;

      const isAtLeftEdge = container.scrollLeft <= 5;
      const isAtRightEdge = Math.ceil(container.scrollLeft) >= maxScrollLeft - 5;

      // When wheeling vertically, translate to horizontal scroll
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

  // Navigate left / right by one card
  const scrollDirection = (dir) => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.offsetWidth || 480;
    const gap = 24;
    const amount = cardWidth + gap;

    container.scrollBy({
      left: dir === 'next' ? amount : -amount,
      behavior: 'smooth'
    });
  };

  // Scroll to a specific project by index
  const scrollToProject = (index) => {
    const container = scrollRef.current;
    if (!container) return;

    const cardWidth = container.firstElementChild?.offsetWidth || 480;
    const gap = 24;
    container.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth'
    });
  };

  // Drag-to-scroll handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
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
    <section id={id} className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative">
      <div className="min-h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-24">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Selected Work</h2>
            <p className="text-vercel-accents-5 max-w-xl text-sm md:text-base">
              A collection of {data.projects.length} projects demonstrating my experience in backend systems, AI agents, and product development.
            </p>
          </div>

          {/* Navigation Controls for Mouse & Trackpad */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-xs font-mono text-vercel-accents-4 bg-white/5 px-3 py-2 rounded-lg border border-white/10">
              <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="text-white/30 mx-1.5">/</span>
              <span>{String(data.projects.length).padStart(2, '0')}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => scrollDirection('prev')}
                disabled={!canScrollLeft}
                aria-label="Previous project"
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${canScrollLeft
                    ? 'text-white hover:bg-white/15 active:scale-95 cursor-pointer'
                    : 'text-white/20 cursor-not-allowed'
                  }`}
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => scrollDirection('next')}
                disabled={!canScrollRight}
                aria-label="Next project"
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${canScrollRight
                    ? 'text-white hover:bg-white/15 active:scale-95 cursor-pointer'
                    : 'text-white/20 cursor-not-allowed'
                  }`}
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Draggable Cards Row */}
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`flex gap-6 overflow-x-auto pt-3 pb-6 -mt-3 hide-scrollbar ${isMouseDown ? 'cursor-grabbing select-none' : 'cursor-grab'
              }`}
            style={{
              scrollbarWidth: 'none',
              scrollBehavior: isDragging ? 'auto' : 'smooth'
            }}
          >
            {data.projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 25, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                onClick={() => handleCardClick(project)}
                className="vercel-card w-[320px] sm:w-[400px] md:w-[440px] h-[500px] p-6 flex flex-col cursor-pointer group shrink-0 select-none hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.06)]"
              >
                <div className="w-full h-52 shrink-0 rounded-xl overflow-hidden relative mb-5 bg-zinc-950/80 border border-white/5">
                  {project.heroImage && (
                    <img
                      src={project.heroImage}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />

                  {project.status && (
                    <span className="absolute top-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white/80 uppercase tracking-wider">
                      {project.status}
                    </span>
                  )}
                </div>

                <div className="flex flex-col flex-grow min-h-0">
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan-400 transition-colors truncate">
                    {project.title}
                  </h3>
                  <p className="text-vercel-accents-4 text-sm mb-4 line-clamp-2 h-10 shrink-0 leading-relaxed">
                    {project.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4 h-14 overflow-hidden content-start shrink-0">
                    {project.skills.slice(0, 4).map(skillId => {
                      const skill = data.skills.find(s => s.id === skillId);
                      return skill ? (
                        <span key={skillId} className="text-xs px-2.5 py-1 bg-white/5 rounded-md border border-white/10 text-vercel-accents-5">
                          {skill.name}
                        </span>
                      ) : null;
                    })}
                    {project.skills.length > 4 && (
                      <span className="text-xs px-2 py-1 text-vercel-accents-6">
                        +{project.skills.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors mt-auto pt-3 border-t border-white/5">
                    View Case Study <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Interactive Project Indicators (Dots) */}
          <div className="flex items-center justify-center gap-2 mt-2">
            {data.projects.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => scrollToProject(idx)}
                aria-label={`Jump to project ${p.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentIndex === idx
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProjectsView;
