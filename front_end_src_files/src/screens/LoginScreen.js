import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { login } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {
    // first we need to set the component level state here, jo email aur password hai.

    const [email, setEmail] = useState('') // just an empty string as a default
    const [password, setPassword] = useState('') // just an empty string as a default

    // lets define dispatch 
    const dispatch = useDispatch()

    // and we wanna get from our state user login, so we will use useSelector
    const userLogin = useSelector(state => state.userLogin)
    // and now what we wanna take from useLogin is
    const { loading, error, userInfo } = userLogin

    // url query string, if that exist, phir split kardaingain, split array main turn kardeta hai. right of the equal sign ki value jo kay index 1 hai 
    const redirect = location.search ? location.search.split('=')[1] : '/'

    //i wanna redirect if we are already loggedIn
    useEffect(() => {
        // if we are not loggedIn its gonna be null. if its not null its mean we are logged In
        if(userInfo){
            history.push(redirect) //  and we wanna go to whatever will be in redirect
        }
    }, [history, userInfo, redirect]) // also we need to pass userInfo because if that changes we want to redirect

    const submitHandler = (e) => {
        e.preventDefault()
        // This is where we want to dispatch login

        dispatch(login(email,password)) // email and password from the form
    }

    return (
        <FormContainer>
            <h1>Sign In</h1>
            {error && <Message variant='danger'>{error}</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>Sign In</Button>

            </Form>

            <Row className='py-3'>
                <Col>New Customer? <Link to={ redirect ? `/register?redirect=${redirect}` : '/register' }>Register</Link> </Col>
            </Row>

        </FormContainer>
    )
}

export default LoginScreen
