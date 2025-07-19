// src/App/Components/Footer.jsx

import React from "react";

const Footer = () => {
  return (
    <footer className="w-full border-t py-4 mt-8">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ContextQ — Built using ShadCN UI
      </div>
    </footer>
  );
};

export default Footer;
