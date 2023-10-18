// import library and functions 
import { FormControl } from '@mui/base/FormControl';
import { useState } from 'react';
import callAPI from '../callAPI'
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';

// import components
import "../css/Site.css"
import "../css/Admin.css"
import Header from '../components/Header.jsx'
import Footer from  '../components/Footer.jsx'

function Admin (){
    const [file, setFile] = useState(null)

    const formData = new FormData()
    formData.append('csv_file',file)

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
            const data = await callAPI('POST',token)
            .then(response => {
                if (response.code === 20000){
                    alert('file uploaded successfully!')
                }
                else{
                        alert('file upload failed')
                }
            })
        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }
    return (
        <div className='site-struct'>
            <Header/>
            <div className="main-container">
                <div className="file-upload-box">
                    <div className='file-upload-content'>
                        <FormControl>
                            <InputLabel style={{ fontSize: '30px' }}>Upload New CSV</InputLabel>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop:'50px'}}>
                            <TextField 
                                label="Select CSV File" 
                                type="file" 
                                variant="outlined" 
                                fullWidth 
                                style={{ marginBottom: '1rem', marginTop:'5px'}}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                    accept: ".csv"
                                }}
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            </div>
                            <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleFileUpload}
                            style={{ display: 'block', marginTop: '15px', backgroundColor:'gold', width:'100px', }} >
                            Upload
                        </Button>
                            <FormHelperText></FormHelperText>
                        </FormControl>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Admin