import { useState } from "react";
import { Box, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import Modal from '@mui/material/Modal';

import { styled } from '@mui/system'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AddchartIcon from '@mui/icons-material/Addchart';
import PollIcon from '@mui/icons-material/Poll';

import Header from '../components/Header'
import Footer from '../components/Footer'

import '../css/Site.css'
import '../css/pages/Analysis/Analysis.css'
import '../css/pages/Analysis/Metrics.css'

function Metrics () {

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
                                    "environment": 1,
                                    "social": 0,
                                    "governance":0
                                },
                                "Technological innovation": {
                                    "value": "0.234566",
                                    "indicator_weight": "5",
                                    "environment": 0,
                                    "social": 1,
                                    "governance":0
                                }
                            },
                            "sub_category_weight": 0.1
                        },
                        "sub_category_2": {
                            "indicators": {
                                "Stakeholder litigation risks": {
                                    "value": "0.1245",
                                    "indicator_weight": "35",
                                    "environment": 0,
                                    "social": 1,
                                    "governance":0
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
                                    "environment": 0,
                                    "social": 1,
                                    "governance":0
                                }
                            },
                            "sub_category_weight": 0.1
                        }
                    }
                },
                "company_name_2": {}
            },
        }
    )
    

    const [expandedSubCategories, setExpandedSubCategories] = useState({})
    

    function handleSubCategoryWeightChange(companyName, categoryName, subCategoryName, newWeight) {
        setMetricList(prevMetricList => {
            const updatedMetricList = { ...prevMetricList };
            const newWeightNumber = parseFloat(newWeight); 
            if (!isNaN(newWeightNumber)) {
                updatedMetricList.framework[companyName][categoryName][subCategoryName].sub_category_weight = newWeightNumber;
            }
            return updatedMetricList;
        });
    }

    function toggleSubCategory(companyName, categoryName, subCategoryName) {
        setExpandedSubCategories(prevState => {
            const newState = { ...prevState };
            const current = newState[`${companyName}-${categoryName}-${subCategoryName}`];
            newState[`${companyName}-${categoryName}-${subCategoryName}`] = !current;
            return newState;
        });
    }

    function handleIndicatorValueChange(companyName, categoryName, subCategoryName, indicatorName, newValue) {
        setMetricList(prevMetricList => {
            const updatedMetricList = { ...prevMetricList };
            const newValueNumber = parseFloat(newValue);
            if (!isNaN(newValueNumber)) {
                updatedMetricList.framework[companyName][categoryName][subCategoryName].indicators[indicatorName].value = newValueNumber.toString();
            }
            return updatedMetricList;
        });
    }

    function handleIndicatorWeightChange(companyName, categoryName, subCategoryName, indicatorName, newWeight) {
        setMetricList(prevMetricList => {
            const updatedMetricList = { ...prevMetricList };
            const newWeightNumber = parseInt(newWeight, 10); 
            if (!isNaN(newWeightNumber)) {
                updatedMetricList.framework[companyName][categoryName][subCategoryName].indicators[indicatorName].indicator_weight = newWeightNumber.toString();
            }
            return updatedMetricList;
        });
    }



    console.log(metricList)

    const renderIndicatorsTable = (companyName, categoryName, subCategoryName, indicators) => {
        return (
            <TableContainer component={Paper} sx={{ marginTop: '10px' }}>
                <Table aria-label="indicators table" size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Indicator</TableCell>
                            <TableCell align="right">Value</TableCell>
                            <TableCell align="right">Weight</TableCell>
                            <TableCell align="right">Environment</TableCell>
                            <TableCell align="right">Social</TableCell>
                            <TableCell align="right">Governance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(indicators).map(([indicatorName, indicatorDetails], index) => (
                            <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                    {indicatorName}
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        type="number"
                                        size="small"
                                        style={{ width: '100px' }} 
                                        value={indicatorDetails.value}
                                        onChange={(e) => handleIndicatorValueChange(companyName, categoryName, subCategoryName, indicatorName, e.target.value)}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <TextField
                                        type="number"
                                        size="small"
                                        style={{ width: '60px' }} 
                                        value={indicatorDetails.indicator_weight}
                                        onChange={(e) => handleIndicatorWeightChange(companyName, categoryName, subCategoryName, indicatorName, e.target.value)}
                                    />
                                </TableCell>
                                <TableCell align="right">{indicatorDetails.environment}</TableCell>
                                <TableCell align="right">{indicatorDetails.social}</TableCell>
                                <TableCell align="right">{indicatorDetails.governance}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    

    const renderSubCategories = (companyName, categoryName, subCategories) => {
        return Object.entries(subCategories).map(([subCategoryName, subCategoryDetails], index) => {
            const isExpanded = expandedSubCategories[`${companyName}-${categoryName}-${subCategoryName}`];
            return (
                <Box key={index} className='sub-category-block'>
                    <Box
                        className='sub-category-title'
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px',
                            margin: '10px 0',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#f9f9f9',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            cursor: 'pointer'
                        }}
                        onClick={() => toggleSubCategory(companyName, categoryName, subCategoryName)}
                    >
                        <Typography>
                            {subCategoryName}
                        </Typography>
                        <TextField
                            type="number"
                            size="small"
                            variant="outlined"
                            value={subCategoryDetails.sub_category_weight}
                            onChange={(e) => handleSubCategoryWeightChange(companyName, categoryName, subCategoryName, e.target.value)}
                            sx={{
                                maxWidth: '60px',
                                '& .MuiInputBase-input': {
                                    textAlign: 'right',
                                    paddingRight: '0',
                                },
                            }}
                        />
                    </Box>
                    {isExpanded && renderIndicatorsTable(companyName, categoryName, subCategoryName, subCategoryDetails.indicators)}
                </Box>
            );
        });
    };

    function renderCategories (companyName, categories) {
        return Object.entries(categories).map(([categoryName, categoryDetails], index) => (
            <Box key={index} className='category-block' sx={{ margin: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <Typography variant='subtitle1'>{categoryName}</Typography>
                {renderSubCategories(companyName, categoryName, categoryDetails)}
            </Box>
        ))
    }


    function renderCompanyBlocks () {
        const companyNames = Object.keys(metricList.framework);
        return companyNames.map((companyName, index) => (
            <Box
                key={index}
                className='company-block'
                sx={{
                    margin: '10px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    minWidth: '300px', // Set a minimum width for the box
                    overflowX: 'auto', // Add horizontal scroll when content overflows
                    '&::-webkit-scrollbar': {
                        height: '6px', // Adjust the scrollbar height
                        backgroundColor: '#F5F5F5', // Scrollbar track color
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#CCCCCC', // Scrollbar handle color
                    },
                }}
            >
                <Typography variant='h6'>{companyName}</Typography>
                {renderCategories(companyName, metricList.framework[companyName])}
            </Box>
        ))
    }

    return(
        <div className='site-struct'>
            <Header/>
            <div className='main-container'>
                {/* For Metrics  */}
                <div className='metrics-container-block'>
                    <div className='analysis-title'>
                        <PollIcon style={{ fontSize: 30, color:'#979aa6' }}/>
                        <Typography style={{ color:'#979aa6'}} variant='h5'>Metrics</Typography>
                    </div>
                    <hr />
                    {renderCompanyBlocks()}
                </div>
                {/* For Visualization */}
                <div className='metrics-container-block'>
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