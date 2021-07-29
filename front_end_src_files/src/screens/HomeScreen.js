import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux' // useDispatch will be use to dispatch a calling action, And useSelector which is use to select parts of the State.
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
// now to dispatch our listProductAction we actually have to bring that in from reac redux
import { listProducts } from '../actions/productActions'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'
import { Link } from 'react-router-dom'


const HomeScreen = ({match}) => {

    // jo search kiya hai woh hum Url se keyword le rhai hain. it might be nothing or it might be keyword. whatever it is. we need to pass it in listProduct() in useEffect. because thats the action that calls from the backend
    const keyword = match.params.keyword

    const pageNumber = match.params.pageNumber || 1 // if its not there then its gonna be on page one


    const dispatch = useDispatch()

    // selectors takes in arrow function. what part of the state that we want. yani state => iskay baad hamain konsa state kar part chaiye. hamain product list cha hiye
    const productList = useSelector(state => state.productList) 
    // now we can destructure here, and pull out what we want from productList
    const { loading, error, products, page, pages } = productList // we are pulling loading,error and products from state. so these are the part of the state that could be sent down


    // whatever we put in here is gonna run as soon as the components load, now that where we wanna do request, we want our products as soon as the components load.
    // its makes the request to the backend to get products
    useEffect(()=>{
        dispatch(listProducts(keyword,pageNumber))
        // now since we are using dispatch in this useEffect 
    },[dispatch,keyword,pageNumber]) // i am gonna pass in here a dependency so that humko warning na milay console main 

            // if loading ? then we actually gonna have a spinner, little loader, else if there is an error ? then, and then finally else we want to dispaly our row with data

    return (
        <>

        <Meta /> 

        {!keyword ? <ProductCarousel /> : <Link to='/' className='btn btn-light'> Go Back</Link>}
            <h1>Latest Products</h1>
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> :
            <>
                <Row>
                    {products.map(product => (
                        <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                            <Product product={product} />
                        </Col>
                ))}
                </Row>
                <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
            </>
            }

        </>
    )
}

export default HomeScreen
