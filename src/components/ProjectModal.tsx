import { useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '../lib/supabase';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

function VideoPlayer({ src, poster }: { src: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolume, setShowVolume] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const newMuted = !v.muted;
    v.muted = newMuted;
    setMuted(newMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const val = Number(e.target.value);
    v.volume = val;
    setVolume(val);
    setMuted(val === 0);
    v.muted = val === 0;
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * v.duration;
  };

  const fullscreen = () => {
    videoRef.current?.requestFullscreen?.();
  };

  return (
    <div className="video-player-wrap">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        playsInline
      />
      <div className="video-controls">
        <div className="video-progress-bar" onClick={handleSeek}>
          <div className="video-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="video-controls-row">
          <button className="video-ctrl-btn" onClick={toggle}>
            {playing ? <Pause size={13} /> : <Play size={13} />}
          </button>
          <div
            className="video-volume-wrap"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <button className="video-ctrl-btn" onClick={toggleMute}>
              {muted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
            <div className={`video-volume-slider-wrap ${showVolume ? 'visible' : ''}`}>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={muted ? 0 : volume}
                onChange={handleVolumeChange}
                className="video-volume-slider"
              />
            </div>
          </div>
          <button className="video-ctrl-btn" style={{ marginLeft: 'auto' }} onClick={fullscreen}>
            <Maximize size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [project]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!project) return null;

  const hasVideo = !!project.video_url;

  return (
    <div
      className="fixed inset-0 z-50 project-page-bg overflow-y-auto scrollbar-hide"
      style={{ animation: 'assembleFade 0.3s ease both' }}
    >
      <div style={{ padding: 'clamp(1.2rem, 4vw, 3rem) clamp(1rem, 5vw, 4rem)' }}>
        <button
          onClick={onClose}
          className="btn-outline assemble-btn mb-6"
          style={{ fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ArrowLeft size={13} />
          RETURN TO HOME
        </button>

        <div className="assemble-title clip-line">
          <h1
            className="font-display font-black text-white"
            style={{ fontSize: 'clamp(2.5rem, 9vw, 8rem)', lineHeight: 0.9, letterSpacing: '-0.01em' }}
          >
            {project.name}
          </h1>
        </div>

        <div className="assemble-sub mt-3 mb-2 flex flex-wrap items-baseline gap-3">
          <span className="font-display font-black text-white" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.6rem)' }}>
            {project.year}
          </span>
          <span className="text-white" style={{ fontSize: '0.9rem', opacity: 0.6 }}>
            {project.subtitle}
          </span>
        </div>


        <div className="project-modal-grid">
          <div className="assemble-image overflow-hidden" style={{ borderRadius: '2px' }}>
            {hasVideo ? (
              <div style={{ height: 'clamp(220px, 38vw, 520px)', position: 'relative', background: '#0a0f18' }}>
                <VideoPlayer src={project.video_url} poster={project.image_url || undefined} />
              </div>
            ) : (
              <img
                src={project.image_url}
                alt={project.name}
                style={{ width: '100%', height: 'clamp(220px, 38vw, 520px)', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>

          <div className="assemble-desc flex flex-col gap-8">
            <div>
              <p className="font-display font-black text-white mb-4"
                style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.35rem)', letterSpacing: '0.05em' }}>
                DESCRIPTION
              </p>
              {project.description.split('\n').map((para, i) => (
                <p key={i} className="text-white mb-3"
                  style={{ fontSize: 'clamp(0.82rem, 1vw, 0.9rem)', lineHeight: 1.78, opacity: 0.8 }}>
                  {para}
                </p>
              ))}
            </div>

            <div className="assemble-highlights">
              <p className="font-display font-black text-white mb-4"
                style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.35rem)', letterSpacing: '0.05em' }}>
                HIGHLIGHTS
              </p>
              <ul className="flex flex-col gap-2">
                {project.highlights.map((item, i) => (
                  <li key={i} className="text-white"
                    style={{ fontSize: 'clamp(0.82rem, 1vw, 0.875rem)', lineHeight: 1.65, opacity: 0.75 }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
