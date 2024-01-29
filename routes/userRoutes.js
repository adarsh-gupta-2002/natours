const express = require('express')
const userController = require('./../controllers/userControllers')
const authController = require('./../controllers/authController')
 

 

const router = express.Router()

const {signup , login , forgotPassword , resetPassword , updatePassword , protect, restrictTo , logout} = authController
const {getAllUsers , getUser , createUser , updateUser , deleteUser,updateMe , deleteMe , getMe , uploadUserPhoto, resizeUserPhoto} = userController 

router.post('/signup' , signup) 
router.post('/login' , login)
router.get('/logout' , logout)
router.post('/forgotPassword' , forgotPassword) 
router.patch('/resetPassword/:token' , resetPassword)

router.use(protect)

router.patch('/updateMyPassword' ,  updatePassword)

router.get('/me',  getMe , getUser)

router.patch('/updateMe' ,uploadUserPhoto ,resizeUserPhoto, updateMe)

router.delete('/deleteMe', deleteMe)

router.use(restrictTo('admin'))

router
    .route('/')
    .get(getAllUsers)
    .post(createUser)

router
    .route('/:id')
    .get(getUser)
    .patch(updateUser)
    .delete(deleteUser)




module.exports  = router