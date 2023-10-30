import { useState } from 'react'
import { Box, Checkbox, FormControlLabel, Typography, Button } from '@mui/material'
import { styled } from '@mui/system'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import AddchartIcon from '@mui/icons-material/Addchart';
import PollIcon from '@mui/icons-material/Poll';

// components
import Header from '../components/Header'
import Footer from '../components/Footer'
import CompanyBox from '../components/analysis/Company'
import Dropdown from '../components/analysis/Dropdown'
import Category from '../components/MetricsBox'
// css files 
import "../css/Site.css"
import "../css/pages/Analysis.css"

import { useCustomNavigate } from '../utils'






function Analysis () {
    const navigate = useCustomNavigate()
    // dummy company list 
    const [companies, setCompanies] = useState([
        {
            "name": "Top Company 1 - APRA_CPG_229 TNFD",
            "region": "Japan,New Zealand,China",
            "sector": "Education"
        },
        {
            "name": "Top Company 2 - TCFD",
            "region": "New Zealand",
            "sector": "Health"
        },
        {
            "name": "Top Company 3 - TCFD",
            "region": "New Zealand,China",
            "sector": "Health,Energy,Hospitality,Legal,Agriculture"
        },
        {
            "name": "Top Company 4 - TNFD IFRS",
            "region": "US",
            "sector": "Agriculture"
        },
        {
            "name": "Top Company 5 - IFRS TNFD TCFD",
            "region": "Australia",
            "sector": "Mining"
        }
    ])
    // dummy metrics and indicator list 
    const [metricList, setMetricList] = useState(
        {
            "category1": [
            {
            "name":"subcategory1",
            "indicators": [
                {
                    "name": "Technological innovation",
                    "value": "0.475338734",
                    "environment": "No",
                    "social": "No",
                    "governance": "Yes"
                },
                {
                    "name": "Social adaptation",
                    "value": "0.475338734",
                    "environment": "No",
                    "social": "No",
                    "governance": "Yes"
                }
            ],
            "value": '10'
            },
            {
            "name":"subcategory2",
            "indicators": [
                {
                    "name": "Changing climate conditions",
                    "value": "0.475338734",
                    "environment": "No",
                    "social": "No",
                    "governance": "Yes"
                }
            ],
            "value": '10'
            },
        ],
        "category2": [
            {
            "name":"subcategory1",
            "indicators": [
                {
                    "name": "TI",
                    "value": "0.475338734",
                    "environment": "No",
                    "social": "No",
                    "governance": "Yes"
                },
                {
                    "name": "SA",
                    "value": "0.475338734",
                    "environment": "No",
                    "social": "No",
                    "governance": "Yes"
                }
            ],
            "value": '10'
            },
            {
            "name":"subcategory2",
            "indicators": [
                {
                    "name": "CCC",
                    "value": "0.475338734",
                    "environment": "No",
                    "social": "No",
                    "governance": "Yes"
                }
            ],
            "value": '10'
            },
        ]
    })

    // for company checkbox
    const [selectedCompanies, setSelectedCompanies] = useState([])
    // for region and sector filter
    const regions = ['Japan', 'New Zealand', 'China', 'Australia', 'US']
    const sectors = ['Agriculture', 'Legal', 'Mining', 'Construction', 'Retail', 'Energy', 'Education', 'Hospitality', 'Health', 'Manufacturing']
    const [selectedRegions, setSelectedRegions] = useState([])
    const [selectedSectors, setSelectedSectors] = useState([])
    // clear checked box
    const [key, setKey] = useState(0)

    // check box handle 
    function handleCompanySelect (company, isChecked) {
        if (isChecked) {
            if (!selectedCompanies.some(selectedCompany => selectedCompany.name === company.name)) {
                setSelectedCompanies([...selectedCompanies, company]);
            }
        } else {
            setSelectedCompanies(selectedCompanies.filter(selectedCompany => selectedCompany.name !== company.name));
        }
    }
    
    // filter functions 
    // region filter
    function handleRegionToggle (region) {
        setSelectedRegions(prevRegions => 
            prevRegions.includes(region) 
            ? prevRegions.filter(r => r !== region) 
            : [...prevRegions, region]
        );
    };
    // sector filter
    function handleSectorToggle (sector) {
        setSelectedSectors(prevSectors => 
            prevSectors.includes(sector) 
            ? prevSectors.filter(s => s !== sector) 
            : [...prevSectors, sector]
        );
    };

    // filter function : filter companies that does not satisfy the conditions
    const filteredCompanies = companies.filter(company => {
        const companyRegions = company.region.split(',')
        const companySectors = company.sector.split(',')

        return (
            (!selectedRegions.length || companyRegions.some(region => selectedRegions.includes(region))) &&
            (!selectedSectors.length || selectedSectors.some(sector => companySectors.includes(sector)))
        )
    })

    // filter reset button
    function handleReset () {
        setSelectedRegions([])
        setSelectedSectors([])
    };
    // filter clear button 
    function handleClear () {
        setKey(prevKey => prevKey + 1)
        setSelectedCompanies([])
    };

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

    console.log(selectedCompanies)
    console.log(metricList)
    
    const analysisBtn = (analysisId) => {
        navigate(`analysis/result/${analysisId}`);
        // console.log('analysisBtn');
    };

    return (
        <div className='site-struct'>
            <Header/>
            <div className='main-container'>
                <div className='company-container-block'>
                    <div className='analysis-title'>
                        <CorporateFareIcon style={{ fontSize: 30, color:'#979aa6' }}/>
                        <Typography style={{ color:'#979aa6'}} variant='h5'>Company List</Typography>
                    </div>
                    <hr />
                    <div className='option-block'>
                        <Dropdown title="Region" options={regions} onToggle={handleRegionToggle} />
                        <Dropdown title="Sector" options={sectors} onToggle={handleSectorToggle} />
                        <Button style={{ color:"#a50221" }} onClick={handleReset}>Reset Filters</Button>
                        <Button style={{ color:"#a50221" }} onClick={handleClear}>Clear</Button>
                    </div>
                    <CompanyBox companyList={filteredCompanies} onCompanySelect={handleCompanySelect} key={key} onAddIndicator={handleAddIndicator}/>
                </div>
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
                <Button style={{ marginTop:'10px', backgroundColor:'white'}} onClick={() => analysisBtn('analysisId')}>Analysis</Button>
            </div>
            <Footer/>
        </div>
        )
}

export default Analysis