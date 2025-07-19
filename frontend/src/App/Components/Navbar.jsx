import React from "react";
import { Button } from "@/components/ui/button";
import { Book, Info, Github } from "lucide-react";

const Navbar = () => {
  return (
    <header className="w-full border-b bg-white shadow-sm dark:bg-background dark:border-slate-800">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* App Name - Sticks to left */}
        <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          ContextQ
        </h1>

        {/* Nav Links - Stick to right */}
        <nav className="flex items-center space-x-2 sm:space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="#docs" className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              <span className="hidden sm:inline">Docs</span>
            </a>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <a href="#about" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">About</span>
            </a>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a
              // Link to GitHub repository. Comes from .env
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
