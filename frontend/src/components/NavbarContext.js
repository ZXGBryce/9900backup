// NavbarContext.js
import { createContext } from 'react';
import React from 'react';

const NavbarContext = React.createContext({
    navbarOpen: false // default value
});


export default NavbarContext;
