const express = require('express')
const AppError = require('./utils/appError')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require("./routes/userRoutes")
const reviewRouter = require('./routes/reviewRoutes')
const bookingRouter = require('./routes/bookingRoutes')
const globalErrorHandler = require('./controllers/errorControllers')
const rateLimit = require('express-rate-limit')
const helmet = require("helmet")
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const path = require('path')
const cookieParser = require('cookie-parser')
const viewRouter  = require('./routes/viewRoutes')
const cors = require('cors')
// Initialising the app
const app = express()

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
// app.set('trust proxy', process.env.NODE_ENV !== 'production')
 

// global middlewares

// Serving static files
app.use(express.static(path.join(__dirname, 'public')))


// Set Security HTTP header 
// app.use(helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       connectSrc: ["'self'", 'ws://localhost:57314/','http://127.0.0.1:3000'],
//       // Add other directives as needed
//     },
//   }));
// app.use(helmet())
app.use(helmet.contentSecurityPolicy({
    directives: {
       defaultSrc: ["'self'"],
       connectSrc: ["*"],
       scriptSrc: ["'self'", 'https://js.stripe.com'],
       frameSrc: ["'self'", 'https://js.stripe.com'],
    },
}));

app.use(cors({
    origin: 'http://localhost:3000', // replace with your frontend URL
    credentials: true,
}));
// app.use(
//     helmet({
//       contentSecurityPolicy: false,
//     })
// );
// app.use(cors(
    // {
    //     origin: 'http://localhost:3000',
    //     credentials: true,
        
    // }
// ));

// middleware for cross browser acess
// app.use((req, res , next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*")
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
//     res.setHeader("Access-Control-Allow-Methods",  ['GET', 'POST', 'PATCH', 'DELETE'])
//     next()
// })

// Developer logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in an hour!"
})

app.use('/api',limiter)

 
// Body parser, reading data from body into req.body
app.use(express.json({limit: "10kb"}));
app.use(express.urlencoded({extended: true, limit: '10kb'}))
app.use(cookieParser())


// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data Sanitization against XSS
app.use(xss())

// Prevent parameter Pollution
app.use(hpp({
    whitelist:['duration' , 'ratingsQuantity', 'ratingsAverage' , 'maxGroupSize' ,'difficulty', 'price']
}))

 



// Test Middleware
// app.use((req, res , next) => {
//     console.log(req.cookies)
//     next()
// })

// testing cookie is set
// app.get('/test-cookie', (req, res) => {
//     res.cookie('test', 'test_value', { httpOnly: true });
//     res.send('Cookie set!');
// });
 

app.use('/' , viewRouter)
app.use('/api/v1/tours' , tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews' , reviewRouter)
app.use('/api/v1/bookings' , bookingRouter)

app.all('*' , (req , res , next) => {
    next(new AppError(`Con't find ${req.originalUrl} on this server!` , 404))
})

app.use(globalErrorHandler)
     
module.exports = app