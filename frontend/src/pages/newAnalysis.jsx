import { useState } from 'react';
import { Copyright } from '../helper';
import { BrowserRouter, Routes, Link, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header'
import Footer from '../components/Footer'
import "../css/Site.css"
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { useCustomNavigate, } from '../utils'

const NewAnalysis = (props) => {
    const navigate = useCustomNavigate()
    const [activeBox, setActiveBox] = useState(null)

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

    // for box sizes 
    const StyledBox = styled(Box)(({ theme, bgcolor, active }) => ({
      width: '250px',
      height: '500px',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', 
      margin: theme.spacing(1),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: `linear-gradient(45deg, ${bgcolor}, ${shadeColor(bgcolor, -20)})`,
      transition: 'all 0.3s ease', 
    
      '&:hover': {
        transform: 'scale(1.05)',
        cursor: 'pointer',
        backgroundColor: shadeColor(bgcolor, -10),  
        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.4)', 
      },

      '@media (min-width: 750px) and (max-width: 1024px)': {
        width:'170px',
        height:'340px'
      },

      '@media (min-width: 600px) and (max-width: 750px)': {
        width:'150px',
        height:'360px',
      },

      // Adjust fontSize for smaller screens
      '@media (min-width: 300px) and (max-width: 650px)': {
        margin: theme.spacing(0.5),
        width:'83px',
        height:'140px',
      },

      // Adjust fontSize for smaller screens
      '@media (max-width: 300px)': {
        margin: theme.spacing(0.5),
        width:'63px',
        height:'100px',
      },

      backgroundColor: active ? shadeColor(bgcolor, -30) : bgcolor,
    }));

    // for front sizes 
    const StyledTypography = styled(Typography)(({ theme }) => ({
      // Default fontSize (for larger screens)
      fontSize: '35px',
      alignItems:'center',
    
      // Adjust fontSize for medium screens
      '@media (min-width: 750px) and (max-width: 1024px)': {
        fontSize: '20px',
      },

      // intermediate screen size
      '@media (min-width: 650px) and (max-width: 750px)': {
        fontSize: '15px',
      },

      // Adjust fontSize for smaller screens
      '@media (min-width: 300px) and (max-width: 650px)': {
        fontSize: '9px',
      },

      // Adjust fontSize for smaller screens
      '@media (max-width: 300px)': {
        fontSize: '8px',
      },
    }));

    
    // Helper function to darken or lighten a color
    function shadeColor(color, percent) {
      const R = parseInt(color.substring(1, 3), 16);
      const G = parseInt(color.substring(3, 5), 16);
      const B = parseInt(color.substring(5, 7), 16);
    
      const getHex = (num) => {
        const result = parseInt(num).toString(16);
        return result.length === 1 ? "0" + result : result;
      };
    
      return `#${getHex(R * (100 + percent) / 100)}${getHex(G * (100 + percent) / 100)}${getHex(B * (100 + percent) / 100)}`;
    }
    

    const handleBoxClick = (boxName) => {
      setActiveBox(boxName);
      navigate(`analysis/${boxName}`)

    };
    
    return (
      <div className='site-struct'>
        <Header/>
        <div className='main-container'>
          <div style={{ display:'flex', flexDirection:'row', justifyContent:'center'}}>
          <StyledBox bgcolor="#FE905D" onClick={() => handleBoxClick('TCFD')} active={activeBox === 'TCFD'}>
            <StyledTypography variant="body1">TCFD</StyledTypography>
          </StyledBox>
          <StyledBox bgcolor="#FEC35D" onClick={() => handleBoxClick('TNFD')} active={activeBox === 'TNFD'}>
            <StyledTypography variant="body1" >TNFD</StyledTypography>
          </StyledBox>
          <StyledBox bgcolor="#BDFC48"  onClick={() => handleBoxClick('APRA-CPG229')} active={activeBox === 'APRA-CPG229'}>
            <StyledTypography variant="body1" > APRA-CPG229 </StyledTypography>
          </StyledBox>
          <StyledBox bgcolor="#48D6FC"onClick={() => handleBoxClick('IFRS')} active={activeBox === 'IFRS'}>
            <StyledTypography variant="body1" >IFRS</StyledTypography>
          </StyledBox>
          </div>
        </div>
        <Footer/>
      </div>
    
    );

}
  
export default NewAnalysis;