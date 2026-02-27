import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SiteContent {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  subtitle: string;
  year: string;
  tags: string;
  description: string;
  highlights: string[];
  image_url: string;
  video_url: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
