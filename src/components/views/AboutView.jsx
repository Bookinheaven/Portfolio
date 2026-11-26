import { useMemo } from 'react';
import data from '../../data/portfolio.json';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const AboutView = ({ id }) => {
  const { about, personal, projects = [] } = data;

  const timelineData = useMemo(() => {
    const projectsByYear = {};
    projects.forEach((p) => {
      const year = p.period?.start;
      if (!year) return;
      if (!projectsByYear[year]) projectsByYear[year] = [];
      projectsByYear[year].push(p.title);
    });

    const milestones = about.milestones || {};
    const allYears = Array.from(
      new Set([...Object.keys(projectsByYear), ...Object.keys(milestones)])
    ).sort((a, b) => b.localeCompare(a));

    return allYears.map((year, index) => {
      const projectList = projectsByYear[year];
      const milestoneNote = milestones[year];

      let description = milestoneNote || '';
      if (projectList && projectList.length > 0) {
        const formattedNames =
          projectList.length > 1
            ? `${projectList.slice(0, -1).join(', ')} & ${projectList[projectList.length - 1]}`
            : projectList[0];
        description = milestoneNote ? `${formattedNames} — ${milestoneNote}` : formattedNames;
      }

      return {
        year,
        description,
        active: index === 0
      };
    });
  }, [about.milestones, projects]);

  return (
    <section
      id={id}
      className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative"
    >
      <div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 pt-10 pb-24">
        <div className="max-w-[1360px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Background & Education */}
          <div className="lg:col-span-5 space-y-5">
            <div className="select-none">
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Background
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                About Me
              </h2>
            </div>

            <div className="space-y-3 text-sm md:text-[15px] text-ink-secondary leading-relaxed">
              {about.story.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            {personal.education && (
              <>
                <Separator />
                <div className="flex items-start justify-between gap-4 select-none">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
                      Education
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {personal.education.institution}
                    </div>
                    <div className="text-xs text-ink-secondary mt-0.5">
                      {personal.education.degree}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-medium text-foreground">
                      CGPA {personal.education.cgpa}
                    </div>
                    <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                      {personal.education.period}
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="grid grid-cols-2 gap-6 select-none">
              <div>
                <h3 className="text-[11px] font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                  Core Focus
                </h3>
                <ul className="space-y-1">
                  {about.currentFocus.map((item, idx) => (
                    <li key={idx} className="text-xs text-ink-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[11px] font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                  Exploring
                </h3>
                <ul className="space-y-1">
                  {about.currentlyExploring.map((item, idx) => (
                    <li key={idx} className="text-xs text-ink-secondary">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Shadcn Tabs + Card Ledger (Fits comfortably inside 100vh) */}
          <div className="lg:col-span-7">
            <Card className="rounded-2xl">
              <CardContent className="p-6 lg:p-7">
                <Tabs defaultValue="experience" className="gap-5">
                  <div className="flex items-center justify-between gap-4 pb-3 border-b border-border select-none">
                    <TabsList>
                      <TabsTrigger value="experience">Experience & Hackathons</TabsTrigger>
                      <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    </TabsList>
                    <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
                      2023 — Present
                    </span>
                  </div>

                  <TabsContent value="experience" className="space-y-5">
                    {about.experience?.length > 0 && (
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 select-none">
                          Internships & Training
                        </div>
                        <div className="divide-y divide-border">
                          {about.experience.map((exp, idx) => (
                            <div key={idx} className="py-2.5 first:pt-0 last:pb-0">
                              <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <div className="text-sm font-medium text-foreground">
                                  {exp.role}{' '}
                                  <span className="text-ink-secondary font-normal">
                                    · {exp.organization}
                                  </span>
                                </div>
                                <span className="text-[11px] font-mono text-muted-foreground select-none">
                                  {exp.period}
                                </span>
                              </div>
                              <p className="text-xs text-ink-secondary mt-1 leading-relaxed">
                                {exp.summary}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {about.achievements?.length > 0 && (
                      <div className="pt-4 border-t border-border">
                        <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-2 select-none">
                          Hackathons & Leadership
                        </div>
                        <div className="divide-y divide-border">
                          {about.achievements.map((ach, idx) => (
                            <div
                              key={idx}
                              className="py-2 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-4"
                            >
                              <div className="min-w-0">
                                <span className="text-sm font-medium text-foreground">
                                  {ach.event}
                                </span>
                                <span className="text-xs text-ink-secondary block sm:inline sm:ml-2">
                                  — {ach.title}
                                </span>
                              </div>
                              <span className="text-[11px] font-mono text-muted-foreground shrink-0 select-none">
                                {ach.year}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="timeline">
                    <div className="pl-4 border-l border-border space-y-5 py-1">
                      {timelineData.map((item) => (
                        <div key={item.year} className="relative pl-4">
                          <span
                            className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border ${
                              item.active
                                ? 'bg-foreground border-foreground'
                                : 'bg-card border-muted-foreground'
                            }`}
                          />
                          <div className="text-sm font-mono font-semibold text-foreground select-none">
                            {item.year}
                          </div>
                          <div className="text-xs sm:text-sm text-ink-secondary mt-1 leading-relaxed">
                            {item.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutView;
