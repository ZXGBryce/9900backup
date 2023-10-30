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
import Admin from './pages/admin.jsx';
import Analysis from './pages/analysis.jsx';
import Result from './pages/result.jsx';

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
      if (pathname === '/login') {
        navigate('/dashboard');
      } 
      // else if (pathname === '/register'){
      //   navigate('/login');
      // }
    }
    // If the user is not logged in, redirect to landing page
    else {
      if (pathname === '/dashboard' || pathname === '/newAnalysis') {
        navigate('/');
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
        <Route path="/dashboard" element={<Dashboard token />} />
        <Route path='/newAnalysis' element={<NewAnalysis token />} />
        <Route path='/admin' element={<Admin setToken={setToken} />} />
        <Route path='/analysis/:frameworkId' element={<Analysis token />} />
        <Route path='/result' element={<Result setToken={setToken} />} />
      </Routes>
    </>
  );
}



export default App;
