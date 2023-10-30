import {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Box} from '@mui/material'
import Button from '@mui/material/Button';
import {useCustomNavigate} from '../../utils'

function CompanyBox ({ companyList, onCompanySelect, frameworkId }) {

    const [checkedCompanies, setCheckedCompanies] = useState([])
    const navigate = useCustomNavigate();
    

    const handleToggle = (company, isChecked) => {
        if (isChecked) {
            setCheckedCompanies(prev => [...prev, company.name])
        } else {
            setCheckedCompanies(prev => prev.filter(name => name !== company.name))
        }
        onCompanySelect(company, isChecked)
    }

    function handleNextButtonClick(){
        navigate(`analysis/${frameworkId}/metrics`)
        // send APIcall to backend to extract metrics 
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Box style={{ maxHeight: '550px', overflow: 'auto', marginTop:'50px' }}>
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