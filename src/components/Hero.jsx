import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import portfolioData from '../data/portfolio.json';

const Hero = () => {
  const { personal } = portfolioData;

  return (
    <section id="home" className="min-h-[90vh] flex flex-col justify-center items-center text-center px-6 relative overflow-hidden">
      {/* Subtle Grid Background and Ambient Glow */}
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none"></div>
      <div className="ambient-glow"></div>
      
      <div className="container mx-auto z-10 max-w-4xl flex flex-col items-center pt-20">
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          {personal.availability && (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-vercel-accents-1 border border-vercel-accents-2 rounded-full text-xs font-mono text-vercel-accents-5 uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              {personal.availability}
            </span>
          )}
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
        >
          {personal.name}. <br/>
          <span className="text-gradient-accent">{personal.role1} {personal.role2}.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="text-vercel-accents-5 text-lg max-w-2xl font-light mb-10 leading-relaxed"
        >
          {personal.tagline}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a 
            href="#projects" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3 edge-glow-solid font-medium text-sm transition-all"
          >
            View Projects
          </a>
          <a 
            href={personal.resumeUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 edge-glow text-vercel-accents-5 hover:text-white font-medium text-sm transition-all"
          >
            Resume <Download size={16} />
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
