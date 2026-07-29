import { motion } from 'framer-motion';
import portfolioData from '../data/portfolio.json';
import { FaJava, FaPython, FaReact, FaNodeJs, FaDocker, FaGitAlt, FaLinux, FaDatabase, FaHtml5, FaCss3Alt } from 'react-icons/fa';
import { SiJavascript, SiElectron, SiExpress, SiFastapi, SiMongodb, SiPostgresql, SiMysql, SiTailwindcss, SiKotlin } from 'react-icons/si';

const iconMap = {
  "Java": FaJava,
  "Python": FaPython,
  "JavaScript": SiJavascript,
  "Kotlin": SiKotlin,
  "HTML": FaHtml5,
  "CSS": FaCss3Alt,
  "React": FaReact,
  "Electron": SiElectron,
  "Node.js": FaNodeJs,
  "Express.js": SiExpress,
  "FastAPI": SiFastapi,
  "MongoDB": SiMongodb,
  "PostgreSQL": SiPostgresql,
  "MySQL": SiMysql,
  "SQL": FaDatabase,
  "Tailwind CSS": SiTailwindcss,
  "Java Swing": FaJava,
  "Docker": FaDocker,
  "Git": FaGitAlt,
  "Linux": FaLinux
};

const Skills = () => {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="py-24 px-6 md:px-12 border-t border-vercel-accents-2">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">Stack</h2>
          <p className="text-vercel-accents-5">Technologies I work with.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-3"
        >
          {skills.map((skill, idx) => {
            const Icon = iconMap[skill];
            return (
              <motion.div 
                key={skill}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="px-4 py-2 bg-vercel-accents-1 hover:bg-vercel-accents-2 border border-vercel-accents-2 text-sm text-vercel-accents-7 font-medium transition-all cursor-default flex items-center gap-2 rounded-md shadow-sm hover:shadow-white/5 hover:border-vercel-accents-4"
              >
                {Icon && <Icon className="text-vercel-accents-5" />}
                {skill}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
