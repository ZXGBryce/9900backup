import { Copyright } from '../helper';
import { BrowserRouter, Routes, Link, Route, useNavigate, useLocation } from 'react-router-dom';
import callAPI from '../callAPI';
import Header from '../components/Header'
import Footer from '../components/Footer'

import "../css/pages/Dashboard.css"
import "../css/Site.css"

const Dashboard = (props) => {
    const navigate = useNavigate();
    // const token = localStorage.getItem('token')
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
    
    return (
      <div className='site-struct'>
        <Header/>
        <div className='main-container'>
          <div className='container-block'>
            <h3>Weekly News</h3>
          </div>
          <hr />
          <div className='container-block'>
            <h3>System Update</h3>
          </div>
        </div>
        <Footer/>
      </div>
    )
  }
  
export default Dashboard;
