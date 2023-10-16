import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import HomeIcon from '@mui/icons-material/Home';
import FeaturesIcon from '@mui/icons-material/Star';
import PricingIcon from '@mui/icons-material/MonetizationOn';

const NavBar = () => {
  return (
    <Drawer
      variant="permanent"
      open
    >
      <List>
        <ListItem button>
          <HomeIcon sx={{ mr: 2 }} />
          Home
        </ListItem>
        <ListItem button>
          <FeaturesIcon sx={{ mr: 2 }} />
          Features
        </ListItem>
        <ListItem button>
          <PricingIcon sx={{ mr: 2 }} />
          Pricing
        </ListItem>
      </List>
    </Drawer>
  );
};

export default NavBar;
