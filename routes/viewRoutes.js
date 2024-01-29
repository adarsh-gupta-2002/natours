const express =  require('express')
const viewsController = require('./../controllers/viewsController')
const authController = require('./../controllers/authController')
const {createBookingCheckout} = require('./../controllers/bookingController')

const router = express.Router()

const {getOverview, getTour, getLoginForm , getAccount , updateUserData, getMyTours}  = viewsController
const {protect, isLoggedIn} = authController

// router.use(isLoggedIn)

router.get('/login', isLoggedIn, getLoginForm)

router.get('/',createBookingCheckout,isLoggedIn ,getOverview  )

router.get('/tour/:slug',isLoggedIn , getTour)

router.get('/me' ,protect, getAccount)

router.get('/my-tours' ,protect, getMyTours)

router.post('/submit-user-data',protect,  updateUserData)

module.exports = router