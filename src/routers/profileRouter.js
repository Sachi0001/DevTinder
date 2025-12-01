
const express = require("express");

const profileRouter = express.Router();
const useAuth = require("../middlewares/auth")
const User = require("../models/user")


profileRouter.get("/user",useAuth, async (req,res)=>{
    const user = req.user;
    try{
        if(!user){
            throw new Error("User not exist")
        }else{
            res.status(200).json({data:user})
        }
    }catch(err){
        res.status(400).json({error:err.message})
    }
})


profileRouter.patch("/user",useAuth,async(req,res)=>{
    const data = req.body
    const userId = req.user._id
    try {
        const allowedUpdates = ["firstName","lastName","age","gender","skills","photoUrl","about"]
        if(!Object.keys(data).every((k)=>allowedUpdates.includes(k))){
           throw new Error("Update not allowed")
        }
        const user = await User.findByIdAndUpdate({_id:userId},data,{
            returnDocument:'before'
        })

        console.log(user)
        await user.save()
        res.status(200).json({message:`${user.firstName}'s data updated succesfully`});
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})



module.exports = profileRouter;