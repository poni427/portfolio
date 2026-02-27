import { useState, useRef } from 'react';
import { LogOut, Layout, User, FolderOpen, MessageSquare, FileText, Plus, Edit2, ChevronRight, Upload, X, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminData } from './useAdminData';
import ProjectEditor from './ProjectEditor';
import { uploadMediaTus } from './uploadMedia';
import type { Project } from '../lib/supabase';

type Tab = 'hero' | 'about' | 'projects' | 'contact' | 'resume';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface ImageUploadFieldProps {
  contentKey: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
}

function ImageUploadField({ contentKey, label, value, onChange }: ImageUploadFieldProps) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setProgress(0);
    const ext = file.name.split('.').pop();
    const path = `images/${Date.now()}.${ext}`;
    try {
      const url = await uploadMediaTus(file, path, pct => setProgress(pct));
      onChange(url);
    } catch (err: unknown) {
      setError('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setTimeout(() => setProgress(null), 1200);
      e.target.value = '';
    }
  };

  return (
    <div className="admin-field">
      <label>{label}</label>
      <div className="admin-media-upload">
        {value && progress === null && (
          <div className="admin-media-preview">
            <img src={value} alt="preview" />
            <button type="button" className="admin-media-clear" onClick={() => onChange('')}>
              <X size={12} />
            </button>
          </div>
        )}
        {progress !== null ? (
          <div className="admin-upload-progress">
            <div className="admin-upload-progress-bar">
              <div className="admin-upload-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="admin-upload-progress-label">
              {progress < 100 ? `Uploading... ${progress}%` : <><CheckCircle size={12} /> Done</>}
            </span>
          </div>
        ) : (
          <button type="button" className="admin-upload-area" onClick={() => inputRef.current?.click()}>
            <Upload size={18} />
            <span>Click to upload image</span>
            <span className="admin-upload-hint">JPG, PNG, WEBP, GIF</span>
          </button>
        )}
        {error && <p className="admin-error">{error}</p>}
        <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
    </div>
  );
}

interface PdfUploadFieldProps {
  value: string;
  onChange: (val: string) => void;
}

function PdfUploadField({ value, onChange }: PdfUploadFieldProps) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.pdf')) {
      setError('Only PDF files are allowed.');
      return;
    }
    setError('');
    setProgress(0);
    const path = `resume/resume_${Date.now()}.pdf`;
    try {
      const url = await uploadMediaTus(file, path, pct => setProgress(pct));
      onChange(url);
    } catch (err: unknown) {
      setError('Upload failed: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setTimeout(() => setProgress(null), 1200);
      e.target.value = '';
    }
  };

  return (
    <div className="admin-field">
      <label>Resume PDF File</label>
      <div className="admin-media-upload">
        {value && progress === null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', background: '#0a1220', border: '1px solid rgba(255,255,255,0.1)' }}>
            <FileText size={16} style={{ color: '#60a5fa', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value.split('/').pop() || 'resume.pdf'}
            </span>
            <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.68rem', color: '#60a5fa', letterSpacing: '0.08em', textDecoration: 'none' }}>
              VIEW
            </a>
            <button type="button" className="admin-media-clear" style={{ position: 'static', width: 20, height: 20 }} onClick={() => onChange('')}>
              <X size={12} />
            </button>
          </div>
        )}
        {progress !== null ? (
          <div className="admin-upload-progress">
            <div className="admin-upload-progress-bar">
              <div className="admin-upload-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="admin-upload-progress-label">
              {progress < 100 ? `Uploading... ${progress}%` : <><CheckCircle size={12} /> Done</>}
            </span>
          </div>
        ) : (
          <button type="button" className="admin-upload-area" onClick={() => inputRef.current?.click()}>
            <Upload size={18} />
            <span>Click to upload resume</span>
            <span className="admin-upload-hint">PDF only</span>
          </button>
        )}
        {error && <p className="admin-error">{error}</p>}
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }} onChange={handleFile} />
      </div>
    </div>
  );
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { content, projects, loading, saving, saveMsg, saveContent, saveProject, deleteProject } = useAdminData();
  const [tab, setTab] = useState<Tab>('hero');
  const [editingProject, setEditingProject] = useState<Partial<Project> | null | 'new'>(null);
  const [localContent, setLocalContent] = useState<Record<string, string>>({});

  const getVal = (key: string) => (key in localContent ? localContent[key] : content[key] ?? '');
  const setVal = (key: string, val: string) => setLocalContent(prev => ({ ...prev, [key]: val }));

  const handleSaveSection = async (keys: string[]) => {
    const updates: Record<string, string> = {};
    keys.forEach(k => { updates[k] = getVal(k); });
    await saveContent(updates);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'hero', label: 'Hero Section', icon: <Layout size={15} /> },
    { id: 'about', label: 'About Section', icon: <User size={15} /> },
    { id: 'projects', label: 'Projects', icon: <FolderOpen size={15} /> },
    { id: 'contact', label: 'Contact', icon: <MessageSquare size={15} /> },
    { id: 'resume', label: 'Resume', icon: <FileText size={15} /> },
  ];

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <span className="admin-logo">ADMIN PANEL</span>
          <span className="admin-logo-sub">Portfolio CMS</span>
        </div>
        <nav className="admin-nav">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`admin-nav-item ${tab === t.id ? 'active' : ''}`}
              onClick={() => { setTab(t.id); setEditingProject(null); }}
            >
              {t.icon}
              {t.label}
              {tab === t.id && <ChevronRight size={13} style={{ marginLeft: 'auto' }} />}
            </button>
          ))}
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <LogOut size={14} />
          LOGOUT
        </button>
      </aside>

      <main className="admin-main">
        {saveMsg && <div className="admin-save-toast">{saveMsg}</div>}

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : (
          <>
            {tab === 'hero' && (
              <section className="admin-section">
                <h2 className="admin-section-title">Hero Section</h2>

                <div className="admin-card">
                  <h3 className="admin-card-title">Headline</h3>
                  <div className="admin-field">
                    <label>Line 1</label>
                    <input value={getVal('hero_title_line1')} onChange={e => setVal('hero_title_line1', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Line 2</label>
                    <input value={getVal('hero_title_line2')} onChange={e => setVal('hero_title_line2', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Line 3</label>
                    <input value={getVal('hero_title_line3')} onChange={e => setVal('hero_title_line3', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Line 4</label>
                    <input value={getVal('hero_title_line4')} onChange={e => setVal('hero_title_line4', e.target.value)} />
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card-title">Description & Tagline</h3>
                  <div className="admin-field">
                    <label>Description</label>
                    <textarea rows={3} value={getVal('hero_description')} onChange={e => setVal('hero_description', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Tagline</label>
                    <input value={getVal('hero_tagline')} onChange={e => setVal('hero_tagline', e.target.value)} />
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card-title">Background Image</h3>
                  <ImageUploadField
                    contentKey="hero_image_url"
                    label="Background Image"
                    value={getVal('hero_image_url')}
                    onChange={v => setVal('hero_image_url', v)}
                  />
                </div>

                <button
                  className="admin-btn-primary"
                  onClick={() => handleSaveSection(['hero_title_line1','hero_title_line2','hero_title_line3','hero_title_line4','hero_description','hero_tagline','hero_image_url'])}
                  disabled={saving}
                >
                  {saving ? 'SAVING...' : 'SAVE HERO SECTION'}
                </button>
              </section>
            )}

            {tab === 'about' && (
              <section className="admin-section">
                <h2 className="admin-section-title">About Section</h2>

                <div className="admin-card">
                  <h3 className="admin-card-title">Background Image</h3>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    The About section uses the same background as the Hero section. Change it in the Hero tab.
                  </p>
                  {getVal('hero_image_url') && (
                    <img
                      src={getVal('hero_image_url')}
                      alt="current hero/about background"
                      style={{ maxHeight: '100px', width: 'auto', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.07)', opacity: 0.6 }}
                    />
                  )}
                </div>

                <div className="admin-card">
                  <h3 className="admin-card-title">Photo</h3>
                  <ImageUploadField
                    contentKey="about_image_url"
                    label="Profile Photo"
                    value={getVal('about_image_url')}
                    onChange={v => setVal('about_image_url', v)}
                  />
                </div>

                <div className="admin-card">
                  <h3 className="admin-card-title">Text Blocks</h3>
                  <div className="admin-field">
                    <label>Paragraph 1</label>
                    <textarea rows={4} value={getVal('about_text1')} onChange={e => setVal('about_text1', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Paragraph 2</label>
                    <textarea rows={4} value={getVal('about_text2')} onChange={e => setVal('about_text2', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Paragraph 3</label>
                    <textarea rows={4} value={getVal('about_text3')} onChange={e => setVal('about_text3', e.target.value)} />
                  </div>
                </div>

                <button
                  className="admin-btn-primary"
                  onClick={() => handleSaveSection(['about_image_url','about_text1','about_text2','about_text3'])}
                  disabled={saving}
                >
                  {saving ? 'SAVING...' : 'SAVE ABOUT SECTION'}
                </button>
              </section>
            )}

            {tab === 'contact' && (
              <section className="admin-section">
                <h2 className="admin-section-title">Contact Section</h2>

                <div className="admin-card">
                  <h3 className="admin-card-title">Links</h3>
                  <div className="admin-field">
                    <label>Telegram URL</label>
                    <input value={getVal('telegram_url')} onChange={e => setVal('telegram_url', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>LinkedIn URL</label>
                    <input value={getVal('linkedin_url')} onChange={e => setVal('linkedin_url', e.target.value)} />
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card-title">Text Blocks</h3>
                  <div className="admin-field">
                    <label>Column 1 Text</label>
                    <textarea rows={4} value={getVal('contact_text1')} onChange={e => setVal('contact_text1', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Column 2 Text</label>
                    <textarea rows={4} value={getVal('contact_text2')} onChange={e => setVal('contact_text2', e.target.value)} />
                  </div>
                  <div className="admin-field">
                    <label>Column 3 Text</label>
                    <textarea rows={4} value={getVal('contact_text3')} onChange={e => setVal('contact_text3', e.target.value)} />
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card-title">Background Image</h3>
                  <ImageUploadField
                    contentKey="contact_footer_image_url"
                    label="Footer Background Image"
                    value={getVal('contact_footer_image_url')}
                    onChange={v => setVal('contact_footer_image_url', v)}
                  />
                </div>

                <button
                  className="admin-btn-primary"
                  onClick={() => handleSaveSection(['telegram_url','linkedin_url','contact_text1','contact_text2','contact_text3','contact_footer_image_url'])}
                  disabled={saving}
                >
                  {saving ? 'SAVING...' : 'SAVE CONTACT SECTION'}
                </button>
              </section>
            )}

            {tab === 'resume' && (
              <section className="admin-section">
                <h2 className="admin-section-title">Resume</h2>
                <div className="admin-card">
                  <h3 className="admin-card-title">Upload Resume PDF</h3>
                  <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Upload a PDF file. The Resume button in the navbar will link directly to this file for download.
                  </p>
                  <PdfUploadField
                    value={getVal('resume_url')}
                    onChange={v => setVal('resume_url', v)}
                  />
                </div>
                <button
                  className="admin-btn-primary"
                  onClick={() => handleSaveSection(['resume_url'])}
                  disabled={saving}
                >
                  {saving ? 'SAVING...' : 'SAVE RESUME'}
                </button>
              </section>
            )}

            {tab === 'projects' && (
              <section className="admin-section">
                <div className="admin-section-header">
                  <h2 className="admin-section-title" style={{ margin: 0 }}>Projects</h2>
                  {!editingProject && (
                    <button className="admin-btn-primary" onClick={() => setEditingProject('new')}>
                      <Plus size={14} /> ADD PROJECT
                    </button>
                  )}
                </div>

                {!editingProject && (
                  <div className="admin-card">
                    <h3 className="admin-card-title">Section Background</h3>
                    <ImageUploadField
                      contentKey="projects_bg_image_url"
                      label="Background Image (Selected Projects section)"
                      value={getVal('projects_bg_image_url')}
                      onChange={v => setVal('projects_bg_image_url', v)}
                    />
                    <button
                      className="admin-btn-primary"
                      onClick={() => handleSaveSection(['projects_bg_image_url'])}
                      disabled={saving}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      {saving ? 'SAVING...' : 'SAVE BACKGROUND'}
                    </button>
                  </div>
                )}

                {editingProject ? (
                  <div className="admin-card">
                    <h3 className="admin-card-title">
                      {editingProject === 'new' ? 'New Project' : `Edit: ${(editingProject as Project).name}`}
                    </h3>
                    <ProjectEditor
                      project={editingProject === 'new' ? null : editingProject as Partial<Project>}
                      onSave={async p => {
                        await saveProject(p);
                        setEditingProject(null);
                      }}
                      onDelete={async id => {
                        await deleteProject(id);
                        setEditingProject(null);
                      }}
                      onCancel={() => setEditingProject(null)}
                      saving={saving}
                    />
                  </div>
                ) : (
                  <div className="admin-projects-list">
                    {projects.map(p => (
                      <div key={p.id} className="admin-project-row">
                        <div className="admin-project-thumb">
                          {p.video_url ? (
                            <video src={p.video_url} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : p.image_url ? (
                            <img src={p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', background: '#1a2535' }} />
                          )}
                        </div>
                        <div className="admin-project-info">
                          <span className="admin-project-name">{p.name}</span>
                          <span className="admin-project-meta">{p.year} — {p.subtitle}</span>
                          {p.video_url && <span className="admin-project-badge">VIDEO</span>}
                        </div>
                        <button className="admin-btn-ghost admin-edit-btn" onClick={() => setEditingProject(p)}>
                          <Edit2 size={13} /> EDIT
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}
