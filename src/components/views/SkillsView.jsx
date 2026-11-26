import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SiPython,
  SiJavascript,
  SiReact,
  SiElectron,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiFastapi,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiSqlite,
  SiDrizzle,
  SiOllama,
  SiGit,
  SiJsonwebtokens,
  SiIntel,
  SiOpencv
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { FiArrowUpRight, FiCpu, FiCrosshair, FiCode, FiGithub } from 'react-icons/fi';
import data from '../../data/portfolio.json';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { buttonVariants } from '@/components/ui/button';
import { SmoothImage } from '@/components/ui/smooth-image';
import SkillChart from './SkillChart';
import { cn } from '@/lib/utils';

const SKILL_ICON_MAP = {
  python: { Icon: SiPython, color: '#3776AB' },
  javascript: { Icon: SiJavascript, color: '#EAB308' },
  java: { Icon: FaJava, color: '#EA580C' },
  react: { Icon: SiReact, color: '#0EA5E9' },
  electron: { Icon: SiElectron, color: '#38BDF8' },
  tailwindcss: { Icon: SiTailwindcss, color: '#06B6D4' },
  nodejs: { Icon: SiNodedotjs, color: '#16A34A' },
  express: { Icon: SiExpress, color: 'currentColor' },
  fastapi: { Icon: SiFastapi, color: '#0D9488' },
  postgresql: { Icon: SiPostgresql, color: '#3B82F6' },
  mongodb: { Icon: SiMongodb, color: '#16A34A' },
  mysql: { Icon: SiMysql, color: '#0284C7' },
  sqlite: { Icon: SiSqlite, color: '#38BDF8' },
  drizzle: { Icon: SiDrizzle, color: '#84CC16' },
  ollama: { Icon: SiOllama, color: 'currentColor' },
  yolov8: { Icon: FiCrosshair, color: '#0EA5E9' },
  deepsort: { Icon: SiOpencv, color: '#6366F1' },
  openvino: { Icon: SiIntel, color: '#2563EB' },
  git: { Icon: SiGit, color: '#F05032' },
  jwt: { Icon: SiJsonwebtokens, color: '#EC4899' }
};

const SkillsView = ({ id, onOpenProject }) => {
  const [selectedSkillId, setSelectedSkillId] = useState(data.skills[0]?.id || 'python');
  const [rightMode, setRightMode] = useState('chart');

  const skillProjectMap = useMemo(() => {
    const map = {};
    data.skills.forEach((skill) => {
      map[skill.id] = data.projects.filter((p) => p.skills?.includes(skill.id));
    });
    return map;
  }, []);

  const domains = useMemo(() => {
    const order = ['Languages', 'Frontend', 'Backend', 'Database', 'AI / ML', 'Tools'];
    return order
      .map((category) => ({
        category,
        skills: data.skills.filter((s) => s.category === category)
      }))
      .filter((d) => d.skills.length > 0);
  }, []);

  const selectedSkill =
    data.skills.find((s) => s.id === selectedSkillId) || data.skills[0];
  const selectedProjects = skillProjectMap[selectedSkill?.id] || [];
  const SelectedIconMeta = SKILL_ICON_MAP[selectedSkill?.id] || {
    Icon: FiCode,
    color: 'currentColor'
  };
  const SelectedIcon = SelectedIconMeta.Icon;

  const handleSelectSkill = (skillId) => {
    setSelectedSkillId(skillId);
    setRightMode('proof');
  };

  const getProofSnippet = (project, skillName) => {
    const matchedDecision = project.technicalDecisions?.find(
      (td) =>
        td.technology.toLowerCase().includes(skillName.toLowerCase()) ||
        td.reasoning.toLowerCase().includes(skillName.toLowerCase())
    );
    if (matchedDecision) return matchedDecision.reasoning;
    return project.overview?.solution || project.subtitle;
  };

  return (
    <section
      id={id}
      className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative"
    >
      <div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 pt-10 pb-24">
        <div className="max-w-[1360px] w-full mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-7 select-none">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Technical Stack
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Skills & Project Proof
              </h2>
            </div>
            <p className="text-xs font-mono text-muted-foreground">
              Inspect project evidence or switch to domain skill chart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left 5 Columns: Categorized Tech Directory */}
            <div className="lg:col-span-5 divide-y divide-border border-t border-b border-border select-none">
              {domains.map((domain) => (
                <div
                  key={domain.category}
                  className="py-3 flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4"
                >
                  <div className="w-24 shrink-0 pt-1.5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    {domain.category}
                  </div>
                  <div className="flex flex-wrap gap-1.5 flex-grow">
                    {domain.skills.map((skill) => {
                      const isSelected = rightMode === 'proof' && skill.id === selectedSkill?.id;
                      const iconMeta = SKILL_ICON_MAP[skill.id] || {
                        Icon: FiCpu,
                        color: 'currentColor'
                      };
                      const IconComponent = iconMeta.Icon;

                      return (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => handleSelectSkill(skill.id)}
                          className={cn(
                            'px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all inline-flex items-center gap-1.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
                            isSelected
                              ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                              : 'bg-card/80 border-border text-ink-secondary hover:border-line-strong hover:text-foreground'
                          )}
                        >
                          <IconComponent
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: isSelected ? 'var(--primary-foreground)' : iconMeta.color }}
                          />
                          <span>{skill.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Right 7 Columns: Shadcn Card with Project Proof / Skill Chart Toggle */}
            <div className="lg:col-span-7">
              <Card className="rounded-2xl min-h-[420px]">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-border select-none">
                    {rightMode === 'proof' && selectedSkill ? (
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl border border-border bg-muted/60 flex items-center justify-center shrink-0">
                          <SelectedIcon
                            className="w-5 h-5"
                            style={{ color: SelectedIconMeta.color }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-semibold text-foreground leading-tight">
                              {selectedSkill.name}
                            </h3>
                            <Badge variant="secondary" className="font-mono text-[10px]">
                              {selectedSkill.category}
                            </Badge>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">
                            Used in {selectedProjects.length}{' '}
                            {selectedProjects.length === 1 ? 'project' : 'projects'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-xl font-semibold text-foreground leading-tight">
                          Domain Skill Chart
                        </h3>
                        <span className="text-xs font-mono text-muted-foreground">
                          Project coverage across {domains.length} engineering domains
                        </span>
                      </div>
                    )}

                    <Tabs value={rightMode} onValueChange={setRightMode} className="w-auto">
                      <TabsList>
                        <TabsTrigger value="proof">Project Proof</TabsTrigger>
                        <TabsTrigger value="chart">Skill Chart</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  <AnimatePresence mode="wait">
                    {rightMode === 'proof' && selectedSkill ? (
                      <motion.div
                        key={`proof-${selectedSkill.id}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.14 }}
                        className="space-y-3 overflow-y-auto max-h-[325px] p-1 -m-1"
                      >
                        {selectedProjects.map((project) => {
                          const thumb = project.gallery?.[0]?.src;
                          return (
                            <div
                              key={project.id}
                              className="relative rounded-xl border border-border bg-muted/35 hover:bg-muted/65 hover:border-line-strong transition-all group"
                            >
                              <button
                                type="button"
                                onClick={() => onOpenProject(project)}
                                className="w-full p-3.5 pr-16 text-left flex items-start gap-3.5 cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                              >
                                {thumb && (
                                  <SmoothImage
                                    src={thumb}
                                    alt={project.title}
                                    wrapperClassName="w-20 h-14 rounded-lg border border-border shrink-0"
                                    className="w-full h-full object-cover object-top"
                                  />
                                )}
                                <div className="min-w-0 flex-grow">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-sm font-semibold text-foreground">
                                      {project.title}
                                    </span>
                                    <span className="text-[11px] font-mono text-muted-foreground truncate">
                                      · {project.overview?.role || 'Developer'}
                                    </span>
                                  </div>

                                  <p className="text-xs text-ink-secondary line-clamp-2 mt-1 leading-relaxed">
                                    {getProofSnippet(project, selectedSkill.name)}
                                  </p>
                                </div>
                              </button>

                              <div className="absolute top-3.5 right-3.5 flex items-center gap-1">
                                {project.links?.github && (
                                  <a
                                    href={project.links.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`${project.title} source code`}
                                    className={cn(
                                      buttonVariants({ variant: 'ghost', size: 'icon-xs' }),
                                      'text-muted-foreground hover:text-foreground rounded-md'
                                    )}
                                  >
                                    <FiGithub className="w-3.5 h-3.5" />
                                  </a>
                                )}
                                <button
                                  type="button"
                                  onClick={() => onOpenProject(project)}
                                  aria-label={`Open ${project.title} case study`}
                                  className={cn(
                                    buttonVariants({ variant: 'ghost', size: 'icon-xs' }),
                                    'text-muted-foreground group-hover:text-foreground rounded-md cursor-pointer'
                                  )}
                                >
                                  <FiArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="chart"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.14 }}
                      >
                        <SkillChart
                          skills={data.skills}
                          projects={data.projects}
                          onSelectSkill={handleSelectSkill}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsView;
