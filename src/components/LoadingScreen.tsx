import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<'greeting' | 'loading' | 'done'>('greeting');
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const greetingTimer = setTimeout(() => {
      setPhase('loading');
    }, 1400);
    return () => clearTimeout(greetingTimer);
  }, []);

  useEffect(() => {
    if (phase !== 'loading') return;

    const total = 2200;
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const current = Math.min((elapsed / total) * 100, 100);
      setProgress(current);

      if (current < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => {
            setPhase('done');
            onComplete();
          }, 600);
        }, 300);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: '#1c2a1e',
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      {phase === 'greeting' && (
        <div className="text-center animate-fadeIn">
          <p
            className="font-display text-white"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              opacity: 0,
              animation: 'fadeInUp 0.6s ease 0.2s forwards',
            }}
          >
            HELLO
          </p>
        </div>
      )}

      {phase === 'loading' && (
        <div
          className="flex flex-col items-center gap-4"
          style={{ opacity: 0, animation: 'fadeIn 0.5s ease forwards' }}
        >
          <p
            className="font-mono text-xs tracking-widest"
            style={{ color: 'rgba(255,255,255,0.55)', letterSpacing: '0.18em' }}
          >
            {Math.round(progress)}%
          </p>
          <p
            className="font-display text-center"
            style={{
              fontSize: 'clamp(0.85rem, 2vw, 1rem)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>
              DESIGNED. CODED. LOVED.
            </span>{' '}
            <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.7)' }}>
              BY VITALIY VITKOVSKIY
            </span>
          </p>
          <div className="loading-bar">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
