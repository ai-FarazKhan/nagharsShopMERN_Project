import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'
// authenticate user and get token. this will be a Post request to api/users/login, access will be public
const authUser = asyncHandler(async(req,res) => {
    // the first jo hum karaingain is that, get data from the body, matlab ye ke when we set a form in the fronEnd, and when we submit it, and we gonna send a request and we gonna send the data in the body 
    // we need to add a one peace of middle ware in our server.js file. we need to add body parse. app.use(express.json()) // express.json() this will allow us to accept json data in
    const { email, password } = req.body    // so now this req.body will be able to access like req.email or req.password etc. And hum destructure kar rhai hain us data ko from req.body 
    // is tarhan hum body se data ko access karsaktay hain, jo hum request bhaijay gain server pe wohi output main response agai ga, Like agar hum JSON main email ya password likh ke bhaijay gain, toh wohi return ajai ga.
    // res.send({
    //     email,password,
    // })
    // we wanna find one document, and we wanna find it by email, iska matlab hai ke, hum email dhoondna chatay hain, Jo ke,  const { email, password } = req.body  is email se match ho 
    const user = await User.findOne({ email })
    // now we wanna check if the user exist 
    if(user && (await user.matchPassword(password))){
        // ab humain user ki email ke saath password bhi dekhna hai, ke sahi hai ya nhin. Hum password ko encrypt kar rhai thai us waqt. ab hmain jo user request main password bhaijay ga usko decrypt karke match karna hoga.
        // matchPassword function humnay userModel.js ki file main banaya hai. wahan hum entered password ko jo kay aik plain text hai usko compare kar rhai hain jo database main encrypted password hai ussay, usko decrypt karke compare kar rhai hain. Using bcrypt js
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    }
    // or we can also do like this directly
    // if(user && await bcrypt.compare(password,user.password)){
    //     // ab humain user ki email ke saath password bhi dekhna hai, ke sahi hai ya nhin. Hum password ko encrypt kar rhai thai us waqt. ab hmain jo user request main password bhaijay ga usko decrypt karke match karna hoga.
    //     // matchPassword function humnay userModel.js ki file main banaya hai. wahan hum entered password ko jo kay aik plain text hai usko compare kar rhai hain jo database main encrypted password hai ussay, usko decrypt karke compare kar rhai hain. Using bcrypt js
    //     res.json({
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         isAdmin: user.isAdmin,
    //         token: null,
    //     })
    // }
else{
    // if password/user match na ho toh.
    res.status(401) // 401 which is unauthorize.
    throw new Error('Invalid Email or password');
}
})



// register a new user 
// its gonna be the POST request to api/users
// access gonna be public

const registerUser = asyncHandler(async(req,res) => {
    const { name,email,password } = req.body    
    const userExists = await User.findOne({ email }) // we wanna see if the user exist already ?

    if(userExists){
        // if user already exists then i am sending error. 400 status is bad request
        res.status(400)
        throw new Error('User already exists ')
    }

    // .create method take an object, what we wanna add
    const user = await User.create({
        name,
        email,
        password,
    })

    // now if everythings goes ok and everything is created 
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        }) // 201 means that something is created. and what i to send back is the same data jokay login ke waqt bhai tha uper. kunke hamain authenticate karna hai, right after register
    
    }
    else{
        res.status(400)
        throw new Error('Invalid user data')
    }

})


// Get user profile.
// its gonna be GET request. Get/api/users/profile.
// its access gonna be private.

const getUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id) // which is gonna be whatever the current logged in user is.

    if(user){
        // so i wanna return this for the logged in user.
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    }
    else{
        res.status(404)
        throw new Error('User Not Found')
    }
})



// updating user profile
// its gonna be a put request, because we wanna update the user profile. PUT /api/users/profile
// access gonna be private

const updateUserProfile = asyncHandler(async(req,res) => {
    const user = await User.findById(req.user._id) // which is gonna be whatever the current logged in user is.

    if(user){
        // if the user is there. if thats not there its gonna stay whatever the use name is
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if(req.body.password){
            user.password = req.body.password // when updating password it will be encrypted automatically. because in the userModel we added the middleware that should get called
        }

        // values change karnay ke baad save kardi humnay woh values.
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        })
    }
    else{
        res.status(404)
        throw new Error('User Not Found')
    }
})



// get all users. 
// its gonna be Get request to Get/api/users
// access will be Private/admin
// na sirf isko protected hona hai balke isko admin hona hai, kunke all users ki details admin dekhay ga.
const getUsers = asyncHandler(async(req,res) => {
    const users = await User.find({}) // hum empty object pass karaingain, kunke hamain all users chahhiye
    res.json(users)
})


// delete the user
// its gonna be the delete request DELETE /api/users/:id
// access will also be private
const deleteUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id) // to get the user
    
    if(user){
        // if user exist then we simply just need to remove it
        await user.remove()
        res.json({message: 'user removed'})
    }
    else{
        res.status(404)
        throw new Error('User not found')
    }
})



// we wanna get the user by id
// route  will be GET /api/users/:id
// access will be private admin

const getUserById = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id).select('-password') // req.params.id which is the id in the url. i dont want to fetch the user user password, thats why maine .select('-password') yeh kiya
    if(user){
        res.json(user)
    }
    else{
        res.status(404)
        throw new Error('User not found')        
    }
})



// update users by admin
// its gonna be the put request to /api/users/:id
// access will be private/admin

const updateUser = asyncHandler(async(req,res) => {
    const user = await User.findById(req.params.id)

    if(user){
        // if the user is there. if thats not there its gonna stay whatever the use name is
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin

        // values change karnay ke baad save kardi humnay woh values.
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    }
    else{
        res.status(404)
        throw new Error('User Not Found')
    }
})






export {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
}