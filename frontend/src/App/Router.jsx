// src/App/Router.jsx

import { Routes, Route } from "react-router-dom";
import BaseLayout from "./Components/BaseLayout";
import UploadPage from "./Pages/UploadPage";
import ContextsPage from "./Pages/ContextsPage";

const Router = () => {
  return (
    <Routes>
      {/* 👇 All routes inside this will use BaseLayout */}
      <Route path="/" element={<BaseLayout />}>
        <Route index element={<UploadPage />} /> {/* Renders on `/` */}
        <Route path="contexts" element={<ContextsPage />} />{" "}
      </Route>
    </Routes>
  );
};

export default Router;
