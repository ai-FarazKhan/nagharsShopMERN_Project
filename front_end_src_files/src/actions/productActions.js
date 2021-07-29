import axios from 'axios'

// so any actions that have to do with product will go over here. 

// now we wanna bring constants to our this action file.

import { PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAILED, PRODUCT_LIST_REQUEST, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAILED, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAILED,PRODUCT_CREATE_SUCCESS,PRODUCT_CREATE_FAILED,PRODUCT_CREATE_REQUEST, PRODUCT_UPDATE_REQUEST,PRODUCT_UPDATE_SUCCESS,PRODUCT_UPDATE_FAILED, PRODUCT_CREATE_REVIEW_SUCCESS, PRODUCT_CREATE_REVIEW_REQUEST, PRODUCT_CREATE_REVIEW_FAILED, PRODUCT_TOP_REQUEST, PRODUCT_TOP_SUCCESS, PRODUCT_TOP_FAILED } from '../constants/productConstants'


// here we want to make an asynchronous request, what redux thunk allows us to basically add a function within a function like this => async () =>
export const listProducts = (keyword = '', pageNumber = '') => async (dispatch) => { // dispatch mean bhaijna
    try {
        // first dispatch mean phele bhaijo, 
        // first dispatch the request, because we are ready to send the request, in the paranthesis we pass an object, with a type
        
        dispatch({ type: PRODUCT_LIST_REQUEST })

        // this is where we wanna make our request

        // we gonna destructure data. We gonna use axios here. we gonna make a get request using axios to /api/products
        const { data } = await axios.get(`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`) // this should gives use the data. aur jo data hum search karaingain woh lakar bhi de dega. agar hmaray paas 1 ya 2 se zaida query string hoon toh hum & use karsaktay hain.

        // now we wanna do is disptach the product list success. here its gonna be object with a type
        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data
        }) 
    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAILED,
            // and the payload is gonna be the error.
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}



// yahan argument main id deni hogi, kunke hum janna chatay hain ke which product we are getting
export const listProductDetails = (id) => async (dispatch) => { // dispatch mean bhaijna
    try {
        dispatch({ type: PRODUCT_DETAILS_REQUEST })
        const { data } = await axios.get(`/api/products/${id}`) 

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        }) 
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAILED,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}




// this is gonna take in the id of the product that we wanna delete
export const deleteProduct = (id) => async (dispatch,getState) => { 
    try {
        dispatch({
            type: PRODUCT_DELETE_REQUEST,
        })
        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }
        
        await axios.delete(`/api/products/${id}`, config)
        
        dispatch({
            type: PRODUCT_DELETE_SUCCESS,
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAILED,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}





// its gonna take any argument, kunke yeh sample product banaiga 
export const createProduct = () => async (dispatch,getState) => { 
    try {
        dispatch({
            type: PRODUCT_CREATE_REQUEST,
        })
        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }
        // second argument main empty object pass karaingain. because we are making post request, but we are not sending any data.
        const { data } = await axios.post(`/api/products`, {}, config)
        
        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAILED,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}






export const updateProduct = (product) => async (dispatch,getState) => { 
    try {
        dispatch({
            type: PRODUCT_UPDATE_REQUEST,
        })
        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }

        const { data } = await axios.put(`/api/products/${product._id}`, product, config)
        
        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAILED,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}








export const createProductReview = (productId,review) => async (dispatch,getState) => { 
    try {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_REQUEST,
        })
        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }

        await axios.post(`/api/products/${productId}/reviews`, review, config)
        
        dispatch({
            type: PRODUCT_CREATE_REVIEW_SUCCESS
        })
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_REVIEW_FAILED,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}









export const listTopProducts = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_TOP_REQUEST })
        const { data } = await axios.get(`/api/products/top`) 

        dispatch({
            type: PRODUCT_TOP_SUCCESS,
            payload: data
        }) 
    } catch (error) {
        dispatch({
            type: PRODUCT_TOP_FAILED,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}