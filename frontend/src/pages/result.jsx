import Header from '../components/Header'
import Footer from '../components/Footer'
import { Box, Checkbox, FormControlLabel, Typography, Button } from '@mui/material'

const Result= (props) => {
    return (
        <div className='site-struct'>
          <Header/>
          <div className='main-container'>
            <div className='container-block'>
              <h1>Analysis Result</h1>
            </div>
            <Button style={{ marginTop:'10px', backgroundColor:'white'}} onClick={() => console.log('Save Result')}>Save Result</Button>
          </div>
          <Footer/>
        </div>
    )
}

export default Result;