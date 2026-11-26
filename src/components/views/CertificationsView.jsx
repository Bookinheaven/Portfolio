import { useState } from 'react';
import { FiExternalLink, FiArrowUpRight, FiCopy, FiCheck, FiMail } from 'react-icons/fi';
import data from '../../data/portfolio.json';
import { Card } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const RESUME_ITEMS = [
  {
    key: 'general',
    label: 'General SWE',
    focus: 'Systems, Java & Python',
    url: data.personal.resumes?.general
  },
  {
    key: 'fullstack',
    label: 'Full-Stack',
    focus: 'React, Express & Postgres',
    url: data.personal.resumes?.fullstack
  },
  {
    key: 'ai',
    label: 'AI / ML',
    focus: 'Local LLMs & Computer Vision',
    url: data.personal.resumes?.ai
  }
].filter((item) => Boolean(item.url));

const CertificationsView = ({ id }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(data.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section
      id={id}
      className="w-screen shrink-0 h-screen snap-start overflow-y-auto overflow-x-hidden hide-scrollbar relative"
    >
      <div className="min-h-full flex flex-col justify-center px-6 sm:px-10 md:px-16 lg:px-24 pt-10 pb-24">
        <div className="max-w-[1360px] mx-auto w-full space-y-7">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 select-none">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                Credentials & Resumes
              </p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                Certifications & CV
              </h2>
            </div>
            <p className="text-xs font-mono text-ink-secondary">
              {data.personal.availability}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.certifications.map((cert, index) => (
              <Card key={index} className="rounded-xl p-5 justify-between hover:border-line-strong select-none">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    {cert.issuer}
                  </span>
                  <div className="flex items-center gap-2">
                    {cert.year && (
                      <span className="text-[11px] font-mono text-muted-foreground">{cert.year}</span>
                    )}
                    {cert.link && (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={`View ${cert.title} credential`}
                      >
                        <FiExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                <h3 className="text-sm sm:text-base font-medium text-foreground leading-snug">
                  {cert.title}
                </h3>
              </Card>
            ))}
          </div>

          {/* Role-Tailored Resumes Strip (Uniform Cards) */}
          <Card className="rounded-2xl p-5 select-none">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Tailored Resumes (PDF)</h3>
                <p className="text-xs text-ink-secondary mt-0.5">
                  Select the version matched to the role you are hiring for.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:w-[680px]">
                {RESUME_ITEMS.map((resume) => (
                  <a
                    key={resume.key}
                    href={resume.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group px-4 py-3 rounded-xl border border-border bg-muted/40 hover:bg-primary hover:border-primary transition-colors flex items-center justify-between gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground group-hover:text-primary-foreground transition-colors">
                        {resume.label}
                      </div>
                      <div className="text-[11px] text-muted-foreground group-hover:text-primary-foreground/75 truncate transition-colors">
                        {resume.focus}
                      </div>
                    </div>
                    <FiArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </div>
            </div>
          </Card>

          <div className="pt-1 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-foreground select-none">
            <span>{data.personal.location}</span>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyEmail}
                className="rounded-lg font-mono text-xs gap-2 cursor-pointer bg-card/85"
              >
                {copiedEmail ? (
                  <FiCheck className="w-3.5 h-3.5 text-status-dot" />
                ) : (
                  <FiCopy className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span>{copiedEmail ? 'Copied email' : data.personal.email}</span>
              </Button>

              <a
                href={`mailto:${data.personal.email}`}
                className={cn(
                  buttonVariants({ variant: 'outline', size: 'sm' }),
                  'rounded-lg font-mono text-xs gap-2 bg-card/85'
                )}
              >
                <FiMail className="w-3.5 h-3.5 text-ink-secondary" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificationsView;
