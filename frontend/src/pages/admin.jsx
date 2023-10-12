import { Copyright } from '../helper';
import { BrowserRouter, Routes, Link, Route, useNavigate, useLocation } from 'react-router-dom';
import { Button, TextField, Container, Paper, Typography } from '@mui/material';
import { useState } from 'react';


function Admin (){
    const [file, setFile] = useState(null)

    const formData = new FormData()
    formData.append('file',file)

    const token = localStorage.getItem('token')

    async function callAPI (method,token) {
        console.log('API call starts with:', method);
        const options = {
        method: 'POST',
        headers: {
        Authorization: `Bearer ${token}`,
        },
        body: formData,
        redirect: 'follow'
    };
    if (method === 'GET') {
        delete options.body;
    }
    // console.log('calling fetch')
    const response = await fetch(`http://127.0.0.1:5000/admin/upload_csv`, options);
    const data = await response.json();
    if (data.error) {
        console.log(data.error);
        throw new Error(data.error);
    }
    return data;
    }

    async function handleFileUpload(){
        if (!file) {
            console.error("No File Selected!")
            return
        }

        try {
            const data = await callAPI('POST','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Inp4ZyIsInZlcnNpb24iOjEsImlzX2FkbWluIjp0cnVlLCJleHAiOjE2OTcyMDUwNjl9.mnwrEJnzxg-AJ6y9IGNl8t9CAJQkDYMJz7iXTqkR408')
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