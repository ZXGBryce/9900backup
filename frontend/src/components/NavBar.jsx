import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon'
import HomeIcon from '@mui/icons-material/Home'
import FiberNewIcon from '@mui/icons-material/FiberNew'
import HistoryIcon from '@mui/icons-material/History'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

import '../css/Navbar.css';
import { useCustomNavigate, } from '../utils'


function Navbar({ drawerOpen }) {
  //const [drawerOpen, setDrawerOpen] = React.useState(window.innerWidth > 768)
  const navigate = useCustomNavigate()

  return (
    <Drawer
      variant='permanent' 
      open={drawerOpen}
    >

      <div className='logo-box' style={{ display: 'flex ', alignItems: 'center', height:'10%'}}>
          <div style={{ marginLeft: 'calc(2vw)', display: 'flex', justifyContent:'center', alignItems: 'center' }}>
            <AutoGraphIcon style={{ color: 'blue' }} fontSize="large" />
            <h1 className='logo-text'>Glitch</h1>
          </div>
      </div>


      <List className='navbar-list'>

        <ListItem className='navbar-first-item' onClick={() => {navigate('dashboard')}}>
          <Box className='navbar-box'>
            <ListItemIcon className='navbar-icon'>
              <HomeIcon style={{color:'grey'}}/>
            </ListItemIcon>
            <div className='text'>
              Dashboard
            </div>
          </Box>
        </ListItem>

        <ListItem className='navbar-item' onClick={() => {navigate('analysisHistory')}}>
          <Box className='navbar-box'>
            <ListItemIcon className='navbar-icon'>
              <HistoryIcon style={{color:'grey'}}/>
            </ListItemIcon>
            <div className='text'>
              Analysis History
            </div>
          </Box>
        </ListItem>

        <ListItem className='navbar-item' onClick={() => {navigate('newAnalysis')}}>
          <Box className='navbar-box'>
            <ListItemIcon className='navbar-icon'>
              <FiberNewIcon style={{color:'grey'}}/>
            </ListItemIcon>
            <div className='text'>
              New Analysis
            </div>
          </Box>
        </ListItem>

        <ListItem className='navbar-item' onClick={() => {navigate('profile')}}>
          <Box className='navbar-box'>
            <ListItemIcon className='navbar-icon'>
              <AccountBoxIcon style={{color:'grey'}}/>
            </ListItemIcon>
            <div className='text'>
              Profile
            </div>
          </Box>
        </ListItem>

      </List>
    </Drawer>
  );
}

export default Navbar;

