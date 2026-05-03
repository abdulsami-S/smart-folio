import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Loader2, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

gsap.registerPlugin(ScrollTrigger);

const Contact = ({ portfolio }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const socialLinksRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        [headingRef.current, formRef.current, socialLinksRef.current], 
        { opacity: 0, y: 50, filter: "blur(8px)" },
        {
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          duration: 1, 
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      toast.success('Message sent successfully! I will get back to you soon.', {
        style: { background: '#0a0a0f', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    }, 1500);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-32 relative bg-[var(--bg-primary)] border-t border-[rgba(255,255,255,0.05)] overflow-hidden">
      
      {/* Huge subtle background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/[0.02] whitespace-nowrap pointer-events-none select-none">
        CONTACT
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left: Big CTA */}
          <div className="flex flex-col justify-between">
            <div ref={headingRef}>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-cyan)] mb-6 block">05 // Contact</span>
              <h2 className="text-6xl md:text-8xl font-black leading-[1.1] tracking-tighter">
                <div className="text-white">Let's Build</div>
                <div className="text-white">Something</div>
                <div className="text-[var(--accent-cyan)] drop-shadow-[0_0_15px_rgba(0,212,255,0.5)]">Together.</div>
              </h2>
            </div>

            <div className="mt-20" ref={socialLinksRef}>
              <p className="text-sm uppercase tracking-[0.2em] text-white/40 mb-4">Drop a line</p>
              <a 
                href={`mailto:${portfolio?.socials?.email || 'hello@example.com'}`} 
                className="text-2xl md:text-4xl font-light text-white hover:text-[var(--accent-cyan)] transition-colors duration-300 relative group inline-block cursor-pointer"
              >
                {portfolio?.socials?.email || 'hello@example.com'}
                <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[var(--accent-cyan)] group-hover:w-full transition-all duration-500"></div>
              </a>

              <div className="flex gap-6 mt-16">
                {portfolio?.socials?.github && (
                  <a href={portfolio.socials.github} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-[var(--accent-cyan)] hover:bg-[var(--accent-cyan)]/10 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] transition-all duration-300 group cursor-pointer">
                    <Github size={24} className="group-hover:text-[var(--accent-cyan)] transition-colors" />
                  </a>
                )}
                {portfolio?.socials?.linkedin && (
                  <a href={portfolio.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 group cursor-pointer">
                    <Linkedin size={24} className="group-hover:text-blue-500 transition-colors" />
                  </a>
                )}
                {portfolio?.socials?.twitter && (
                  <a href={portfolio.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/5 border border-white/10 hover:border-sky-400/50 hover:bg-sky-400/10 hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] transition-all duration-300 group cursor-pointer">
                    <Twitter size={24} className="group-hover:text-sky-400 transition-colors" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Glassmorphism Form */}
          <div className="relative" ref={formRef}>
            <form onSubmit={handleSubmit} className="bg-white/[0.02] backdrop-blur-2xl p-10 md:p-14 rounded-[2rem] border border-[rgba(255,255,255,0.05)] shadow-2xl relative z-10">
              <div className="space-y-10">
                <div className="relative group">
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:outline-none focus:border-[var(--accent-cyan)] peer transition-colors placeholder-transparent" 
                    placeholder="Name"
                    id="name"
                  />
                  <label htmlFor="name" className="absolute left-0 top-4 text-white/40 text-sm tracking-widest uppercase transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--accent-cyan)] peer-valid:-top-4 peer-valid:text-xs">
                    Your Name
                  </label>
                </div>
                
                <div className="relative group">
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:outline-none focus:border-[var(--accent-cyan)] peer transition-colors placeholder-transparent" 
                    placeholder="Email"
                    id="email"
                  />
                  <label htmlFor="email" className="absolute left-0 top-4 text-white/40 text-sm tracking-widest uppercase transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--accent-cyan)] peer-valid:-top-4 peer-valid:text-xs">
                    Email Address
                  </label>
                </div>
                
                <div className="relative group">
                  <textarea 
                    required 
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-transparent border-b border-white/20 px-0 py-4 text-white focus:outline-none focus:border-[var(--accent-cyan)] peer transition-colors resize-none placeholder-transparent" 
                    placeholder="Message"
                    id="message"
                  ></textarea>
                  <label htmlFor="message" className="absolute left-0 top-4 text-white/40 text-sm tracking-widest uppercase transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-[var(--accent-cyan)] peer-valid:-top-4 peer-valid:text-xs">
                    Project Details
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-xl bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-[var(--accent-cyan)] transition-all duration-300 flex items-center justify-center gap-4 group mt-8 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : (
                    <>
                      Send Message 
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Form Background Accent Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[var(--accent-cyan)]/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
