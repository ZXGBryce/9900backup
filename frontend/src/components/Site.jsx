import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Register from '../pages/Register';
import Login from '../pages/Login';
import ListingNew from '../pages/ListingNew';
import AllListings from '../pages/AllListings';
import MyListings from '../pages/MyListings';
import { MyButton } from './MyButton';
import EditListing from '../pages/EditListing';
// import { WidthDiv } from './WidthDiv';
// import { Context, initialValue } from '../context';

function Site () {
  const [token, setToken] = React.useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // const [stateNavigate, setStateNavigate] = React.useState(initialValue.stateNavigate);
  // const getters = {
  //   // var1,
  //   // var2,
  //   stateNavigate,
  // };
  // const setters = {
  //   // setVar1,
  //   // setVar2,
  //   setStateNavigate,
  // }

  React.useEffect(() => {
    const lsToken = localStorage.getItem('token');
    if (lsToken) {
      setToken(lsToken);
    }
  }, [token]);

  React.useEffect(() => {
    if (token) {
      if (pathname === '/login' || pathname === '/register') {
        // navigate('/dashboard');
        navigate('/');
      }
    }
  }, [token]);

  const logoutAction = async () => {
    const res = await fetch('http://localhost:5005/user/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      setToken(null);
      navigate('/');
    }
  }

  return (
    <>
    {/* <Context.Provider value={{ getters, setters, }}> */}

      {!token && <>
                  <div style={{ display: 'flex ', alignItems: 'center', justifyContent: 'space-around' }}>
                    <Link to="/register"><h2>Register</h2></Link>
                    <Link to="/login"><h2>Login</h2></Link>
                  </div>
                  <hr />
                </>}

      {token && <>
                  <div style={{ display: 'flex ', alignItems: 'center', justifyContent: 'space-around' }}>
                    {/* <Link to="/dashboard">Dashboard</Link>&nbsp;|&nbsp; */}
                    <Link to="/"><h2>All listings</h2></Link>
                    {/* <a href="/mylisting">My Listings</a>&nbsp;&nbsp;&nbsp; */}
                    <Link to="/mylisting"><h2>My Listings</h2>(Click to see your Current Listings)</Link>

                    <MyButton onClick={logoutAction} text='Logout'></MyButton>
                  </div>
                  <hr />
                </>}

      <Routes>
        {/* <Route path="/dashboard" element={<><b>Hello</b>Token:{token}</>} /> */}

        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/mylisting" element={<MyListings token={token} />} />
        <Route path="/mylisting/new" element={<ListingNew token={token} />} />
        <Route path="/mylisting/edit/:houseId" element={<EditListing token={token} />} />
        <Route path='/' element={<AllListings />} />
      </Routes>
    {/* </Context.Provider> */}

    </>
  );
}

export default Site;
