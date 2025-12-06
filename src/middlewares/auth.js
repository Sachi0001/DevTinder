
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const useAuth = async(req,res,next)=>{
    try{ 
                   const {token} = await req?.cookies;
                
                if(!token){
                    return res.status(401).json({message:"Please Login"})
                }
                    const decoded = await jwt.verify(token,"DEV@tinder123")
                    const{_id}= decoded
                    const user = await User.findById(_id);
                    const userObj = user.toObject();
                    delete userObj.password
                    if(!user){
                        throw new Error("User not exist")
                    }else{
                         req.user = userObj 
                        next()
                    }}catch(err){
                        res.status(400).json({error:err.message})
                    }
                    }
                    

                        

    module.exports = useAuth;                    