import { ORDER_CREATE_REQUEST,ORDER_CREATE_SUCCESS,ORDER_CREATE_FAIL, ORDER_DETAILS_FAIL, ORDER_DETAILS_SUCCESS, ORDER_DETAILS_REQUEST, ORDER_PAY_FAIL, ORDER_PAY_SUCCESS, ORDER_PAY_REQUEST, ORDER_LIST_MY_REQUEST, ORDER_LIST_MY_SUCCESS, ORDER_LIST_MY_FAIL, ORDER_LIST_REQUEST, ORDER_LIST_SUCCESS, ORDER_LIST_FAIL, ORDER_DELIVER_REQUEST,ORDER_DELIVER_SUCCESS,ORDER_DELIVER_FAIL } from '../constants/orderConstants'
import axios from 'axios'


// this is gonna take in the entire user object 
export const createOrder = (order) => async (dispatch,getState) => { 
    try {
        dispatch({
            type: ORDER_CREATE_REQUEST,
        })

        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }

        const { data } = await axios.post(`/api/orders`, order, config)

        dispatch({
            type: ORDER_CREATE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}





// argument main order ID pass kis hai. id
export const getOrderDetails = (id) => async (dispatch,getState) => { 
    try {
        dispatch({
            type: ORDER_DETAILS_REQUEST,
        })
        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }
        const { data } = await axios.get(`/api/orders/${id}`, config)
        dispatch({
            type: ORDER_DETAILS_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}





// in argument i passed two things, the order itself and also the paymentResult which is gonna come from paypal
export const payOrder = (orderId,paymentResult) => async (dispatch,getState) => { 
    try {
        dispatch({
            type: ORDER_PAY_REQUEST,
        })
        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }
        const { data } = await axios.put(`/api/orders/${orderId}/pay`, paymentResult , config)
        dispatch({
            type: ORDER_PAY_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: ORDER_PAY_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}





export const deliverOrder = (order) => async (dispatch,getState) => { 
    try {
        dispatch({
            type: ORDER_DELIVER_REQUEST,
        })
        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }
        const { data } = await axios.put(`/api/orders/${order._id}/deliver`, {}, config)
        dispatch({
            type: ORDER_DELIVER_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: ORDER_DELIVER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}







// we dont need to pass anything in the parameter. because its knows who we are by token
export const listMyOrders = () => async (dispatch,getState) => { 
    try {
        dispatch({
            type: ORDER_LIST_MY_REQUEST,
        })
        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }
        const { data } = await axios.get(`/api/orders/myorders`, config)
        
        dispatch({
            type: ORDER_LIST_MY_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: ORDER_LIST_MY_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}








export const listOrders = () => async (dispatch,getState) => { 
    try {
        dispatch({
            type: ORDER_LIST_REQUEST,
        })
        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }
        const { data } = await axios.get(`/api/orders`, config)
        
        dispatch({
            type: ORDER_LIST_SUCCESS,
            payload: data,
        })
    } catch (error) {
        dispatch({
            type: ORDER_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}