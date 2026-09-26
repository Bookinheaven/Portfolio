import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import data from '../../data/portfolio.json';

const ProjectCaseStudy = ({ project, onClose }) => {
  const overlayRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = project.gallery?.length > 0 
    ? project.gallery 
    : (project.heroImage ? [{ src: project.heroImage, title: 'Hero' }] : []);

  // Stop native wheel events from bubbling up to the horizontal scroll container
  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      e.stopPropagation();
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto"
    >
      <div className="min-h-screen w-full max-w-5xl mx-auto px-6 py-12 md:py-24 relative">
        <button 
          onClick={onClose}
          className="fixed top-8 right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50 text-white"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Hero Section */}
        <div className="mb-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p className="text-vercel-accents-5 font-mono text-sm mb-4 tracking-wider uppercase">
              {project.period.start}{project.period.start !== project.period.end ? ` - ${project.period.end}` : ''} • {project.status}
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{project.title}</h1>
            <p className="text-xl md:text-2xl text-vercel-accents-4 max-w-2xl mb-8 leading-relaxed">
              {project.subtitle}
            </p>

            <div className="flex gap-4 mb-12">
              {project.links && Object.entries(project.links).map(([type, url]) => {
                if (!url) return null;
                return (
                  <a key={type} href={url} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium capitalize">
                    {type === 'github' ? <FiGithub /> : <FiExternalLink />}
                    {type === 'github' ? 'View Source' : `Visit ${type}`}
                  </a>
                );
              })}
            </div>
          </motion.div>

          {images.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.3 }}
              className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/10 group bg-black/50"
            >
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImageIndex}
                  src={images[currentImageIndex].src} 
                  alt={images[currentImageIndex].title || project.title} 
                  initial={{ opacity: 0, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </AnimatePresence>

              {images[currentImageIndex].description && (
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm md:text-base font-medium drop-shadow-md">
                    {images[currentImageIndex].description}
                  </p>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white border border-white/20 shadow-lg opacity-70 group-hover:opacity-100 hover:scale-110 transition-all hover:bg-black/90 backdrop-blur-md z-10"
                  >
                    <FiChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => setCurrentImageIndex(prev => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white border border-white/20 shadow-lg opacity-70 group-hover:opacity-100 hover:scale-110 transition-all hover:bg-black/90 backdrop-blur-md z-10"
                  >
                    <FiChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute top-4 right-4 flex gap-2 z-10 bg-black/30 px-3 py-2 rounded-full backdrop-blur-md border border-white/10">
                    {images.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentImageIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all shadow-md ${i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </div>

        {/* Overview & Role */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Overview</h2>
            <div className="space-y-6 text-vercel-accents-4 leading-relaxed">
              {project.overview?.problem && (
                <div>
                  <h3 className="text-white font-medium mb-2">The Problem</h3>
                  <p>{project.overview.problem}</p>
                </div>
              )}
              {project.overview?.solution && (
                <div>
                  <h3 className="text-white font-medium mb-2">The Solution</h3>
                  <p>{project.overview.solution}</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Role & Tech</h2>
            <div className="mb-6">
              <h3 className="text-white font-medium mb-2">Role</h3>
              <p className="text-vercel-accents-4">{project.overview?.role || 'Developer'}</p>
            </div>
            <div>
              <h3 className="text-white font-medium mb-3">Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {project.skills?.map(skillId => {
                  const skill = data.skills.find(s => s.id === skillId);
                  return skill ? (
                    <span key={skillId} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded text-vercel-accents-3">
                      {skill.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {project.features.map((feature, i) => (
                <div key={i} className="vercel-card p-6">
                  <h3 className="text-lg font-bold mb-3">{feature.name}</h3>
                  <p className="text-vercel-accents-4 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Decisions */}
        {project.technicalDecisions && project.technicalDecisions.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8">Engineering Decisions</h2>
            <div className="space-y-8">
              {project.technicalDecisions.map((decision, i) => (
                <div key={i} className="border-l-2 border-vercel-accents-2 pl-6 py-2">
                  <h3 className="text-xl font-bold mb-2">{decision.decision}</h3>
                  <p className="text-sm font-mono text-vercel-accents-5 mb-4">Technology: {decision.technology}</p>
                  <p className="text-vercel-accents-4">{decision.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCaseStudy;
