// src/App/Pages/ContextsPage.jsx
import React from "react";
import Contexts from "../Components/Contexts";

const ContextsPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-10">Uploaded Contexts</h1>
      <Contexts />
    </div>
  );
};

export default ContextsPage;
