import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'


// This is gonna create a new order
// This is gonna be a Post request api/orders
// Its gonna be private access

// this function gonna take in a req and res, and its gonna be asycn, aur hum isko asyncHandler se wrap kardaingain
const addOrderItems = asyncHandler(async(req,res) => {
    // so we gonna get some stuff from the body, lets destructure some stuff from req.body
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice,  } = req.body

    // now we wanna make sure that orderItems is not empty
    // if orderItems exists and orderItems.length 
    if(orderItems && orderItems.length === 0) {
        res.status(400) // 400 is a bad request
        throw new Error('No Order Items')
        return
    }
    else{
        // else if there is an items, then we wanna create a new order in the database.
        // first thing will do is to instantiate a new order, and pass an object, aur woh saray items jo body se a rhai hain woh pass kardaingain. Aur aik cheez ka addition karaingain. ke logged in user ko bhi attach kardaingain. kunke yeh protected rout hai,aur humain user._id token se milgai gi.
        const order = new Order({
            orderItems, user: req.user._id,  shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice,
        })

        // now saving to database.
        const createdOrder = await order.save()


        // now status will be 201, because something is created.
        res.status(201).json(createdOrder)
    }
})



// fetching the order from the database

// Get an order by id
// its gonna be a get request
// Its gonna be private access

// this function gonna take in a req and res, and its gonna be asycn, aur hum isko asyncHandler se wrap kardaingain
const getOrderById = asyncHandler(async(req,res) => {
    // we wanna fetch the order
    const order = await Order.findById(req.params.id).populate('user', 'name email') // so humain id URL se mil gai gi, so req.params.id, also i want to get the user name, email, that is associated with this order. so for this .populate(), name email ko space dekar likhaingain toh woh ajai gi user se. is tarhan user ka name aur email attach hokar ajaiga order ke saath. ke kisnay order kiya hai, aur kiya kiya hai.

    if(order){
        res.json(order)
    }
    else{
        res.status(404)
        throw new Error('Order not found')
    }

}) 


// this function gonna update order to paid
// route will be GET /api/order/:id/pay
// access will be private

const updateOrderToPaid = asyncHandler(async(req,res) => {
    // we wanna fetch the order
    const order = await Order.findById(req.params.id) 

    if(order){
        order.isPaid = true
        order.paidAt = Date.now()
        // this actually gonna come from paypal, jo object ke andar id wagera hain, woh ultimately paypal ke response se aingeen.
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        }
        // uper jo humnay kiya hai woh set kiya hai order ko, ab yahan is line pe hum order ko save kar rhai hain database main.
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    }
    else{
        res.status(404)
        throw new Error('Order not found')
    }

}) 






// this function gonna update order to delivered
// route will be GET /api/order/:id/deliver
// access will be private/admin

const updateOrderToDelivered = asyncHandler(async(req,res) => {
    // we wanna fetch the order
    const order = await Order.findById(req.params.id) 

    if(order){
        order.isDelivered = true
        order.deliveredAt = Date.now()
        // uper jo humnay kiya hai woh set kiya hai order ko, ab yahan is line pe hum order ko save kar rhai hain database main.
        const updatedOrder = await order.save()
        res.json(updatedOrder)
    }
    else{
        res.status(404)
        throw new Error('Order not found')
    }

}) 








// this function gonna get logged in user orders
// route will be GET /api/order/myorders
// access will be private

const getMyOrders = asyncHandler(async(req,res) => {
    // we wanna fetch the orders, .find() use karaingain. kunke we are getting more than one. aur find() ke andar object pass karaingain. because we only wanna find orders where the user is equal to the req.user._id. Yani only the logged in user.
    const orders = await Order.find({ user: req.user._id}) 
    res.json(orders)
}) 




// get all orders
// route will be GET /api/orders
// access will be private/admin

const getOrders = asyncHandler(async(req,res) => {
    const orders = await Order.find({ }).populate('user','id name') // adding populate because from the user, i wanna get the id and the name, which is associated with that order
    res.json(orders)
}) 



export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
    updateOrderToDelivered
}