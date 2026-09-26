import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import HorizontalContainer from './components/layout/HorizontalContainer';
import Navigation from './components/layout/Navigation';
import HomeView from './components/views/HomeView';
import ProjectsView from './components/views/ProjectsView';
import SkillsView from './components/views/SkillsView';
import AboutView from './components/views/AboutView';
import CertificationsView from './components/views/CertificationsView';
import ProjectCaseStudy from './components/project/ProjectCaseStudy';

const SECTIONS = [
  { id: 'home', name: 'Home' },
  { id: 'projects', name: 'Projects' },
  { id: 'skills', name: 'Skills' },
  { id: 'about', name: 'About' },
  { id: 'certifications', name: 'Certifications' }
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProject, setActiveProject] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) setActiveIndex(index);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-black text-white selection:bg-vercel-accents-2 selection:text-vercel-foreground h-screen w-screen overflow-hidden font-sans">
      <Navigation sections={SECTIONS} activeIndex={activeIndex} />
      
      <main>
        <HorizontalContainer>
          <HomeView id="home" onOpenProject={setActiveProject} />
          <ProjectsView id="projects" onOpenProject={setActiveProject} />
          <SkillsView id="skills" onOpenProject={setActiveProject} />
          <AboutView id="about" />
          <CertificationsView id="certifications" />
        </HorizontalContainer>
      </main>

      <AnimatePresence>
        {activeProject && (
          <ProjectCaseStudy 
            project={activeProject} 
            onClose={() => setActiveProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
