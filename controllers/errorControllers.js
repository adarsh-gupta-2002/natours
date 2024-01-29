const AppError = require("../utils/appError")

const handleJWTExpiredError = err => new AppError("Your token has expired! Please log in again." , 401)

const handleCastErrorDB = err => {
 
    const message = `Invalid ${err.path}: ${err.value}.`
     
    return new AppError(message , 400)
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]

    
    const message = `Duplicate field value: ${value}. Please use another value!`

    return new AppError(message, 400)
}

const handleValidationErrorDB = err => {

    const errors = Object.values(err.errors).map(el => el.message)
    console.log(errors)
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message , 400)
}

const sendErrorDev = (err ,req ,res) => {

    if(req.originalUrl.startsWith('/api')){

        return res.status(err.statusCode).json({
            stauts: err.status,
            error: err,
            message: err.message,
            stack:err.stack
        })
    } 
    // RENDERED WEBSITE
    console.log("ERROR 🚨", err)
    return res.status(err.statusCode).render('error', {
        title:'Something went wrong',
        msg: err.message
    })
    
} 

const sendErrorProd = (err , req, res) => {
    // Operational, trusted error: send message to client
    // API
    if(req.originalUrl.startsWith('/api')){

        if(err.isOperational){
    
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                
            })
        }
        // Programming or other unknown error: don't leak error details.
        // 1)log Error
        console.log("ERROR 🚨", err)
    
        // 2)Send generic message
        return res.status(500).json({
            status: 'error',
            message: "Something went very wrong"
        })
        
    }
     
    // RENDERED WEBSITE
    // Operational, trusted error: send message to client
    if(err.isOperational){

        return res.status(err.statusCode).render('error',{
            title: "Something went wrong",
            msg: err.message,
            
        })
    }
    // Programming or other unknown error: don't leak error details.
    // 1)log Error
    console.log("ERROR 🚨", err)

    // 2)Send generic message
    return res.status(500).render('error', {
        title:"Something went wrong",
        msg: "Please try again later."
    })
    
    
}

const handleJWTError = err => new AppError("Invalid token, Please login again ", 401)


module.exports = (err , req , res , next) => {
    err.statusCode = err.statusCode || 500 
    err.status = err.status || 'error'

    
    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err,req, res)
    }
    else if((process.env.NODE_ENV) === 'production'){
         
        let error = {...err};

        if(err.name === 'CastError') {
            error = handleCastErrorDB(err)
        }

        // console.log('Hell' , err.code)
        if(err.code === 11000) {
             
            error = handleDuplicateFieldsDB(err)
        }

        if(err.name === 'ValidationError'){
            error = handleValidationErrorDB(err)
        }

        if(err.name === 'JsonWebtokenError') error = handleJWTError(err)

        if(err.name === 'TokenExpiredError') error = handleJWTExpiredError(err)
         
        sendErrorProd(error ,req, res)
    }

}