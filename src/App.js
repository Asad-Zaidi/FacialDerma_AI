import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Analysis from './Pages/Analysis';
import About from './Pages/About';
import Profile from './Pages/Profile';
import LoginForm from './Pages/Login';
import SignupForm from './Pages/Signup';
import ForgetPassword from './Pages/ForgetPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/Analysis" element={<Analysis />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/Profile" element={<Profile />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;