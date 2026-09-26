import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '../../data/portfolio.json';
import SkillRadar from './SkillRadar';

const SkillsView = ({ id, onOpenProject }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSkills, setActiveSkills] = useState([]);

  // Derive categories
  const categories = useMemo(() => {
    const cats = new Set(data.skills.map(s => s.category));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All') return data.skills;
    return data.skills.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    if (activeCategory === 'All') {
      setActiveSkills([]);
    } else if (filteredSkills.length > 0) {
      setActiveSkills([filteredSkills[0]]);
    } else {
      setActiveSkills([]);
    }
  }, [filteredSkills, activeCategory]);

  return (
    <section id={id} className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative">
      <div className="min-h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24">
        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:h-[80vh] items-center">
        
        {/* Left Column: Skill Graph / List */}
        <div className="md:col-span-5 flex flex-col h-full justify-center">
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Skill Graph</h2>
            <p className="text-vercel-accents-5 text-sm">
              Explore the technologies I use and the projects where I've applied them.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-2" style={{ scrollbarWidth: 'none' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => { setActiveCategory(cat); setActiveSkills([]); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat ? 'bg-white text-black' : 'bg-white/5 text-vercel-accents-4 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div layout className="flex flex-wrap gap-3 overflow-y-auto max-h-[50vh] pr-4 custom-scrollbar content-start">
            <AnimatePresence mode="popLayout">
              {filteredSkills.map(skill => (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, layout: { type: "spring", bounce: 0.2, duration: 0.6 } }}
                  key={skill.id}
                  onClick={() => {
                    setActiveSkills(prev => {
                      const isSelected = prev.some(s => s.id === skill.id);
                      if (isSelected) {
                        // Prevent deselecting the last skill to avoid empty state if preferred, but allow it for now
                        return prev.filter(s => s.id !== skill.id);
                      }
                      return [...prev, skill];
                    });
                  }}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors duration-300 ${
                    activeSkills.some(s => s.id === skill.id) 
                      ? 'border-white bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                      : 'border-white/10 bg-black text-vercel-accents-4 hover:border-white/30 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {skill.name}
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Column: Skill Details */}
        <div className="md:col-span-7 h-[60vh] flex flex-col justify-center vercel-card p-8 relative overflow-hidden">
          {/* Ambient Glow inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

          <AnimatePresence mode="wait">
            {activeSkills.length > 0 ? (
              <motion.div
                key={activeSkills.map(s => s.id).join('-')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className={`flex flex-wrap items-center ${activeSkills.length === 1 ? 'gap-4' : 'gap-3'} mb-2`}>
                  {activeSkills.map(skill => (
                    <div key={skill.id} className={`flex items-center ${activeSkills.length === 1 ? 'gap-3' : 'gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl'}`}>
                      <h3 className={`${activeSkills.length === 1 ? 'text-4xl' : 'text-xl'} font-bold leading-none`}>{skill.name}</h3>
                      <span className={`font-mono bg-white/10 rounded text-vercel-accents-5 uppercase ${activeSkills.length === 1 ? 'text-xs px-2 py-1' : 'text-[10px] px-2 py-0.5'}`}>
                        {skill.category}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="w-12 h-1 bg-white/20 mb-8 mt-4 rounded-full" />

                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-4 text-white/80">Projects Demonstrated In</h4>
                  {(() => {
                    const derivedProjects = data.projects.filter(p => 
                      p.skills?.some(skillId => activeSkills.some(active => active.id === skillId))
                    );
                    
                    return derivedProjects.length > 0 ? (
                      <div className="flex flex-col gap-3">
                        {derivedProjects.map(project => (
                          <div key={project.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 transition-colors cursor-pointer group"
                               onClick={() => onOpenProject(project)}>
                            <div className="mb-2 sm:mb-0">
                              <h5 className="font-bold group-hover:text-white transition-colors">{project.title}</h5>
                              <p className="text-xs text-vercel-accents-5">{project.subtitle}</p>
                            </div>
                            <div className="flex flex-col sm:items-end">
                              <div className="text-xs text-vercel-accents-5 mb-1 max-w-[200px] text-left sm:text-right truncate">
                                {project.skills.filter(s => activeSkills.some(as => as.id === s)).map(s => data.skills.find(ds => ds.id === s)?.name).join(', ')}
                              </div>
                              <div className="text-xs font-medium text-vercel-accents-6 group-hover:text-white transition-colors">
                                View Project →
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-vercel-accents-5 italic">No specific projects linked yet, but used in general development.</p>
                    );
                  })()}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full relative z-10"
              >
                <div className="mb-4 w-full">
                  <SkillRadar skills={data.skills} />
                </div>
                <p className="text-vercel-accents-5 text-sm text-center">
                  Select a skill from the graph to explore related case studies.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
      </div>
    </section>
  );
};

export default SkillsView;
