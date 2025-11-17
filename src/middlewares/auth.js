
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const useAuth = async(req,res,next)=>{
                const {token} = req?.cookies;
               try{ if(!token){
                    throw new Error("Invalid token")
                }
                    const decoded = await jwt.verify(token,"DEV@tinder123")
                    const{_id}= decoded
                    const user = await User.findById(_id);
                    if(!user){
                        throw new Error("User not exist")
                    }else{
                         req.user = user
                        next()
                    }}catch(err){
                        res.status(400).json({error:err.message})
                    }
                    }
                    

                        

    module.exports = useAuth;                    