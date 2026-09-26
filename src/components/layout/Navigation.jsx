import { motion } from 'framer-motion';

const Navigation = ({ sections, activeIndex }) => {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 bg-black/50 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
        {sections.map((section, index) => (
          <div key={section.id} className="flex items-center group cursor-pointer shrink-0" onClick={() => {
            const el = document.getElementById(section.id);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}>
            <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
              {/* The dot */}
              <div className={`w-2 h-2 rounded-full transition-all duration-300 shrink-0 ${index === activeIndex ? 'bg-white scale-125' : 'bg-white/30 group-hover:bg-white/60'}`} />
              
              {/* Label (visible on hover or active) */}
              <div className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono transition-opacity duration-200 whitespace-nowrap ${index === activeIndex ? 'opacity-100 text-white' : 'opacity-0 group-hover:opacity-100 text-white/70'}`}>
                {section.name}
              </div>
            </div>

            {/* Connecting line */}
            {index < sections.length - 1 && (
              <div className="w-8 h-[1px] bg-white/10 mx-2 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
