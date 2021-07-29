import React, {useState,useEffect} from 'react'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import {Link} from 'react-router-dom'
import { Button ,Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { getOrderDetails, payOrder, deliverOrder } from '../actions/orderActions'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../constants/orderConstants'

// we need orderID
const OrderScreen = ({ match, history }) => {

    const orderId = match.params.id

    // we actually wanna have a piece of state when the sdk is ready 
    // so we gonna have a piece of state called sdk
    const [sdkReady, setSdkReady] = useState(false) // we gonna set this to false as a default value

    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails) 
    const { order, loading, error } = orderDetails 
    
    
    const orderPay = useSelector(state => state.orderPay) 
    const { loading:loadingPay, success:successPay } = orderPay // hamaray paas loading name se alreay variable hai, toh hum isko loadingPay kar rhai hain. rename kar rhai hain. Same for success

    const orderDeliver = useSelector(state => state.orderDeliver) 
    const { loading:loadingDeliver, success:successDeliver } = orderDeliver


    const userLogin = useSelector(state => state.userLogin) 
    const { userInfo } = userLogin 

    if(!loading){
         // calculating price
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100 ).toFixed(2)
    }
    order.itemsPrice = addDecimals(order.orderItems.reduce((acc,item) => acc + item.price * item.qty, 0))
    }




    // in useEffect we wanna dispatch our action
    useEffect(() => {

        if(!userInfo){
            history.push('/login')
        }

        const addPayPalScript = async () => {
            // here we gonna fetch the client id from the backend
            const { data: clientId } = await axios.get('/api/config/paypal') // and the route that we wanna hit is /api/config/paypal
            // console.log(clientId)

            const script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
            // i want this to be asynchronous 
            script.async = true

            // once this loads 
            script.onload = () => {
                setSdkReady(true)
            }
            // we just dynamically adding the paypal script.
            document.body.appendChild(script)
        }
        
        if(!order || successPay || successDeliver){
            dispatch({ type: ORDER_PAY_RESET })
            dispatch({ type: ORDER_DELIVER_RESET })
            dispatch(getOrderDetails(orderId))
        }
        
        else if(!order.isPaid){
            // we also wanna check if paypal script is not there
            if(!window.paypal){
                // then we going to cal the addPaypal script
                addPayPalScript()
            } 
            else{
                // then we to setSdk ready to true
                setSdkReady(true)
            }
        }
    },[dispatch,orderId,history,userInfo,order,successDeliver,successPay])
    

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult)
        dispatch(payOrder(orderId,paymentResult))
    }


    const deliverHandler = () => {
        dispatch(deliverOrder(order))
    }


    return loading ? <Loader /> : error ? <Message variant='danger' >{error}</Message> : 
    <>
    <Link className='btn btn-light my-3' to='/profile'>Go Back</Link>
        <h1>Order {order._id}</h1>
        <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p><strong>Name: </strong> {order.user.name} </p>
                    <p><strong>Email: </strong><a href={`mail to:${order.user.email}`}>{order.user.email}</a></p>
                    <p>
                    <strong>Address:</strong>
                    {order.shippingAddress.address},{order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </p>
                    {order.isDelivered ? <Message variant='success'>Delivered on {order.deliveredAt}</Message> : <Message variant='danger'>Not Delivered</Message> }

                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                    </p>
                    {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message> }
                </ListGroup.Item>

                <ListGroup.Item>
                    <h2>Order Items</h2>
                    {/* if there is no items in the cart then show the message, Else hum listgroup banaingain, jis main sa ray items hoongain. */}
                    {order.orderItems.length === 0 ? <Message>Order is Empty</Message>
                    :
                    (
                    <ListGroup variant='flush'>
                        {/* Now here we need to loop through all our cart items, and output them or map through them to create a list.*/}
                        {/* foreach cart item we wanna render a listGroup item. since this is a list, this has to have a key, a unique key.*/}
                        {order.orderItems.map((item,index) => (
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col md={1}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={4}>{item.qty} x ${item.price} = ${item.qty * item.price}</Col>
                                </Row>
                            </ListGroup.Item> 
                        ))}
                    </ListGroup>
                    )}
                </ListGroup.Item>

            </ListGroup>
        </Col>

        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Order Summary</h2> 
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Items</Col>
                            <Col>${order.itemsPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                    <Row>
                        <Col>Shipping</Col>
                        <Col>${order.shippingPrice}</Col>
                    </Row>
                </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Tax</Col>
                            <Col>${order.taxPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                    <Row>
                        <Col>Total</Col>
                        <Col>${order.totalPrice}</Col>
                    </Row>
                    </ListGroup.Item>
                    


                    {!order.isPaid && (
                        <ListGroup.Item>
                            {loadingPay && <Loader />}
                            {!sdkReady ? <Loader/> : (
                                <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
                            )}
                        </ListGroup.Item>
                    )} 


                 { /* agar hum chahtay hain ke admin kisi ka bhi orde pay na karay toh yeh kar saktay hain
                 {userInfo.isAdmin ? <ListGroup.Item></ListGroup.Item> : 
                    <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {!sdkReady ? <Loader/> : (
                        <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
                    )}
                </ListGroup.Item>

                } */}



                    {loadingDeliver && <Loader />}
                    {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <ListGroup.Item>
                            <Button type='button' className='btn btn-block' onClick={deliverHandler}>Mark as Delivered</Button>
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        </Col>
                    
    </Row>
                    
    </>
                    
}
export default OrderScreen
