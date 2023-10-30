import Header from '../components/Header';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';

const Profile = (props) => {
    return (
        <div className='site-struct'>
            <Header/>
            <div className='main-container'>
                <div className='container-block'>
                    <h1>Profile</h1>
                </div>
            </div>
            <Footer/>
        </div>
    );
    
}

export default Profile;