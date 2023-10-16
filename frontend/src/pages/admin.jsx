// import library and functions 
import { Copyright } from '../helper';
import { Button, TextField, Container, Paper, Typography, AppBar, Toolbar, Box} from '@mui/material';
import { useState } from 'react';
import callAPI from '../callAPI'

// import components
import SideBar from '../components/SideBar.jsx'
import '../css/SideBar.css'


function Admin (){
    const [file, setFile] = useState(null)

    const formData = new FormData()
    formData.append('csv_file',file)

    const token = localStorage.getItem('token')

    async function handleFileUpload(){
        if (!file) {
            console.error("No File Selected!")
            return
        }
        callAPI('POST',`admin/upload_csv`,token,formData)
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
        <div>
            <SideBar/>
        </div>

        
    );
}

export default Admin