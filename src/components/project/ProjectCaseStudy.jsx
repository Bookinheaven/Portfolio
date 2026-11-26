import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiX, FiGithub, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import data from '../../data/portfolio.json';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SmoothImage } from '@/components/ui/smooth-image';
import { cn } from '@/lib/utils';

const ProjectCaseStudy = ({ project, onClose }) => {
  const overlayRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = project.gallery || [];

  useEffect(() => {
    const el = overlayRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      e.stopPropagation();
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (images.length > 1 && e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      } else if (images.length > 1 && e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, images.length]);

  return (
    <motion.div
      ref={overlayRef}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="fixed inset-0 z-[100] bg-transparent overflow-y-auto"
    >
      <div className="sticky top-0 z-50 bg-dock-bg backdrop-blur-md border-b border-border select-none">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground truncate">
            <span>Selected Work</span>
            <span>/</span>
            <span className="text-foreground">{project.title}</span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'rounded-md gap-1.5')}
              >
                <FiGithub className="w-3.5 h-3.5" />
                <span>Source</span>
              </a>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              aria-label="Close case study"
              className="rounded-md font-mono text-xs gap-1.5 cursor-pointer"
            >
              <span className="hidden sm:inline">ESC</span>
              <FiX className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-10">
          <p className="text-muted-foreground font-mono text-xs mb-3 tracking-wider uppercase select-none">
            {project.period.start}
            {project.period.start !== project.period.end ? ` – ${project.period.end}` : ''} · {project.status}
          </p>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-4">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-ink-secondary max-w-3xl leading-relaxed mb-6">
            {project.subtitle}
          </p>

          {project.links && (
            <div className="flex flex-wrap gap-3">
              {Object.entries(project.links).map(([type, url]) => {
                if (!url) return null;
                return (
                  <a
                    key={type}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'rounded-lg gap-2 capitalize')}
                  >
                    {type === 'github' ? <FiGithub className="w-3.5 h-3.5" /> : <FiExternalLink className="w-3.5 h-3.5" />}
                    <span>{type === 'github' ? 'View on GitHub' : `Visit ${type}`}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {images.length > 0 && (
          <Card className="mb-12 rounded-2xl overflow-hidden shadow-sm">
            <div className="relative w-full aspect-[16/9] group">
              <SmoothImage
                key={images[currentImageIndex].src}
                src={images[currentImageIndex].src}
                alt={images[currentImageIndex].title || project.title}
                loading="eager"
                wrapperClassName="w-full h-full"
                className="w-full h-full object-cover object-top"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    aria-label="Previous screenshot"
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-950/85 hover:bg-zinc-900 text-white border border-white/25 hover:border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.55)] backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-10 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                    aria-label="Next screenshot"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-950/85 hover:bg-zinc-900 text-white border border-white/25 hover:border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.55)] backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-10 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-3.5 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card/60">
              <div className="min-w-0">
                {images[currentImageIndex].title && (
                  <div className="text-xs font-semibold text-foreground">
                    {images[currentImageIndex].title}
                  </div>
                )}
                {images[currentImageIndex].description && (
                  <p className="text-xs text-ink-secondary mt-0.5 leading-relaxed">
                    {images[currentImageIndex].description}
                  </p>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      aria-label={`View screenshot ${i + 1}: ${img.title || project.title}`}
                      className={cn(
                        'h-1.5 rounded-full transition-all cursor-pointer',
                        i === currentImageIndex ? 'w-5 bg-foreground' : 'w-1.5 bg-line-strong hover:bg-ink-secondary'
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}

        {project.metrics && project.metrics.length > 0 && (
          <Card className="grid grid-cols-2 md:grid-cols-4 rounded-2xl divide-y md:divide-y-0 md:divide-x divide-border mb-14 overflow-hidden select-none">
            {project.metrics.map((metric, i) => (
              <div key={i} className="p-5">
                <div className="text-lg md:text-xl font-semibold text-foreground mb-1">{metric.value}</div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </div>
              </div>
            ))}
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          <div className="md:col-span-2 space-y-6">
            {project.overview?.problem && (
              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 select-none">
                  Problem
                </h2>
                <p className="text-sm md:text-base text-ink-secondary leading-relaxed">
                  {project.overview.problem}
                </p>
              </div>
            )}
            {project.overview?.solution && (
              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2 select-none">
                  Solution
                </h2>
                <p className="text-sm md:text-base text-ink-secondary leading-relaxed">
                  {project.overview.solution}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6 select-none">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Role</h2>
              <p className="text-sm font-medium text-foreground">{project.overview?.role || 'Developer'}</p>
            </div>
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2.5">
                Technologies
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {project.skills?.map((skillId) => {
                  const skill = data.skills.find((s) => s.id === skillId);
                  return skill ? (
                    <Badge key={skillId} variant="secondary" className="font-mono text-xs rounded-md h-auto py-1">
                      {skill.name}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>

        <Separator className="mb-14" />

        {Array.isArray(project.architecture) && project.architecture.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6 select-none">
              System Architecture
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {project.architecture.map((node, i) => (
                <Card key={i} className="rounded-xl p-5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground block mb-2 select-none">
                    {String(i + 1).padStart(2, '0')} · {node.layer}
                  </span>
                  <p className="text-sm text-ink-secondary leading-relaxed">{node.detail}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {project.features && project.features.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6 select-none">
              Key Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.features.map((feature, i) => (
                <Card key={i} className="rounded-xl p-5">
                  <h3 className="text-base font-medium text-foreground mb-1.5">{feature.name}</h3>
                  <p className="text-ink-secondary text-sm leading-relaxed">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {project.technicalDecisions && project.technicalDecisions.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6 select-none">
              Engineering Tradeoffs & Decisions
            </h2>
            <div className="divide-y divide-border border-t border-b border-border">
              {project.technicalDecisions.map((decision, i) => (
                <div key={i} className="py-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-base font-medium text-foreground">{decision.decision}</h3>
                    <p className="text-xs font-mono text-muted-foreground mt-1">{decision.technology}</p>
                  </div>
                  <p className="md:col-span-2 text-sm text-ink-secondary leading-relaxed">
                    {decision.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.challenges && project.challenges.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-6 select-none">
              Challenges & Solutions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.challenges.map((item, i) => (
                <Card key={i} className="rounded-xl p-5 space-y-3">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground select-none">
                      Challenge
                    </span>
                    <h3 className="text-sm font-medium text-foreground mt-1">{item.challenge}</h3>
                  </div>
                  <Separator />
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground select-none">
                      Resolution
                    </span>
                    <p className="text-sm text-ink-secondary mt-1 leading-relaxed">{item.solution}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectCaseStudy;
