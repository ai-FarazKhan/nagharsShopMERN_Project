// also i wanna have a fallback for 404 error which is a not found, so basically if you go to anything thats not an actual route

const notFound = (req,res,next) => {
    const error = new Error(`Not found -${req.originalUrl}`) // this is how we can through an error 
    // and then set the status, and the status gonna be set to 404
    res.status(404)
    // and then we just wanna call next and pass in error
    next(error)

    // so now in the browser ab agar hum aik asay route pe jaingain jo define nhin hai like this http://localhost:5000/api/test. Toh hamain error millay ga. message not found. Aur yeh hamain woh URL dikhaiga jo hum access karna chatay hain /api/test
}


// now i am gonna create an error middleware, down here under he routes
// here if we want to overwrite the default error handler than its gonna take 1 more parameter err first
const errorHandler = (err,req,res,next) => {
    // here first of all we need to figure out what is the status code. if that is equal to 200 then make its a 500. 500 means its a server error. And then else its gonna be whatever the status code is. Because when we were inside of route i wanna be able to set a status code before we through an error and we can set it to whatever we want 
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    // now we wanna set status whatever the status code is
    res.status(statusCode)
    // and then what i wanna respond with is json. and i want it to be an object, with a message and that message is gonna come from that error object
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
}



export { notFound, errorHandler } 