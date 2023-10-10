import React from 'react';
import { BrowserRouter, Routes, Link, Route, useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Copyright } from '../helper';

const CustomButton = styled(Button)({
  width: '20%',
  height: '5%',
  padding: '1%',
  margin: '1.2%',
  // marginLeft: '4%',
  backgroundColor: '#4dabf5',
  color: '#fff',
  '& .MuiButton-label': { fontSize: '100%',},
  '&:hover': { backgroundColor: '#1976d2',},
});

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{height:'100vh'}}>
      <div style={{ display: 'flex ', alignItems: 'center', height:'10%'}}>
        <div style={{marginLeft: '5%', display: 'flex ', alignItems: 'center'}}><h1>Glitch</h1></div>
        <div style={{ display: 'flex ', alignItems: 'center', width: '100%',height: '100%'}}>
          <CustomButton onClick={() => navigate('/register')} sx={{marginLeft: '70%', height:'80%', width:'10%', fontSize: 'calc(0.8vw + 0.8vh)'}}>Register</CustomButton>
          <CustomButton onClick={() => navigate('/login')} sx={{height:'80%', width:'10%', fontSize: 'calc(0.8vw + 0.8vh)'}}>Login</CustomButton>
        </div>
      </div>
      <hr />
      
      <div className="App">
        <h2>Home Page</h2>
      </div>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </div>
  );
}
  
export default Home;
  