import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import HorizontalContainer from './components/layout/HorizontalContainer';
import Navigation from './components/layout/Navigation';
import HomeView from './components/views/HomeView';
import ProjectsView from './components/views/ProjectsView';
import SkillsView from './components/views/SkillsView';
import AboutView from './components/views/AboutView';
import CertificationsView from './components/views/CertificationsView';
import ProjectCaseStudy from './components/project/ProjectCaseStudy';
import { syncSession } from './lib/session';

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

  // Sync initial session on mount
  useEffect(() => {
    syncSession({ section: 'home' });
  }, []);

  // Sync project interactions
  useEffect(() => {
    if (activeProject) {
      syncSession({
        section: 'projects',
        project: activeProject.title
      });
    }
  }, [activeProject]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (index !== -1) {
              setActiveIndex(index);
              syncSession({ section: SECTIONS[index].id });
            }
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
      <Navigation sections={SECTIONS} activeIndex={activeIndex} isLocked={!!activeProject} />

      <main>
        <HorizontalContainer isLocked={!!activeProject}>
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
      <Analytics />
    </div>
  );
}

export default App;
