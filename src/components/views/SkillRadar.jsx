import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SkillRadar = ({ skills = [], projects = [], activeCategory = 'All', onSelectCategory }) => {
  const [hoveredAxis, setHoveredAxis] = useState(null);

  const totalProjects = Math.max(projects.length, 1);

  // Compute actual project usage dynamically per category
  const axes = useMemo(() => {
    const cats = Array.from(new Set(skills.map(s => s.category)));

    return cats.map(cat => {
      const catSkills = skills.filter(s => s.category === cat);
      const catSkillIds = new Set(catSkills.map(s => s.id));

      const matchingProjects = projects.filter(p =>
        p.skills?.some(sid => catSkillIds.has(sid))
      );

      return {
        name: cat,
        value: matchingProjects.length,
        projectCount: matchingProjects.length,
        projects: matchingProjects.map(p => p.title),
        skillsInCat: catSkills.map(s => s.name)
      };
    });
  }, [skills, projects]);

  const maxVal = totalProjects;
  const size = 360;
  const center = size / 2;
  const radius = (size / 2) - 60;

  const getCoordinates = (value, angle) => {
    // Ensure 0 value has a tiny offset for visual geometry
    const normalizedValue = Math.max(value, 0.2);
    const r = (normalizedValue / maxVal) * radius;
    const x = center + r * Math.cos(angle - Math.PI / 2);
    const y = center + r * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  // Concentric levels representing actual project counts (1 to totalProjects)
  const levels = totalProjects;
  const webPolygons = [];
  for (let i = 1; i <= levels; i++) {
    const r = (i / levels) * radius;
    const points = axes.map((_, index) => {
      const angle = (Math.PI * 2 * index) / axes.length;
      const x = center + r * Math.cos(angle - Math.PI / 2);
      const y = center + r * Math.sin(angle - Math.PI / 2);
      return `${x},${y}`;
    }).join(' ');
    webPolygons.push({ level: i, points, r });
  }

  const dataPoints = axes.map((axis, index) => {
    const angle = (Math.PI * 2 * index) / axes.length;
    const { x, y } = getCoordinates(axis.value, angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center w-full select-none">
      <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
              <stop offset="60%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.01)" />
            </radialGradient>
            <linearGradient id="activeAxisGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
            </linearGradient>
          </defs>

          {/* Grid Polygons (Levels 1 to totalProjects) */}
          {webPolygons.map(({ level, points, r }) => (
            <g key={level}>
              <polygon
                points={points}
                fill="none"
                stroke={level === levels ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"}
                strokeWidth={level === levels ? "1.5" : "1"}
                strokeDasharray={level === levels ? "none" : "2 3"}
              />
              {/* Subtle numeric level indicator on the 12 o'clock axis */}
              <text
                x={center + 5}
                y={center - r + 3}
                fill="rgba(255,255,255,0.25)"
                fontSize="8"
                fontFamily="monospace"
              >
                {level}
              </text>
            </g>
          ))}

          {/* Radial Spokes & Category Labels */}
          {axes.map((axis, index) => {
            const angle = (Math.PI * 2 * index) / axes.length;
            const { x: endX, y: endY } = getCoordinates(maxVal, angle);
            const { x: labelX, y: labelY } = getCoordinates(maxVal * 1.30, angle);

            const isHovered = hoveredAxis?.name === axis.name;
            const isActiveCategory = activeCategory === axis.name;

            return (
              <g
                key={axis.name}
                className="cursor-pointer group"
                onMouseEnter={() => setHoveredAxis(axis)}
                onMouseLeave={() => setHoveredAxis(null)}
                onClick={() => onSelectCategory && onSelectCategory(isActiveCategory ? 'All' : axis.name)}
              >
                <line
                  x1={center}
                  y1={center}
                  x2={endX}
                  y2={endY}
                  stroke={isHovered || isActiveCategory ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.08)"}
                  strokeWidth={isHovered || isActiveCategory ? "1.5" : "1"}
                  className="transition-colors duration-200"
                />

                {/* Category Name */}
                <text
                  x={labelX}
                  y={labelY - 6}
                  fill={isHovered || isActiveCategory ? "#ffffff" : "rgba(255,255,255,0.7)"}
                  fontSize="11"
                  fontWeight={isHovered || isActiveCategory ? "700" : "500"}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono uppercase tracking-wider transition-colors duration-200"
                >
                  {axis.name}
                </text>

                {/* Dynamic Real Project Metric Badge */}
                <text
                  x={labelX}
                  y={labelY + 8}
                  fill={isHovered || isActiveCategory ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.4)"}
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="transition-colors duration-200"
                >
                  {axis.value} {axis.value === 1 ? 'project' : 'projects'}
                </text>
              </g>
            );
          })}

          {/* Actual Project Data Polygon */}
          <motion.polygon
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring', damping: 18 }}
            points={dataPoints}
            fill="url(#radarGlow)"
            stroke="rgba(255, 255, 255, 0.7)"
            strokeWidth="1.8"
            style={{ transformOrigin: `${center}px ${center}px` }}
          />

          {/* Dots on Vertices with Pulse & Hover */}
          {axes.map((axis, index) => {
            const angle = (Math.PI * 2 * index) / axes.length;
            const { x, y } = getCoordinates(axis.value, angle);
            const isHovered = hoveredAxis?.name === axis.name;
            const isActiveCategory = activeCategory === axis.name;

            return (
              <g
                key={`vertex-${axis.name}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredAxis(axis)}
                onMouseLeave={() => setHoveredAxis(null)}
                onClick={() => onSelectCategory && onSelectCategory(isActiveCategory ? 'All' : axis.name)}
              >
                {/* Glow ring on hover */}
                {(isHovered || isActiveCategory) && (
                  <circle
                    cx={x}
                    cy={y}
                    r={8}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    opacity={0.6}
                  />
                )}
                <motion.circle
                  initial={{ opacity: 0, r: 0 }}
                  animate={{ opacity: 1, r: isHovered || isActiveCategory ? 4.5 : 3.5 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  cx={x}
                  cy={y}
                  fill={isHovered || isActiveCategory ? "#ffffff" : "rgba(255,255,255,0.85)"}
                />
              </g>
            );
          })}
        </svg>

        {/* Center Origin Dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/70 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)] pointer-events-none" />
      </div>

      {/* Dynamic Metric Detail / Legend Footer */}
      <div className="w-full mt-3 px-4 min-h-[44px] flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {hoveredAxis ? (
            <motion.div
              key={hoveredAxis.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="text-xs"
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="font-bold text-white uppercase tracking-wider">{hoveredAxis.name}</span>
                <span className="text-vercel-accents-5">•</span>
                <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded text-[11px]">
                  {hoveredAxis.projectCount} of {totalProjects} Projects ({Math.round((hoveredAxis.projectCount / totalProjects) * 100)}%)
                </span>
              </div>
              <p className="text-vercel-accents-4 text-[11px] truncate max-w-[340px]">
                {hoveredAxis.projects.length > 0 
                  ? `Applied in: ${hoveredAxis.projects.join(', ')}` 
                  : 'Independent explorations'}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="default-legend"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-vercel-accents-5 flex flex-col items-center gap-1"
            >
              <span className="font-mono text-[11px] tracking-wide">
                Values reflect real project deployments ({totalProjects} total projects)
              </span>
              <span className="text-[10px] text-vercel-accents-6">
                Hover or click any category axis to inspect applied codebases
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillRadar;

