import { motion } from 'framer-motion';
import portfolioData from '../data/portfolio.json';
import { FaGithub, FaLinkedin, FaDiscord, FaEnvelope } from 'react-icons/fa';
import { SiX, SiLeetcode } from 'react-icons/si';

const iconMap = {
  github: FaGithub,
  linkedin: FaLinkedin,
  x: SiX,
  discord: FaDiscord,
  gmail: FaEnvelope,
  leetcode: SiLeetcode
};

const Contact = () => {
  const { personal, socials } = portfolioData;

  return (
    <section id="contact" className="py-32 px-6 md:px-12 border-t border-vercel-accents-2 bg-grid relative overflow-hidden">
      <div className="absolute inset-0 bg-vercel-bg/90 pointer-events-none"></div>
      
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Ready to collaborate?
          </h2>
          <p className="text-vercel-accents-5 text-lg font-light mb-10 max-w-xl mx-auto">
            I'm {personal.availability.toLowerCase()}. Let's build something great.
          </p>
          
          <a 
            href={`mailto:${personal.email}`}
            className="inline-flex items-center justify-center px-8 py-4 edge-glow-solid font-medium text-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] mb-16"
          >
            Contact Me
          </a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {Object.entries(socials).map(([platform, url]) => {
            const Icon = iconMap[platform.toLowerCase()];
            return (
              <a 
                key={platform} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-vercel-accents-5 hover:text-white transition-colors capitalize text-sm font-medium"
              >
                {Icon && <Icon size={20} />}
                <span>{platform}</span>
              </a>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
