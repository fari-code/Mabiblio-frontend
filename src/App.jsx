import "./App.css";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
// import DashboardAdherent from "./pages/DashboardAdherent";
import DashboardBibliothecaire from "./pages/DashboardBibliothecaire";
// import Home from "./pages/Home";
// import Login from "./pages/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardBibliothecaire />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
