import Header from '../components/Header';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import '../css/Profile.css';
// import Loading from './Loading';

const Profile = (props) => {
    const username_or_email = localStorage.getItem('username_or_email');
    return (
        <div className='site-struct'>
            <Header/>
            <div className='main-container'>
                <div className='container-block'>
                    <h2 style={{textAlign:'center'}}>Profile</h2>
                    <div className='profile-container'>
                        <h3 style={{textAlign: 'center'}}>Welcome to Profile Page, <span className='text-gradient'>{username_or_email}</span>!</h3>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
    
}

export default Profile;