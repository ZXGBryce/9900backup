import { useState, useEffect } from "react";
import { Box, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import callAPI from '../callAPI'
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

    const [metricList, setMetricList] = useState({})
    const [expandedSubCategories, setExpandedSubCategories] = useState({})
    const [visualizationType, setVisualizationType] = useState('barChart');
    const location = useLocation()
    const navigate = useNavigate()
    const { frameworkId } = useParams()
    const token = localStorage.getItem('token')
    localStorage.setItem('visualizationType', visualizationType)
    useEffect(() => {
        // If there's any state passed in the location object, use that
        setMetricList(location.state.categories || []);
    }, [location]);


    // change properties 
    function handleIndicatorPropertyChange(companyName, categoryName, subCategoryName, indicatorName, propertyName, newValue) {
        setMetricList(prevMetricList => {
            // Safely access the nested data
            let companyData = prevMetricList[frameworkId] && prevMetricList[frameworkId][companyName];
            let categoryData = companyData && companyData[categoryName];
            let subCategoryData = categoryData && categoryData[subCategoryName];
            let indicators = subCategoryData && subCategoryData.indicators;
    
            // If any part of the path is undefined, return previous state
            if (!indicators || !indicators[indicatorName]) {
                console.error('Invalid path to indicators');
                return prevMetricList;
            }
    
            // Update the property for the indicator
            const newIndicators = {
                ...indicators,
                [indicatorName]: {
                    ...indicators[indicatorName],
                    [propertyName]: newValue
                }
            };
    
            // Build the new state from the top, ensuring all keys exist
            return {
                ...prevMetricList,
                [frameworkId]: {
                    ...prevMetricList[frameworkId],
                    [companyName]: {
                        ...prevMetricList[frameworkId][companyName],
                        [categoryName]: {
                            ...prevMetricList[frameworkId][companyName][categoryName],
                            [subCategoryName]: {
                                ...prevMetricList[frameworkId][companyName][categoryName][subCategoryName],
                                indicators: newIndicators
                            }
                        }
                    }
                }
            };
        });
    }


    // adding new indicator 
    function addNewIndicator(companyName, categoryName, subCategoryName) {
        setMetricList(prevMetricList => {
            const updatedMetricList = { ...prevMetricList };
            const newIndicatorName = `new indicator ${Object.keys(updatedMetricList[frameworkId][companyName][categoryName][subCategoryName].indicators).length + 1}`;
            updatedMetricList[frameworkId][companyName][categoryName][subCategoryName].indicators[newIndicatorName] = {
                value: "0",
                indicator_weight: "0",
                environment: 0,
                social: 0,
                government: 0,
                isNew: true
            }
            return updatedMetricList;
        })
    }
    
    function renderAddIndicatorButton (companyName, categoryName, subCategoryName) {
        return (
            <Button
                variant="contained"
                onClick={() => addNewIndicator(companyName, categoryName, subCategoryName)}
            >
                Add New Indicator
            </Button>
        )
    }

    function handleIndicatorNameChange(companyName, categoryName, subCategoryName, oldIndicatorName, newIndicatorName) {
        setMetricList(prevMetricList => {
            let updatedMetricList = { ...prevMetricList };
            // Check if the new indicator name is already in use
            if (updatedMetricList[frameworkId][companyName][categoryName][subCategoryName].indicators[newIndicatorName]) {
                // Handle error: maybe alert the user that the name is in use
                return prevMetricList;
            }
            // Update the indicator name and keep the existing data
            updatedMetricList[frameworkId][companyName][categoryName][subCategoryName].indicators[newIndicatorName] = 
                { ...updatedMetricList[frameworkId][companyName][categoryName][subCategoryName].indicators[oldIndicatorName] };
            // Remove the old indicator
            delete updatedMetricList[frameworkId][companyName][categoryName][subCategoryName].indicators[oldIndicatorName];
            
            return updatedMetricList;
        })
    }

    function renderIndicatorsTable (companyName, categoryName, subCategoryName, indicators) {
        return (
            <>
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
                                        {indicatorDetails.isNew ? (
                                            <TextField
                                                value={indicatorName}
                                                onChange={(e) => handleIndicatorNameChange(companyName, categoryName, subCategoryName, indicatorName, e.target.value)}
                                                size="small"
                                                style={{ width: '100%', fontSize:'30px' }}
                                            />
                                        ) : (
                                            indicatorName
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {indicatorDetails.isNew ? (
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    style={{ width: '80px' }}
                                                    value={parseFloat(indicatorDetails.value).toFixed(2)}
                                                    onChange={(e) => handleIndicatorPropertyChange(companyName, categoryName, subCategoryName, indicatorName, 'value', e.target.value)}
                                                />
                                            ) : (
                                                parseFloat(indicatorDetails.value).toFixed(2)
                                            )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <TextField
                                            type="number"
                                            size="small"
                                            style={{ width: '60px' }} 
                                            value={indicatorDetails.indicator_weight}
                                            onChange={(e) => handleIndicatorPropertyChange(companyName, categoryName, subCategoryName, indicatorName, 'indicator_weight', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {indicatorDetails.isNew ? (
                                            <TextField
                                            type="number"
                                            size="small"
                                            style={{ width: '80px' }}
                                            value={indicatorDetails.environment.toString()}
                                            onChange={(e) => {
                                                const newValue = parseInt(e.target.value, 10);
                                                if (newValue === 0 || newValue === 1) {
                                                handleIndicatorPropertyChange(companyName, categoryName, subCategoryName, indicatorName, 'environment', newValue);
                                                }
                                            }}
                                            inputProps={{ min: "0", max: "1", step: "1" }}
                                            />
                                        ) : (
                                            parseInt(indicatorDetails.environment)
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {indicatorDetails.isNew ? (
                                            <TextField
                                            type="number"
                                            size="small"
                                            style={{ width: '80px' }}
                                            value={indicatorDetails.social.toString()}
                                            onChange={(e) => {
                                                const newValue = parseInt(e.target.value, 10);
                                                if (newValue === 0 || newValue === 1) {
                                                handleIndicatorPropertyChange(companyName, categoryName, subCategoryName, indicatorName, 'social', newValue);
                                                }
                                            }}
                                            inputProps={{ min: "0", max: "1", step: "1" }}
                                            />
                                        ) : (
                                            parseInt(indicatorDetails.social)
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        {indicatorDetails.isNew ? (
                                            <TextField
                                            type="number"
                                            size="small"
                                            style={{ width: '80px' }}
                                            value={indicatorDetails.government.toString()}
                                            onChange={(e) => {
                                                const newValue = parseInt(e.target.value, 10);
                                                if (newValue === 0 || newValue === 1) {
                                                handleIndicatorPropertyChange(companyName, categoryName, subCategoryName, indicatorName, 'government', newValue);
                                                }
                                            }}
                                            inputProps={{ min: "0", max: "1", step: "1" }}
                                            />
                                        ) : (
                                            parseInt(indicatorDetails.government)
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {renderAddIndicatorButton(companyName, categoryName, subCategoryName)}
            </>
        )
    }
    
    //  For all SubCategories
    
    function handleSubCategoryWeightChange(companyName, categoryName, subCategoryName, newWeight, indicatorName = null) {
        setMetricList(prevMetricList => {
            const updatedMetricList = { ...prevMetricList };
            const newWeightNumber = parseFloat(newWeight); 
    
            if (!isNaN(newWeightNumber)) {
                // If an indicatorName is provided, we're updating an indicator's weight
                if (indicatorName) {
                    const indicators = updatedMetricList[frameworkId][companyName][categoryName][subCategoryName].indicators;
                    if (indicators && indicators[indicatorName]) {
                        indicators[indicatorName].indicator_weight = newWeightNumber.toString();
                    } else {
                        // Handle the case where the indicator does not exist
                        console.error(`Indicator '${indicatorName}' not found.`);
                    }
                } else {
                    // Otherwise, we're updating the subcategory's weight
                    if (updatedMetricList[frameworkId][companyName][categoryName][subCategoryName]) {
                        updatedMetricList[frameworkId][companyName][categoryName][subCategoryName].sub_category_weight = newWeightNumber;
                    } else {
                        // Handle the case where the subcategory does not exist
                        console.error(`SubCategory '${subCategoryName}' not found.`);
                    }
                }
            }
    
            return updatedMetricList;
        });
    }

    function handleSubCategoryNameChange(companyName, categoryName, oldSubCategoryName, newSubCategoryName) {
        setMetricList(prevMetricList => {
            let updatedMetricList = { ...prevMetricList };
            const descriptor = Object.getOwnPropertyDescriptor(updatedMetricList[frameworkId][companyName][categoryName], oldSubCategoryName);
            
            if (descriptor) {
                Object.defineProperty(
                    updatedMetricList[frameworkId][companyName][categoryName],
                    newSubCategoryName,
                    descriptor
                );
                delete updatedMetricList[frameworkId][companyName][categoryName][oldSubCategoryName];
            } else {
                console.error(`SubCategory '${oldSubCategoryName}' not found.`);
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

    function addNewSubCategory(companyName, categoryName) {
        setMetricList(prevMetricList => {
            const updatedMetricList = { ...prevMetricList };
            // Create a unique subcategory name based on the number of subcategories
            const newSubCategoryName = `New SubCategory ${Object.keys(updatedMetricList[frameworkId][companyName][categoryName]).length + 1}`;
            
            // Add new subcategory with editable fields
            updatedMetricList[frameworkId][companyName][categoryName][newSubCategoryName] = {
                sub_category_weight: "0", // Default weight as string to allow text field editing
                indicators: {}, // Empty indicators object
                isNew: true // Flag to indicate that this is a new subcategory
            };
            return updatedMetricList;
        });
    }

    
    const renderSubCategories = (companyName, categoryName, subCategories) => {
        return (
            <>
                {Object.entries(subCategories).map(([subCategoryName, subCategoryDetails], index) => {
                    const isExpanded = expandedSubCategories[`${companyName}-${categoryName}-${subCategoryName}`];
                    const isNewSubCategory = subCategoryDetails.isNew; // You need to define how to check if the subcategory is new
    
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
                                {isNewSubCategory ? (
                                    <TextField
                                        defaultValue={subCategoryName}
                                        onBlur={(e) => handleSubCategoryNameChange(companyName, categoryName, subCategoryName, e.target.value)}
                                        size="small"
                                        style={{ width: '100%' }}
                                        InputProps={{ disableUnderline: true }}
                                    />
                                ) : (
                                    <Typography>
                                        {subCategoryName}
                                    </Typography>
                                )}
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
                })}
            </>
        );
    };
    

    function renderCategories(companyName, categories) {
        return (
            <>
                {Object.entries(categories).map(([categoryName, categoryDetails], index) => (
                    <Box key={index} className='category-block' sx={{ margin: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                        <Typography variant='subtitle1'>{categoryName}</Typography>
                        {renderSubCategories(companyName, categoryName, categoryDetails)}
                        <Button
                            variant="contained"
                            onClick={() => addNewSubCategory(companyName, categoryName)}
                            sx={{ margin: '10px' }}
                        >
                            Add New SubCategory
                        </Button>
                    </Box>
                ))}
            </>
        );
    }


    function renderCompanyBlocks () {
        const frameworkData = metricList[frameworkId] || {};
        const companyNames = Object.keys(frameworkData);

        return companyNames.map((companyName, index) => (
            <Box 
                key={index} 
                className='company-block' 
                sx={{
                    margin: '10px',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    minWidth: '300px', 
                    overflowX: 'auto', 
                    '&::-webkit-scrollbar': {
                        height: '6px', 
                        backgroundColor: '#F5F5F5', 
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#CCCCCC', 
                    },
                }}
            >
                <Typography variant='h6'>{companyName}</Typography>
                {renderCategories(companyName, frameworkData[companyName])}
            </Box>
        ));
    }

    function handleVisualizationTypeChange (event) {
        setVisualizationType(event.target.value)
        localStorage.setItem('visualizationType', event.target.value)
    };

    async function handleAnalysisClick (event){
        console.log("handle analysis button clicked")
        const payload = {
            "__root__": metricList
        };
        try {
            const response = await callAPI('POST', 'analysis/calculation', token, payload);
            const data = response.data
            console.log("result calculations")
            console.log(data)
            navigate(`/analysis/${frameworkId}/result`, { state: { data} });

        } catch (error) {
            console.error('Failed to fetch companies:', error);
        }
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
                    <FormControl variant="outlined" style={{ minWidth: 120, marginTop: '10px' }}>
                        <InputLabel id="visualization-type-label">Type</InputLabel>
                        <Select
                            labelId="visualization-type-label"
                            id="visualization-type"
                            value={visualizationType}
                            onChange={handleVisualizationTypeChange}
                            label="Type"
                        >
                            <MenuItem value={'barChart'}>Bar Chart</MenuItem>
                            <MenuItem value={'linePlot'}>Line Plot</MenuItem>
                            <MenuItem value={'piePlot'}>Pie Plot</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <Button
                    style={{
                        marginTop: '10px',
                        backgroundColor: '#4CAF50', // A green shade
                        color: 'white', // Text color
                        padding: '10px 20px', // Larger padding for a bigger button
                        border: 'none',
                        borderRadius: '5px', // Rounded corners
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)', // Subtle shadow for depth
                        transition: '0.3s', // Smooth transition for hover effect
                        '&:hover': {
                        backgroundColor: '#45a049', // Slightly darker shade on hover
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', // Larger shadow on hover
                        },
                    }}
                    onClick={handleAnalysisClick}
                    >
                    Analysis
                </Button>
            </div>
            <Footer/>
        </div>
    )
}

export default Metrics