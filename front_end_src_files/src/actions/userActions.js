// hamain login action chahiye. its gonna make a request to login and get the token

import { USER_DETAILS_FAIL, USER_DETAILS_REQUEST, USER_DETAILS_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS, USER_UPDATE_PROFILE_FAIL, USER_UPDATE_PROFILE_REQUEST, USER_UPDATE_PROFILE_SUCCESS, USER_DETAILS_RESET, USER_LIST_REQUEST, USER_LIST_SUCCESS, USER_LIST_FAIL, USER_LIST_RESET, USER_DELETE_REQUEST, USER_DELETE_SUCCESS, USER_DELETE_FAIL, USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL} from "../constants/userConstants"
import { ORDER_LIST_MY_RESET } from '../constants/orderConstants'
import axios from 'axios'


export const login = (email, password) => async (dispatch) => {
    try {
        // in the try we wanna dispatch the request 
        dispatch({
            type: USER_LOGIN_REQUEST
        })
        // after the request, i wanna create config object because when we actually sending data, we wanna send in the headers a content type. 
        const config = {
            headers: {
                // yahan token bhi pass karaingain for protected routes, but abhi sirf content type set kar rhai hain.

                'Content-Type': 'application/json',
            }
        }
        // now make a request, const and destructure data
        const { data } = await axios.post('/api/users/login',{ email,password }, config)
        // now after we make our request, we wanna dispatch our user login success, and payload main hum data bhaijdaingain, that we get back from above data.
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })
        // another thing i wanna do is to set our user to localstorage
        localStorage.setItem('userInfo', JSON.stringify(data))
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}




export const logout = () => (dispatch) => {
    // jab logout karaingain, toh 2 kaam karna hai. first remove it from localstorage. And then we wanna dispatch the userLogout action with the user logout constant

    localStorage.removeItem('userInfo')
    dispatch({
        type: USER_LOGOUT
    })
    dispatch({
        type: USER_DETAILS_RESET
    })
    dispatch({
        type: ORDER_LIST_MY_RESET  // when we logout our hamari state reset hojaigi. jab hum kisi aur dossray account se login karaingain. toh details uski aingeen. previous walay ke nhin aigi.
    })
    dispatch({
        type: USER_LIST_RESET 
    })
}






export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        })
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        }
        const { data } = await axios.post('/api/users',{ name, email,password }, config)

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data,
        })

        // right after above user_register_success here i also want to dispatch user_login_success, because we are getting the same thing back the user data and the token, when we register/login
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}









export const getUserDetails = (id) => async (dispatch,getState) => { // we need to send the token, jab getState lagaya hai, because haimain user ka info milta hai from getState se, which has the token
    try {
        dispatch({
            type: USER_DETAILS_REQUEST,
        })

        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }

        // now the id might be user profile, when we call it from  the profile screen, we gonna pass in profile as the id
        const { data } = await axios.get(`/api/users/${id}`, config)

        dispatch({
            type: USER_DETAILS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: USER_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}






// this is gonna take in the entire user object 
export const updateUserProfile = (user) => async (dispatch,getState) => { 
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST,
        })

        // destructuring from getState. userLogin: hamain aik level aur destructure karna hai. to get userInfo which is in userLogin
        const { userLogin: {userInfo} } = getState()

        

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }

        // now the id might be user profile, when we call it from  the profile screen, we gonna pass in profile as the id
        const { data } = await axios.put(`/api/users/profile`, user, config)

        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data, 
        })


    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}






export const listUsers = () => async (dispatch,getState) => { 
    try {
        dispatch({
            type: USER_LIST_REQUEST,
        })

        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }

        // now the id might be user profile, when we call it from  the profile screen, we gonna pass in profile as the id
        const { data } = await axios.get(`/api/users`, config)


        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data, 
        })


    } catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}









export const deleteUser = (id) => async (dispatch,getState) => { 
    try {
        dispatch({
            type: USER_DELETE_REQUEST,
        })

        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }

        // now the id might be user profile, when we call it from  the profile screen, we gonna pass in profile as the id
         await axios.delete(`/api/users/${id}`, config)


        dispatch({
            type: USER_DELETE_SUCCESS
        })


    } catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}






export const updateUser = (user) => async (dispatch,getState) => { 
    try {
        dispatch({
            type: USER_UPDATE_REQUEST,
        })

        const { userLogin: {userInfo} } = getState()

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}` // this is actually where we want to pass the token. We wanna pass it as Authorization, so we dont need '' for this. and we wanna set it to bearer token. jokay humnay PostMan jab kar rhai thai us waqt kiya tha.
            }
        }

        // destructuring the data that we get from this request, its gonna be the put request
         const { data } = await axios.put(`/api/users/${user._id}`, user, config)


        dispatch({
            type: USER_UPDATE_SUCCESS
        })
        // user update karnay ke baad updated data aur user details succes dispatch karaingain.
        dispatch({
            type: USER_DETAILS_SUCCESS, payload: data
        })


    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        })
    }
}
