import React, {useState} from 'react'
import { Form, Button, Col} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import {savePaymentMethod} from '../actions/cartActions'

// hum history ko destructure kar rhai hain. kunke when we submit the form, we wanna redirect or push to our payment screen
const PaymentScreen = ({ history }) => {
    
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart

    if (!shippingAddress){
        // if there is no shipping address, its should not be on payment screen 
        history.push('/shipping')
    }


    // lets add state for the form
    const [paymentMethod, setPaymentMethod] = useState('PayPal') // this gonna be our default payment method

    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod))

        // now after dispatch i wanna move to the next page
        history.push('/placeorder')
    }
    
    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3/>
            <h1>Payment Method</h1>
            <Form onSubmit={submitHandler}>

            <Form.Group>
                <Form.Label as='legend'>Select Method</Form.Label>
            

            <Col>
                <Form.Check type='radio' label='PayPal or Credit card' id='PayPal' name='paymentMethod' value='PayPal' checked onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>
                {/*<Form.Check type='radio' label='Stripe' id='Stripe' name='paymentMethod' value='Stripe' onChange={(e) => setPaymentMethod(e.target.value)}></Form.Check>*/}
            </Col>
            </Form.Group>
            <Button type='submit' variant='primary'>
                Continue
            </Button>

            </Form> 
        </FormContainer>
    )
}

export default PaymentScreen
