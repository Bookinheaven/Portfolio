import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import data from '../../data/portfolio.json';
import { FiArrowRight } from 'react-icons/fi';

const ProjectsView = ({ id, onOpenProject }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        const isAtLeftEdge = container.scrollLeft <= 0;
        const isAtRightEdge = Math.ceil(container.scrollLeft) >= maxScrollLeft;

        if ((e.deltaY < 0 && !isAtLeftEdge) || (e.deltaY > 0 && !isAtRightEdge)) {
          e.stopPropagation();
          e.preventDefault();
          container.scrollLeft += e.deltaY;
        }
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <section id={id} className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative">
      <div className="min-h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24">
        <div className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Selected Work</h2>
          <p className="text-vercel-accents-5 max-w-xl">
            A collection of projects demonstrating my experience in backend systems, AI, and product development.
          </p>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x" style={{ scrollbarWidth: 'none' }}>
          {data.projects.map((project, index) => (
            <div
              key={project.id}
              onClick={() => onOpenProject(project)}
              className="vercel-card min-w-[320px] md:min-w-[450px] lg:min-w-[500px] h-[55vh] min-h-[400px] max-h-[600px] p-6 flex flex-col cursor-pointer group snap-center flex-shrink-0"
            >
              <div className="h-48 rounded-md bg-vercel-accents-2 mb-6 overflow-hidden relative">
                {project.heroImage && (
                  <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              <div className="flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                <p className="text-vercel-accents-4 text-sm mb-4 flex-grow">{project.subtitle}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.skills.slice(0, 3).map(skillId => {
                    const skill = data.skills.find(s => s.id === skillId);
                    return skill ? (
                      <span key={skillId} className="text-xs px-2 py-1 bg-white/5 rounded-md border border-white/10 text-vercel-accents-5">
                        {skill.name}
                      </span>
                    ) : null;
                  })}
                  {project.skills.length > 3 && (
                    <span className="text-xs px-2 py-1 text-vercel-accents-6">+{project.skills.length - 3}</span>
                  )}
                </div>

                <div className="flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors mt-auto">
                  View Case Study <FiArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProjectsView;
