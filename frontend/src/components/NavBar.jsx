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
import '../css/Navbar.css';
import { useNavigate } from 'react-router-dom'

function Navbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(window.innerWidth > 768)
  const navigate = useNavigate()

  function handleNavigate(path){
    navigate(`/${path}`)
  }

  return (
    <Drawer
      variant={drawerOpen ? 'permanent' : 'temporary'}
      open={drawerOpen}
    >
      <List className='navbar-list'>

        <ListItem className='navbar-first-item' onClick={() => {handleNavigate('dashboard')}}>
          <Box className='navbar-box'>
            <ListItemIcon className='navbar-icon'>
              <HomeIcon style={{color:'grey'}}/>
            </ListItemIcon>
            Dashboard
          </Box>
        </ListItem>

        <ListItem className='navbar-item' onClick={() => {handleNavigate('analysisHistory')}}>
          <Box className='navbar-box'>
            <ListItemIcon className='navbar-icon'>
              <HistoryIcon style={{color:'grey'}}/>
            </ListItemIcon>
            Analysis History
          </Box>
        </ListItem>

        <ListItem className='navbar-item' onClick={() => {handleNavigate('newAnalysis')}}>
          <Box className='navbar-box'>
            <ListItemIcon className='navbar-icon'>
              <FiberNewIcon style={{color:'grey'}}/>
            </ListItemIcon>
            New Analysis
          </Box>
        </ListItem>

        <ListItem className='navbar-item' onClick={() => {handleNavigate('profile')}}>
          <Box className='navbar-box'>
            <ListItemIcon className='navbar-icon'>
              <AccountBoxIcon style={{color:'grey'}}/>
            </ListItemIcon>
            Profile
          </Box>
        </ListItem>

      </List>
    </Drawer>
  );
}

export default Navbar;

