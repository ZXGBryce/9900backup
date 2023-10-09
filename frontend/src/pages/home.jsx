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
    <>
      <div style={{ display: 'flex ', alignItems: 'center'}}>
        <div style={{marginLeft: '5%', display: 'flex ', alignItems: 'center'}}><h2>Glitch</h2></div>
        <div style={{ display: 'flex ', alignItems: 'center', width: '100%',height: '100%'}}>
          {/* <Button onClick={() => navigate('/register')} sx={{ width: '15%', height: '5%',padding: '1%', margin: '1.2%', marginLeft: '50%',backgroundColor: '#66bb6a', color: '#fff', '&:hover': { backgroundColor: '#43a047' } }}><h2>Register</h2></Button> */}
          {/* <Button onClick={() => navigate('/login')} sx={{ width: '15%', height: '5%',padding: '1%', margin: '1.2%', marginLeft: '4%', fontSize: '10%', backgroundColor: '#66bb6a', color: '#fff', '&:hover': { backgroundColor: '#43a047' } }}><h2>Login</h2></Button> */}
          <CustomButton onClick={() => navigate('/register')} sx={{marginLeft: '60%',}}>Register</CustomButton>
          <CustomButton onClick={() => navigate('/login')}>Login</CustomButton>
        </div>
      </div>
      <hr />
      
      <div className="App">
        <h1>Home Page</h1>
      </div>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </>
  );
}
  
export default Home;
  