import { Copyright } from '../helper';
import { BrowserRouter, Routes, Link, Route, useNavigate, useLocation } from 'react-router-dom';


function Dashboard () {
    const navigate = useNavigate();
    return (
      <div style={{height:'100vh'}}>
        <div style={{ display: 'flex', alignItems: 'center', height:'10%'}}>
          <div style={{marginLeft: '5%', display: 'flex ', alignItems: 'center'}}><h1>Glitch</h1></div>
          
        </div>
        {/* <hr /> */}
        
        {/* Bottom half */}
        <div style={{ display: 'flex', alignItems: 'center', height:'80%', justifyContent: 'center'}}>
          <div style={{ display: 'flex', flexDirection:'column', alignItems: 'center', width: '10%', height: '100%', border: '1px solid black'}}>
            <div className='unclickableDiv'>Dashboard</div>
            <div className='clickableDiv'>Analsis History</div>
            <div className='clickableDiv' onClick={() => navigate('/newAnalysis')}>New Analsis</div>
            <div className='clickableDiv'>Profile</div>
            <div className='clickableDiv'>Logout</div>
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
