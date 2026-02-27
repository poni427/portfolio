import { useState, lazy, Suspense } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import ContactSection from './components/ContactSection';
import { useScrollReveal, useGsapParallax } from './hooks/useScrollReveal';
import { useSiteData } from './hooks/useSiteData';

const AdminPanel = lazy(() => import('./admin/AdminPanel'));

function Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const { content, projects } = useSiteData();

  useScrollReveal();
  useGsapParallax();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <LoadingScreen onComplete={() => setLoaded(true)} />

      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.7s ease 0.1s' }}>
        <Navbar visible={loaded} resumeUrl={content['resume_url'] || ''} />

        <main>
          <HeroSection
            visible={loaded}
            onCollaborate={() => scrollTo('contact')}
            onHire={() => scrollTo('contact')}
            content={content}
          />
          <AboutSection content={content} />
          <ProjectsSection projects={projects} content={content} />
          <ContactSection content={content} />
        </main>
      </div>
    </>
  );
}

export default function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <Suspense fallback={null}>
        <AdminPanel />
      </Suspense>
    );
  }

  return <Portfolio />;
}
