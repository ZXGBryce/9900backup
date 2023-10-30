import { useState } from "react";
import { Box, Checkbox, FormControlLabel, Typography, Button } from '@mui/material'
import { styled } from '@mui/system'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AddchartIcon from '@mui/icons-material/Addchart';
import PollIcon from '@mui/icons-material/Poll';

import Header from '../components/Header'
import Footer from '../components/Footer'
import CompanyBox from '../components/analysis/Company'
import Dropdown from '../components/analysis/Dropdown'
import Category from '../components/MetricsBox'
function Metrics () {


    // metrics 
    // change indicator values
    const handleUpdateValue = (categoryName, subcategoryName, index, newValue) => {
        setMetricList(prevMetricList => {
            const newMetricList = { ...prevMetricList };
            const subcategories = newMetricList[categoryName];
            if (subcategories) {
                subcategories.forEach(subcategory => {
                    if (subcategory.name === subcategoryName) {
                        subcategory.indicators[index].value = newValue;
                    }
                });
            }
            return newMetricList;
        });
    };
    // Add new indicators 
    const handleAddIndicator = (subcategoryName, newIndicator) => {
        setMetricList(prevMetricList => {
            const newMetricList = { ...prevMetricList };
            Object.entries(newMetricList).forEach(([categoryKey, subcategories]) => {
                subcategories.forEach(subcategory => {
                    if (subcategory.name === subcategoryName) {
                        subcategory.indicators.push(newIndicator);
                    }
                });
            });
            return newMetricList;
        });
    };

    console.log(metricList)

    const [metricList, setMetricList] = useState(
        {
            "framework": {
                "company_name_1": {
                    "category_1": {
                        "sub_category_1": {
                            "indicators": {
                                "Policy changes": {
                                    "value": "0.45231",
                                    "indicator_weight": "15",
                                    "enviroment": 1,
                                    "social": 0,
                                    "government":0
                                },
                                "Technological innovation": {
                                    "value": "0.234566",
                                    "indicator_weight": "5",
                                    "enviroment": 0,
                                    "social": 1,
                                    "government":0
                                }
                            },
                            "sub_category_weight": 0.1
                        },
                        "sub_category_2": {
                            "indicators": {
                                "Stakeholder litigation risks": {
                                    "value": "0.1245",
                                    "indicator_weight": "35",
                                    "enviroment": 0,
                                    "social": 1,
                                    "government":0
                                }
                            },
                            "sub_category_weight": 0.2
                        }
                    },
                    "category_2": {
                        "sub_category_3": {
                            "indicators": {
                                "Regulatory enforcement risks": {
                                    "value": "0.46125",
                                    "indicator_weight": "12",
                                    "enviroment": 0,
                                    "social": 1,
                                    "government":0
                                }
                            },
                            "sub_category_weight": 0.1
                        }
                    }
                },
            }
        }
    )

    return(
        <div className='site-struct'>
            <Header/>
            <div className='main-container'>
                <div className='container-block'>
                    <div className='analysis-title'>
                        <AddchartIcon style={{ fontSize: 30, color:'#979aa6' }}/>
                        <Typography style={{ color:'#979aa6'}} variant='h5'>Metrics</Typography>
                    </div>
                    <hr />
                    <div>
                        {/* debug this line */}
                        {/* have the value link with the indicator name not the index */}
                        <Category data={metricList} onUpdateValue={handleUpdateValue}/>
                    </div>
                    
                </div>
                <div className='container-block'>
                    <div className='analysis-title'>
                            <AddchartIcon style={{ fontSize: 30, color:'#979aa6' }}/>
                            <Typography style={{ color:'#979aa6'}} variant='h5'>Visualization</Typography>
                        </div>
                </div>
                <Button style={{ marginTop:'10px', backgroundColor:'white'}}>Analysis</Button>
            </div>
            <Footer/>
        </div>
        )

}

export default Metrics