// this is where we basically connect all our reducers, any middleware stuff like that.
// createStore jaisakay name se hi pata chal rha hai, its a function to actually create your store.
// we also want combineReducers. basically we gonna have bunch of reducers, and each reducer gonna handle a certain peice of functionality. So if we are fetching our product from backend, we gonna have reducer for productlist, it will have request part a success if a successful response, and then it will have a fail in case there is an error
// also we need applyMiddleware so that we can apply any middleware

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
// now to use redux dev tools extension we wanna import this.
import { composeWithDevTools } from 'redux-devtools-extension'
import { productListReducer, productDetailsReducer, productDeleteReducer, productCreateReducer, productUpdateReducer, productReviewCreateReducer, productTopRatedReducer } from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer } from './reducers/userReducers'
import { orderCreateReducer, orderDetailsReducer, orderPayReducer, orderDeliverReducer, orderListMyReducer, orderListReducer } from './reducers/orderReducers'

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderDeliver: orderDeliverReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,
})

// we wanna fetch it from local storage. if thats there ? in this variable we wanna put whatever in there, but we have to run it through JSON.parse, because remember its gets stored in the string. : Else if its not found in local storage, than its gonna be an empty array[]
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []

// just like we did with the cart, when we save the cart items in the local storage, we want to load those initially in our initial state, in the store js.
const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null // if nothings there i am gonna return null

// if there is something in the localstorage for the shipping address we wanna add that to our state
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {} // if nothing its gonna be an empty object



const initialState = {
    cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage, },
    userLogin: { userInfo: userInfoFromStorage },
} // if we want something to be loaded when the reduxStore load initially we can put it in here, as initial state.

const middleware = [thunk]

const store = createStore(
    reducer, initialState, composeWithDevTools(applyMiddleware(...middleware))
)


export default store