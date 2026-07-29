import portfolioData from '../data/portfolio.json';

const Footer = () => {
  const { personal } = portfolioData;

  return (
    <footer className="py-8 px-6 border-t border-vercel-accents-2 bg-vercel-bg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm font-light text-vercel-accents-5 max-w-6xl">
        <div className="flex items-center gap-2">
          &copy; {new Date().getFullYear()} {personal.name}.
        </div>
        
        <div>
          Based in {personal.location}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
