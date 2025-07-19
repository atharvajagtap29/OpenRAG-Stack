// src/App.jsx

import React from "react";
import Navbar from "./App/Components/Navbar";
import Footer from "./App/Components/Footer";
import UploadFile from "./App/Components/UploadFile";

const App = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 flex-col px-6 py-10 gap-8 max-w-4xl mx-auto">
        <div className="w-full max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold">Upload Your Document</h1>
        </div>

        <UploadFile />
      </main>

      <Footer />
    </div>
  );
};

export default App;
