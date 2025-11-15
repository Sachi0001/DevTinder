const express = require("express");
const app = express();

const connectDB = require("./configue/database")
const User = require("./models/user")
const bcrypt = require("bcrypt")
const {signUpValidator} = require("./utils/validator")
app.use(express.json())

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


app.get("/user",async (req,res)=>{
    const userEmail = req.body.emailId;
    try {
        const user = await User.find({emailId:userEmail});
        
       if(user.length===0){
        res.status(400).send("user not found")
       }else{

           res.send(user)
       }


    } catch (error) {
        res.status(400).send("Something went wrong" +error);
    }
})


app.get("/feed",async(req,res)=>{
    try {
        const user = await User.find({})
        res.send(user)
    } catch (error) {
        res.status(400).send("something went wrong")
    }
})

app.patch("/user",async(req,res)=>{
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
