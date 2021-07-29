// cart reducer aik hi hoga, cartReducers is liye likha hai kunke naming convention follow ho dosri files ki tarhan.


import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_SHIPPING_ADDRESS, CART_SAVE_PAYMENT_METHOD } from '../constants/cartConstants'

// in this state object we gonna have cart items, which is gonna be an array, because we will have more than one items in the cart obviously
export const cartReducer = (state = { cartItems: [], shippingAddress:{} }, action) => {

    // switch for the action type 
    switch(action.type) {

        case CART_ADD_ITEM:
            // if that item in a cart already exist, we have to handle it also. I wanna payload in the variable called item
            const item= action.payload

            // lets find if its exist, creating variable existItem, we get from state in our cart item and we wanna find. find() arrow function leta hai parameter main. Lets say foreach of the of items that are in the current state cart items. x.product === item.product, current state se match agar hogai 
            const existItem = state.cartItems.find((x) => x.product === item.product)

            if(existItem){
                return{
                    ...state,
                    cartItems: state.cartItems.map((x) => x.product === existItem.product ? item : x), // map throught the current cart items, agar donon exist kartay hain, then we just gonna return the item for this iteration, else it will be x
                }
            }
            else{
                // if its doesn't exist we just gonna push it into the array
                return {
                    ...state,
                    cartItems: [...state.cartItems, item], // and then we just gonna add that new item
                }
            }

        case CART_REMOVE_ITEM:
            return{
                ...state,
                cartItems: state.cartItems.filter((x) => x.product !== action.payload ) // foreach item we wanna check if the x.product which is the id, if thats not equal to the action.payload
            }
        case CART_SAVE_SHIPPING_ADDRESS:
            return{
                ...state,
                shippingAddress: action.payload, //  action.payload which is the data which we gonna pass in from the form
            }
        case CART_SAVE_PAYMENT_METHOD:
            return{
                ...state,
                paymentMethod: action.payload, //  action.payload which is the data which we gonna pass in from the form
            }            
        default:
            return state
    }

}