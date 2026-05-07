import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Loader2 } from 'lucide-react';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider, PortfolioContext } from './context/PortfolioContext';

// Portfolio Layout Components
import Navbar from './portfolio/components/Navbar';
import CustomCursor, { CursorProvider } from './portfolio/components/CustomCursor';
import MarqueeTicker from './portfolio/components/MarqueeTicker';
import Footer from './portfolio/components/Footer';
import IntroScreen from './portfolio/components/IntroScreen';

// Portfolio Page Sections
import HeroSection from './portfolio/sections/HeroSection';
import AboutSection from './portfolio/sections/AboutSection';
import SkillsSection from './portfolio/sections/SkillsSection';
import ProjectsSection from './portfolio/sections/ProjectsSection';
import TimelineSection from './portfolio/sections/TimelineSection';
import CTABannerSection from './portfolio/sections/CTABannerSection';
import ContactSection from './portfolio/sections/ContactSection';

// Admin Panel
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import ProtectedRoute from './admin/ProtectedRoute';
import DashboardOverview from './admin/pages/DashboardOverview';
import HeroEditor from './admin/pages/HeroEditor';
import AboutEditor from './admin/pages/AboutEditor';
import ProjectsManager from './admin/pages/ProjectsManager';
import SkillsManager from './admin/pages/SkillsManager';
import TimelineManager from './admin/pages/TimelineManager';
import SocialEditor from './admin/pages/SocialEditor';

gsap.registerPlugin(ScrollTrigger);

const PortfolioView = () => {
  const { portfolio, projects, skills, timeline, loading } = useContext(PortfolioContext);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0, left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
    });

    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Show portfolio only when intro finishes AND data is ready
  const ready = introComplete && !loading;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg)' }}>
      {/* Intro splash — plays on every page load */}
      {!introComplete && (
        <IntroScreen onComplete={() => setIntroComplete(true)} />
      )}

      {/* Loading fallback — shown only if intro finished but data still loading */}
      {introComplete && loading && (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)' }}>
          <Loader2 style={{ width: 40, height: 40, color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {/* Portfolio — rendered once everything is ready */}
      {ready && (
        <>
          <Navbar portfolio={portfolio} />
          <main>
            <HeroSection portfolio={portfolio} />
            <AboutSection portfolio={portfolio} />
            <SkillsSection skills={skills} />
            <MarqueeTicker />
            <ProjectsSection projects={projects} />
            <TimelineSection timeline={timeline} />
            <CTABannerSection />
            <ContactSection portfolio={portfolio} />
            <Footer />
          </main>
          <CustomCursor />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <CursorProvider>
            <BrowserRouter>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#0d0f1e',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<PortfolioView />} />

                <Route path="/admin/login" element={<AdminLogin />} />

                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="dashboard" element={<DashboardOverview />} />
                    <Route path="projects" element={<ProjectsManager />} />
                    <Route path="skills" element={<SkillsManager />} />
                    <Route path="about" element={<AboutEditor />} />
                    <Route path="timeline" element={<TimelineManager />} />
                    <Route path="hero" element={<HeroEditor />} />
                    <Route path="social" element={<SocialEditor />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </CursorProvider>
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
