import { Copyright } from '../helper';
import { BrowserRouter, Routes, Link, Route, useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, Container, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import callAPI from '../callAPI.jsx'

function Admin (){
    const [file, setFile] = useState(null)

    const token = localStorage.getItem('token')

    async function handleFileUpload(){
        if (!file) {
            console.error("No File Selected!")
            return
        }

        const formData = new FormData()
        formData.append('file',file)

        try {
            const data = await callAPI('POST', 'uploadCSV', token, formData)

            console.log(data)
        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }
    return (
        <Container style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} style={{ padding: '2rem', height: '300px', width: '500px' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    CSV File Upload
                </Typography>
                <TextField 
                    label="Select CSV File" 
                    type="file" 
                    variant="outlined" 
                    fullWidth 
                    style={{ marginBottom: '1rem', marginTop:'50px'}}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        accept: ".csv"
                    }}
                    onChange={(e) => setFile(e.target.files[0])}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth onClick={handleFileUpload}>
                    Upload
                </Button>
            </Paper>
        </Container>
    );
}

export default Admin