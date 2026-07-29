import { motion } from 'framer-motion';
import portfolioData from '../data/portfolio.json';

const About = () => {
  const { about } = portfolioData;

  return (
    <section id="about" className="py-24 px-6 md:px-12 border-t border-vercel-accents-2 relative">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          
          <div className="w-full md:w-1/3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                {about.heading}
              </h2>
              <p className="text-vercel-accents-5">Background & Experience.</p>
            </motion.div>
          </div>

          <div className="w-full md:w-2/3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-base md:text-lg leading-relaxed font-light text-vercel-accents-6 space-y-6"
            >
              {about.paragraphs.map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
