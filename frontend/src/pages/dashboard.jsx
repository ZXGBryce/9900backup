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
            <h1>Weekly News</h1>
            <div className='news-bloclk'>
                <p><h5>1.Global Shift towards ESG:</h5> The recent UN conference highlighted the importance of ESG metrics in driving sustainable growth in the financial sector. FinTech companies are now in a better position to leverage these metrics for ethical investments.</p>
                <p><h5>2.Paris Agreement's New Targets:</h5> The Paris Agreement's updated goals for 2023 emphasize the significance of transparent ESG reporting. FinTech industries worldwide are urged to align their financial products accordingly.</p>
                <p><h5>3.TCFD Recommendations:</h5> The Task Force on Climate-related Financial Disclosures (TCFD) has recently released a new set of guidelines on integrating climate risks and opportunities in financial decision-making.</p>
            </div>
          </div>
          <hr />
          <div className='container-block'>
            <h1>System Update</h1>
            <div className='news-bloclk'>
              <p><h5>Version 2.0.1 - Released on [03 Nov 2023]</h5></p>
              <p><h5>1.Account Management Enhancements:</h5><b>·</b> Streamlined user registration process with reduced steps.</p>
              <p><h5>2.Framework Selection:</h5><b>·</b> Added three ESG frameworks to the list.<br/><b>·</b> Enhanced UI for easier framework browsing.</p>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    )
  }
  
export default Dashboard;
