import React, {useState} from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import {saveShippingAddress} from '../actions/cartActions'

// hum history ko destructure kar rhai hain. kunke when we submit the form, we wanna redirect or push to our payment screen
const ShippingScreen = ({ history }) => {
    
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    // lets add state for the form
    const [address, setAddress] = useState(shippingAddress.address) 
    const [city, setCity] = useState(shippingAddress.city) 
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode) 
    const [country, setCountry] = useState(shippingAddress.country) 

    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(saveShippingAddress({address,city,postalCode,country}))

        // now after dispatch i wanna move to the next page
        history.push('/payment')
    }
    
    return (
        <FormContainer>
            <CheckoutSteps step1 step2/>
            <h1>Shipping</h1>
            <Form onSubmit={submitHandler}>

            <Form.Group controlId='address'>
            <Form.Label>Address</Form.Label>
            <Form.Control type='text' placeholder='Enter Address' value={address} required onChange={(e) => setAddress(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='city'>
            <Form.Label>City</Form.Label>
            <Form.Control type='text' placeholder='Enter City' value={city} required onChange={(e) => setCity(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='postalCode'>
            <Form.Label>Postal Code</Form.Label>
            <Form.Control type='text' placeholder='Enter Postal Code' value={postalCode} required onChange={(e) => setPostalCode(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='country'>
            <Form.Label>Country</Form.Label>
            <Form.Control type='text' placeholder='Enter country' value={country} required onChange={(e) => setCountry(e.target.value)}></Form.Control>
            </Form.Group>


            <Button type='submit' variant='primary'>
                Continue
            </Button>


            </Form> 
        </FormContainer>
    )
}

export default ShippingScreen
