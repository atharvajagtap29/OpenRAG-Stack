import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UploadCloud, Files, Book, Info, Github } from "lucide-react";

const Navbar = () => {
  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-1 transition-colors ${
      isActive ? "text-blue-600 font-semibold" : "text-muted-foreground"
    }`;

  return (
    <header className="w-full border-b bg-white shadow-sm dark:bg-background dark:border-slate-800">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* App Name */}
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          ContextQ
        </h1>

        {/* Nav Links */}
        <nav className="flex items-center space-x-2 sm:space-x-4">
          {/* Upload Context */}
          <NavLink to="/" className={navLinkStyle}>
            <UploadCloud className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </NavLink>

          {/* View Contexts */}
          <NavLink to="/contexts" className={navLinkStyle}>
            <Files className="h-4 w-4" />
            <span className="hidden sm:inline">Contexts</span>
          </NavLink>

          {/* Docs */}
          <Button variant="ghost" size="sm" asChild>
            <a href="#docs" className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              <span className="hidden sm:inline">Docs</span>
            </a>
          </Button>

          {/* GitHub */}
          <Button variant="outline" size="sm" asChild>
            <a
              href={import.meta.env.VITE_GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
