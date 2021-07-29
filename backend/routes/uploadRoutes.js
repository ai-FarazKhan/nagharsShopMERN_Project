// this is where we gonna put our routes which is just 1 /api/upload. But we also gonna put all our config, validation etc stuff. for multer we gonna put all that here.

import express from 'express'
import multer from 'multer'
import path from 'path'

const router = express.Router()

// just doing some config

// we gonna pass in the object with two functions. first will be destination, destination main 3 parameter hotay hain. cb means callBack
const storage = multer.diskStorage({
    destination(req,file,cb) {
        cb(null,'uploads/') // null because there is no error, then where we wanna upload 
    },
    filename(req,file,cb){
        cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`) // extname() method does is that its gets the extension of the fileName
    }
})


function checkFileType(file,cb){
    // first we need to create an expression that which type of file we only want.
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()) // we gonna test this against the extension for the filename that passed in. extname() gets the extension from the file. basically hum compare kar rhai hain. Basically test() jo function hai woh hamain true or falso bata ta hai. agar jo banda file upload kar rha hai, uski extension match na hoi toh false de dega, warna true hojaigi condition.
    const mimetype = filetypes.test(file.mimetype)

    // now hmain yeh make sure karna hai ke yeh dono true hoon. before we move on

    if(extname && mimetype){
        return cb(null,true)
    } else{
        // we gonna call the callback but we wanna pass in the error this time, instead of passin null, which means no error
        cb('Images only !!')
    }
}


// this where we will gonna pass in the middleware to our route. fileFilter hamain 
const upload = multer({
    storage,
    fileFilter: function(req, file, cb){
        checkFileType(file,cb)
    }
})



// now lets create the route. or hum keh saktay hain ke endpoint. hum sirf / pass karaingain. kunke this uploadRoutes file is gonna be connected to api/upload. second argument main hum middleware pass karaingain.
router.post('/', upload.single('image'), (req,res) => {
    res.send(`/${req.file.path}`) // this will gives us the path, then in the frontend we gonna set it to the image piece of the state
})

export default router