import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Analysis from './Pages/Analysis';
import About from './Pages/About';
import Profile from './Pages/Profile';
import AuthForm from './Pages/Auth';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/Analysis" element={<Analysis />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/Profile" element={<Profile />} />
        <Route exact path="/login" element={<AuthForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;