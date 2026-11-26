import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FiSearch,
  FiCompass,
  FiFolder,
  FiFileText,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiSun,
  FiMoon,
  FiX
} from 'react-icons/fi';
import data from '../../data/portfolio.json';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const CommandPalette = ({
  sections,
  theme = 'dark',
  onToggleTheme,
  onClose,
  onNavigateSection,
  onOpenProject
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const listRef = useRef(null);

  const items = useMemo(() => {
    const all = [];

    sections.forEach((sec) => {
      all.push({
        id: `sec-${sec.id}`,
        group: 'Navigate',
        label: sec.name,
        hint: 'Section',
        icon: 'section',
        keywords: `${sec.name} ${sec.id} section jump`,
        action: () => {
          onNavigateSection(sec.id);
          onClose();
        }
      });
    });

    data.projects.forEach((project) => {
      all.push({
        id: `proj-${project.id}`,
        group: 'Projects',
        label: project.title,
        hint: project.subtitle,
        icon: 'project',
        keywords: `${project.title} ${project.subtitle} ${(project.tags || []).join(' ')} ${(project.skills || []).join(' ')}`,
        action: () => {
          onOpenProject(project);
          onClose();
        }
      });
    });

    const resumes = [
      { key: 'general', label: 'General Software Engineer Resume', url: data.personal.resumes?.general },
      { key: 'fullstack', label: 'Full-Stack Developer Resume', url: data.personal.resumes?.fullstack },
      { key: 'ai', label: 'AI / ML Engineering Resume', url: data.personal.resumes?.ai }
    ].filter((r) => r.url);

    resumes.forEach((r) => {
      all.push({
        id: `resume-${r.key}`,
        group: 'Resumes',
        label: r.label,
        hint: 'PDF',
        icon: 'resume',
        keywords: `resume cv pdf download ${r.label} ${r.key}`,
        action: () => {
          window.open(r.url, '_blank', 'noopener,noreferrer');
          onClose();
        }
      });
    });

    if (onToggleTheme) {
      all.push({
        id: 'action-toggle-theme',
        group: 'Preferences',
        label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        hint: 'Theme',
        icon: 'theme',
        keywords: 'theme dark light appearance mode toggle',
        action: () => {
          onToggleTheme();
          onClose();
        }
      });
    }

    all.push({
      id: 'action-copy-email',
      group: 'Connect',
      label: copiedEmail ? `Copied ${data.personal.email}` : `Copy Email (${data.personal.email})`,
      hint: 'Clipboard',
      icon: copiedEmail ? 'check' : 'copy',
      keywords: `email contact mail copy ${data.personal.email}`,
      action: () => {
        navigator.clipboard?.writeText(data.personal.email);
        setCopiedEmail(true);
        setTimeout(() => onClose(), 650);
      }
    });

    data.socials
      .filter((s) => s.platform !== 'Email')
      .forEach((social) => {
        all.push({
          id: `social-${social.platform}`,
          group: 'Connect',
          label: `Open ${social.platform}`,
          hint: social.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0],
          icon: 'link',
          keywords: `${social.platform} social link profile`,
          action: () => {
            window.open(social.url, '_blank', 'noopener,noreferrer');
            onClose();
          }
        });
      });

    return all;
  }, [sections, theme, onToggleTheme, onClose, onNavigateSection, onOpenProject, copiedEmail]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q) ||
        item.keywords.toLowerCase().includes(q)
    );
  }, [items, query]);

  const activeIndex = Math.min(selectedIndex, Math.max(0, filteredItems.length - 1));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filteredItems.length ? (prev + 1) % filteredItems.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filteredItems.length ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
        );
      } else if (e.key === 'Enter' && filteredItems[activeIndex]) {
        e.preventDefault();
        filteredItems[activeIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, activeIndex, onClose]);

  useEffect(() => {
    const activeEl = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const renderIcon = (type) => {
    switch (type) {
      case 'section':
        return <FiCompass className="w-4 h-4 text-muted-foreground shrink-0" />;
      case 'project':
        return <FiFolder className="w-4 h-4 text-foreground shrink-0" />;
      case 'resume':
        return <FiFileText className="w-4 h-4 text-muted-foreground shrink-0" />;
      case 'theme':
        return theme === 'dark' ? (
          <FiSun className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <FiMoon className="w-4 h-4 text-muted-foreground shrink-0" />
        );
      case 'copy':
        return <FiCopy className="w-4 h-4 text-muted-foreground shrink-0" />;
      case 'check':
        return <FiCheck className="w-4 h-4 text-status-dot shrink-0" />;
      default:
        return <FiExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />;
    }
  };

  let lastGroup = null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.14 }}
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: -8 }}
        transition={{ duration: 0.16, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl"
      >
        <Card className="bg-surface-solid rounded-2xl shadow-2xl overflow-hidden select-none">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
            <FiSearch className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Jump to a project, section, resume, or preference..."
              aria-label="Command palette search"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={onClose}
              aria-label="Close command palette"
              className="rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <FiX className="w-4 h-4" />
            </Button>
          </div>

          <div ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <div className="py-10 text-center text-sm text-muted-foreground">
                No matching commands found.
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const showGroup = item.group !== lastGroup;
                lastGroup = item.group;
                const isSelected = idx === activeIndex;

                return (
                  <div key={item.id}>
                    {showGroup && (
                      <div className="px-3 pt-2.5 pb-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {item.group}
                      </div>
                    )}
                    <button
                      type="button"
                      data-index={idx}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={item.action}
                      className={cn(
                        'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer outline-none',
                        isSelected ? 'bg-surface-hover text-foreground' : 'text-ink-secondary hover:bg-surface-muted'
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {renderIcon(item.icon)}
                        <span className="text-sm font-medium truncate">{item.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground truncate max-w-[180px] shrink-0">
                        {item.hint}
                      </span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between px-4 py-2.5 border-t border-border bg-muted/40 text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
            </div>
            <span>esc close</span>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CommandPalette;
