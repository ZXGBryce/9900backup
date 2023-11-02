import Header from '../components/Header';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';
import '../css/Profile.css';
// import Loading from './Loading';

const Profile = (props) => {
    const [cusframeworks, setCusframeworks] = useState([]);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const token = localStorage.getItem('token');
    
    const GetProfileAction= async () => {
        const res = await fetch('https://glitch9900f15a.au.ngrok.io/profile/userprofile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            //   Authorization: `Bearer ${props.token}`
            Authorization: `Bearer ${token}`
            }
        });
        const data = await res.json();
        if (data.error) {
            alert(data.error);
        } else {
            setCusframeworks(data.data.cusframeworks);
            setEmail(data.data.email);
            setUsername(data.data.username);
        }
    };
    
    React.useEffect(() => {
        GetProfileAction();
    }, []);
    
    console.log(cusframeworks);
    
    return (
        <div className='site-struct'>
            <Header/>
            <div className='main-container'>
                <div className='container-block'>
                    <h2 style={{textAlign:'center'}}>Profile</h2>
                    <div className='profile-container' style={{display:'flex', flexDirection: 'column'}}>
                        {/* <h3 style={{textAlign: 'center'}}>Welcome to Profile Page, <span className='text-gradient'>{username_or_email}</span>!</h3> */}
                        <div class="row align-items-center gx-5" style={{width:'100%'}}>
                            <div class="col text-center text-lg-start mb-4 mb-lg-0" style={{width:'100%'}}>
                                <div class="bg-light p-4 rounded-4" style={{display:'flex'}}>
                                    <div class="text-primary fw-bolder mb-2">User Name:</div>
                                    <div class="small text-muted" style={{marginLeft: '10%'}}>{username}</div>
                                </div>
                                
                                <div class="bg-light p-4 rounded-4" style={{display:'flex', marginTop: '2%'}}>
                                    <div class="text-primary fw-bolder mb-2">User Email:</div>
                                    <div class="small text-muted" style={{marginLeft: '10%'}}>{email}</div>
                                </div>
                            
                                <div class="bg-light p-4 rounded-4" style={{display:'flex', marginTop: '2%'}}>
                                    <div class="text-primary fw-bolder mb-2">Custom FrameWorks:</div>
                                    <div class="small text-muted" style={{marginLeft: '10%', display: 'flex', flexDirection: 'column'}}>
                                        {cusframeworks.map((framework, index) => (
                                            <div key={framework}>
                                                {framework}<span style={{color:'#0D6EFD'}}><b>{index !== cusframeworks.length - 1 ? ',' : ''}</b></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                              
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
    
}

export default Profile;