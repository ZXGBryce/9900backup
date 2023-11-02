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
import Metrics from './pages/metrics.jsx';
import Result from './pages/result.jsx';
import Profile from './pages/profile.jsx';
import AnalysisHistory from './pages/analysisHistory.jsx';
// import Loading from '../src/pages/Loading';


function App() {
  const [token, setToken] = React.useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  // Redirect the user
  React.useEffect(() => {
    // update the state
    const lsToken = localStorage.getItem('token');
    if (lsToken) {
      setToken(lsToken);
      if (pathname === '/login') {
        navigate('/dashboard');
      }
    }
    // If the user is not logged in, redirect to landing page
    else {
      if (pathname !== '/login' && pathname !== '/register') {
        navigate('/');
      }
    }
  }, [pathname, navigate]);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path='/analysis' element={<NewAnalysis token={token} />} />
        <Route path='/admin' element={<Admin token={token} />} />
        <Route path='/analysis/:frameworkId' element={<Analysis token={token} />} />
        <Route path='/analysis/:frameworkId/metrics' element={<Metrics token={token} />} />
        <Route path='/analysis/:frameworkId/:analysisId/result' element={<Result token={token} />} />
        <Route path='/profile' element={<Profile token={token} />} />
        <Route path='/analysisHistory' element={<AnalysisHistory token={token} />} />
      </Routes>
    </>
  );
}



export default App;
