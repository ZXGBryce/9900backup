import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Link, Route, useNavigate, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import Home from './pages/home.jsx';
import Register from './pages/register.jsx';
import Login from './pages/login.jsx';
import Reset from './pages/reset.jsx';
import Dashboard from './pages/dashboard.jsx';
import NewAnalysis from './pages/newAnalysis.jsx';

function App() {
  const [token, setToken] = React.useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    const lsToken = localStorage.getItem('token');
    if (lsToken) {
      setToken(lsToken);
    }
  }, [token]);
  
  React.useEffect(() => {
    if (token) {
      if (pathname === '/login' || pathname === '/register') {
        navigate('/dashboard');
      }
    }
  }, [token]);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/dashboard" element={<Dashboard token={token}/>} />
        <Route path='/newAnalysis' element={<NewAnalysis />} />
      </Routes>
    </>
  );
}



export default App;
