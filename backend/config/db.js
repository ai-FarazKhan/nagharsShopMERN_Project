// this is our database config file or you can say its our connection file

import mongoose from 'mongoose'

// this function will be asyncrhonous, because when we deal with mongodb, when we call like .connecter .finder .create or whatever, its always gonna return promise and i wanna use async await
const connectDB = async () => {

    try {
        // we want to await because mongoose.connect returns a promise, and what its takes in is MONGO_URI. And then we have a second argument we can pass in, which is a set of options
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })

        // after we connect, we just doing console log

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        // if something goes wrong we cant connect 
        console.error(`Error: ${error.message}`)
        // and we want to exit the process
        process.exit(1) // if we pass 1 here its means its gonna exit with failure
    }

}


// and here we just want to export the function

export default connectDB