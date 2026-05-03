import React, { useEffect, useRef, createContext, useContext } from 'react';

// Keep Context for backwards compatibility if needed, but we don't actively use it now
const CursorContext = createContext({
  cursorMode: 'default',
  setCursorMode: () => {},
});

export const CursorProvider = ({ children }) => {
  return (
    <CursorContext.Provider value={{ cursorMode: 'default', setCursorMode: () => {} }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursorMode = () => useContext(CursorContext);

// Initialize global state
if (typeof window !== 'undefined') {
  window.__cursorMode = 'default';
}

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  // Use refs to store actual positions to decouple from React state rendering delays
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Hide cursor on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    let animationFrameId;

    const render = () => {
      // Lerp ring towards mouse
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;

      // Update dot instantly
      if (dot) {
        dot.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Update ring with lerped position
      if (ring) {
        ring.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;

        // Handle VIEW mode logic directly in the render loop for absolute smooth performance
        if (window.__cursorMode === 'view') {
          ring.style.width = '80px';
          ring.style.height = '80px';
          ring.style.background = 'rgba(0,212,255,0.1)';
          ring.style.borderColor = 'rgba(0,212,255,0.4)';
          if (label) label.style.opacity = '1';
        } else {
          ring.style.width = '40px';
          ring.style.height = '40px';
          ring.style.background = 'transparent';
          ring.style.borderColor = 'rgba(0,212,255,0.3)';
          if (label) label.style.opacity = '0';
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Handle interactive elements hover effect (global)
    const handleMouseOver = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, [role="button"]');
      if (isInteractive && window.__cursorMode !== 'view') {
        if (ring) {
          ring.style.width = '60px';
          ring.style.height = '60px';
          ring.style.background = 'rgba(0,212,255,0.05)';
        }
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, [role="button"]');
      if (isInteractive && window.__cursorMode !== 'view') {
        if (ring) {
          ring.style.width = '40px';
          ring.style.height = '40px';
          ring.style.background = 'transparent';
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Return empty on touch devices
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      <div 
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-[var(--accent-cyan)] flex items-center justify-center transition-[width,height,background-color] duration-300 ease-out will-change-transform"
        style={{ width: '40px', height: '40px', borderWidth: '1px' }}
      >
        <span 
          ref={labelRef}
          className="text-[10px] font-bold text-[var(--accent-cyan)] tracking-widest uppercase transition-opacity duration-300"
          style={{ opacity: 0 }}
        >
          VIEW
        </span>
      </div>
      <div 
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full bg-[var(--accent-cyan)] will-change-transform"
        style={{ width: '8px', height: '8px' }}
      />
    </>
  );
};

export default CustomCursor;
