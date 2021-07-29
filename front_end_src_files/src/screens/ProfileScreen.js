import React, {useState, useEffect} from 'react'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { listMyOrders } from '../actions/orderActions'
import { ORDER_DETAILS_RESET } from '../constants/orderConstants'

const ProfileScreen = ({ location, history }) => {
    // first we need to set the component level state here, jo email aur password hai.

    const [name, setName] = useState('') // just an empty string as a default
    const [email, setEmail] = useState('') // just an empty string as a default
    const [password, setPassword] = useState('') // just an empty string as a default
    const [confirmPassword, setConfirmPassword] = useState('') // just an empty string as a default
    const [message, setMessage] = useState(null) // set to null by default

    // lets define dispatch 
    const dispatch = useDispatch()

    
    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails


   const userLogin = useSelector(state => state.userLogin)
   const { userInfo } = userLogin

   // update honay pe main chata hoon ke success ka message show ho
   const userUpdateProfile = useSelector(state => state.userUpdateProfile)
   const { success } = userUpdateProfile

   const orderListMy = useSelector(state => state.orderListMy)
   const { loading:loadingOrders, error:errorOrders, orders } = orderListMy


   // now i wanna check if the user is loggedin or not, if it is not, we dont want to access this page

    useEffect(() => {
        // yeh new add kiya hai
        // jab hum order ki details dekh kar wapis profile screen par aingain. toh orderDetails wali state ko reset kardaingain. ta kay jab hum koi next order dekhain toh state new ho.
        dispatch({
            type: ORDER_DETAILS_RESET,
        })
        if(!userInfo){
            history.push('/login') // if not then we want to redirect to /login
        }
        else{
            // here i wanna check for the user, which is coming from userDetails
            if(!user.name){
                dispatch(getUserDetails('profile')) // userActions main humnay ID ka argument pass kiya tha, but users/profile hit karaiga, not actually ID, because we wanna get the logged in user
                dispatch(listMyOrders())
            }
            else{
                // if we do have the user, let set the form field
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch,history, userInfo,user]) 

    const submitHandler = (e) => {
        e.preventDefault()
        
        if(password !== confirmPassword){
            setMessage('Passwords do not match')
        }
        else{
            // Dispatch update profile
            dispatch(updateUserProfile({ id: user._id, name, email, password })) // updateUserProfile() yeh object leta hai, thats the user object we wanna pass in to the action
        }
    }

    return (<Row>
        <Col md={3}>
        <h2>User Profile</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && <Message variant='success'>Profile Updated</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>

        <Form.Group controlId='name'>
        <Form.Label>Name</Form.Label>
        <Form.Control type='name' placeholder='Enter Email' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
    </Form.Group>

            <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type='email' placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)}></Form.Control>
            </Form.Group>


            <Form.Group controlId='confrimPassword'>
            <Form.Label>Confrim Password</Form.Label>
            <Form.Control type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
        </Form.Group>


            <Button type='submit' variant='primary'>Update</Button>

        </Form>

        </Col>
        <Col md={9}>
            <h2>My Orders</h2>
            {loadingOrders ? <Loader /> : errorOrders ? <Message variant='danger'>{errorOrders}</Message> : (
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.totalPrice}</td>
                                <td>{order.isPaid ? order.paidAt.substring(0,10) : (
                                    <i className='fas fa-times' style={{color: 'red'}}></i>
                                )}</td>
                                <td>{order.isDelivered ? order.deliveredAt.substring(0,10) : (
                                    <i className='fas fa-times' style={{color: 'red'}}></i>
                                )}</td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button className='btn-sm' variant='light'>Details</Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) }
        </Col>
    </Row>)
}

export default ProfileScreen