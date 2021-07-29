// yahan hum validate karaingain tokens ko.

import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'
import asyncHandler from 'express-async-handler'

// i am gonna call this function protect.
const protect = asyncHandler( async (req,res,next) => {
    let token 

    // now ab hum token ko check kar rhai hain, ke token ke starting main Bearer space ke saath likha wa hai ke nhin,
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1] // i just want token, woh jo token ke starting main bearer likha wa hai woh nhin chahiye hamain, hamain sirf token chahiye. Toh hum split() karaingain use, aur split main hum space daingain. split array main covert kardega, ' ' yeh index 0 hoga jis pe Bearer likha hoga, hamain yeh nhin hamain token chahiye, toh hum [1] likh kar purely token le laingain.
            // what we wanna try is to decode that token
            const decoded = jwt.verify(token,process.env.JWT_SECRET) // we also need to pass our secret in the second argument.
            // decode karnay ke baad output kuch aisa aiga. { id: '602fedbe97a4d130ec125c1d', iat: 1618666882, exp: 1621258882 }. is main hum user ki ID, token ka issue at, aur expire kab hona hai yeh hai.

            // now ab token ko decode karnay baad user ko fetch karna hai, isi liye user model imort kiya hai, takay findByID karlain, aur phir argument main decoded.id

            req.user = await User.findById(decoded.id).select('-password') // and the only thing that i dont want to return here is password. toh uskay liye yeh likha hai. So we gonna put all the user data in the req.user which now will have access to in al our protected routes

            next()
        }
        catch(error){
            console.error(error)
            res.status(401)
            throw new Error('Not authorize, token failed')
        }
    }
    // if there is no tokens then
    if(!token){
        res.status(401)
        throw new Error ('Not authorized, no token')
    }
})



// ab hum chahtay hain ke jitnay bhi users hain unki information sirf admin ko milay, har user ko na milay, sirf admin user ko milay
const admin = (req,res,next) => {
    if(req.user && req.user.isAdmin) {
        next()
    }
    else{
        res.status(401)
        throw new Error('Not authorized as an admin ')
    }
}

export {
    protect,
    admin
}