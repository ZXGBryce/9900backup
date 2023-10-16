import { Copyright } from '../helper';
import { Button, TextField, Container, Paper, Typography, AppBar, Toolbar, Box} from '@mui/material';
import { useState } from 'react';
import SideBar from '../components/Sidebar.jsx'

function Admin (){
    const [file, setFile] = useState(null)

    const formData = new FormData()
    formData.append('csv_file',file)

    const token = localStorage.getItem('token')

    ////// replace this code later with just callAPI from callAPI page
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

    const response = await fetch(`http://127.0.0.1:5000/admin/upload_csv`, options);
    const data = await response.json().then(

    )
    if (data.error) {
        console.log(data.error);
        throw new Error(data.error);
    }
    return data;
    }
    ////////////////////////////////////////////

    async function handleFileUpload(){
        if (!file) {
            console.error("No File Selected!")
            return
        }
        callAPI('POST',token)
        .then(response =>{
                console.log(response)
                console.log(response.data)
                if (response.code === 20000){
                    alert('file uploaded successfully!')
                }
                else{
                        alert('file upload failed')
                }
            }
        ).catch(error => {
        console.log('Error:', error)
            })
    }

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
        {/* Header */}
        <AppBar position="static" >
            <Toolbar>
            <Typography variant="h6">
                Glitch
            </Typography>
            </Toolbar>
        </AppBar>

        {/* Main Content + Sidebars wrapped */}
        <Box flexGrow={1}> {/* Added margin top (mt) and margin bottom (mb) */}
            <Box display="flex" flexDirection="row" height="100%">
            {/* Left Sidebar */}
            <Box width='240' bgcolor="grey.200">
                <SideBar />
            </Box>

            {/* Central Container */}
            <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

            {/* Right Empty Sidebar */}
            <Box width='240' bgcolor="grey.200">
                {/* Empty for now */}
            </Box>
            </Box>
        </Box>

        {/* Footer */}
        <Box height="50px" bgcolor="grey.300" display="flex" justifyContent="center" alignItems="center">
            <Typography>
            Footer Content Here
            </Typography>
        </Box>
        </Box>

        
    );
}

export default Admin