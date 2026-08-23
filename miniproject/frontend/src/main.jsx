import React from "react";
import ReactDOM from "react-dom/client";

import "./output.css"; // Tailwind built file

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import App from "./App";
import ProfileSetup from "./components/ProfileSetup";
import Dashboard from "./components/Dashboard";
import AptitudeRound from "./components/AptitudeRound";
import TechnicalRound from "./components/TechnicalRound";
import CodingRound from "./components/CodingRound";
import ReportCard from "./components/ReportCard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<ProfileSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/technical" element={<TechnicalRound />} />
        <Route path="/coding" element={<CodingRound />} />
        {/* FIXED — no ID needed */}
        <Route path="/aptitude" element={<AptitudeRound />} />
        <Route path="/report" element={<ReportCard />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
