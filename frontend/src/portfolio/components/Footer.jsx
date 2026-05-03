import React from 'react';

const Footer = ({ portfolio }) => {
  return (
    <footer className="py-8 border-t border-black/10 dark:border-white/5 text-center">
      <div className="container mx-auto px-6">
        <p className="text-sm opacity-60">
          © {new Date().getFullYear()} {portfolio?.name || 'Sami'}. All rights reserved.
        </p>
        <p className="text-xs opacity-40 mt-2">
          Designed & Built with React, Three.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
};

export default Footer;
