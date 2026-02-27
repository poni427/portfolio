import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface HeroSectionProps {
  visible: boolean;
  onCollaborate: () => void;
  onHire: () => void;
  content: Record<string, string>;
}

export default function HeroSection({ visible, onCollaborate, onHire, content }: HeroSectionProps) {
  const c = (k: string, fallback: string) => content[k] || fallback;
  const btnRef1 = useRef<HTMLButtonElement>(null);
  const btnRef2 = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    [btnRef1, btnRef2].forEach((ref) => {
      const el = ref.current;
      if (!el) return;
      const onEnter = () => gsap.to(el, { y: -3, duration: 0.25, ease: 'power2.out' });
      const onLeave = () => gsap.to(el, { y: 0, duration: 0.3, ease: 'power2.inOut' });
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      };
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full grain-overlay"
      style={{ height: '100vh', minHeight: '560px' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center parallax-bg"
        id="hero-bg"
        style={{ backgroundImage: `url('${c('hero_image_url', 'https://i.postimg.cc/CxDPxFzt/Podlozka-1-i-2-stranica.webp')}')` }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10,22,40,0.2) 0%, rgba(10,22,40,0.08) 35%, rgba(10,22,40,0.6) 80%, rgba(10,22,40,0.88) 100%)',
        }}
      />

      <div
        className="relative z-10 w-full h-full flex flex-col justify-between"
        style={{
          padding: 'clamp(5rem, 8vh, 6rem) clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 4vh, 2.5rem)',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
        }}
      >
        <div />

        <div className="flex flex-col lg:flex-row lg:items-end gap-6 lg:gap-8">
          <div>
            <h1
              className="font-display font-black text-white"
              style={{
                fontSize: 'clamp(2.2rem, 8.5vw, 7rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.01em',
              }}
            >
              <span className="block">{c('hero_title_line1', 'TECHNICAL')}</span>
              <span className="block">
                GAME{' '}
                <span className="text-stroke" style={{ WebkitTextStroke: 'clamp(1px, 0.3vw, 2px) rgba(255,255,255,0.85)' }}>
                  DESIGNER
                </span>
              </span>
              <span className="block text-stroke" style={{ WebkitTextStroke: 'clamp(1px, 0.3vw, 2px) rgba(255,255,255,0.85)' }}>
                {c('hero_title_line3', '& UNREAL ENGINE')}
              </span>
              <span className="block">{c('hero_title_line4', 'DEVELOPER.')}</span>
            </h1>
          </div>

          <div className="flex flex-col gap-4 lg:max-w-sm hero-desc-block" style={{ paddingBottom: '0.15rem' }}>
            <p
              className="text-white"
              style={{ fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', lineHeight: 1.65, opacity: 0.82 }}
            >
              {c('hero_description', 'A Technical Game Designer focused on gameplay systems, tools, and interactions. I work with Unreal Engine to turn ideas into playable and scalable mechanics.')}
            </p>
            <p
              className="font-display font-black text-white"
              style={{ fontSize: 'clamp(0.88rem, 1.8vw, 1.3rem)', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}
            >
              {c('hero_tagline', 'BUILD SYSTEMS. SHAPE GAMEPLAY.')}
            </p>
            <div className="flex gap-3 mt-2 flex-wrap">
              <button ref={btnRef1} className="btn-outline" onClick={onCollaborate}>
                LET&apos;S COLLABORATE
              </button>
              <button ref={btnRef2} className="btn-filled" onClick={onHire}>
                HIRE ME
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
