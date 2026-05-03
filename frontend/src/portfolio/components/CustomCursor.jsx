import React, { useEffect, useState, useRef, createContext, useContext } from 'react';

/* ─── CURSOR CONTEXT (global cursor mode state) ─── */
export const CursorContext = createContext({
  cursorMode: 'default',
  setCursorMode: () => {},
});

export const CursorProvider = ({ children }) => {
  const [cursorMode, setCursorMode] = useState('default');
  return (
    <CursorContext.Provider value={{ cursorMode, setCursorMode }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursorMode = () => useContext(CursorContext);

/* ─── CUSTOM CURSOR COMPONENT ─── */
const CustomCursor = () => {
  const { cursorMode } = useCursorMode();
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const delayedMouse = useRef({ x: 0, y: 0 });
  const hoveringRef = useRef(false);
  const clickingRef = useRef(false);
  const modeRef = useRef('default');

  // Keep refs in sync with state
  useEffect(() => { hoveringRef.current = isHovering; }, [isHovering]);
  useEffect(() => { clickingRef.current = isClicking; }, [isClicking]);
  useEffect(() => { modeRef.current = cursorMode; }, [cursorMode]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setIsVisible(true);

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    let rafId;
    const render = () => {
      delayedMouse.current.x +=
        (mouse.current.x - delayedMouse.current.x) * 0.12;
      delayedMouse.current.y +=
        (mouse.current.y - delayedMouse.current.y) * 0.12;

      if (ringRef.current) {
        const scale = clickingRef.current ? 0.75 : 1;
        ringRef.current.style.transform = `translate(calc(${delayedMouse.current.x}px - 50%), calc(${delayedMouse.current.y}px - 50%)) scale(${scale})`;

        const mode = modeRef.current;
        if (mode === 'view') {
          ringRef.current.style.width = '80px';
          ringRef.current.style.height = '80px';
          ringRef.current.style.borderColor = 'rgba(0,212,255,0.9)';
          ringRef.current.style.background = 'rgba(0,212,255,0.15)';
        } else if (hoveringRef.current) {
          ringRef.current.style.width = '64px';
          ringRef.current.style.height = '64px';
          ringRef.current.style.borderColor = 'rgba(0,212,255,0.9)';
          ringRef.current.style.background = 'transparent';
        } else {
          ringRef.current.style.width = '40px';
          ringRef.current.style.height = '40px';
          ringRef.current.style.borderColor = 'rgba(0,212,255,0.6)';
          ringRef.current.style.background = 'transparent';
        }
      }

      // Label visibility
      if (labelRef.current) {
        labelRef.current.style.opacity = modeRef.current === 'view' ? '1' : '0';
      }

      // Dot visibility in view mode
      if (dotRef.current) {
        dotRef.current.style.opacity = modeRef.current === 'view' ? '0' : '1';
      }

      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* DOT */}
      <div
        ref={dotRef}
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#00d4ff',
          boxShadow: '0 0 10px #00d4ff',
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          willChange: 'transform',
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* RING */}
      <div
        ref={ringRef}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'transparent',
          border: '1.5px solid rgba(0,212,255,0.6)',
          pointerEvents: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9998,
          transition:
            'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background 0.3s ease',
          willChange: 'transform, width, height, border-color, background',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* VIEW label inside ring */}
        <span
          ref={labelRef}
          style={{
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#00d4ff',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          VIEW →
        </span>
      </div>
    </>
  );
};

export default CustomCursor;
