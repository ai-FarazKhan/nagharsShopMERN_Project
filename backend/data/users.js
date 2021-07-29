import bcrypt from 'bcryptjs'


// here we just wanted to create an array of three users, and one of them is gonna be an admin

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('123456', 10), // first argument is plain text password, and second will be number of rounds 
        isAdmin: true,
    },
    {
        name: 'Faraz',
        email: 'faraz@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
    {
        name: 'Huzaifa',
        email: 'Huzaifa@example.com',
        password: bcrypt.hashSync('123456', 10),
    },
]

export default users