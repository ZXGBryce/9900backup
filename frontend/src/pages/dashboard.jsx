import { Copyright } from '../helper';
import { BrowserRouter, Routes, Link, Route, useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import callAPI from '../callAPI';

const Dashboard = (props) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    //TODO: Wait for backend to be ready, then change the API call
    // const logoutAction = async () => {
    //   const res = await fetch('http://localhost:5005/user/auth/logout', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${token}`
    //     }
    //   });
    //   const data = await res.json();
    //   if (data.error) {
    //     alert(data.error);
    //   } else {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('email');
    //     setToken(null);
    //     navigate('/');
    //   }
    // }
    function handleAdminOnClick(){

      callAPI('GET','admin/check_admin', token)
        .then(response => {
          console.log(response)
          if (response === true){
            navigate('/admin')
          }
          else{
            alert("You are not an admin, please login as an admin to access this page")
          }
        }
      )
      .catch(error => {
        console.error('Error:', error)
      })
    }
    const logoutAction = async () => {
      localStorage.clear();
      // localStorage.removeItem('token');
      // localStorage.removeItem('email');
      props.setToken(null);
      navigate('/');
    }
    
    return (
      <div style={{height:'100vh'}}>
        <div style={{ display: 'flex', alignItems: 'center', height:'10%',justifyContent: 'space-between', width: '100%'}}>
          <div style={{marginLeft: '5%', display: 'flex ', alignItems: 'center'}}><h1>Glitch</h1></div>
          <Button variant="contained" color="primary" onClick={handleAdminOnClick} style={{ marginRight: '5%' }}>
            Admin
          </Button>
        </div>
        {/* <hr /> */}
        
        {/* Bottom half */}
        <div style={{ display: 'flex', alignItems: 'center', height:'80%', justifyContent: 'center'}}>
          <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center', width: '10%', height: '100%', border: '1px solid black'}}>
            <div className='unclickableDiv'>Dashboard</div>
            <div className='clickableDiv'>Analsis History</div>
            <div className='clickableDiv' onClick={() => navigate('/newAnalysis')}>New Analsis</div>
            <div className='clickableDiv'>Profile</div>
            <div className='clickableDiv'onClick={logoutAction}>Logout</div>
          </div>
          <div style={{ display: 'flex ', flexDirection:'column', alignItems: 'center', justifyContent: 'center', width: '80%',height: '100%', border: '1px solid black'}}>
            <div style={{width: '100%', height: '10%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black'}}><h2>Dashboard</h2></div>
            <div style={{width: '100%', height: '45%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black'}}>User Information</div>
            <div style={{width: '100%', height: '45%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid black'}}>News and Update</div>
          </div>
          <div style={{ display: 'flex ', alignItems: 'center', width: '10%',height: '100%', border: '1px solid black'}}>
          </div>
        </div>
        
        <div className="App">
          
        </div>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </div>
    )
  }
  
export default Dashboard;
