import "./App.css";

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardAdherent from "./pages/DashboardAdherent";
import DashboardBibliothecaire from "./pages/DashboardBibliothecaire";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        {/* Routes protégées (Simples redirections basées sur le rôle stocké) */}
        <Route path="/adherent/dashboard" element={<DashboardAdherent />} />
        <Route path="/admin/dashboard" element={<DashboardBibliothecaire />} />

        {/* Redirection par défaut vers le login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
