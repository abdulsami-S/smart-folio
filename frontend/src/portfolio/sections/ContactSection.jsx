import React, { useState, useEffect, useRef, useContext } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Loader2, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { ThemeContext } from '../../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const Contact = ({ portfolio }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const socialLinksRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

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

      /* ── Emit sectionChange for ThreeBackground transition effect ── */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 60%',
        onEnter: () => window.dispatchEvent(new CustomEvent('sectionChange')),
        once: true,
      });
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
        style: { background: 'var(--bg-card)', color: 'var(--fg)', border: '1px solid var(--border)' }
      });
    }, 1500);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-40 relative overflow-hidden" style={{ zIndex: 1, backgroundColor: 'transparent', borderTop: '1px solid var(--border-sub)' }}>
      
      {/* Huge subtle background text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] whitespace-nowrap pointer-events-none select-none text-[var(--fg-06)]" style={{ fontFamily: 'var(--font-display)', fontWeight: 300, fontStyle: 'italic' }}>
        CONTACT
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left: Big CTA */}
          <div className="flex flex-col justify-between">
            <div ref={headingRef}>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent)] mb-8 block font-semibold">05 // Contact</span>
              <h2 style={{ fontFamily: 'var(--font-display)', lineHeight: 1.05 }}>
                <span 
                  className="block text-[var(--fg)]" 
                  style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 300 }}
                >
                  Let's Build
                </span>
                <span 
                  className="block text-[var(--fg)]" 
                  style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 300 }}
                >
                  Something
                </span>
                <span 
                  className="block text-[var(--accent)] drop-shadow-[0_0_20px_rgba(201,112,74,0.4)]" 
                  style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 700, fontStyle: 'italic' }}
                >
                  Together.
                </span>
              </h2>
            </div>

            <div className="mt-20" ref={socialLinksRef}>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--fg-40)] mb-4">Drop a line</p>
              <a 
                href={`mailto:${portfolio?.socials?.email || 'workwithsami07@gmail.com'}`} 
                className="text-2xl md:text-4xl font-light text-[var(--fg)] hover:text-[var(--accent)] transition-colors duration-300 relative group inline-block cursor-pointer"
              >
                {portfolio?.socials?.email || 'workwithsami07@gmail.com'}
                <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[var(--accent)] group-hover:w-full transition-all duration-500"></div>
              </a>

              <div className="flex gap-6 mt-16">
                {portfolio?.socials?.github && (
                  <a href={portfolio.socials.github} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full border transition-all duration-300 group cursor-pointer" style={{ backgroundColor: 'var(--fg-06)', borderColor: 'var(--border)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent) 10%, transparent)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--fg-06)' }}>
                    <Github size={24} className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors" />
                  </a>
                )}
                {portfolio?.socials?.linkedin && (
                  <a href={portfolio.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full border transition-all duration-300 group cursor-pointer" style={{ backgroundColor: 'var(--fg-06)', borderColor: 'var(--border)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent) 10%, transparent)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--fg-06)' }}>
                    <Linkedin size={24} className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors" />
                  </a>
                )}
                {portfolio?.socials?.twitter && (
                  <a href={portfolio.socials.twitter} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full border transition-all duration-300 group cursor-pointer" style={{ backgroundColor: 'var(--fg-06)', borderColor: 'var(--border)' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent) 10%, transparent)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.backgroundColor = 'var(--fg-06)' }}>
                    <Twitter size={24} className="text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right: Glassmorphism Form */}
          <div className="relative" ref={formRef}>
            <form onSubmit={handleSubmit} className="backdrop-blur-2xl p-10 md:p-14 rounded-[2rem] border shadow-2xl relative z-10" style={{ backgroundColor: 'rgba(68,32,62,0.8)', borderColor: 'var(--border-sub)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
              <div className="space-y-10">
                <div className="relative group">
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-transparent border-b px-0 py-4 focus:outline-none peer transition-colors placeholder-transparent text-[var(--fg)]" 
                    style={{ borderColor: 'var(--border)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    placeholder="Name"
                    id="name"
                  />
                  <label htmlFor="name" className="absolute left-0 top-4 text-sm tracking-widest uppercase transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-valid:-top-4 peer-valid:text-xs" style={{ color: 'var(--fg-40)' }}>
                    Your Name
                  </label>
                </div>
                
                <div className="relative group">
                  <input 
                    required 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-transparent border-b px-0 py-4 focus:outline-none peer transition-colors placeholder-transparent text-[var(--fg)]" 
                    style={{ borderColor: 'var(--border)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    placeholder="Email"
                    id="email"
                  />
                  <label htmlFor="email" className="absolute left-0 top-4 text-sm tracking-widest uppercase transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-valid:-top-4 peer-valid:text-xs" style={{ color: 'var(--fg-40)' }}>
                    Email Address
                  </label>
                </div>
                
                <div className="relative group">
                  <textarea 
                    required 
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-transparent border-b px-0 py-4 focus:outline-none peer transition-colors resize-none placeholder-transparent text-[var(--fg)]" 
                    style={{ borderColor: 'var(--border)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    placeholder="Message"
                    id="message"
                  ></textarea>
                  <label htmlFor="message" className="absolute left-0 top-4 text-sm tracking-widest uppercase transition-all duration-300 peer-focus:-top-4 peer-focus:text-xs peer-valid:-top-4 peer-valid:text-xs" style={{ color: 'var(--fg-40)' }}>
                    Project Details
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-4 group mt-8 cursor-pointer disabled:opacity-70"
                  style={{ backgroundColor: 'var(--fg)', color: 'var(--bg)' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--accent)'; e.currentTarget.style.color = '#fff3e6'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--fg)'; e.currentTarget.style.color = 'var(--bg)'; }}
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full blur-[100px] rounded-full pointer-events-none -z-10" style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)' }}></div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
