import React from 'react';
import PropTypes from 'prop-types';
import { MyButton } from '../components/MyButton';
import { TextField } from '@mui/material';
import { useEmptyValidation, useEmailValidation, Copyright} from '../helper';
import { BrowserRouter, Routes, Link, Route, useNavigate, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

const Register = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeat_password, setConfirmPassword] = React.useState(''); //TODO: Add confirmPassword field
  const [username, setName] = React.useState('');
  const emailIsValid = useEmailValidation(email);
  const passwordIsValid = useEmptyValidation(password);
  const nameIsValid = useEmptyValidation(username);
  const [readyToSubmit, setReadyToSubmit] = React.useState(false);
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (emailIsValid && passwordIsValid && nameIsValid && password === repeat_password) {
      setReadyToSubmit(true);
    } else {
      setReadyToSubmit(false);
    }
  }, [email, password, username, emailIsValid, passwordIsValid, nameIsValid, repeat_password]);
  
  const registerAction = async () => {
    if (readyToSubmit) {
      const res = await fetch('http://127.0.0.1:5000/auth/sign_up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password,
          repeat_password
        })
      });
      const data = await res.json();
      console.log(data);
      if (data.code!==20000){
        alert('Email or username already exists');
      // if (data.error) {
      //   alert(data.error);
      } else {
        alert('Successfully registered. Please login to continue!')
        navigate('/login');
        // props.setToken(data.token);
        // localStorage.setItem('token', data.token);
        // localStorage.setItem('email', email);
      }
    }
  };

  return (
    <div style={{height:'100vh'}}>
      <div style={{ display: 'flex', alignItems: 'center', height:'10%'}}>
      <div style={{marginLeft: '2%', display: 'flex ', alignItems: 'center',  cursor: 'pointer',}} onClick={ () => navigate('/') }>
        <AutoGraphIcon style={{ color: 'blue' }} fontSize="large" />
        <h1 className='text-gradient'>Glitch</h1>
      </div>
        
      </div>
      
      <div style={{ height:'100vh', display: 'flex', justifyContent: 'center' , alignItems: 'center', height:'90%'}}>
        <div style={{ width: '75%', margin: '3% auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '30%'}}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main',  margin: '0 auto'}}> 
            </Avatar>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5%'}}><h2>Sign Up</h2></div>
            <div style={{ display: 'flex'}} >
              <TextField onChange={(e) => setEmail(e.target.value)} label='Email*' value={email} variant="outlined" style={{ width: '100%'}}/>
            </div>
            <br />
            <div style={{ display: 'flex' }} >
              <TextField onChange={(e) => setName(e.target.value)} label='User Name*' value={username} variant="outlined" style={{ width: '100%'}}/>
            </div>
            <br />
            <div style={{ display: 'flex' }} >
              <TextField onChange={(e) => setPassword(e.target.value)} label='Password*' value={password} variant="outlined"  type="password" style={{ width: '100%'}}/>
            </div>
            <br />
            <div style={{ display: 'flex' }} >
              <TextField onChange={(e) => setConfirmPassword(e.target.value)} label='Confirm Password*' value={repeat_password} variant="outlined"  type="password" style={{ width: '100%'}}/>
            </div>
            <br />
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MyButton style={{width:'100%'}} onClick={registerAction} disabled={!readyToSubmit} text={readyToSubmit ? 'Register' : 'Please Enter valid Details'}></MyButton>
            </div>
            
            <Link to="/login" href="#" variant="body2" style={{ display: 'flex', justifyContent: 'center', marginTop: '5%'}}>
              Already have an account? Sign in
            </Link>
            
            <Copyright sx={{ mt: 8, mb: 4 }} />
      
          </div>
        </div>
      </div>
    </div>
  );
}
Register.propTypes = {
  setToken: PropTypes.func
};

export default Register;
