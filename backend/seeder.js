// i wanna create database seeder so that we can easily import some sample data. This is not gonna be part of our application. this is a separate script that we wanna run, import data

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import users from './data/users.js'
import products from './data/products.js'
import User from './models/userModel.js'
import Product from './models/productModel.js'
import Order from './models/orderModel.js'
import connectDB from './config/db.js'
import e from 'express'

dotenv.config()

connectDB()

// this is gonna be asynchronous because we are dealing with database, we dealing with mongoose, everything returns a promise
const importData = async () => {
    try {
        // first thing i wanna do is to clear out all three collections completely.
        await Order.deleteMany() // its gonna delete everything, this returns a promise, so we need to add await in front
        await Product.deleteMany() // its gonna delete everything, this returns a promise, so we need to add await in front
        await User.deleteMany() // its gonna delete everything, this returns a promise, so we need to add await in front
    
        const createdUsers = await User.insertMany(users)
        
        const adminUser = createdUsers[0]._id

        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser}
        }) // i am gona map through this and add the admin user to each one, its gonna be products but in the addition of the user of the adminUser 
    
        await Product.insertMany(sampleProducts) 

        console.log('Data Imported ')
        process.exit() 
    
    } catch (error) {
        // if something goes wrong
        console.error(`${error}`)
        process.exit(1) // we wanna exit with failure, so we pass 1 in argument.
    }
}


const destroyData = async () => {
    try {
        // first thing i wanna do is to clear out all three collections completely.
        await Order.deleteMany() // its gonna delete everything, this returns a promise, so we need to add await in front
        await Product.deleteMany() // its gonna delete everything, this returns a promise, so we need to add await in front
        await User.deleteMany() // its gonna delete everything, this returns a promise, so we need to add await in front

        console.log('Data Destroyed')
        process.exit() 
    
    } catch (error) {
        // if something goes wrong
        console.error(`${error}`)
        process.exit(1) // we wanna exit with failure, so we pass 1 in argument.
    }
}

if(process.argv[2] == '-d'){
    // if we type in terminal node backend/seeder -d. so we want to call destroyData() function
    destroyData()
}
else{
    // else we want to call importData function
    importData()
}

// i could run this node backend/seeder -d. But instead of having to do that, lets add a npm script in package.json file.
// by adding "data:import": "node backend/seeder" and "data:destroy": "node backend/seeder"
// now in the terminal we need to run npm run data:import OR npm run data:destroy. in order to run. This makes simple.