const dotenv = require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoute = require('./routes/userRoute')
const errorHandler = require('./middleWare/errorMiddleWare')
const cookieParser = require("cookie-parser")

const app = express()

const PORT = process.env.PORT || 3000

// Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json())

//Routes Middleware
app.use("/api/users",userRoute)

// Routes
app.get("/",(req,res) =>{
    res.send("home page")
})

// Error Middleware
app.use(errorHandler)

mongoose
.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`listen to port ${PORT}`);
        
    })
})
.catch((err)=>{
    console.log(err);
})