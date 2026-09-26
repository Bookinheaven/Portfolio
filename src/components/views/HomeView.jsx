import data from '../../data/portfolio.json';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail, FiTwitter } from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';

const HomeView = ({ id, onOpenProject }) => {
  const { personal, socials } = data;

  const iconMap = {
    github: <FiGithub className="w-5 h-5" />,
    linkedin: <FiLinkedin className="w-5 h-5" />,
    leetcode: <SiLeetcode className="w-5 h-5" />,
    twitter: <FiTwitter className="w-5 h-5" />,
    mail: <FiMail className="w-5 h-5" />
  };

  const featuredProjects = data.projects.filter(p => p.featured).slice(0, 4);

  return (
    <section id={id} className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative">
      <div className="min-h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 md:py-20 lg:py-24">
        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center z-10">
          
          {/* Left Column: Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-vercel-accents-5 font-mono text-sm md:text-base mb-4 tracking-wider uppercase">
              {personal.role}
            </h2>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight">
              Hi, I'm {personal.name.split(' ')[0]}.<br/>
              <span className="text-vercel-accents-4 text-4xl md:text-6xl lg:text-7xl block mt-2">I build systems & experiences.</span>
            </h1>
            <p className="text-lg md:text-xl text-vercel-accents-5 max-w-2xl mb-10 leading-relaxed">
              {personal.tagline}
            </p>
            
            <div className="flex items-center gap-6">
              <button className="edge-glow-solid px-8 py-4 font-medium cursor-pointer rounded-lg text-lg" onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}>
                View Work
              </button>
              <div className="flex items-center gap-5 text-vercel-accents-4">
                {socials.filter(s => iconMap[s.icon]).map((social) => (
                  <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hover:scale-110 transform duration-200" aria-label={social.platform}>
                    {iconMap[social.icon]}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Featured Showcase */}
          <div className="hidden lg:grid grid-cols-2 gap-6 relative h-auto w-full items-center">
            {/* Center glow for the grid */}
            <div className="absolute inset-0 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="flex flex-col gap-6 translate-y-12">
              {featuredProjects.slice(0, 2).map((project, idx) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (idx * 0.1), duration: 0.5 }}
                  className="vercel-card p-2 rounded-2xl group cursor-pointer overflow-hidden border border-white/5 hover:border-white/20"
                  onClick={() => onOpenProject(project)}
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-black">
                    {project.heroImage && (
                      <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-mono text-vercel-accents-5 mb-1 uppercase tracking-wider">{project.status}</p>
                      <h3 className="font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">{project.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-6 -translate-y-12">
              {featuredProjects.slice(2, 4).map((project, idx) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1), duration: 0.5 }}
                  className="vercel-card p-2 rounded-2xl group cursor-pointer overflow-hidden border border-white/5 hover:border-white/20"
                  onClick={() => onOpenProject(project)}
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden relative bg-black">
                    {project.heroImage && (
                      <img src={project.heroImage} alt={project.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-mono text-vercel-accents-5 mb-1 uppercase tracking-wider">{project.status}</p>
                      <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{project.title}</h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
        
        {/* Ambient background decoration */}
        <div className="absolute right-[-10%] top-[20%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-white/5 to-transparent blur-[120px] pointer-events-none -z-10" />
      </div>
    </section>
  );
};

export default HomeView;
