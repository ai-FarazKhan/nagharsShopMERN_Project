import express from 'express'
const router = express.Router()
import { authUser, getUserProfile, registerUser, updateUserProfile, getUsers, deleteUser, getUserById,updateUser } from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'


router.route('/').post(registerUser).get(protect,admin,getUsers)

// handling post request
router.post('/login',authUser)

router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile) // this protect middleware, whenever we gonna hit this route.

router.route('/:id').delete(protect,admin,deleteUser).get(protect,admin,getUserById).put(protect,admin,updateUser)

export default router