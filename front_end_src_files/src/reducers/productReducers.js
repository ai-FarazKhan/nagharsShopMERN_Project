import { PRODUCT_LIST_REQUEST, PRODUCT_LIST_SUCCESS, PRODUCT_LIST_FAILED, PRODUCT_DETAILS_REQUEST, PRODUCT_DETAILS_SUCCESS, PRODUCT_DETAILS_FAILED, PRODUCT_DELETE_REQUEST, PRODUCT_DELETE_SUCCESS, PRODUCT_DELETE_FAILED, PRODUCT_CREATE_REQUEST, PRODUCT_CREATE_SUCCESS, PRODUCT_CREATE_FAILED, PRODUCT_CREATE_RESET, PRODUCT_UPDATE_RESET, PRODUCT_UPDATE_FAILED, PRODUCT_UPDATE_SUCCESS, PRODUCT_UPDATE_REQUEST, PRODUCT_CREATE_REVIEW_FAILED,PRODUCT_CREATE_REVIEW_REQUEST,PRODUCT_CREATE_REVIEW_RESET,PRODUCT_CREATE_REVIEW_SUCCESS, PRODUCT_TOP_FAILED,PRODUCT_TOP_REQUEST,PRODUCT_TOP_SUCCESS } from '../constants/productConstants'


// first i want is a product list reducer, and this is gonna handle the state for the product list which we see on the homepage.
// the reducer takes in two things, 1: the initial state, and we can set that to an empty object. and then it also takes an action. Now when we create an action we gonna dispatch an action to this productListReducer, and action will be an object that has a type, so the type will be gonna evaluate in the function, this action might also contain the payload for getting data.
// now in the initial state or we can say state, we gonna products thats gonna be an empty array.

export const productListReducer = (state = { products: [] }, action) => {
    // now we want to evaluate the type of the action object. so we will use switch statements

    // eslint-disable-next-line default-case
    switch(action.type){
        // this gonna be three different types that we look for here, one is the product list request, where we actually make the fetch request, one is gonna be the productList success, which is if we get a successful response, so we get the data. Another is gonna be if its fails, then we send error through state

        // first case
        case PRODUCT_LIST_REQUEST:
            return {// we gonna set the loading value to true, because when we make the request, we want the component to know that its currently fetching, so its currently loading. So thats gonna be set to true. Also we can pass products as an empty array, because its hasn't filled yet.
                loading: true, products: []
            }

        // case for successfull response
        case PRODUCT_LIST_SUCCESS:
            return {
                // here we wanna return an object, and we wanna make sure we set loading to false, because its done loading, its done making a request. And products will be filled with that action object that is payload. so we gonna filled products in the state with that payload
                // In the short, here if its successfull, than we will send the data in the payload
                loading: false, products: action.payload.products, pages:action.payload.pages, page:action.payload.page
            }

        // last case if its failed, if we try to fetch data, and we get an error.like a 404 or something like that
        case PRODUCT_LIST_FAILED:
            // if that happens 
            return{
                // we still wanna set loading to false, because its already done loading. Than i will set an error in the state, and than send that error in the payload
                //In the short, if its failed, we gonna the send the error in the payload.
                loading: false, error: action.payload
            }
        // default will gonna be state, jo kay uper function ke arugument main hai, aur woh initial state hai.
        default:
            return state

    }
}

// now in order ot use this above reducer, we actually have to add it to store.js file




export const productDetailsReducer = (state = { product: { reviews: [] } }, action) => {
    switch(action.type){
        case PRODUCT_DETAILS_REQUEST:
            return {
                loading: true, ...state // i am just gonna add whatever else in the current state, so we use spread operator ...
            }
        case PRODUCT_DETAILS_SUCCESS:
            return {
                loading: false, product: action.payload
            }
        case PRODUCT_DETAILS_FAILED:
            return{
                loading: false, error: action.payload
            }
        default:
            return state
    }
}





export const productDeleteReducer = (state = { }, action) => {
    switch(action.type){
        case PRODUCT_DELETE_REQUEST:
            return {
                loading: true,
            }
        case PRODUCT_DELETE_SUCCESS:
            return {
                loading: false, success: true
            }
        case PRODUCT_DELETE_FAILED:
            return{
                loading: false, error: action.payload
            }
        default:
            return state
    }
}




export const productCreateReducer = (state = { }, action) => {
    switch(action.type){
        case PRODUCT_CREATE_REQUEST:
            return {
                loading: true,
            }
        case PRODUCT_CREATE_SUCCESS:
            return {
                loading: false, success: true, product: action.payload
            }
        case PRODUCT_CREATE_FAILED:
            return{
                loading: false, error: action.payload
            }
        case PRODUCT_CREATE_RESET:
            return{ }
        default:
            return state
    }
}





export const productUpdateReducer = (state = { product: {} }, action) => {
    switch(action.type){
        case PRODUCT_UPDATE_REQUEST:
            return {
                loading: true,
            }
        case PRODUCT_UPDATE_SUCCESS:
            return {
                loading: false, success: true, product: action.payload
            }
        case PRODUCT_UPDATE_FAILED:
            return{
                loading: false, error: action.payload
            }
        case PRODUCT_UPDATE_RESET:
            return{ product: {} }
        default:
            return state
    }
}






export const productReviewCreateReducer = (state = { }, action) => {
    switch(action.type){
        case PRODUCT_CREATE_REVIEW_REQUEST:
            return {
                loading: true,
            }
        case PRODUCT_CREATE_REVIEW_SUCCESS:
            return {
                loading: false, success: true
            }
        case PRODUCT_CREATE_REVIEW_FAILED:
            return{
                loading: false, error: action.payload
            }
        case PRODUCT_CREATE_REVIEW_RESET:
            return{}
        default:
            return state
    }
}









export const productTopRatedReducer = (state = { products: [] }, action) => {
    switch(action.type){
        case PRODUCT_TOP_REQUEST:
            return {
                loading: true, products: []
            }
        case PRODUCT_TOP_SUCCESS:
            return {
                loading: false, products: action.payload
            }
        case PRODUCT_TOP_FAILED:
            return{
                loading: false, error: action.payload
            }
        default:
            return state
    }
}