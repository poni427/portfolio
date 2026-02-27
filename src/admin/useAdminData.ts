import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { SiteContent, Project } from '../lib/supabase';

export function useAdminData() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [{ data: sc }, { data: pr }] = await Promise.all([
      supabase.from('site_content').select('*'),
      supabase.from('projects').select('*').order('display_order'),
    ]);
    if (sc) {
      const map: Record<string, string> = {};
      (sc as SiteContent[]).forEach(r => { map[r.key] = r.value; });
      setContent(map);
    }
    if (pr) setProjects(pr as Project[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const saveContent = useCallback(async (updates: Record<string, string>) => {
    setSaving(true);
    const rows = Object.entries(updates).map(([key, value]) => ({ key, value }));
    for (const row of rows) {
      await supabase
        .from('site_content')
        .upsert({ key: row.key, value: row.value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    }
    setContent(prev => ({ ...prev, ...updates }));
    setSaving(false);
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  }, []);

  const saveProject = useCallback(async (project: Partial<Project> & { id?: string }) => {
    setSaving(true);
    if (project.id) {
      await supabase.from('projects').update({ ...project, updated_at: new Date().toISOString() }).eq('id', project.id);
    } else {
      await supabase.from('projects').insert({ ...project, updated_at: new Date().toISOString() });
    }
    await fetchAll();
    setSaving(false);
    setSaveMsg('Saved!');
    setTimeout(() => setSaveMsg(''), 2000);
  }, [fetchAll]);

  const deleteProject = useCallback(async (id: string) => {
    setSaving(true);
    await supabase.from('projects').delete().eq('id', id);
    await fetchAll();
    setSaving(false);
    setSaveMsg('Deleted!');
    setTimeout(() => setSaveMsg(''), 2000);
  }, [fetchAll]);

  return { content, projects, loading, saving, saveMsg, saveContent, saveProject, deleteProject, fetchAll };
}
