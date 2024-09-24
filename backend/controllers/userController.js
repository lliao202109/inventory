const asyncHandler = require("express-async-handler")
const User = require('../models/userModel')
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")


const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'})
}

// Register user
const registerUser = asyncHandler(async(req, res) =>{
    const {name, email, password} = req.body

    if(!name || !email || !password){
        res.status(400)
        throw new Error ("Please fill in all required fields")
    }
    if(password.length < 6){
        res.status(400)
        throw new Error ("Password must be up to 6 characters")
    }
    // check if email already exists
    const userExists = await User.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error ("Email has already been registered")
    }

    // Create new user
    const user = await User.create({
        name,
        email,
        password
    })

    // Gnerate Token
    const token = generateToken(user._id)

    // Send HTTP-only cookie
    res.cookie('token', token, {
        path:'/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400 ), // 1day
        sameSite: 'none',
        secure: true
    })

    if(user){
      const {_id, name, email, photo, phone, bio} = user
        res.status(201).json({
            _id, name, email, photo, phone, bio,token
        })
    }else{
        res.status(400)
        throw new Error ("Invalid user data")

    }
}
)

// Login user
const loginUser = asyncHandler(async(req,res) =>{
const {email, password} = req.body
// Validate Request
if(!email || !password){
    res.status(400)
    throw new Error('Please add email and password')
}

// Check if user exists 
const user = await User.findOne({email})
if(!user){
    res.status(400)
    throw new Error('User not found, please signup')
}
 //   Generate Token
 const token = generateToken(user._id);

// Check if pw is correct
const passwordIsCorrect = await bcrypt.compare(password, user.password)

if(passwordIsCorrect){
    // Send HTTP-only cookie
   res.cookie("token", token, {
     path: "/",
     httpOnly: true,
     expires: new Date(Date.now() + 1000 * 86400), // 1 day
     sameSite: "none",
     secure: true,
   });
 }

if(user && passwordIsCorrect){
    const {_id, name, email, photo, phone, bio} = user
    res.status(200).json({
        _id, name, email, photo, phone, bio, token
    })
}else{
    throw new Error('Invalid email or password')
}

})


const logoutUser = asyncHandler(async(req,res) =>{
   res.cookie('token','',{
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,   })
    return res.status(200).json({message:'Successfully logged out!'})
})


module.exports ={
    registerUser,
    loginUser,
    logoutUser
}