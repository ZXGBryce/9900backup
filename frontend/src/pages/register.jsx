import React from 'react';
import PropTypes from 'prop-types';
import { MyButton } from '../components/MyButton';
import { TextField } from '@mui/material';
import { useEmptyValidation, useEmailValidation, Copyright} from '../helper';
import { Link } from 'react-router-dom'
import Avatar from '@mui/material/Avatar';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';


const Register = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState(''); //TODO: Add confirmPassword field
  const [name, setName] = React.useState('');
  const emailIsValid = useEmailValidation(email);
  const passwordIsValid = useEmptyValidation(password);
  const nameIsValid = useEmptyValidation(name);
  const [readyToSubmit, setReadyToSubmit] = React.useState(false);
  React.useEffect(() => {
    if (emailIsValid && passwordIsValid && nameIsValid) {
      setReadyToSubmit(true);
    } else {
      setReadyToSubmit(false);
    }
  }, [email, password, name, emailIsValid, passwordIsValid, nameIsValid, confirmPassword]);
  
  //TODO: Wait for backend to be ready, then change the API call
  const registerAction = async () => {
    if (readyToSubmit) {
      const res = await fetch('http://localhost:5005/user/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          name
        })
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        props.setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', email);
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' , alignItems: 'center'}}>
      <div style={{ width: '75%', margin: '3% auto', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '30%'}}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main',  margin: '0 auto'}}> 
          </Avatar>
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main',  margin: '0 auto'}}>
            <LockOutlinedIcon />
          </Avatar> */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '5%'}}><h1>Sign Up</h1></div>
          <div style={{ display: 'flex'}} >
            {/* <div style={{ display: 'flex', alignItems: 'center', marginRight: '31px' }}>Email: &nbsp;</div> */}
            <TextField onChange={(e) => setEmail(e.target.value)} label='Email*' value={email} variant="outlined" style={{ width: '100%'}}/>
          </div>
          <br />
          <div style={{ display: 'flex' }} >
            {/* <div style={{ display: 'flex', alignItems: 'center', marginRight: '27px' }}>Name: &nbsp;</div> */}
            <TextField onChange={(e) => setName(e.target.value)} label='User Name*' value={name} variant="outlined" style={{ width: '100%'}}/>
          </div>
          <br />
          <div style={{ display: 'flex' }} >
            {/* <div style={{ display: 'flex', alignItems: 'center', marginRight: '27px' }}>Password: &nbsp;</div> */}
            <TextField onChange={(e) => setPassword(e.target.value)} label='Password*' value={password} variant="outlined"  type="password" style={{ width: '100%'}}/>
          </div>
          <br />
          <div style={{ display: 'flex' }} >
            {/* <div style={{ display: 'flex', alignItems: 'center', marginRight: '27px' }}>Confirm Password: &nbsp;</div> */}
            <TextField onChange={(e) => setConfirmPassword(e.target.value)} label='Confirm Password*' value={confirmPassword} variant="outlined"  type="password" style={{ width: '100%'}}/>
          </div>
          <br />
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <MyButton onClick={registerAction} disabled={!readyToSubmit} text={readyToSubmit ? 'Register' : 'Please Enter valid Details'}></MyButton>
          </div>
          
          <Link to="/login" href="#" variant="body2" style={{ display: 'flex', justifyContent: 'center', marginTop: '5%'}}>
            Already have an account? Sign in
          </Link>
          
          <Copyright sx={{ mt: 8, mb: 4 }} />
    
        </div>
      </div>
    </div>
  );
}
Register.propTypes = {
  setToken: PropTypes.func
};

export default Register;
