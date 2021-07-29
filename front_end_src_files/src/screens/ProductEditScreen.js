import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct } from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'


const ProductEditScreen = ({ match, history }) => {

    const productId = match.params.id

    const [name, setName] = useState('') // just an empty string as a default
    const [price, setPrice] = useState(0) // zero by default
    const [image, setImage] = useState('') // just an empty string as a default
    const [brand, setBrand] = useState('') // just an empty string as a default
    const [category, setCategory] = useState('') // just an empty string as a default
    const [countInStock, setCountInStock] = useState(0) // zero by default
    const [description, setDescription] = useState('') // just an empty string as a default
    const [uploading, setUploading] = useState(false)

    // lets define dispatch 
    const dispatch = useDispatch()

    const productDetails = useSelector(state => state.productDetails)
    const { loading, error, product } = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate


    useEffect(() => {

        if(successUpdate){
            dispatch({type: PRODUCT_UPDATE_RESET})
            history.push('/admin/productlist')
        }
        else{
            if(!product.name || product._id !== productId){
                dispatch(listProductDetails(productId))
            }
            else{
                // if the user is already here, than set out fields.
                setName(product.name)
                setPrice(product.price)
                setBrand(product.brand)
                setDescription(product.description)
                setImage(product.image)
                setCategory(product.category)
                setCountInStock(product.countInStock)
            }
        }
    }, [dispatch, history, productId, product,successUpdate]) 

    // passing e as argument, so that we can get access to the files
    const uploadFileHandler = async(e) => {
        const file = e.target.files[0] // so what happens when we upload is, we get access to this, which is an array, because we have ability to upload multiple files, now since we are only uploading a single file, so its gonna be the first item in the array. [0]
        const formData = new FormData()
        formData.append('image',file) // image in first argument, just like we did in the backend. aur second main file.
        setUploading(true) // yeh loader ko banai ga. loader chalay ga.

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
            const { data } = await axios.post('/api/upload',formData,config)

            setImage(data) // setImage to the data thats comes back, hum jo send back kar rhai hain woh path hai. so that gonna set as the image to that path.
            setUploading(false)
        } catch (error) {
            console.log(error)
            setUploading(false) // again setting uploading to false, so that we can not have a never ending spinner.
        }
    }


// productId coming from url
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            description,
            countInStock,
        }))
    }

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'> Go Back</Link>
            <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
            {loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>

                <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='name' placeholder='Enter Email' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group>
    
                    <Form.Group controlId='price'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control type='number' placeholder='Enter price' value={price} onChange={(e) => setPrice(e.target.value)}></Form.Control>
                    </Form.Group>
    
                    <Form.Group controlId='image'>
                        <Form.Label>Image</Form.Label>
                        <Form.Control type='text' placeholder='Enter image url' value={image} onChange={(e) => setImage(e.target.value)}></Form.Control>

                        <Form.File id='image-file' label='Choose File' custom onChange={uploadFileHandler}></Form.File>
                        {uploading && <Loader />}
                        </Form.Group>

                    <Form.Group controlId='brand'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control type='text' placeholder='Enter Brand' value={brand} onChange={(e) => setBrand(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock'>
                        <Form.Label>Count In Stock</Form.Label>
                        <Form.Control type='number' placeholder='Enter countInStock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='category'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control type='text' placeholder='Enter Category' value={category} onChange={(e) => setCategory(e.target.value)}></Form.Control>
                    </Form.Group>

                    <Form.Group controlId='description'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control type='text' placeholder='Enter description' value={description} onChange={(e) => setDescription(e.target.value)}></Form.Control>
                    </Form.Group>
    
                    <Button type='submit' variant='primary'>Update</Button>
    
                </Form>
            )}

        </FormContainer>            
        </>

    )
}

export default ProductEditScreen
