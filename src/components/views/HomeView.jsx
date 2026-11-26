import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiTwitter,
  FiArrowUpRight,
  FiArrowRight,
  FiFileText,
  FiCommand,
  FiCopy,
  FiCheck
} from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
import data from '../../data/portfolio.json';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { SmoothImage } from '@/components/ui/smooth-image';
import { cn } from '@/lib/utils';

const FOCUS_PHRASES = [
  'local AI CLI tools.',
  'scalable backends.',
  'full-stack apps.',
  'developer tools.'
];

function getISTTime() {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(new Date());
  } catch {
    return 'IST';
  }
}

const HomeView = ({ id, onOpenProject, onOpenPalette }) => {
  const { personal, socials } = data;
  const featuredProjects = data.projects.filter((p) => p.featured).slice(0, 4);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [istTime, setIstTime] = useState(getISTTime);

  useEffect(() => {
    const clockTimer = setInterval(() => setIstTime(getISTTime()), 30000);
    const phraseTimer = setInterval(
      () => setPhraseIndex((prev) => (prev + 1) % FOCUS_PHRASES.length),
      2800
    );
    return () => {
      clearInterval(clockTimer);
      clearInterval(phraseTimer);
    };
  }, []);

  const iconMap = {
    github: <FiGithub className="w-4 h-4" />,
    linkedin: <FiLinkedin className="w-4 h-4" />,
    leetcode: <SiLeetcode className="w-4 h-4" />,
    twitter: <FiTwitter className="w-4 h-4" />,
    mail: <FiMail className="w-4 h-4" />
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const leftColProjects = featuredProjects.slice(0, 2);
  const rightColProjects = featuredProjects.slice(2, 4);

  const renderShowcaseCard = (project, delay) => {
    const thumb = project.gallery?.[0]?.src;
    const metric = project.metrics?.[0]
      ? `${project.metrics[0].value} ${project.metrics[0].label}`
      : project.tags?.[0];

    return (
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.45, ease: 'easeOut' }}
        whileHover={{ y: -4, transition: { duration: 0.18 } }}
      >
        <SpotlightCard
          onClick={() => onOpenProject(project)}
          className="cursor-pointer group select-none"
        >
          <div className="aspect-[16/10] w-full overflow-hidden border-b border-border bg-surface-solid relative">
            {thumb && (
              <SmoothImage
                src={thumb}
                alt={project.title}
                loading="eager"
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover object-top group-hover:scale-[1.04]"
              />
            )}
            {project.status === 'In Development' && (
              <Badge
                variant="outline"
                className="absolute top-2.5 left-2.5 text-[10px] font-mono bg-surface-solid/90 backdrop-blur-md uppercase tracking-wider"
              >
                Active
              </Badge>
            )}
          </div>

          <div className="px-3.5 py-2.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground truncate">
                {project.title}
              </div>
              {metric && (
                <div className="text-[11px] font-mono text-muted-foreground truncate">
                  {metric}
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`${project.title} GitHub`}
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'icon-xs' }),
                    'text-muted-foreground hover:text-foreground rounded-md'
                  )}
                >
                  <FiGithub className="w-3.5 h-3.5" />
                </a>
              )}
              <FiArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </SpotlightCard>
      </motion.div>
    );
  };

  return (
    <section
      id={id}
      className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative"
    >
      <div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 pt-10 pb-24">
        <div className="max-w-[1360px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left 6 Columns: Bold Impact Typography + Fresher Credentials + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="lg:col-span-6 select-none"
          >
            <div className="flex flex-wrap items-center gap-2.5 mb-5">
              <Badge
                variant="outline"
                className="px-3 py-1 h-auto rounded-full bg-card/85 backdrop-blur-md border-border text-ink-secondary font-mono text-[11px] gap-2"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-dot opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-status-dot" />
                </span>
                <span>{personal.availability}</span>
              </Badge>
              <span className="text-[11px] font-mono text-muted-foreground">
                {istTime} IST
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-[4.25rem] font-bold tracking-tight leading-[1.06] mb-5">
              <span className="text-foreground block">Hi, I&apos;m Tanvik.</span>
              <span className="text-ink-muted block text-3xl sm:text-4xl lg:text-[2.65rem] mt-2 font-semibold leading-[1.15]">
                I engineer{' '}
                <span className="inline-block align-bottom overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={FOCUS_PHRASES[phraseIndex]}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.24 }}
                      className="text-ink-secondary inline-block"
                    >
                      {FOCUS_PHRASES[phraseIndex]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </span>
            </h1>

            <p className="text-xs sm:text-sm font-mono text-muted-foreground mb-4">
              {personal.role} · B.Tech CSE &apos;27 ({personal.education?.cgpa} CGPA)
            </p>

            <p className="text-base sm:text-lg text-ink-secondary max-w-xl mb-8 leading-relaxed select-text">
              {personal.tagline}
            </p>

            {/* Primary Recruiter CTAs */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Button
                type="button"
                size="lg"
                onClick={() => scrollToSection('projects')}
                className="rounded-lg px-5 h-10 gap-2 cursor-pointer"
              >
                <span>View Work</span>
                <FiArrowRight className="w-4 h-4" />
              </Button>

              {personal.resumes?.general && (
                <a
                  href={personal.resumes.general}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ variant: 'outline', size: 'lg' }),
                    'rounded-lg px-4 h-10 gap-2 bg-card/85'
                  )}
                >
                  <FiFileText className="w-4 h-4 text-muted-foreground" />
                  <span>Resume</span>
                  <FiArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              )}

              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleCopyEmail}
                className="rounded-lg px-3.5 h-10 gap-2 bg-card/85 font-mono text-xs cursor-pointer"
                title={personal.email}
              >
                {copiedEmail ? (
                  <FiCheck className="w-3.5 h-3.5 text-status-dot" />
                ) : (
                  <FiCopy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span>{copiedEmail ? 'Copied' : 'Email'}</span>
              </Button>

              {onOpenPalette && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onOpenPalette}
                  className="hidden sm:inline-flex rounded-lg font-mono text-xs text-muted-foreground hover:text-foreground gap-1.5 cursor-pointer"
                  title="Quick jump (Cmd/Ctrl + K)"
                >
                  <FiCommand className="w-3.5 h-3.5" />
                  <span>K</span>
                </Button>
              )}
            </div>

            {/* Social Links */}
            <div className="pt-5 border-t border-border flex flex-wrap items-center gap-5">
              {socials
                .filter((s) => iconMap[s.icon])
                .map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.platform}
                  >
                    {iconMap[social.icon]}
                    <span className="hidden sm:inline">{social.platform}</span>
                  </a>
                ))}
            </div>
          </motion.div>

          {/* Right 6 Columns: Staggered 2x2 Spotlight Visual Grid */}
          <div className="hidden lg:grid lg:col-span-6 grid-cols-2 gap-5 items-center">
            <div className="flex flex-col gap-5 translate-y-6">
              {leftColProjects.map((project, idx) =>
                renderShowcaseCard(project, 0.12 + idx * 0.08)
              )}
            </div>
            <div className="flex flex-col gap-5 -translate-y-6">
              {rightColProjects.map((project, idx) =>
                renderShowcaseCard(project, 0.24 + idx * 0.08)
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeView;
