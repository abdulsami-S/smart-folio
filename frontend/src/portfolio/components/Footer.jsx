import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [clock, setClock] = useState('');
  
  useEffect(() => {
    const tick = () => {
      setClock(new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit', minute: '2-digit',
        second: '2-digit', hour12: false
      }).format(new Date()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="w-full py-12 text-center relative z-10 border-t" style={{ borderColor: 'var(--border-sub)', backgroundColor: 'rgba(56,25,50,0.9)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
      <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-12">
        
        {/* Live IST Clock */}
        <div className="flex flex-col items-center">
          <div 
            className="font-black tracking-[-0.02em]"
            style={{ fontSize: '3.5rem', lineHeight: 1, color: 'var(--fg)', fontFamily: 'var(--font-display)' }}
          >
            {clock}
          </div>
          <div 
            className="mt-2 font-bold uppercase text-[var(--fg-40)]"
            style={{ fontSize: '0.7rem', letterSpacing: '0.2em' }}
          >
            IST — IIIT DHARWAD, KARNATAKA
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-[var(--fg-40)] text-xs uppercase tracking-widest font-semibold border-t pt-8 w-full flex justify-center gap-4" style={{ borderColor: 'var(--border-sub)' }}>
          <span>BUILT BY SAMI.</span>
          <span>&middot;</span>
          <a href="/admin/login" className="hover:text-[var(--accent)] transition-colors duration-300" style={{ pointerEvents: 'auto' }}>ADMIN</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
