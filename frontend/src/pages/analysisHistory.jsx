import Header from '../components/Header';
import Footer from '../components/Footer';
import React, { useState, useEffect } from 'react';

const AnalysisHistory = (props) => {
    return (
        <div className='site-struct'>
            <Header/>
            <div className='main-container'>
                <div className='container-block'>
                    <h2 style={{textAlign:'center'}}>Analysis History</h2>
                </div>
            </div>
            <Footer/>
        </div>
    );
    
}

export default AnalysisHistory;