import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import HorizontalContainer from './components/layout/HorizontalContainer';
import Navigation from './components/layout/Navigation';
import CommandPalette from './components/layout/CommandPalette';
import { StudioBackground } from './components/ui/dot-pattern';
import { CursorSpotlight } from './components/ui/cursor-spotlight';
import HomeView from './components/views/HomeView';
import ProjectsView from './components/views/ProjectsView';
import SkillsView from './components/views/SkillsView';
import AboutView from './components/views/AboutView';
import CertificationsView from './components/views/CertificationsView';
import ProjectCaseStudy from './components/project/ProjectCaseStudy';
import { syncSession } from './lib/session';
import data from './data/portfolio.json';

const SECTIONS = [
  { id: 'home', name: 'Home' },
  { id: 'projects', name: 'Projects' },
  { id: 'skills', name: 'Skills' },
  { id: 'about', name: 'About' },
  { id: 'certifications', name: 'Certifications' }
];

function getInitialProject() {
  if (typeof window === 'undefined') return null;
  const projectId = new URLSearchParams(window.location.search).get('project');
  if (!projectId) return null;
  return data.projects.find((p) => p.id === projectId) || null;
}

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
  } catch {
    return 'dark';
  }
  return 'dark';
}

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeProject, setActiveProject] = useState(getInitialProject);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('portfolio-theme', next);
      } catch {
        // Ignore storage restrictions
      }
      return next;
    });
  }, []);

  // Sync theme class onto <html> and update browser theme-color
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#000000' : '#f7f7f5');
    }
  }, [theme]);

  // Listen to OS theme preference when user has not explicitly overridden
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      try {
        if (!localStorage.getItem('portfolio-theme')) {
          setTheme(e.matches ? 'dark' : 'light');
        }
      } catch {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const openProject = useCallback((project) => {
    setActiveProject(project);
    if (typeof window !== 'undefined' && project?.id) {
      const url = new URL(window.location.href);
      if (url.searchParams.get('project') !== project.id) {
        url.searchParams.set('project', project.id);
        window.history.pushState({ projectId: project.id }, '', url);
      }
    }
  }, []);

  const closeProject = useCallback(() => {
    setActiveProject(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('project')) {
        url.searchParams.delete('project');
        window.history.replaceState(null, '', url);
      }
    }
  }, []);

  const navigateToSection = useCallback((sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Sync initial session and deep-link section hash on mount
  useEffect(() => {
    syncSession({ section: 'home' });
    const hash = window.location.hash.replace('#', '');
    if (hash && SECTIONS.some((s) => s.id === hash)) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'auto' });
    }
  }, []);

  // Handle browser back/forward for ?project=<id>
  useEffect(() => {
    const handlePopState = () => {
      const projectId = new URLSearchParams(window.location.search).get('project');
      const matched = projectId ? data.projects.find((p) => p.id === projectId) || null : null;
      setActiveProject(matched);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Global Cmd+K / Ctrl+K command palette shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
      { threshold: 0.5 }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const isOverlayOpen = !!activeProject || isPaletteOpen;

  return (
    <div className="bg-canvas text-ink selection:bg-line-strong selection:text-ink h-screen w-screen overflow-hidden font-sans relative">
      <StudioBackground />
      <CursorSpotlight />

      {/* Single Unified Bottom Dock */}
      <Navigation
        sections={SECTIONS}
        activeIndex={activeIndex}
        isLocked={isOverlayOpen}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenPalette={() => setIsPaletteOpen(true)}
      />

      <main
        className={`relative z-10 transition-opacity duration-200 ${
          activeProject ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <HorizontalContainer isLocked={isOverlayOpen}>
          <HomeView id="home" onOpenProject={openProject} onOpenPalette={() => setIsPaletteOpen(true)} />
          <ProjectsView id="projects" onOpenProject={openProject} />
          <SkillsView id="skills" onOpenProject={openProject} />
          <AboutView id="about" />
          <CertificationsView id="certifications" />
        </HorizontalContainer>
      </main>

      <AnimatePresence>
        {activeProject && (
          <ProjectCaseStudy
            key={activeProject.id}
            project={activeProject}
            onClose={closeProject}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPaletteOpen && (
          <CommandPalette
            sections={SECTIONS}
            theme={theme}
            onToggleTheme={toggleTheme}
            onClose={() => setIsPaletteOpen(false)}
            onNavigateSection={navigateToSection}
            onOpenProject={openProject}
          />
        )}
      </AnimatePresence>

      <Analytics />
    </div>
  );
}

export default App;
