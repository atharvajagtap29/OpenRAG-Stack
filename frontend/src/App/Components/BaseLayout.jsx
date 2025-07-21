// src/App/Components/BaseLayout.jsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";

const BaseLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Toaster richColors position="top-center" />
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-start px-6 pt-18">
        <Outlet />{" "}
        {/* Outlet is a special component from react-router-dom. Like a placeholder for the actual content that differs from page to page */}
      </main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
