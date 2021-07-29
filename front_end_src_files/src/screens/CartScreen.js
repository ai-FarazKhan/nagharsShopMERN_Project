// we gonna need useEffect is where we actually wanna dispatch addtoCart 
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'    // we also gonna need react router link
import { useDispatch, useSelector } from 'react-redux' // because we are dealing with redux state, so pretty much anytime you are dealing with your redux state you gonna bring this in
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart} from '../actions/cartActions'


const CartScreen = ({match,location,history}) => {
    // down here first get the product id which is gonna be match.param.id that how we get it from the URL. toh hum parameter main destructure karaingain match ko. And i also wanna get the location because we also need to get the quantity, and to get a querry string like ?qty to get this we need to use location.search, so we want location. We also want history which is use to redirect. so we wanna bring these props
    
    const productId = match.params.id // so we are getting product id from the URL
    // now we want to get the quantity 
    const qty = location.search ? Number(location.search.split('=')[1]) : 1 // we gonna check for location.search because thats gonna be the query params like ?qty. location.search hamain ? ke baad qty=1 ya lakar dega. Now if its there ? we only want the number. yani agar qty=1 hai toh hamain sirf ismain se number chahiye. so take the location.search which will look like this ?qty=1, now i wanna call .split, and i wanna split it by the equal sign. what that will do is that, it will set ?qty as the 0 index and 1 will be the 1 index. So i wanna get the 1 index. And than : else than the quantiyy will just be 1
    // toh yeh location.search.split('=')[1] hamain quantity ko dega lekin number Formate/dataType main nhin dega. Toh isiliye hum isko Number(location.search.split('=')[1]) aisay wrap karaingain.
    // agar hum qty ko console.log karaingain toh humain yeh milay ga. Toh jaisi hi hum add to cart pe click karaingain toh URL main ? ke baad jo hoga yani qty=1 toh yeh cheez hoti hai location.search main
    // console.log(qty)


    // now we wanna define our dispatch

    const dispatch = useDispatch()


    // displaying item in the cart. for this we wanna use the useSelector, to grab that piece of state
    const cart = useSelector((state) => state.cart)
    const { cartItems } = cart

    //console.log(cartItems) // just console.log karke dekh rha hoon ke cartItems show ho rhai hain ke nhin. karke dekhliy show ho rhai hain.

    useEffect(() => {
        // in this useEffect we only wanna dispatch AddToCart if there is a productID, if we go to regular cart page then we dont want to do.

        if(productId){
            // if there is productID, matlab agar user ne addToCart pe click kiya hai aur URL main ProductID agai hai.
            // then dispatch right away

            dispatch(addToCart(productId,qty))
        }
    },[dispatch,productId,qty])


    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkOutHandler = () =>{
        // redirecting to 
        history.push('/login?redirect=shipping') // basically if we are not logged inwe gonna go to login, And if we are login then we gonna go to shipping. Yeh hai iska matlab.
    }


    return( 
        <Row>
            <Col md={8}>
                <h1>Shopping Cart</h1>
                {cartItems.length === 0 ? ( <Message>Your Cart is Empty <Link to='/'>Go Back</Link></Message> ) : (
                    <ListGroup variant='flush'>
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item.product}>
                                <Row>
                                    <Col md={2}>
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col md={3}>
                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                    </Col>
                                    <Col md={2}>${item.price}</Col>
                                    <Col md={2}>
                                        <Form.Control as='select' value={item.qty} onChange={(e) => dispatch(addToCart(item.product,Number(e.target.value)))}>
                                        {
                                            [...Array(item.countInStock).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                {x + 1}
                                                </option>
                                            ))
                                        }
                                    </Form.Control>
                                    </Col>
                                    
                                    <Col md={2}>
                                        <Button type='Button' variant='light' onClick={() => removeFromCartHandler(item.product)}>
                                            <i className='fas fa-trash'></i>
                                        </Button>
                                    </Col>

                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Col>
            <Col md={4}>
               <Card>
                 <ListGroup variant='flush'>
                  <ListGroup.Item>
                   <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                   ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={checkOutHandler}>
                        Proceed To CheckOut
                    </Button>
                  </ListGroup.Item>
                 </ListGroup>
               </Card> 
            </Col>
        </Row>
    )
}

export default CartScreen
