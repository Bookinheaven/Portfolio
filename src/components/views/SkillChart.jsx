import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DOMAIN_ORDER = ['Languages', 'Frontend', 'Backend', 'Database', 'AI / ML', 'Tools'];

const SkillChart = ({ skills = [], projects = [], onSelectSkill }) => {
  const [hoveredName, setHoveredName] = useState(null);

  const axes = useMemo(() => {
    return DOMAIN_ORDER.map((category) => {
      const catSkills = skills.filter((s) => s.category === category);
      const catSkillIds = new Set(catSkills.map((s) => s.id));
      const matchingProjects = projects.filter((p) =>
        p.skills?.some((sid) => catSkillIds.has(sid))
      );
      return {
        name: category,
        projectCount: matchingProjects.length,
        skillCount: catSkills.length,
        projects: matchingProjects,
        skills: catSkills
      };
    }).filter((a) => a.skills.length > 0);
  }, [skills, projects]);

  const activeAxis = axes.find((a) => a.name === hoveredName) || axes[0];

  const maxProjects = Math.max(projects.length, 1);
  const size = 310;
  const center = size / 2;
  const radius = size / 2 - 54;
  const levels = Math.min(maxProjects, 6);

  const getCoordinates = (value, angle) => {
    const normalized = Math.max(value, 0.35);
    const r = (normalized / maxProjects) * radius;
    return {
      x: center + r * Math.cos(angle - Math.PI / 2),
      y: center + r * Math.sin(angle - Math.PI / 2)
    };
  };

  const webPolygons = Array.from({ length: levels }, (_, idx) => {
    const level = idx + 1;
    const r = (level / levels) * radius;
    const points = axes
      .map((_, i) => {
        const angle = (Math.PI * 2 * i) / axes.length;
        const x = center + r * Math.cos(angle - Math.PI / 2);
        const y = center + r * Math.sin(angle - Math.PI / 2);
        return `${x},${y}`;
      })
      .join(' ');
    return { level, points };
  });

  const dataPoints = axes
    .map((axis, i) => {
      const angle = (Math.PI * 2 * i) / axes.length;
      const { x, y } = getCoordinates(axis.projectCount, angle);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center py-1">
      {/* Interactive SVG Radar */}
      <div className="md:col-span-7 flex items-center justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[300px] aspect-square overflow-visible select-none"
        >
          <defs>
            <radialGradient id="skillChartFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--ink)" stopOpacity="0.04" />
            </radialGradient>
          </defs>

          {/* Concentric Hexagons */}
          {webPolygons.map(({ level, points }) => (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke="var(--line)"
              strokeWidth={level === levels ? '1.2' : '0.8'}
              strokeDasharray={level === levels ? undefined : '2 3'}
            />
          ))}

          {/* Spokes & Labels */}
          {axes.map((axis, i) => {
            const angle = (Math.PI * 2 * i) / axes.length;
            const { x: endX, y: endY } = getCoordinates(maxProjects, angle);
            const { x: labelX, y: labelY } = getCoordinates(maxProjects * 1.32, angle);
            const isActive = activeAxis?.name === axis.name;

            return (
              <g
                key={axis.name}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredName(axis.name)}
                onClick={() => setHoveredName(axis.name)}
              >
                <line
                  x1={center}
                  y1={center}
                  x2={endX}
                  y2={endY}
                  stroke={isActive ? 'var(--line-strong)' : 'var(--line)'}
                  strokeWidth={isActive ? '1.4' : '1'}
                />
                <text
                  x={labelX}
                  y={labelY - 5}
                  fill={isActive ? 'var(--ink)' : 'var(--ink-secondary)'}
                  fontSize="10"
                  fontWeight={isActive ? '600' : '500'}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono uppercase tracking-wider"
                >
                  {axis.name}
                </text>
                <text
                  x={labelX}
                  y={labelY + 8}
                  fill="var(--ink-muted)"
                  fontSize="8.5"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono"
                >
                  {axis.projectCount} {axis.projectCount === 1 ? 'proj' : 'projs'}
                </text>
              </g>
            );
          })}

          {/* Data Area */}
          <motion.polygon
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, type: 'spring', damping: 20 }}
            points={dataPoints}
            fill="url(#skillChartFill)"
            stroke="var(--ink)"
            strokeOpacity="0.75"
            strokeWidth="1.6"
            style={{ transformOrigin: `${center}px ${center}px` }}
          />

          {/* Interactive Vertices */}
          {axes.map((axis, i) => {
            const angle = (Math.PI * 2 * i) / axes.length;
            const { x, y } = getCoordinates(axis.projectCount, angle);
            const isActive = activeAxis?.name === axis.name;

            return (
              <g
                key={`dot-${axis.name}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredName(axis.name)}
                onClick={() => setHoveredName(axis.name)}
              >
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r={7}
                    fill="none"
                    stroke="var(--ink)"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 4 : 3}
                  fill="var(--ink)"
                  stroke="var(--surface-solid)"
                  strokeWidth="1.2"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Domain Inspector Panel */}
      {activeAxis && (
        <div className="md:col-span-5 space-y-4 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-5 select-none">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1">
              Domain Breakdown
            </div>
            <h4 className="text-lg font-semibold text-foreground">{activeAxis.name}</h4>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">
              {activeAxis.skills.length} tools · {activeAxis.projectCount} projects
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Inspect Technology
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeAxis.skills.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => onSelectSkill && onSelectSkill(skill.id)}
                  className={cn(
                    'px-2.5 py-1 rounded-md border border-border bg-muted/50 hover:bg-primary hover:text-primary-foreground hover:border-primary text-xs font-medium text-ink-secondary transition-colors cursor-pointer'
                  )}
                >
                  {skill.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
              Projects
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeAxis.projects.map((p) => (
                <Badge key={p.id} variant="outline" className="font-mono text-[11px] rounded-md">
                  {p.title}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillChart;
