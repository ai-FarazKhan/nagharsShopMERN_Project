import React from 'react'
// hum spinner component lekar aingain, from react bootstrap
import { Spinner } from 'react-bootstrap'

const Loader = () => {
    return (
        // this takes bunch of props 
        <Spinner animation='border' role='status' style={{ width: '100px', height: '100px', margin: 'auto', display: 'block', }}>
            <span className='sr-only'>Loading...</span>
        </Spinner>
    )
}

export default Loader
