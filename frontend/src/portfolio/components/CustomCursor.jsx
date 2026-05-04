import React, { createContext, useContext } from 'react';

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

if (typeof window !== 'undefined') {
  window.__cursorMode = 'default';
}

// Custom cursor removed — using default browser cursor
const CustomCursor = () => null;

export default CustomCursor;
