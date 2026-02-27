import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollReveal() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
        const dir = el.dataset.reveal;
        const delay = parseFloat(el.dataset.delay || '0') / 1000;

        let fromVars: gsap.TweenVars = { opacity: 0, y: 52 };
        if (dir === 'left') fromVars = { opacity: 0, x: -56 };
        else if (dir === 'right') fromVars = { opacity: 0, x: 56 };
        else if (dir === 'scale') fromVars = { opacity: 0, scale: 0.92, y: 30 };
        else if (dir === 'clip') {
          fromVars = { clipPath: 'inset(0 0 100% 0)', opacity: 1 };
        }

        const toVars: gsap.TweenVars = {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          clipPath: dir === 'clip' ? 'inset(0 0 0% 0)' : undefined,
          duration: 0.9,
          delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        };

        gsap.fromTo(el, fromVars, toVars);
      });
    });

    return () => ctx.revert();
  }, []);
}

export function useGsapParallax() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const heroBg = document.getElementById('hero-bg');
      if (heroBg) {
        heroBg.style.willChange = 'transform';
        gsap.to(heroBg, {
          yPercent: 25,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      const projectsBg = document.getElementById('projects-bg');
      if (projectsBg) {
        projectsBg.style.willChange = 'transform';
        gsap.to(projectsBg, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: '#projects',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      const aboutBg = document.querySelector<HTMLElement>('#about .parallax-bg');
      if (aboutBg) {
        aboutBg.style.willChange = 'transform';
        gsap.to(aboutBg, {
          yPercent: 18,
          ease: 'none',
          scrollTrigger: {
            trigger: '#about',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);
}
