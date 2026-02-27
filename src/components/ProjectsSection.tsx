import { useState, useRef, useEffect } from 'react';
import ProjectModal from './ProjectModal';
import type { Project } from '../lib/supabase';

interface ProjectsSectionProps {
  projects: Project[];
  content: Record<string, string>;
}

export default function ProjectsSection({ projects, content }: ProjectsSectionProps) {
  const [selected, setSelected] = useState<Project | null>(null);
  const [hovered, setHovered] = useState<Project | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);
  const c = (k: string, fallback: string) => content[k] || fallback;

  const coverSrc = hovered?.image_url || null;

  useEffect(() => {
    const measure = () => {
      if (thumbsRef.current) {
        setPreviewWidth(thumbsRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [projects]);

  return (
    <>
      <section
        id="projects"
        className="relative w-full grain-overlay"
        style={{ minHeight: '100vh' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center parallax-bg"
          id="projects-bg"
          style={{ backgroundImage: `url('${c('projects_bg_image_url', 'https://i.postimg.cc/rpHk2VbQ/Podlozka-3-stranica-Selected-Project-1.webp')}')` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(10,22,40,0.28) 0%, rgba(10,22,40,0.42) 45%, rgba(10,22,40,0.92) 100%)',
          }}
        />

        <div
          className="absolute hidden lg:block"
          style={{
            zIndex: 10,
            top: 'clamp(3rem, 7vh, 4rem)',
            right: '0',
            bottom: `calc(clamp(1.5rem, 4vh, 2.5rem) + clamp(94px, 12vw, 140px) + 1.5rem)`,
            left: '50%',
            pointerEvents: 'none',
            padding: 'clamp(2rem, 4vh, 3rem) clamp(1.25rem, 2vw, 1.75rem) clamp(2rem, 4vh, 3rem) clamp(2rem, 3vw, 3rem)',
          }}
        >
          <div
            className={`project-hover-preview-fixed ${coverSrc ? 'visible' : ''}`}
            style={{ width: '100%', height: '100%' }}
          >
            {coverSrc && <img src={coverSrc} alt={hovered?.name} loading="eager" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />}
          </div>
        </div>

        <div
          className="relative z-10 w-full h-full flex flex-col justify-between"
          style={{
            minHeight: '100vh',
            padding: 'clamp(5rem, 8vh, 5.5rem) clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vh, 2.5rem)',
          }}
        >
          <div />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-10">
            <div style={{ maxWidth: '460px' }}>
              <div data-reveal data-delay="0">
                <h2
                  className="font-display font-black text-white"
                  style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', lineHeight: 0.95 }}
                >
                  <span>SELECTED </span>
                  <span className="text-stroke">PROJECTS</span>
                </h2>
              </div>
              <p
                data-reveal
                data-delay="120"
                className="text-white mt-4"
                style={{ fontSize: 'clamp(1.05rem, 2vw, 1.1rem)', lineHeight: 1.75, opacity: 0.55 }}
              >
                {c('projects_description', 'My projects span from gameplay systems to interactive real-time applications. Across all projects, the focus is the same: building systems that feel responsive, clear, and meaningful to explore.')}
              </p>
            </div>

            <div
              ref={thumbsRef}
              data-reveal="right"
              data-delay="80"
              className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 flex-shrink-0"
              style={{ maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}
            >
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelected(project)}
                  onMouseEnter={() => setHovered(project)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex-shrink-0 overflow-hidden project-thumb"
                  style={{
                    width: 'clamp(140px, 18vw, 210px)',
                    height: 'clamp(94px, 12vw, 140px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    borderRadius: '2px',
                    position: 'relative',
                  }}
                  aria-label={`Open ${project.name}`}
                >
                  {project.image_url ? (
                    <img src={project.image_url} alt={project.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  ) : project.video_url ? (
                    <video src={project.video_url} muted playsInline preload="none" className="w-full h-full object-cover" />
                  ) : null}
                  <div
                    className="absolute inset-0 flex items-end p-2"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)' }}
                  >
                    <span
                      className="font-display font-black text-white"
                      style={{ fontSize: 'clamp(0.55rem, 0.9vw, 0.68rem)', letterSpacing: '0.08em' }}
                    >
                      {project.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  );
}
