
const express = require("express");

const userRouter = express.Router();
const useAuth = require("../middlewares/auth")
const connectionRequest = require("../models/requestConnection");
const User = require("../models/user")




userRouter.get("/recived/requests",useAuth,async(req,res)=>{

const loggedUserId = req.user._id;
try{

const connectionRequests = await connectionRequest.find({
    toUserId:loggedUserId,
    status:"interested"
}).populate("fromUserId",["firstName","lastName","age","gender","skills","photoUrl","about"])


res.status(200).json({message:`you have ${connectionRequests.length} request`,data:connectionRequests})
}catch(err){
    res.status(400).json({error:err.message})
}

})


userRouter.get("/connections",useAuth,async(req,res)=>{
    const fromUserId=req.user._id;
    try{
        const connectionRequests = await connectionRequest.find({
           $or:[{ fromUserId:fromUserId,
            status:"accepted"},
            {
                toUserId:fromUserId,
                status:"accepted"
            }]
        }).populate("fromUserId",["firstName","lastName","age","gender","skills","photoUrl","about"])
        .populate("toUserId",["firstName","lastName","age","gender","skills","photoUrl","about"])


console.log(connectionRequests)
        if(!connectionRequests){
          return  res.json({message:"There are no connections"})
        }

             const data = connectionRequests.map((item)=>{
                if(item.fromUserId._id.toString()===req.user._id.toString()){
                    return item.toUserId
                }
                return item.fromUserId
             })


        res.status(200).json({message:`you have ${connectionRequests.length} connections`,data:data})
    }catch(err){
        res.status(400).json({error:err.message})
    }
})


userRouter.get("/interactionFeed",useAuth,async(req,res)=>{
    const loggedUserId = req.user._id;

    const page = parseInt(req.query.page)||1;
    const limit = parseInt(req.query.limit) || 10
    skip = (page-1)*limit;
  try{  const interactedProfiles = await connectionRequest.find({
        $or:[
            {fromUserId:loggedUserId},
            {toUserId:loggedUserId}
        ]
    }).select("fromUserId toUserId");

    const hideFromUser = new Set()

    interactedProfiles.forEach((req)=>{
        hideFromUser.add(req.fromUserId.toString());
        hideFromUser.add(req.toUserId.toString())
    })

    const feed = await User.find({
        $and:[{
           _id: {$nin:Array.from(hideFromUser)}},
           {_id: {$ne:loggedUserId}}
        ]
    }).select(["firstName","lastName","age","gender","skills","photoUrl","about"])
    .skip(skip).limit(limit)

console.log(feed)
res.status(200).json(feed);}
catch(err){
    res.status(400).json({error:err.message})
}


})


module.exports = userRouter;