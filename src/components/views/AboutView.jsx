import { motion } from 'framer-motion';
import data from '../../data/portfolio.json';
import { FiTarget, FiCompass, FiCode, FiCpu, FiLayers } from 'react-icons/fi';

const AboutView = ({ id }) => {
  const { about } = data;

  const timelineData = [
    {
      year: '2026',
      badge: 'Active & Latest',
      title: 'Athena, Support & Commit',
      description: 'Architecting AI-powered developer tools, terminal natural language SQL engines, and full-stack productivity platforms.',
      active: true
    },
    {
      year: '2025',
      badge: 'Architecture',
      title: 'Systems & Deep Learning',
      description: 'Strengthening backend scalability, distributed databases, transformer architectures, and algorithms.',
      active: false
    },
    {
      year: '2024',
      badge: 'Foundations',
      title: 'ResQit, AquaTrack, InsightEX',
      description: 'Built computer vision analytics, disaster management systems, and desktop productivity software.',
      active: false
    }
  ];

  const highlights = [
    { icon: <FiCode className="w-4 h-4 text-cyan-400" />, label: '6+ Projects', sub: 'Open-source & production' },
    { icon: <FiCpu className="w-4 h-4 text-purple-400" />, label: 'AI & Systems', sub: 'LLMs, SQLGlot, CV' },
    { icon: <FiLayers className="w-4 h-4 text-emerald-400" />, label: 'Full-Stack', sub: 'React, Node, Python, SQL' },
  ];

  return (
    <section id={id} className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative">
      <div className="min-h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 md:py-24">
        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Story & Focus (Left Column - 6 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono uppercase tracking-widest text-vercel-accents-5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 select-none">
                Biography
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">About Me</h2>

            {/* Highlights Bar */}
            <div className="grid grid-cols-3 gap-3 mb-8 select-none">
              {highlights.map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1), duration: 0.4 }}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="mb-2 p-1.5 rounded-lg bg-white/5 w-fit border border-white/5">
                    {h.icon}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{h.label}</div>
                    <div className="text-[11px] text-vercel-accents-5 leading-tight">{h.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Story Paragraphs */}
            <div className="space-y-4 text-base md:text-lg text-vercel-accents-4 leading-relaxed mb-8">
              {about.story.map((paragraph, idx) => (
                <p key={idx} className={idx === 0 ? "text-white/90 font-normal leading-relaxed" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Current Focus & Exploring Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-3 uppercase tracking-wider">
                  <FiTarget className="w-3.5 h-3.5" />
                  <span>Current Focus</span>
                </div>
                <ul className="space-y-1.5">
                  {about.currentFocus.map((item, idx) => (
                    <li key={idx} className="flex items-center text-vercel-accents-4 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 mr-2.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-3 uppercase tracking-wider">
                  <FiCompass className="w-3.5 h-3.5" />
                  <span>Currently Exploring</span>
                </div>
                <ul className="space-y-1.5">
                  {about.currentlyExploring.map((item, idx) => (
                    <li key={idx} className="flex items-center text-vercel-accents-4 text-xs font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400/80 mr-2.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Timeline Side (Right Column - 6 Cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative w-full h-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-white/[0.02] blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 w-full vercel-card p-6 md:p-8 lg:p-10 border border-white/10 bg-black/60 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 select-none">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-white">Engineering Timeline</h3>
                  <p className="text-xs text-vercel-accents-5">Evolution of systems, tools & projects</p>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-vercel-accents-4">
                  2024 - 2026
                </span>
              </div>

              <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-cyan-400 before:via-white/20 before:to-transparent">
                {timelineData.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (index * 0.15), duration: 0.5 }}
                    className="relative group select-none"
                  >
                    {/* Timeline Node */}
                    <div className="absolute -left-[31px] top-1 flex items-center justify-center">
                      {item.active && (
                        <span className="absolute w-5 h-5 rounded-full bg-cyan-400/30 animate-ping" />
                      )}
                      <div className={`w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 ${item.active
                        ? 'border-cyan-400 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] scale-110'
                        : 'border-white/30 bg-black group-hover:border-white group-hover:bg-white/40'
                        }`} />
                    </div>

                    {/* Timeline Card */}
                    <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all duration-300 group-hover:translate-x-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xl font-black font-mono tracking-tight ${item.active ? 'text-white' : 'text-vercel-accents-4 group-hover:text-white'
                          }`}>
                          {item.year}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${item.active
                          ? 'bg-cyan-400/10 text-cyan-300 border border-cyan-400/30'
                          : 'bg-white/5 text-vercel-accents-5 border border-white/5'
                          }`}>
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white/90 mb-1">{item.title}</h4>
                      <p className="text-xs text-vercel-accents-5 leading-relaxed">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AboutView;
