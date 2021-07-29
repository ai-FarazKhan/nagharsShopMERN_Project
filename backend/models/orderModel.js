import mongoose from 'mongoose'

// here we gonna create a use schema, and pass the object, In this object we will define all the fields that we want for a user
const orderSchema = mongoose.Schema({
    // we gonna have user connected to the order as well, this is the user that buys the product
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // and we wanna reference the user model
    },
    orderItems: [
        {
            name: { type: String, required: true }, // this is gonna be the name of the product
            qty: { type: Number, required: true }, // we also want quantity
            image: { type: String, required: true }, // also image
            price: { type: Number, required: true }, // also price
            product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }  // this order have relationship to the product model. Reference will be the product model
        }
    ],
    shippingAddress: {
        address: { type: String, required: true }, // basically these are embeded objects, shippingAdress will have address which is type of string
        city: { type: String, required: true }, 
        postalCode: { type: String, required: true },
        country: { type: String, required: true }
        
    },
    // even though we are setting up the paypal gateway, but i wanna make it scalable, so that we can easily add payment method
    paymentMethod: {
        type: String,
        required: true
    },
    // this is going to come through paypal, when we go through and made the payment, when payment successfull, we get some data back,and thats we gonna put here
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    // we need to know if its paid ?
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date
    },
}, 
{
    timestamps: true
})

// mongoose.model because we wanna create model from this schema
const Order = mongoose.model('Order', orderSchema)

export default Order