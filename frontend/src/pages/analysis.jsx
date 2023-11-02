import { useState, useEffect } from 'react'
import { Box, Checkbox, FormControlLabel, Typography, Button } from '@mui/material'
import { styled } from '@mui/system'
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// components
import Header from '../components/Header'
import Footer from '../components/Footer'
import CompanyBox from '../components/analysis/Company'
import Dropdown from '../components/analysis/Dropdown'
import Category from '../components/MetricsBox'
// css files 
import "../css/Site.css"
import "../css/pages/Analysis/Analysis.css"



        // dummy company list 
    // const [companies, setCompanies] = useState([
    //     {
    //         "name": "Top Company 1 - APRA_CPG_229 TNFD",
    //         "region": "Japan,New Zealand,China",
    //         "sector": "Education"
    //     },
    //     {
    //         "name": "Top Company 2 - TCFD",
    //         "region": "New Zealand",
    //         "sector": "Health"
    //     },
    //     {
    //         "name": "Top Company 3 - TCFD",
    //         "region": "New Zealand,China",
    //         "sector": "Health,Energy,Hospitality,Legal,Agriculture"
    //     },
    //     {
    //         "name": "Top Company 4 - TNFD IFRS",
    //         "region": "US",
    //         "sector": "Agriculture"
    //     },
    //     {
    //         "name": "Top Company 5 - IFRS TNFD TCFD",
    //         "region": "Australia",
    //         "sector": "Mining"
    //     },
    //     {
    //         "name": "Top Company 6 - APRA_CPG_229 TNFD",
    //         "region": "Japan,New Zealand,China",
    //         "sector": "Education"
    //     },
    //     {
    //         "name": "Top Company 7 - TCFD",
    //         "region": "New Zealand",
    //         "sector": "Health"
    //     },
    //     {
    //         "name": "Top Company 8 - TCFD",
    //         "region": "New Zealand,China",
    //         "sector": "Health,Energy,Hospitality,Legal,Agriculture"
    //     },
    //     {
    //         "name": "Top Company 9 - TNFD IFRS",
    //         "region": "US",
    //         "sector": "Agriculture"
    //     },
    //     {
    //         "name": "Top Company 10 - IFRS TNFD TCFD",
    //         "region": "Australia",
    //         "sector": "Mining"
    //     }
    // ])




function Analysis () {

    const [companies, setCompanies ] = useState([])
    const location = useLocation()

    useEffect(() => {
        // If there's any state passed in the location object, use that
        if (location.state && location.state.companyList) {
            setCompanies(location.state.companyList || []);
        }
    }, [location])

    // for company checkbox
    const [selectedCompanies, setSelectedCompanies] = useState([])
    // for region and sector filter
    const regions = ['Japan', 'New Zealand', 'China', 'Australia', 'US']
    const sectors = ['Agriculture', 'Legal', 'Mining', 'Construction', 'Retail', 'Energy', 'Education', 'Hospitality', 'Health', 'Manufacturing']
    const [selectedRegions, setSelectedRegions] = useState([])
    const [selectedSectors, setSelectedSectors] = useState([])
    // clear checked box
    const [key, setKey] = useState(0)
    // get framework name 
    const { frameworkId } = useParams()

    useEffect(() => {
        console.log(frameworkId)
    }, [frameworkId])

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

    console.log(selectedCompanies)

    return (
        <div className='site-struct'>
            <Header/>
            <div className='main-container'>
                <div className='container-block'>
                    <div>
                        <div className='analysis-title'>
                            <CorporateFareIcon style={{ fontSize: 30, color:'#979aa6' }}/>
                            <Typography style={{ color:'#979aa6'}} variant='h5'>Company List</Typography>
                        </div>
                        <hr />
                        <div className='option-block'>
                            <Dropdown title="Region" options={regions} onToggle={handleRegionToggle} />
                            <Dropdown title="Sector" options={sectors} onToggle={handleSectorToggle} />
                            <Button className='companyList-button' style={{ color:"#a50221" }} onClick={handleReset}>Reset Filters</Button>
                            <Button className='companyList-button' style={{ color:"#a50221" }} onClick={handleClear}>Clear</Button>
                        </div>
                        <CompanyBox companyList={filteredCompanies} onCompanySelect={handleCompanySelect} frameworkId={frameworkId}/>
                    </div>
                </div>

            </div>
            <Footer/>
        </div>
        )
}

export default Analysis