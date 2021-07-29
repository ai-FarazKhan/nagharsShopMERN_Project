import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'


// This is gonna fetch all products
// This is GET request api/products
// This is a public route
// this function gonna take in a req and res, and its gonna be asycn, aur hum isko asyncHandler se wrap kardaingain
const getProducts = asyncHandler(async(req,res) => {

    // adding product pagination. takay agar zaida products hain toh unko different page pe show kardiya jai.
    const pageSize = 10 // hum pages ke size barha saktay, 10 bhi karsaktay hain, lekin abhi bas aisay hi 2 pages rakhain hain initially. abhi 2 likha hai toh 2 products show hoogeen. 4 karaingain toh 4 hoongeen
    const page = Number(req.query.pageNumber) || 1 // jo page select karaingain. us page pe chalai jaingain. agar woh page nhi hai toh offcourse hum page 1 pe hain



    // now we need to decide that we wanna all product or specific product if we do search on that.
    const keyword = req.query.keyword ? {
        // we wanna match the name of the keyword with the product name. we are using regex. 
        name: {
            $regex: req.query.keyword,  // now the reason we are doing this is because we not just saying if name = this, issay hoga yeh key zarori nhin hai hamain exact name hi searchBox main likhna ho. hum chahain toh agar start a ya b se kisi bhi aur letter se karaingain. toh toh hamain us hisaab se products dikh jaingi.
            $options: 'i'
        }
    } :  // req.query means this is how we got our query string. if there is ?adad something etc, this is how we get this, what is after that ?.
    {}
    

    // we need to get the total count of the products. also jab hum fetch kar rhai hain products ko toh limit lagani hogi. nichay limit lagai hai. limit hum pageSize se kardaingain.
    const count = await Product.countDocuments({ ...keyword })

    // ...keyword. now its gonna be empty or its gonna have the keyword
    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page-1)) // this return every think, aur hamnay async aur await isiliye lagaya hai kunk .find promise return karta hai. Bas hamain sari product mil jain geen issay
    
    res.json({products, page, pages: Math.ceil(count / pageSize)})   // even products are not json, but res.json converts it to the JSON
})




// This is gonna fetch single product
// This is GET request api/products/:id
// This is a public route
// now we create another route jahan hum id likhain gain aur us product ki details uth kar ajai gi
const getProductById = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id) // req.params.id gives us whatever the id is in the URL
    // now we do wanna check that there is a product
    if(product){
        res.json(product)
    }
    else{
        // here we wanna respond with error. Now we can send whatever status code we want
        // res.status(404).json({ message: 'Product not found' }) // 404 means not found
        // or we can also do this.
        res.status(404) // even if we not type this. its gonna be 500 by default. but yeh aisay hi set kardiya humnay
        // Now we have have custom error handler,so we can throw a new error.
        throw new Error('Product Not Found') // ab kunke humnay custom error handler bana liya hai, toh ab humko res.json karke error nhin likhna parayga, ab simple hum yeh likh kar bhi send karsaktay hain.
    }
})




// delete a product
// route will be DELETE /api/products/:id
// access will be private. Private/Admin
const deleteProduct = asyncHandler(async(req,res) => {
    const product = await Product.findById(req.params.id) // req.params.id gives us whatever the id is in the URL
    // now we do wanna check that there is a product
    if(product){
        // the way this gonna be work is that,any admin can able to delete the product. agar hum chatay hain ke jis admin ne product banain hai wohi delete karai toh woh aisay hoga. if(req.user._id === product.user._id). yeh condition lagay gi. if we only want ke wohi admin product delete karay jisne product banain hai.
        // yeh aisa delete hai ke hum trust kar rhai hain every admin par ke woh delete karsakta hai product ko.

        await product.remove() // product now removed from the database.
        res.json({ message: 'Product removed' })
    }
    else{
        res.status(404) 
        throw new Error('Product Not Found')
    }
})


// when click on createProduct its gonna automatically create on the database with some sample data and then immediately takes us to screen where we can edit that data
// its gonna be a POST request POST /api/products
// access will also be private private/admin

const createProduct = asyncHandler(async(req,res) => {
    // yaha par hum aik new product bana rha hain.
    // user will going to be the logged in user. req.user._Id

    const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description'
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
})



// update product, jo humnay sample product banain hai ussi update kar rhai hain.
// PUT /api/products/:id
// access will be private too. private/admin

const updateProduct = asyncHandler(async(req,res) => {

    // getting date as an input from the body
    const {name,price,description,image,brand,category,countInStock} = req.body

    const product = await Product.findById(req.params.id)
    
    if(product){
        product.name = name 
        product.price = price 
        product.description = description 
        product.image = image 
        product.brand = brand 
        product.category = category 
        product.countInStock = countInStock 

        const updatedProduct = await product.save()
        res.status(201).json(updatedProduct)
    }
    else{
        res.status(404)
        throw new Error('Product not found')
    }
})




// create new review
// its gonna be a POST request, /api/products/:id/reviews
// access will gonna be private but not admin
const createProductReview = asyncHandler(async(req,res) => {

    // getting rating and comment from the body
    const { rating, comment } = req.body

    const product = await Product.findById(req.params.id)
    
    if(product){
        // if the product exist, then i wanna check if the user already submitted the review. 
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

        if(alreadyReviewed){
            res.status(400) // bad request
            throw new Error('Product already reviewed')
        }

        // agar review add already nhin hai toh
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(review)

        product.numReviews = product.reviews.length

        // yahan overall rating dekh rhai hain
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0 ) / product.reviews.length

        await product.save()
        res.status(201).json({ message: 'Review added' })
    }
    else{
        res.status(404)
        throw new Error('Product not found')
    }
})









// get top rated products
// its gonna be get request GET /api/products/top
// and its gonna be a public route

const getTopProducts = asyncHandler(async(req,res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3) // we will just pass an empty object here. because we are not limitting it to anything. but mujhey acsending order main sort karna hai. acsending main sort karn hai toh -1 lagadaingain aur rating se sort karna hai. aur hamain 3 product chahiye, toh limit() 3 rakh di hum nain.

    res.json(products)
})




export {getProducts,getProductById, deleteProduct, createProduct, updateProduct, createProductReview, getTopProducts}