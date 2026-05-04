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
    <footer className="w-full bg-[var(--bg)] py-12 text-center relative z-10 border-t" style={{ borderColor: 'var(--border-sub)' }}>
      <div className="container mx-auto px-6 flex flex-col items-center justify-center gap-12">
        
        {/* Live IST Clock */}
        <div className="flex flex-col items-center">
          <div 
            className="font-black font-mono tracking-[-0.02em]"
            style={{ fontSize: '3.5rem', lineHeight: 1, color: 'var(--fg)' }}
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
        <div className="text-[var(--fg-40)] text-xs uppercase tracking-widest font-semibold border-t pt-8 w-full" style={{ borderColor: 'var(--border-sub)' }}>
          DESIGNED LIKE ANTIMATTER, BUILT BY SAMI.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
