import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.scss'
import Navbar from "./components/Navbar";
import Graph from "./pages/Graph";
import Home from "./pages/Home";
import About from "./pages/About";
import Pricing from "./pages/Pricing";
import InputPage from "./pages/InputPage";
import Login from "./components/Login";
  
const App = () => {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <main className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
             <Route path="/fileinput" element={<InputPage/>} />
            <Route path="/login" element={<Login/>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
