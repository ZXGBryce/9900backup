import {useState} from 'react'
import { Table, TableBody, TableCell, TableHead, TableRow, Checkbox, Box} from '@mui/material'
import Button from '@mui/material/Button';

function CompanyBox ({ companyList, onCompanySelect }) {

    const [checkedCompanies, setCheckedCompanies] = useState([])

    const handleToggle = (company, isChecked) => {
        if (isChecked) {
            setCheckedCompanies(prev => [...prev, company.name])
        } else {
            setCheckedCompanies(prev => prev.filter(name => name !== company.name))
        }
        onCompanySelect(company, isChecked)
    }

    const handleClear = () => {
        setCheckedCompanies([])
    }

    return (
        <div>
            <Box style={{ maxHeight: '350px', overflow: 'auto', marginTop:'50px' }}>
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
        </div>
    );
};

export default CompanyBox;