import React from 'react';
import PropTypes from 'prop-types';
import { MyButton } from '../components/MyButton';
import { TextField } from '@mui/material';
import { useEmptyValidation, useEmailValidation, Copyright } from '../helper';
import { Link } from 'react-router-dom'
import Avatar from '@mui/material/Avatar';

const Login = (props) => {
  const [ username_or_email,  setUsername_or_Email] = React.useState('');
  const [password, setPassword] = React.useState('');
  const emailIsValid = useEmptyValidation( username_or_email);
  const passwordIsValid = useEmptyValidation(password);
  const [readyToSubmit, setReadyToSubmit] = React.useState(false);
  
  React.useEffect(() => {
    if (emailIsValid && passwordIsValid) {
      setReadyToSubmit(true);
    } else {
      setReadyToSubmit(false);
    }
  }, [ username_or_email, password, emailIsValid, passwordIsValid]);
  console.log('readyToSubmit', readyToSubmit);

  //TODO: Wait for backend to be ready, then change the API call
  const LoginAction = async () => {
    if (readyToSubmit) {
      const res = await fetch('http://127.0.0.1:5000/auth/sign_in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username_or_email,
          password
        })
      });
      const data = await res.json();
      console.log(data);
      if (data.code!==20000){
        alert('Wrong account or password');
      // if (data.error) {
      //   alert(data.error);
      } else {
        props.setToken(data.data.token);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem(' username_or_email',  username_or_email);
      }
    }
  };

  return (
    <div style={{height:'100vh'}}>
      <div style={{ display: 'flex', alignItems: 'center', height:'10%'}}>
        <div style={{marginLeft: '5%', display: 'flex ', alignItems: 'center'}}><h1>Glitch</h1></div>
        
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height:'90%' }}>
        <div style={{ width: '75%', margin: '3% auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '30%'}}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main',  margin: '0 auto'}}> 
            </Avatar>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5%'}}><h2>Sign In</h2></div>
            <div style={{ display: 'flex' }} >
              {/* <div style={{ display: 'flex', alignItems: 'center', marginRight: '40px' }}>Email: </div> */}
              <TextField onChange={(e) =>  setUsername_or_Email(e.target.value)} label='Email/User Name*' value={ username_or_email} variant="outlined" style={{ width: '100%'}}/>
            </div>
            <br />
            <div style={{ display: 'flex' }} >
              {/* <div style={{ display: 'flex', alignItems: 'center' }}>Password: &nbsp;</div> */}
              <TextField onChange={(e) => setPassword(e.target.value)} label='Password*' value={password} variant="outlined"  type="password" style={{ width: '100%'}}/>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <MyButton disabled={!readyToSubmit} onClick={LoginAction} text={readyToSubmit ? 'Login' : 'Please Enter valid Details'}></MyButton>
            </div>
            
            <Link to="/register" variant="body2" style={{ display: 'flex', justifyContent: 'center', marginTop: '5%'}}> 
              {"Don't have an account? Sign Up"}
            </Link>
            
            <Copyright sx={{ mt: 8, mb: 4 }} />
            
          </div>
        </div>
      </div>
    </div>
  );
}
Login.propTypes = {
  setToken: PropTypes.func
};

export default Login;
