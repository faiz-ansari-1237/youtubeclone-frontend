// src/components/Footer.jsx

import React from 'react';

const Footer = () => (
  <footer className="w-full bg-gray-100 text-center py-3 mt-auto border-t text-sm text-gray-600">
    <span>
      © {new Date().getFullYear()} YouTube Clone. This project is for educational purposes only and is not affiliated with YouTube.
    </span>
  </footer>
);

export default Footer;