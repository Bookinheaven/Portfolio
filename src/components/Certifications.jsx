import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import portfolioData from '../data/portfolio.json';

const Certifications = () => {
  const { certifications } = portfolioData;

  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-24 px-6 md:px-12 border-t border-vercel-accents-2 relative">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
            Certifications
          </h2>
          <p className="text-vercel-accents-5">Professional credentials.</p>
        </motion.div>

        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <motion.a 
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              key={cert.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group vercel-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-vercel-accents-1 transition-colors block"
            >
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-vercel-accents-7 transition-colors mb-1">
                  {cert.title}
                </h3>
                <p className="text-vercel-accents-5 text-sm">{cert.issuer}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center gap-4 text-vercel-accents-4">
                <span className="font-mono text-sm">{cert.year}</span>
                <ExternalLink size={16} className="group-hover:text-white transition-colors" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
