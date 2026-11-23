import data from '../../data/portfolio.json';
import { FiAward, FiExternalLink, FiDownload } from 'react-icons/fi';

const CertificationsView = ({ id }) => {
  return (
    <section id={id} className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative">
      <div className="min-h-full flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="mb-12 text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Certifications</h2>
          <p className="text-vercel-accents-5 max-w-xl mx-auto md:mx-0">
            Professional certifications and continuous learning paths.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.certifications.map((cert, index) => (
            <div key={index} className="vercel-card p-6 flex flex-col h-full group">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-white group-hover:bg-white/10 transition-colors shrink-0">
                  <FiAward className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-lg group-hover:text-white transition-colors leading-tight">{cert.title}</h3>
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noopener noreferrer" className="text-vercel-accents-5 hover:text-white transition-colors shrink-0 mt-1" aria-label={`View ${cert.title} credential`}>
                        <FiExternalLink />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <span className="text-vercel-accents-4 text-sm font-medium">{cert.issuer}</span>
                <span className="text-xs font-mono text-vercel-accents-5 bg-white/5 px-2 py-1 rounded shrink-0">{cert.year}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-24 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4">
          <a
            href={data.personal.resumes?.general || data.personal.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="edge-glow-solid px-6 py-3.5 font-medium inline-flex items-center justify-center gap-2 rounded-lg hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
          >
            <FiDownload className="w-4 h-4" />
            <span>General Resume</span>
          </a>
          {data.personal.resumes?.fullstack && (
            <a
              href={data.personal.resumes.fullstack}
              target="_blank"
              rel="noopener noreferrer"
              className="edge-glow-solid px-6 py-3.5 font-medium inline-flex items-center justify-center gap-2 rounded-lg hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
            >
              <FiDownload className="w-4 h-4" />
              <span>Full-Stack Resume</span>
            </a>
          )}
          {data.personal.resumes?.ai && (
            <a
              href={data.personal.resumes.ai}
              target="_blank"
              rel="noopener noreferrer"
              className="edge-glow-solid px-6 py-3.5 font-medium inline-flex items-center justify-center gap-2 rounded-lg hover:scale-105 transition-transform duration-200 w-full sm:w-auto"
            >
              <FiDownload className="w-4 h-4" />
              <span>AI Resume</span>
            </a>
          )}
        </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsView;
