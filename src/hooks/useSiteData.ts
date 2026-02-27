import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Project } from '../lib/supabase';

export interface SiteData {
  content: Record<string, string>;
  projects: Project[];
  loaded: boolean;
}

export function useSiteData(): SiteData {
  const [content, setContent] = useState<Record<string, string>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      supabase.from('site_content').select('key, value'),
      supabase.from('projects').select('*').order('display_order'),
    ]).then(([{ data: sc }, { data: pr }]) => {
      if (sc) {
        const map: Record<string, string> = {};
        (sc as { key: string; value: string }[]).forEach(r => { map[r.key] = r.value; });
        setContent(map);
      }
      if (pr) setProjects(pr as Project[]);
      setLoaded(true);
    });
  }, []);

  return { content, projects, loaded };
}
