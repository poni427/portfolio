/*
  # Portfolio Admin Panel Schema

  ## Summary
  Creates all tables needed for the portfolio CMS admin panel.

  ## Tables
  1. `site_content` — Key/value store for all editable site text and settings
     - hero section texts, about texts, contact texts, links (telegram, linkedin), images
  2. `projects` — Portfolio projects with support for image URL or video (stored as base64/URL in storage)
     - name, subtitle, year, description, highlights, image_url, video_url, display_order

  ## Security
  - RLS enabled on all tables
  - Only authenticated users (admin) can read/write site_content and projects
  - Public SELECT allowed on projects and site_content (so the site can display them)
*/

-- site_content: key-value store for all editable text/settings
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site content"
  ON site_content FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can update site content"
  ON site_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert site content"
  ON site_content FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete site content"
  ON site_content FOR DELETE
  TO authenticated
  USING (true);

-- projects: portfolio projects
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  tags text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  highlights text[] NOT NULL DEFAULT '{}',
  image_url text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Seed default site_content keys
INSERT INTO site_content (key, value) VALUES
  ('hero_title_line1', 'TECHNICAL'),
  ('hero_title_line2', 'GAME DESIGNER'),
  ('hero_title_line3', '& UNREAL ENGINE'),
  ('hero_title_line4', 'DEVELOPER.'),
  ('hero_description', 'A Technical Game Designer focused on gameplay systems, tools, and interactions. I work with Unreal Engine to turn ideas into playable and scalable mechanics.'),
  ('hero_tagline', 'BUILD SYSTEMS. SHAPE GAMEPLAY.'),
  ('hero_image_url', 'https://i.postimg.cc/C5sNqYLv/Landing-Picture.png'),
  ('about_text1', 'I''m a Technical Game Designer specializing in Unreal Engine-based gameplay and interactive systems. I design and implement mechanics, tools, and logic that support complex interactions, simulations, and real-time experiences.'),
  ('about_text2', 'I enjoy working at the intersection of design and code, translating abstract ideas into concrete systems using Blueprints and C++. Cameras, movement, interaction models, procedural logic, and system architecture are central to my work across games, interactive applications, and real-time environments.'),
  ('about_text3', 'I believe strong interactive experiences come from well-structured systems. My goal is to create solutions that are clear, scalable, and satisfying to use — for both players and for users exploring digital spaces.'),
  ('about_image_url', 'https://i.postimg.cc/kGv0Xk0z/About.png'),
  ('contact_text1', 'Have an idea that needs to come to life? Whether it''s a gameplay concept, an interactive application, or a real-time visualization, I turn ideas into functional, interactive systems in Unreal Engine.'),
  ('contact_text2', 'If you''re a studio, company, or team looking for a Technical Designer or Unreal Engine Developer, I''m open to collaborating on gameplay systems, interactive applications, and real-time environments.'),
  ('contact_text3', 'Feel free to reach out through any of my socials below or send me a message directly. I''m always happy to discuss systems, interaction, and new real-time ideas.'),
  ('contact_footer_image_url', 'https://i.postimg.cc/JnD704KD/footer.png'),
  ('projects_bg_image_url', 'https://i.postimg.cc/hvLC1TMs/Projects.png'),
  ('projects_description', 'My projects span from gameplay systems to interactive real-time applications. Across all projects, the focus is the same: building systems that feel responsive, clear, and meaningful to explore.'),
  ('telegram_url', 'https://t.me/VitIgVit'),
  ('linkedin_url', 'https://linkedin.com')
ON CONFLICT (key) DO NOTHING;

-- Seed default projects
INSERT INTO projects (name, subtitle, year, tags, description, highlights, image_url, video_url, display_order) VALUES
(
  'SPINE',
  'Single-player story rich action game for PC/PS5/Xbox Series',
  '2023–2025',
  'Action Game • Unreal Engine • Combat Systems',
  'On SPINE, I worked as a Technical Game Designer on the core gameplay systems behind combat, movement, and execution mechanics.
The project combines fast-paced combat, parkour elements, and cinematic finishing moves into a cohesive system driven by player input and animation logic. My role was to ensure these elements functioned not only as separate features, but as a unified and scalable gameplay framework.
This work demonstrates how technical design brings creative gameplay concepts to life by transforming design intent into responsive, polished, and reliable interactive systems.',
  ARRAY[
    'Fluid combat that blends movement and finishing actions into a seamless flow',
    'Parkour mechanics integrated directly into combat',
    'Context-driven finishing moves based on player state and situation',
    'Technical systems enabling expressive and cinematic gameplay'
  ],
  '/Рисунок1.png',
  '',
  1
),
(
  'ALIA',
  'Digital Twin • CRM Integration • Sales Platform',
  '2022–2023',
  'Digital Twin • Real-Time • CRM',
  'My role: Lead Unreal Engine Developer for a large-scale digital twin of a premium residential development in Moscow.
The project was built as a real-time platform for interactive property exploration, real-time data access, and client communication. I was responsible for application architecture, core system implementation, and integration with the client''s CRM.
The solution allowed users to view up-to-date property information, submit requests, and send email inquiries directly from the application, turning the visualization into a practical sales tool.
I also worked closely with the client to refine requirements, propose new features, and align the system with real business workflows.',
  ARRAY[
    'Lead developer responsible for application architecture and core systems',
    'Large-scale real-time digital twin platform',
    'CRM integration with live property data',
    'In-app request creation and email communication',
    'Close collaboration with the client and feature planning',
    'Production-ready solution supporting real sales workflows',
    'Developed for an award-winning residential development'
  ],
  '/Рисунок2.png',
  '',
  2
),
(
  'LEVEL GROUP ECOSYSTEM',
  'Real-Time Systems • Digital Twins • Hardware & Business Integration',
  '2022–2023',
  'Digital Twin • Multi-Platform • Hardware',
  'Role: Unreal Engine Developer (team member)
Contributed to the development of a real-time digital twin ecosystem that combines multiple residential developments into a single interactive platform.
As part of the team, I worked on core application features, interaction logic, and system functionality, including tablet-based control for live client presentations.',
  ARRAY[
    'Developed as part of a team on a multi-project digital twin ecosystem',
    'Unified platform for multiple residential developments',
    'Tablet-based remote control for client presentations',
    'Integration with a physical scale model',
    'Real-time synchronization between the digital application and physical hardware',
    'Designed for interactive use in sales environments'
  ],
  '/2026-02-23_18-29-08.png',
  '',
  3
),
(
  'DONSTROY',
  'Real-Time Systems • Digital Twins • Hardware & Business Integration',
  '2023–2024',
  'Digital Twin • UI Systems • Virtual Tour',
  'Role: Unreal Engine Developer (team member)
Contributed to a large-scale interactive digital twin covering three premium residential developments within a unified platform.
I was responsible for end-to-end UI development, including layout, interaction logic, and integration with backend systems. The interface was designed to support real-time property exploration and smooth navigation across the project.
I also developed custom UI animations to improve clarity and visual feedback, and proposed and implemented a virtual tour feature to enhance the user experience and presentation capabilities.',
  ARRAY[
    'End-to-end UI development (layout, interaction, and logic)',
    'Integration of UI with backend systems',
    'Custom UI animations and transitions',
    'Design and implementation of a virtual tour system',
    'Developed as part of a team on a large-scale project',
    'Interface optimized for real-time exploration and client presentations'
  ],
  '/2026-02-23_18-29-47.png',
  '',
  4
)
ON CONFLICT DO NOTHING;
