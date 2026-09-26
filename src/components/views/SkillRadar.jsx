import { useMemo } from 'react';
import { motion } from 'framer-motion';

const SkillRadar = ({ skills }) => {
  const categoryCounts = useMemo(() => {
    const counts = {};
    skills.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [skills]);

  const axes = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  const maxVal = Math.max(...axes.map(a => a.value), 1);
  const size = 300;
  const center = size / 2;
  const radius = (size / 2) - 40;

  const getCoordinates = (value, angle) => {
    const r = (value / maxVal) * radius;
    const x = center + r * Math.cos(angle - Math.PI / 2);
    const y = center + r * Math.sin(angle - Math.PI / 2);
    return { x, y };
  };

  const levels = 4;
  const webPolygons = [];
  for (let i = 1; i <= levels; i++) {
    const r = (i / levels) * radius;
    const points = axes.map((_, index) => {
      const angle = (Math.PI * 2 * index) / axes.length;
      const x = center + r * Math.cos(angle - Math.PI / 2);
      const y = center + r * Math.sin(angle - Math.PI / 2);
      return `${x},${y}`;
    }).join(' ');
    webPolygons.push(points);
  }

  const dataPoints = axes.map((axis, index) => {
    const angle = (Math.PI * 2 * index) / axes.length;
    const { x, y } = getCoordinates(axis.value, angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative flex items-center justify-center w-full h-[300px]">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {webPolygons.map((points, i) => (
          <polygon key={i} points={points} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}

        {axes.map((axis, index) => {
          const angle = (Math.PI * 2 * index) / axes.length;
          const { x: endX, y: endY } = getCoordinates(maxVal, angle);
          const { x: labelX, y: labelY } = getCoordinates(maxVal * 1.25, angle);

          return (
            <g key={axis.name}>
              <line x1={center} y1={center} x2={endX} y2={endY} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={labelX} y={labelY} fill="rgba(255,255,255,0.5)" fontSize="10" textAnchor="middle" dominantBaseline="middle" className="font-mono uppercase tracking-wider">
                {axis.name}
              </text>
            </g>
          );
        })}

        <motion.polygon
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: 'spring', damping: 15 }}
          points={dataPoints}
          fill="rgba(255, 255, 255, 0.05)"
          stroke="rgba(255, 255, 255, 0.5)"
          strokeWidth="1.5"
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {axes.map((axis, index) => {
          const angle = (Math.PI * 2 * index) / axes.length;
          const { x, y } = getCoordinates(axis.value, angle);
          return (
            <motion.circle
              key={`dot-${axis.name}`}
              initial={{ opacity: 0, r: 0 }}
              whileInView={{ opacity: 1, r: 3 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
              cx={x} cy={y} r={3} fill="#fff"
            />
          );
        })}
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
    </div>
  );
};

export default SkillRadar;
