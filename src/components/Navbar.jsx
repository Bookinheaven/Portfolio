import portfolioData from '../data/portfolio.json';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Navbar = () => {
  const { socials } = portfolioData;

  return (
    <header className="fixed top-0 w-full z-50 bg-vercel-bg/80 backdrop-blur-md border-b border-vercel-accents-2">
      <div className="container mx-auto px-6 h-16 flex justify-between items-center max-w-6xl">
        <div className="flex items-center gap-8">
          <a href="#" className="flex items-center gap-2 text-white font-bold tracking-tight text-xl">
            <span>{portfolioData.personal.initials}.</span>
          </a>

          <nav className="hidden md:flex items-center gap-6">
            {['About', 'Projects', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-sm font-medium text-vercel-accents-5 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-vercel-accents-5 hover:text-white transition-colors">
            <FaGithub size={18} />
          </a>
          <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-vercel-accents-5 hover:text-white transition-colors">
            <FaLinkedin size={18} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
