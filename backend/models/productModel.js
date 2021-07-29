import mongoose from 'mongoose'

// this will gonna be individual review rating, The rating down this is the average rating of all the ratings
const reviewSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'  // we need to reference a specific model for this objectId, so we ue ref and then model which gonna be User. This add relationship between the product and the user
    },
},{
    timestamps: true
})

// here we gonna create a use schema, and pass the object, In this object we will define all the fields that we want for a user
const productSchema = mongoose.Schema({
    // i wanna know which admins created which product
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'  // we need to reference a specific model for this objectId, so we ue ref and then model which gonna be User. This add relationship between the product and the user
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    // we want product brand
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    // reviews will gonna be an array of review objects
    reviews: [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0 // its gonna have default value 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0 // its gonna have default value 0
    },
    price: {
        type: Number,
        required: true,
        default: 0 // its gonna have default value 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0 // its gonna have default value 0
    },
}, {
    timestamps: true
})

// mongoose.model because we wanna create model from this schema
const Product = mongoose.model('Product', productSchema)

export default Product