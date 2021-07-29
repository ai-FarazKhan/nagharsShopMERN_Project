import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import CheckoutSteps from '../components/CheckoutSteps'
import {createOrder} from '../actions/orderActions'

const PlaceOrderScreen = ({history}) => {

    const dispatch = useDispatch()

    // now lets get the items in our cart
    const cart = useSelector(state => state.cart) // state => state.cart means that from our state we want cart.

    // calculating prices
    // is function se . ke baad 2 digits lekar a rhai hain bas
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100 ).toFixed(2)
    }

    cart.itemsPrice = addDecimals(cart.cartItems.reduce((acc,item) => acc + item.price * item.qty, 0))
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 100)
    cart.taxPrice = addDecimals((0.15 * cart.itemsPrice).toFixed(2)) // adding 15% tax. and we want it to set to two decimal point thats why i use toFixed()

    cart.totalPrice = (Number(cart.itemsPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)).toFixed(2)


    // once we dispatch createOrder its gonna send everything down through the state and we need to grab that
    const orderCreate = useSelector(state => state.orderCreate) // and we wanna get from the state is orderCreate
    const { order, success, error } = orderCreate // and what we wanna pull from that is gonna be the order itself and success value etc
    
    useEffect(() => {
        if(success){
            history.push(`/order/${order._id}`)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[history,success])
    
    
    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            shippingAddress: cart.shippingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        }))
    }

    return (
        <>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Shipping</h2>
                        <p>
                        <strong>Address:</strong>
                        {cart.shippingAddress.address},{cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <strong>Method: </strong>
                        {cart.paymentMethod}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Order Items</h2>
                        {/* if there is no items in the cart then show the message, Else hum listgroup banaingain, jis main sa ray items hoongain. */}
                        {cart.cartItems.length === 0 ? <Message>Your Cart is Empty</Message>
                        :
                        (
                        <ListGroup variant='flush'>
                            {/* Now here we need to loop through all our cart items, and output them or map through them to create a list.*/}
                            {/* foreach cart item we wanna render a listGroup item. since this is a list, this has to have a key, a unique key.*/}
                            {cart.cartItems.map((item,index) => (
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
                                <Col>${cart.itemsPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <Row>
                            <Col>Shipping</Col>
                            <Col>${cart.shippingPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Tax</Col>
                                <Col>${cart.taxPrice}</Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                        <Row>
                            <Col>Total</Col>
                            <Col>${cart.totalPrice}</Col>
                        </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>{ error && <Message variant='danger'>{ error }</Message> }</ListGroup.Item>
                        <ListGroup.Item>
                            <Button type='button' className='btn-block' disabled={cart.cartItems === 0} onClick={placeOrderHandler}>Place Order</Button>
                        </ListGroup.Item>           
                    </ListGroup>
                </Card>
            </Col>

        </Row>
        </>
    )
}
export default PlaceOrderScreen
