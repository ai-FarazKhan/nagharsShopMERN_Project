// and the reason we importing axios is because when we add an item to the cart, we wanna make a request to api/products/id  to get the data for that particular product which is add to cart 

import axios from 'axios'
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS,CART_SAVE_PAYMENT_METHOD } from '../constants/cartConstants'

// id,qty which in the screens we can get from the URL, and than we wanna use thunk
export const addToCart = (id, qty) => async(dispatch,getState) => {
    // and we also gonna be save the entire cart to our local storage here, and along with dispatch we can also pass in getState, this allows us to get the entire state tree

    // let makes the reqeust
    // destructure the data, and we gonna get this from axios, so we have to await, because its asynchronous.
    const { data } = await axios.get(`/api/products/${id}`)

    // this what we wanna display i
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty,
        }
    })

// once we dispatch it, than we wanna save it in the local storage.
// we wanna set the entire cart, this is where we use getState(). 
// .cart.cartItems this is what we want cartItems in our state.
// getState().cart.cartItems will gives us JSON object, so we will use JSON.stringify, because we can save only strings in our local storage.
localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))


}  

// also we need to pass getState so that we can get all of the items from the cart, so that we can reset our local storage to whatever is in the cart - what we remove from it
export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id,
    })

    // reseting jo jo item remove kiya hai woh hat jai ga hamaray local storage se 
    localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems))
}



// save shipping address action.

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    })
    localStorage.setItem('shippingAddress',JSON.stringify(data))
}



export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data,
    })
    localStorage.setItem('paymentMethod',JSON.stringify(data))
}