import React from 'react';
import PropTypes from 'prop-types';
import { MyButton } from '../components/MyButton';
import { TextField } from '@mui/material';
import { useEmptyValidation, useEmailValidation } from '../helper';

const Register = (props) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
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
  }, [email, password, name, emailIsValid, passwordIsValid, nameIsValid]);
  
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
    <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '75%', margin: '20% auto', display: 'flex', justifyContent: 'center' }}>
    <div >
      <div style={{ display: 'flex' }} >
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '31px' }}>Email: &nbsp;</div>
        <TextField onChange={(e) => setEmail(e.target.value)} label='email' value={email} variant="outlined" />
      </div>
      <br />
      <div style={{ display: 'flex' }} >
        <div style={{ display: 'flex', alignItems: 'center' }}>Password: &nbsp;</div>
        <TextField onChange={(e) => setPassword(e.target.value)} label='password' value={password} variant="outlined" />
      </div>
      <br />
      <div style={{ display: 'flex' }} >
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '27px' }}>Name: &nbsp;</div>
        <TextField onChange={(e) => setName(e.target.value)} label='name' value={name} variant="outlined" />
      </div>
      <br />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MyButton onClick={registerAction} disabled={!readyToSubmit} text={readyToSubmit ? 'Register' : 'Please Enter valid Details'}></MyButton>
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
