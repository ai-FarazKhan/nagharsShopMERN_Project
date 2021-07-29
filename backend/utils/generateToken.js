import jwt from 'jsonwebtoken'

// this function gonna take in user ID, because thats what we want to add as a payload
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    }) // in the first argument payload is gonna be the object with { id }. And in the second argument is the secret, aur yeh hum apni ENV ki file main save karaingain. wahan se uth kar aigi. Wahan secret kuch bhi rakh saktay hain, like maine abc123 likha hai. Now in the third argument there are options, like expiresIn, hum expireIn ka time set karsaktay hain, like 30 mins etc, ke token kab expire hoga. Agar 30 days main expire karna hai toh, 30d aisay likhdaingain, iska matlab 30 days hota hai
}

export default generateToken