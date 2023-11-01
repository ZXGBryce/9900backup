import Header from '../components/Header';
import Footer from '../components/Footer';
import SaveResultModal from '../components/saveResultModal';
import React, { useState, useEffect } from 'react';
import { Button, TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
// import Loading from './Loading';

const Result = (props) => {
    const [isModalOpen, setModalOpen] = useState(false);
  
    // // Example of a 1 second Loading screen with a 0.1 second delay
    // const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //     setTimeout(() => {
    //         setLoading(true);
    //         setTimeout(() => {
    //             setLoading(false);
    //         }, 1000); // 1 seconds loading
    //     }, 100); // 0.1 seconds delay
    //   }, []);
    // if (loading) {
    //     return <Loading />;
    // }
    
    const handleOpenModal = () => {
      setModalOpen(true);
    };

    const handleCloseModal = () => {
      setModalOpen(false);
    };
    
    const handleSubmit = (e) => {
        // e.preventDefault();
        console.log('Submit')
    };


    return (
        <div className='site-struct'>
            <Header/>
            <div className='main-container'>
                <div className='container-block'>
                    <h1>Analysis Result</h1>
                </div>
                {/* <Button style={{ marginTop:'10px', backgroundColor:'white'}} onClick={() => console.log('Save Result')}>Save Result</Button> */}
                <Button variant="contained" color="primary" onClick={handleOpenModal}  style={{ marginTop:'10px'}}>Save Result</Button>

                <SaveResultModal isOpen={isModalOpen} onClose={handleCloseModal}>
                    <Button variant="contained" color="primary" onClick={handleCloseModal}>X</Button>
                    <form onSubmit={handleSubmit}>
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <h4>Result Name</h4>
                            <TextField label="Result Name" name="resultName" variant="outlined" />
                            <h4>Result Description</h4>
                            <TextField label="Result Description" name="resultDescription" variant="outlined" multiline rows={4} />
                            
                            <h4>Metrics</h4>
                            <div style={{ margin: '10px', border: '1px solid black', borderRadius: '10px', padding: '10px' }}>
                                <h5>Metric 1</h5>
                                <div style={{ display: 'flex', justifyContent: ' flex-start' }}>
                                    <FormControlLabel control={<Checkbox name="m1-indicator" value="1" />} label="Indicator 1" />
                                    <FormControlLabel control={<Checkbox name="m1-indicator" value="2" />} label="Indicator 2" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: ' flex-start' }}>
                                    <FormControlLabel control={<Checkbox name="m1-indicator" value="3" />} label="Indicator 3" />
                                    <FormControlLabel control={<Checkbox name="m1-indicator" value="4" />} label="Indicator 4" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: ' flex-start' }}>
                                    <FormControlLabel control={<Checkbox name="m1-indicator" value="5" />} label="Indicator 5" />
                                    <FormControlLabel control={<Checkbox name="m1-indicator" value="6" />} label="Indicator 6" />
                                </div>
                            </div>
                            
                            <div style={{ margin: '10px', border: '1px solid black', borderRadius: '10px', padding: '10px' }}>

                                <h5>Metric 2</h5>
                                <div style={{ display: 'flex', justifyContent: ' flex-start' }}>
                                    <FormControlLabel control={<Checkbox name="m2-indicator" value="1" />} label="Indicator 1" />
                                    <FormControlLabel control={<Checkbox name="m2-indicator" value="2" />} label="Indicator 2" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: ' flex-start' }}>
                                    <FormControlLabel control={<Checkbox name="m2-indicator" value="3" />} label="Indicator 3" />
                                    <FormControlLabel control={<Checkbox name="m2-indicator" value="4" />} label="Indicator 4" />
                                </div>
                                <div style={{ display: 'flex', justifyContent: ' flex-start' }}>
                                    <FormControlLabel control={<Checkbox name="m2-indicator" value="5" />} label="Indicator 5" />
                                    <FormControlLabel control={<Checkbox name="m2-indicator" value="6" />} label="Indicator 6" />
                                </div>
                            </div>


                            <Button variant="contained" color="secondary" type="submit" >Save</Button>
                        </div>
                    </form>
                    
                </SaveResultModal>
            </div>
            <Footer/>
        </div>
    )
}

export default Result;
