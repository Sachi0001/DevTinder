const express = require("express");
const app = express();
const jwt = require("jsonwebtoken")
const connectDB = require("./configue/database")
const User = require("./models/user")
const bcrypt = require("bcrypt")
const {signUpValidator} = require("./utils/validator")
const cookie = require("cookie-parser")
const useAuth = require("./middlewares/auth")





app.use(express.json());
app.use(cookie());


app.post("/signup",async(req,res)=>{
     const data = req.body;
     
try {

  signUpValidator(req);
  const {firstName,lastName,emailId,password} = req.body
const passwordHash = await bcrypt.hash(password, 10)

    const user = new User({
        firstName,lastName,emailId,password:passwordHash
    })

    await user.save();
   res.send("user added succesfully")

    
} catch (error) {
    res.status(400).json({error:error.message})
}


})


app.post("/login",async(req,res)=>{
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

 res.send("Login successful")

} catch(err){
        res.status(400).json({error:err.message})
    }
})


app.get("/user",useAuth, async (req,res)=>{
    const user = req.user;
    try{
        if(!user){
            throw new Error("User not exist")
        }else{
            res.send(user)
        }
    }catch(err){
        res.status(400).json({error:err.message})
    }
})


app.get("/feed", useAuth, async(req,res)=>{
    try {
        const user = await User.find({})
        res.send(user)
    } catch (error) {
        res.status(400).send("something went wrong")
    }
})

app.patch("/user",useAuth,async(req,res)=>{
    const data = req.body
    const userId = req.body.userId
    try {
        const allowedUpdates = ["firstName","lastName","age","gender","skills","photoUrl"]
        if(!Object.keys(data).every((k)=>allowedUpdates.includes(k))){
           throw new Error("Update not allowed")
        }
        const user = await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:'before'
        })

        console.log(user)
        await user.save()
        res.send(`${user.firstName}'s data updated succesfully`);
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

connectDB().then(()=>{
    console.log("DB connected")
    app.listen(7777,()=>{
    console.log("server is running")
})
}).catch((err)=>{
    console.log("DB cannot be connected")
})
