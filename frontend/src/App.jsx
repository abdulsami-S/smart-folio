import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider, PortfolioContext } from './context/PortfolioContext';

// Portfolio Components
import Navbar from './portfolio/components/Navbar';
import CustomCursor, { CursorProvider } from './portfolio/components/CustomCursor';
import MarqueeTicker from './portfolio/components/MarqueeTicker';
import Footer from './portfolio/components/Footer';

import Hero from './portfolio/sections/Hero';
import About from './portfolio/sections/About';
import Skills from './portfolio/sections/Skills';
import Projects from './portfolio/sections/Projects';
import Timeline from './portfolio/sections/Timeline';
import Contact from './portfolio/sections/Contact';
import CTABanner from './portfolio/sections/CTABanner';

// Admin Components
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import ProtectedRoute from './admin/ProtectedRoute';
import Overview from './admin/pages/Overview';
import ProjectsManager from './admin/pages/ProjectsManager';
import SkillsManager from './admin/pages/SkillsManager';
import AboutEditor from './admin/pages/AboutEditor';
import TimelineManager from './admin/pages/TimelineManager';
import HeroEditor from './admin/pages/HeroEditor';
import SocialEditor from './admin/pages/SocialEditor';
import { Loader2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PortfolioView = () => {
  const { portfolio, projects, skills, timeline, loading } = useContext(PortfolioContext);

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
          height: window.innerHeight
        };
      },
      pinType: document.documentElement.style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.addEventListener('refresh', () => lenis.resize());
    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#04050f] text-white">
        <Loader2 className="w-12 h-12 animate-spin text-[#00d4ff]" />
      </div>
    );
  }

  return (
    <div className="relative bg-[var(--bg-primary)] min-h-screen overflow-hidden">
      <Navbar portfolio={portfolio} />
      <main>
        <Hero portfolio={portfolio} />
        <About portfolio={portfolio} />
        <Skills skills={skills} />
        <MarqueeTicker />
        <Projects projects={projects} />
        <Timeline timeline={timeline} />
        <CTABanner />
        <Contact portfolio={portfolio} />
        <Footer />
      </main>
      <CustomCursor />
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
                  className: 'bg-[#0d0f1e] text-white border border-[rgba(255,255,255,0.1)] shadow-[0_0_20px_rgba(0,0,0,0.5)]',
                  style: { background: '#0d0f1e', color: '#fff' },
                }}
              />
              <Routes>
                <Route path="/" element={<PortfolioView />} />

                <Route path="/admin/login" element={<AdminLogin />} />

                <Route path="/admin" element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route index element={<Overview />} />
                    <Route path="dashboard" element={<Overview />} />
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
