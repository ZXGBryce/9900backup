import Header from '../components/Header'
import Footer from '../components/Footer'

const Result= (props) => {
    return (
        <div className='site-struct'>
          <Header/>
          <div className='main-container'>
            <div className='container-block'>
              <h1>Block 1</h1>
            </div>
          </div>
          <Footer/>
        </div>
    )
}

export default Result;