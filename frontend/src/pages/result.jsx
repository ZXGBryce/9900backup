import Header from '../components/Header';
import Footer from '../components/Footer';
import SaveResultModal from '../components/saveResultModal';
import React, { useState, useEffect } from 'react';
import { Button, TextField, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useLocation } from 'react-router-dom';
// import Loading from './Loading';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid, ResponsiveContainer } from 'recharts';

const Result = (props) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [chartWidth,setCharWidth] = useState(window.innerWidth * 0.5);
    const [chartHeight,setCharHeight] = useState(window.innerHeight * 0.5);
    //transfer esg scores
    const [result, setResult] = useState({})
    const location = useLocation()
    useEffect(() => {
        setResult(location.state || []);
    }, [location]);
    console.log('result',result)
    
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
    
    useEffect(() => {
        setCharWidth(window.innerWidth * 0.4);
        setCharHeight(window.innerHeight * 0.4);
    }, []);
    
    console.log('result', result);

    
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    const transformData = (result) => {
        // Extract all unique risks
        let allRisks = [];
        for (let company in result.data.ESGscore) {
            allRisks.push(...Object.keys(result.data.ESGscore[company].categories));
        }
        // remove any duplicates
        const uniqueRisks = [...new Set(allRisks)]; 
        
        // Transform data for each risk
        const riskData = uniqueRisks.map(risk => {
            let dataItem = { name: risk };
            for (let company in result.data.ESGscore) {
                dataItem[company] = result.data.ESGscore[company].categories[risk] || 0;
            }
            return dataItem;
        });
    
        // Add total data
        const totalData = {
            name: "Total",
            ...Object.entries(result.data.ESGscore).reduce((acc, [company, scores]) => {
                acc[company] = scores.total;
                return acc;
            }, {})
        };
        
        return [...riskData, totalData];
    }
    
    const [transformedData, setTransformedData] = useState([]);
    useEffect(() => {
        if (result.data && result.data.ESGscore) {
            const newData = transformData(result);
            setTransformedData(newData);
        }
    }, [result]);
    
    console.log('transformedData', transformedData);


    


    return (
        <div className='site-struct'>
            <Header/>
            <div className='main-container'>
                <div className='container-block'  style={{alignContent: 'center'}}>
                    <h2 style={{textAlign:'center'}}>Analysis Result</h2>
                    <br /><br />
                    <div style={{width: '100%', height: '100%', overflow: 'hidden', display:'flex', alignContent: 'center'}}>
                        {transformedData.length > 0 && transformedData[0] && (
                            <BarChart width={chartWidth} height={chartHeight} data={transformedData} margin={{ top: 20, right: 30, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                {Object.keys(transformedData[0]).filter(key => key !== 'name').map(company => (
                                    <Bar key={company} dataKey={company} name={company} fill={getRandomColor()} />
                                ))}
                            </BarChart>
                        )}

                    </div>


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
