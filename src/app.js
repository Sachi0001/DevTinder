const express = require("express");
const app = express();

const connectDB = require("./configue/database")
const User = require("./models/user")

app.use(express.json())

app.post("/signup",async(req,res)=>{

    const user = new User(req.body)

    await user.save();

res.send("user added succesfully")

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
        const user = await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:'before'
        })

        console.log(user)
        await user.save()
        res.send(`${user.firstName}'s data updated succesfully`);
    } catch (error) {
        res.status(400).send("something went wrong")
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
