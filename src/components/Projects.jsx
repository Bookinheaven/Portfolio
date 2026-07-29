import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import portfolioData from '../data/portfolio.json';

const Projects = () => {
  const { projects } = portfolioData;

  const handleMouseMove = (e) => {
    for (const card of document.querySelectorAll('.flashlight-card')) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <section id="projects" className="py-24 px-6 md:px-12 relative border-t border-vercel-accents-2" onMouseMove={handleMouseMove}>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Selected Works</h2>
            <p className="text-vercel-accents-5 mt-2">A showcase of my recent engineering projects.</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flashlight-card group ${index === 0 ? 'md:col-span-2' : 'col-span-1'}`}
            >
              <div className="flashlight-content flex flex-col h-full bg-vercel-bg">
                <div className={`relative overflow-hidden bg-vercel-accents-1 border-b border-vercel-accents-2 ${index === 0 ? 'aspect-[21/9]' : 'aspect-[16/9]'}`}>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"; 
                    }}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  
                  {/* Hover Description Overlay */}
                  <div className="absolute inset-0 bg-vercel-bg/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8 flex flex-col justify-center">
                    <h4 className="text-white font-bold mb-4">Project Details</h4>
                    <ul className="text-vercel-accents-6 text-sm space-y-3 list-disc pl-4">
                      {project.description.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">
                      {project.title}
                    </h3>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-vercel-accents-4 hover:text-white transition-colors z-10">
                      <ExternalLink size={20} />
                    </a>
                  </div>
                  <p className="text-vercel-accents-5 text-sm mb-4">
                    {project.category}
                  </p>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-vercel-accents-2">
                    <span className="text-xs font-mono text-vercel-accents-4">
                      {project.startDate} {project.startDate !== project.endDate && `- ${project.endDate}`}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
