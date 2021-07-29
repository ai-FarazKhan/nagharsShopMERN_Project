import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// here we gonna create a use schema, and pass the object, In this object we will define all the fields that we want for a user
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
}, 
{
    timestamps: true
})

userSchema.methods.matchPassword = async function(enteredPassword){
    // now we need to use bcrypt to compare the enteredPassword to the one which is in Database. Password jo likhay ga banda usko compare karayga database main ecrypted password jo hai, usko decrypt karke
    // yahan pe aik method use karaingain, jo kay plain text password hai jo user enter karayga usko compare karayga encrypted password se jo database main save hai ussay.

    // aur hum await lagain gain kunke its return a promise.

    return await bcrypt.compare(enteredPassword, this.password)

}


// user to register kartay waqt humko password encrypt karna hai.userSchema.pre(save), its means that before we actually save we gonna run asynce function
userSchema.pre('save', async function(next){
    // hamain sirf register kartay waqt password ko encrypt karna hai. Jab user apni profile ko update karay us waqt agar woh password update karna nhin cha rha toh hamain update nhin karna.
    if(!this.isModified('password')){
        next()
    }

    // aur agar password modified hua tha nichay yeh execute hoga aur password ko hash kardega
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})

// mongoose.model because we wanna create model from this schema
const User = mongoose.model('User', userSchema)

export default User
