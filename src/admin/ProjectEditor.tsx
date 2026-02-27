import { useState, useRef } from 'react';
import { Trash2, Upload, X, Plus, CheckCircle } from 'lucide-react';
import type { Project } from '../lib/supabase';
import { uploadMediaTus } from './uploadMedia';

interface ProjectEditorProps {
  project: Partial<Project> | null;
  onSave: (p: Partial<Project> & { id?: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

const EMPTY: Partial<Project> = {
  name: '',
  subtitle: '',
  year: '',
  tags: '',
  description: '',
  highlights: [],
  image_url: '',
  video_url: '',
  display_order: 0,
};

export default function ProjectEditor({ project, onSave, onDelete, onCancel, saving }: ProjectEditorProps) {
  const [form, setForm] = useState<Partial<Project>>(project ?? EMPTY);
  const [imageUpload, setImageUpload] = useState<{ pct: number } | null>(null);
  const [videoUpload, setVideoUpload] = useState<{ pct: number } | null>(null);
  const [imageError, setImageError] = useState('');
  const [videoError, setVideoError] = useState('');
  const [highlightInput, setHighlightInput] = useState('');
  const videoRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof Project, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    set('highlights', [...(form.highlights ?? []), highlightInput.trim()]);
    setHighlightInput('');
  };

  const removeHighlight = (i: number) => {
    set('highlights', (form.highlights ?? []).filter((_, idx) => idx !== i));
  };

  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError('');
    const ext = file.name.split('.').pop();
    const path = `images/${Date.now()}.${ext}`;
    setImageUpload({ pct: 0 });
    try {
      const url = await uploadMediaTus(file, path, pct => setImageUpload({ pct }));
      set('image_url', url);
    } catch (err: unknown) {
      setImageError('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setTimeout(() => setImageUpload(null), 1200);
      e.target.value = '';
    }
  };

  const handleVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoError('');
    const ext = file.name.split('.').pop();
    const path = `videos/${Date.now()}.${ext}`;
    setVideoUpload({ pct: 0 });
    try {
      const url = await uploadMediaTus(file, path, pct => setVideoUpload({ pct }));
      set('video_url', url);
    } catch (err: unknown) {
      setVideoError('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setTimeout(() => setVideoUpload(null), 1200);
      e.target.value = '';
    }
  };

  return (
    <div className="project-editor">
      <div className="pe-grid">
        <div className="admin-field">
          <label>Project Name</label>
          <input value={form.name ?? ''} onChange={e => set('name', e.target.value)} placeholder="SPINE" />
        </div>
        <div className="admin-field">
          <label>Year</label>
          <input value={form.year ?? ''} onChange={e => set('year', e.target.value)} placeholder="2023–2025" />
        </div>
      </div>

      <div className="admin-field">
        <label>Subtitle</label>
        <input value={form.subtitle ?? ''} onChange={e => set('subtitle', e.target.value)} placeholder="Single-player story rich action game..." />
      </div>

      <div className="admin-field">
        <label>Tags</label>
        <input value={form.tags ?? ''} onChange={e => set('tags', e.target.value)} placeholder="Action Game • Unreal Engine" />
      </div>

      <div className="admin-field">
        <label>Description</label>
        <textarea rows={6} value={form.description ?? ''} onChange={e => set('description', e.target.value)} placeholder="Project description..." />
      </div>

      <div className="admin-field">
        <label>Highlights</label>
        <div className="admin-highlights">
          {(form.highlights ?? []).map((h, i) => (
            <div key={i} className="admin-highlight-item">
              <span>{h}</span>
              <button type="button" onClick={() => removeHighlight(i)}><X size={12} /></button>
            </div>
          ))}
          <div className="admin-highlight-add">
            <input
              value={highlightInput}
              onChange={e => setHighlightInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
              placeholder="Add highlight and press Enter"
            />
            <button type="button" onClick={addHighlight}><Plus size={14} /></button>
          </div>
        </div>
      </div>

      <div className="admin-field">
        <label>Display Order</label>
        <input type="number" value={form.display_order ?? 0} onChange={e => set('display_order', Number(e.target.value))} />
      </div>

      <div className="pe-media-grid">
        <div className="admin-field">
          <label>Cover Image</label>
          <div className="admin-media-upload">
            {form.image_url && !imageUpload && (
              <div className="admin-media-preview">
                <img src={form.image_url} alt="preview" />
                <button type="button" className="admin-media-clear" onClick={() => set('image_url', '')}>
                  <X size={12} />
                </button>
              </div>
            )}
            {imageUpload ? (
              <div className="admin-upload-progress">
                <div className="admin-upload-progress-bar">
                  <div className="admin-upload-progress-fill" style={{ width: `${imageUpload.pct}%` }} />
                </div>
                <span className="admin-upload-progress-label">
                  {imageUpload.pct < 100 ? `Uploading... ${imageUpload.pct}%` : <><CheckCircle size={12} /> Done</>}
                </span>
              </div>
            ) : (
              <button type="button" className="admin-upload-area" onClick={() => imageRef.current?.click()}>
                <Upload size={18} />
                <span>Click to upload image</span>
                <span className="admin-upload-hint">JPG, PNG, WEBP, GIF</span>
              </button>
            )}
            {imageError && <p className="admin-error">{imageError}</p>}
            <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageFile} />
          </div>
        </div>

        <div className="admin-field">
          <label>Video (replaces image in modal)</label>
          <div className="admin-media-upload">
            {form.video_url && !videoUpload && (
              <div className="admin-media-preview admin-video-preview">
                <video src={form.video_url} muted playsInline style={{ width: '100%', maxHeight: '120px', objectFit: 'cover' }} />
                <button type="button" className="admin-media-clear" onClick={() => set('video_url', '')}>
                  <X size={12} />
                </button>
              </div>
            )}
            {videoUpload ? (
              <div className="admin-upload-progress">
                <div className="admin-upload-progress-bar">
                  <div className="admin-upload-progress-fill" style={{ width: `${videoUpload.pct}%` }} />
                </div>
                <span className="admin-upload-progress-label">
                  {videoUpload.pct < 100 ? `Uploading... ${videoUpload.pct}%` : <><CheckCircle size={12} /> Done</>}
                </span>
              </div>
            ) : (
              <button type="button" className="admin-upload-area" onClick={() => videoRef.current?.click()}>
                <Upload size={18} />
                <span>Click to upload video</span>
                <span className="admin-upload-hint">MP4, WEBM, MOV — up to 200MB</span>
              </button>
            )}
            {videoError && <p className="admin-error">{videoError}</p>}
            <input ref={videoRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoFile} />
          </div>
        </div>
      </div>

      <div className="pe-actions">
        {onDelete && project?.id && (
          <button
            type="button"
            className="admin-btn-danger"
            onClick={() => onDelete(project.id!)}
            disabled={saving}
          >
            <Trash2 size={13} /> DELETE PROJECT
          </button>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.75rem' }}>
          <button type="button" className="admin-btn-ghost" onClick={onCancel}>CANCEL</button>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => onSave(form)}
            disabled={saving || !!imageUpload || !!videoUpload}
          >
            {saving ? 'SAVING...' : 'SAVE PROJECT'}
          </button>
        </div>
      </div>
    </div>
  );
}
