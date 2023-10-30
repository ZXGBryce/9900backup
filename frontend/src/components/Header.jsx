import React, { useState, useEffect } from 'react'
import { useCustomNavigate, logout } from '../utils'
import Drawer from '@mui/material/Drawer'
import MenuIcon from '@mui/icons-material/Menu'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Navbar from './NavBar'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import "../css/Header.css"
import callAPI from '../callAPI';

function Header() {
    const [drawerOpen, setDrawerOpen] = useState(window.innerWidth <= 1000 ? false : true);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1000);
    const navigate = useCustomNavigate();
    const token = localStorage.getItem('token')

    // open close drawer
    function toggleDrawer() {
        if (isMobileView) {
            setDrawerOpen(!drawerOpen);
        }
    };

    // responsive window
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth > 1300) {
                setIsMobileView(false);
                setDrawerOpen(true);
            } else {
                setIsMobileView(true);
                setDrawerOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobileView, drawerOpen]);
    
    //admin function
    function handleAdminOnClick(){
        console.log(token)
        callAPI('GET','admin/check_admin', token)
          .then(response => {
            console.log(response)
            if (response.code === 20001){
              navigate('admin')
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
      
    //logout function
    function logoutAction () {
        logout()
        navigate('')
    }

    return (
        <div>
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                backgroundColor: '#4b6ef7',
                height: '60px'
            }}>
                <div>
                    {isMobileView && <MenuIcon style={{ color: 'white', cursor: 'pointer' }} onClick={toggleDrawer} />}
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="contained" color="primary" style={{ marginRight: '30px' }} onClick={handleAdminOnClick}>
                        <SupervisorAccountIcon/>
                        <div className='btn-text'>
                            Admin
                        </div>
                    </Button>

                    <Avatar src="path_to_profile_picture.jpg" style={{ marginRight: '10px', cursor: 'pointer'}} onClick={() => {navigate('profile/profileId')}} />
                    <Button variant="contained" color="secondary" onClick={() => {logoutAction()}}>
                        <ExitToAppIcon/>
                        <div className='btn-text'>
                            Logout
                        </div>
                    </Button>
                </div>
            </header>

            <Drawer variant={isMobileView ? 'temporary' : 'permanent'} open={drawerOpen} onClose={toggleDrawer}>
                <Navbar />
            </Drawer>
        </div>
    );
}

export default Header;

