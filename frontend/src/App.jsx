import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactLenis } from '@studio-freight/react-lenis';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider, PortfolioContext } from './context/PortfolioContext';

// Portfolio Components
import Navbar from './portfolio/components/Navbar';
import CustomCursor, { CursorProvider } from './portfolio/components/CustomCursor';
import MarqueeTicker from './portfolio/components/MarqueeTicker';
import Hero from './portfolio/sections/Hero';
import About from './portfolio/sections/About';
import Skills from './portfolio/sections/Skills';
import Projects from './portfolio/sections/Projects';
import Timeline from './portfolio/sections/Timeline';
import Contact from './portfolio/sections/Contact';

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

// Premium Page Loader Sequence
const PageLoader = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[99999] bg-black flex items-center justify-center pointer-events-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1.5] }}
        transition={{
          duration: 3,
          times: [0, 0.2, 0.8, 1],
          ease: 'easeInOut',
        }}
        className="text-4xl md:text-6xl font-black text-white tracking-widest"
      >
        Shaik Abdul Sami
        <span className="text-primary drop-shadow-[0_0_15px_rgba(0,212,255,0.8)]">
          .
        </span>
      </motion.div>
    </motion.div>
  );
};

const PortfolioView = () => {
  const { portfolio, projects, skills, timeline, loading } =
    useContext(PortfolioContext);
  const [appReady, setAppReady] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030305] text-white">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothTouch: true }}>
      <div className="relative bg-[var(--bg)] min-h-screen">
        <AnimatePresence>
          {!appReady && (
            <PageLoader onComplete={() => setAppReady(true)} />
          )}
        </AnimatePresence>

        {/* Global Background Glow Orbs */}
        <div className="glow-orb-1" />
        <div className="glow-orb-2" />
        <div className="glow-orb-3" />

        <CustomCursor />

        {appReady && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Navbar portfolio={portfolio} />
            <main>
              <Hero portfolio={portfolio} />
              <About portfolio={portfolio} />
              <Skills skills={skills} />
              <MarqueeTicker />
              <Projects projects={projects} />
              <Timeline timeline={timeline} />
              <Contact portfolio={portfolio} />
            </main>
          </motion.div>
        )}
      </div>
    </ReactLenis>
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
                  className:
                    'glass text-white border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]',
                  style: { background: '#0a0a0f', color: '#fff' },
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
