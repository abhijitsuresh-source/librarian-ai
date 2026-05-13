import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Tool from './pages/Tool.jsx';
import Analysis from './pages/Analysis.jsx';
import Library from './pages/Library.jsx';
import Navbar from './components/Navbar.jsx';

export default function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/tool" element={<><Navbar /><Tool /></>} />
        <Route path="/analysis/:id" element={<><Navbar /><Analysis /></>} />
        <Route path="/library" element={<><Navbar /><Library /></>} />
      </Routes>
    </div>
  );
}
