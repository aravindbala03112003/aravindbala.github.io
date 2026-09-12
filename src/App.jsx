import { lazy, Suspense, useEffect, useState } from 'react';
import Lenis from 'lenis';
import LazyHydrate from './components/LazyHydrate';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import CommandPalette from './components/CommandPalette';
import QuickContactFAB from './components/QuickContactFAB';
import AppErrorBoundary from './components/AppErrorBoundary';
import Hero from './sections/Hero';
import About from './sections/About';
import Work from './sections/Work';
import Skills from './sections/Skills';
import Services from './sections/Services';
import Experience from './sections/Experience';
import Contact from './sections/Contact';
import EngagementSection from './components/EngagementSection';
import { useActiveSection } from './hooks/useActiveSection';
import { useGlobal3DMouse } from './hooks/useGlobal3DMouse';
import { navLinks } from './data/portfolio';

const Preloader = lazy(() => import('./components/Preloader'));
const Testimonials = lazy(() => import('./sections/Testimonials'));

export default function App() {
  useGlobal3DMouse();
  const active = useActiveSection(navLinks);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible')),
      { threshold: 0.12 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Enable Lenis for silky smooth wheel scroll on desktop; allow native hardware-accelerated momentum scroll on mobile touch
    const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
    let lenis;
    let frame;

    if (!isTouch) {
      const startLenis = () => {
        lenis = new Lenis({ duration: 1.05, smoothWheel: true });
        const loop = (time) => {
          lenis.raf(time);
          frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
      };
      if ('requestIdleCallback' in window) {
        requestIdleCallback(startLenis, { timeout: 200 });
      } else {
        setTimeout(startLenis, 200);
      }
    }

    const key = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === 'Escape') setCommandOpen(false);
    };
    window.addEventListener('keydown', key);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (lenis && typeof lenis.destroy === 'function') lenis.destroy();
      window.removeEventListener('keydown', key);
    };
  }, []);

  return (
    <AppErrorBoundary>
      <Suspense fallback={null}>
        <Preloader />
      </Suspense>
      <Cursor />
      <ScrollProgress />
      <Navbar active={active} onCommand={() => setCommandOpen(true)} />
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />
      <main>
        <Hero />
        <About />
        <Work />
        <Skills />
        <Services />
        <Experience />
        <LazyHydrate placeholder={<div style={{ minHeight: 520 }} />}>
          <Suspense fallback={null}>
            <Testimonials />
          </Suspense>
        </LazyHydrate>
        <Contact />
        <EngagementSection />
      </main>
      <QuickContactFAB />
      <Footer />
    </AppErrorBoundary>
  );
}
