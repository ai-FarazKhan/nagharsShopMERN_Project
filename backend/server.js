import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

connectDB()

const app = express()

// i only want to run morgan in development mode, not in production mode. toh yeh condition hai.
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev')) // dev gives us Http methods, status code etc. 
}


// we need to add a one peace of middle ware in our server.js file. we need to add body parse 

app.use(express.json()) // express.json() this will allow us to accept json data in the body

// if we get this request / then we wanna run a function thats takes request and response parameter
// app.get('/',(req,res) => {
//     res.send('API is running')
// })

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

// its basically a config route. when we ready to make our payment it will hit this route, and will fetch this client id.
app.get('/api/config/paypal',(req,res) => res.send(process.env.PAYPAL_CLIENT_ID))



//Uploads folder is not gonna be accessible by default we need to do is to make this a static folder so that it can get loaded in the brower. making uploads folder static so that it can get loaded in the browser
const __dirname = path.resolve()
app.use('/uploads',express.static(path.join(__dirname,'/uploads'))) // __ double underscore se current folder milayga. All this is doing that taking us to the upload folder, and we are making it static

// production hojaiga. jab hum deploy karaingain server pe.
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'/frontend/build')))
    app.get('*', (req,res) => res.sendFile(path.resolve(__dirname,'frontend','build','index.html')))  // anyhting that isn't in any of above routes. get any route thats not our api. aur phir hamain frontend ke build se index.html load karni hai.
}
// if we are not in production
else{
app.get('/',(req,res) => {
    res.send('API is running')
})
}



app.use(notFound)

app.use(errorHandler)


// || or means if that not found use 5000
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`))