
const express= require("express")
const authRouter = express.Router()
const {signUpValidator} = require("../utils/validator")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const jwt = require("jsonwebtoken")


authRouter.post("/signup",async(req,res)=>{
     const data = req.body;
     
try {

  signUpValidator(req);
  const {firstName,lastName,emailId,password} = req.body
const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
        firstName,lastName,emailId,password:passwordHash
    })

    await user.save();
   res.status(200).json({message:"user added succesfully"})

    
} catch (error) {
    res.status(400).json({error:error.message})
}


})


authRouter.post("/login",async(req,res)=>{
    try{
const {emailId, password} = req.body
const user = await User.findOne({emailId:emailId})
if(!user){
    throw new Error("Invalid credentials")
}
const passwordDB = user.password
const compare = await bcrypt.compare(password,passwordDB)
if(!compare){
    throw new Error ("Invalid credentials")
}

const token = jwt.sign({_id:user._id},"DEV@tinder123")
res.cookie("token",token)
const userObj = user.toObject();
delete userObj.password 
 res.status(200).json({message:"Login Sucesful",data:userObj})

} catch(err){
        res.status(400).json({error:err.message})
    }
})



authRouter.post("/logout",async(req,res)=>{
try{
    await res.cookie("token",null,{
        expires:new Date(0)
    });
    res.send("Logout succesfully")
}catch(err){
res.status(400).json({error:err})
}

})


module.exports= authRouter;