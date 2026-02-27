import { useState, useEffect, useRef } from 'react';

interface NavbarProps {
  visible: boolean;
  resumeUrl?: string;
}

async function downloadResume(url: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = 'resume.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
  } catch {
    window.open(url, '_blank');
  }
}

export default function Navbar({ visible, resumeUrl }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY <= 60) {
        setHidden(false);
      } else if (currentY > lastScrollY.current) {
        setHidden(true);
        setMenuOpen(false);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const translateY = !visible ? '-10px' : hidden ? '-100%' : '0';
  const opacity = visible ? 1 : 0;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-start justify-between"
        style={{
          padding: '1.25rem clamp(1rem, 3vw, 1.5rem) 1.25rem clamp(1.5rem, 4vw, 2.5rem)',
          opacity,
          transform: `translateY(${translateY})`,
          transition: 'opacity 0.6s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: visible && !hidden ? 'auto' : 'none',
        }}
      >
        <div>
          <p
            className="font-display font-black text-white"
            style={{ fontSize: '1.05rem', letterSpacing: '0.02em', lineHeight: 1.1 }}
          >
            VITALIY VITKOVSKIY
          </p>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button className="nav-link" onClick={() => scrollTo('about')}>About</button>
          <button className="nav-link" onClick={() => scrollTo('projects')}>Projects</button>
          <button className="nav-link" onClick={() => scrollTo('contact')}>Contact</button>
          {resumeUrl ? (
            <button
              onClick={() => downloadResume(resumeUrl)}
              className="nav-link btn-filled"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.78rem' }}
            >
              Resume
            </button>
          ) : (
            <span
              className="nav-link btn-filled"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.78rem', opacity: 0.4, cursor: 'default' }}
            >
              Resume
            </span>
          )}
        </div>

        <button
          className={`md:hidden flex flex-col gap-[5px] p-1 z-50 ${menuOpen ? 'burger-open' : ''}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span className="burger-line" />
          <span className="burger-line" />
          <span className="burger-line" />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="mobile-menu-link" onClick={() => scrollTo('about')}>About</button>
        <button className="mobile-menu-link" onClick={() => scrollTo('projects')}>Projects</button>
        <button className="mobile-menu-link" onClick={() => scrollTo('contact')}>Contact</button>
        {resumeUrl ? (
          <button
            className="nav-link btn-outline mt-2"
            style={{ fontSize: '0.88rem', padding: '0.75rem 2rem' }}
            onClick={() => { downloadResume(resumeUrl); setMenuOpen(false); }}
          >
            Resume
          </button>
        ) : (
          <span
            className="nav-link btn-outline mt-2"
            style={{ fontSize: '0.88rem', padding: '0.75rem 2rem', opacity: 0.4 }}
          >
            Resume
          </span>
        )}
      </div>
    </>
  );
}
