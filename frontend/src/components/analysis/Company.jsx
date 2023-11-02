import {useEffect, useState} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Box} from '@mui/material'
import Button from '@mui/material/Button';


import '../../css/pages/Analysis/CompanyBox.css'
import callAPI from '../../callAPI'


function CompanyBox ({ companyList, onCompanySelect, frameworkId }) {

    const [checkedCompanies, setCheckedCompanies] = useState([])
    const navigate = useNavigate();
    const token = localStorage.getItem('token')
    

    const handleToggle = (company, isChecked) => {
        if (isChecked) {
            setCheckedCompanies(prev => [...prev, company.name])
        } else {
            setCheckedCompanies(prev => prev.filter(name => name !== company.name))
        }
        onCompanySelect(company, isChecked)
    }

    const handleNextButtonClick = async () => {
        if (checkedCompanies.length === 0) {
            alert('Please select at least one company.');
        } else {
            const payload = {
                "companyList" : checkedCompanies
            }
            try {
                const response = await callAPI('POST', 'analysis/framework', token, payload)
                const data = response.data
                console.log("")
                console.log(response)

                navigate(`/analysis/${frameworkId}/metrics`, { state: { data } })

                console.log(" analysis company metrics ")
                console.log(data)

            } catch (error) {
                console.error('Failed to fetch companies:', error);
            }
        }
    }

    console.log(checkedCompanies)

    const boxStyles = {
        maxHeight: '550px',
        overflowY: 'auto', 
        overflowX: 'auto', 
        marginTop: '50px',
        minWidth: '350px', 
        width: '100%', 
    }


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Box className='company-box'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Region</TableCell>
                            <TableCell>Sector</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {companyList.map((company, index) => (
                        <TableRow key={company.name}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={checkedCompanies.includes(company.name)}
                                    onChange={(e) => handleToggle(company, e.target.checked)}
                                />
                            </TableCell>
                            <TableCell>{company.name}</TableCell>
                            <TableCell>{company.region}</TableCell>
                            <TableCell>{company.sector}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
            <div>
            <Button 
                style={{ 
                    marginTop:'50px',
                    marginBottom: '20px', 
                    backgroundColor: '#6200ea',  
                    color: '#ffffff',  
                    borderRadius: '25px',  
                    padding: '10px 20px',  
                    fontSize: '16px',  
                    fontWeight: 'bold',  
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                onClick={handleNextButtonClick}
                >
                    Next
            </Button>
            </div>

        </div>
    );
};

export default CompanyBox;