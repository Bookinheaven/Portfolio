import { motion } from 'framer-motion';
import data from '../../data/portfolio.json';

const AboutView = ({ id }) => {
  const { about } = data;

  const timelineData = [
    { year: '2026', description: 'Athena, AI-Powered Productivity', active: true },
    { year: '2025', description: 'Deepening Backend & AI/ML', active: false },
    { year: '2024', description: 'ResQit, AquaTrack, InsightEX', active: false }
  ];

  return (
    <section id={id} className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative">
      <div className="min-h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24">
        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Story Side */}
        <div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-8">About Me</h2>
          
          <div className="space-y-6 text-lg text-vercel-accents-4 leading-relaxed mb-12">
            {about.story.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-mono text-white mb-4 uppercase tracking-wider">Current Focus</h3>
              <ul className="space-y-2">
                {about.currentFocus.map((item, idx) => (
                  <li key={idx} className="flex items-center text-vercel-accents-5 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-mono text-white mb-4 uppercase tracking-wider">Currently Exploring</h3>
              <ul className="space-y-2">
                {about.currentlyExploring.map((item, idx) => (
                  <li key={idx} className="flex items-center text-vercel-accents-5 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Timeline / Visual Side */}
        <div className="relative w-full h-full min-h-[60vh] flex items-center justify-center py-12">
          <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
          
          <div className="relative z-10 w-full vercel-card p-8 lg:p-12">
            <h3 className="text-xl font-bold mb-6">Engineering Timeline</h3>
            
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-2.5 md:before:ml-auto md:before:mr-auto before:-translate-x-px md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
              
              {timelineData.map((item, index) => (
                <motion.div 
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className={`relative flex items-center justify-between md:justify-normal group ${index % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}
                >
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 z-10 absolute left-0 md:left-1/2 -translate-x-1/2 transition-all duration-300 ${item.active ? 'border-white bg-black shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-110' : 'border-white/20 bg-black group-hover:border-white/60 group-hover:scale-110'}`}>
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${item.active ? 'bg-white' : 'bg-transparent group-hover:bg-white/50'}`} />
                  </div>
                  
                  <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-3rem)] pl-10 md:pl-0 ${index % 2 === 0 ? 'md:pr-12 text-left md:text-right' : 'md:pl-12 text-left'}`}>
                    <motion.div 
                      whileHover={{ x: index % 2 === 0 ? -5 : 5 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors backdrop-blur-sm"
                    >
                      <div className={`text-2xl font-black mb-1 transition-colors duration-300 ${item.active ? 'text-white' : 'text-vercel-accents-4 group-hover:text-white'}`}>{item.year}</div>
                      <div className="text-sm font-medium text-vercel-accents-5">{item.description}</div>
                    </motion.div>
                  </div>
                </motion.div>
              ))}

            </div>
          </div>
        </div>

        </div>
      </div>
    </section>
  );
};

export default AboutView;
