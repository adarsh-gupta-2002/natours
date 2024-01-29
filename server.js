const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config({path: './config.env'})

// process.on('uncaughtException' , err => {
//     console.log("UNCAUGHT EXCEPTION! 🚩 Shutting down..." )
//     console.log(err.name , err.message)
//     console.log(err)

//     process.exit(1)
     
// })

const app = require('./app')


const DB = process.env.DATABASE.replace('<PASSWORD>' , process.env.DATABASE_PASSWORD)

mongoose.connect(DB)
    .then(() => {
        console.log("Database is connected successfully")
    })
     

 
 

 

const port  = process.env.PORT || 8000
 
const server = app.listen(port , () =>{
    console.log("App running on port ", port)
})

 

// process.on('unhandledRejection', (err) => {
     
//     console.log("Unhandled 🚩🚩🚩 rejection. Shutting down...");
//     console.log(err.name , err.message)

//     server.close(() => {
//         process.exit(1);
//     });
// });
 


  