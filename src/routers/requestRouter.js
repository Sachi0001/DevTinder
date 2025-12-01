const express = require("express");

const requestRouter = express.Router();
const useAuth = require("../middlewares/auth")
const connectionRequest = require("../models/requestConnection")
 const User = require("../models/user")

requestRouter.post(
  "/sendRequest/:status/:userId",
  useAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        throw new Error("Invalid receiver id");
      }

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type");
      }

      // Check if a request between these users already exists
      const existingConnectionRequest = await connectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      console.log(existingConnectionRequest,"existingConnectionRequestsssd")

      if (existingConnectionRequest) {
        throw new Error("Connection request already exist");
      }

      const data =   new connectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      console.log(data)
      await data.save();
    if(status==="ignored"){
      res.status(200).json("Profile removed from your feed successfully")
    }
      res.status(200).json("Request sent successfully")
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
);






requestRouter.post("/reviewRequest/:status/:requestId",useAuth,async(req,res)=>{
  try{  const loggedUserId = req.user._id;
    const{status,requestId} = req.params;

    const connectionRequestReceived = await connectionRequest.findOne({
        _id:requestId,
        toUserId:loggedUserId,
        status:"interested"
    }).populate("fromUserId",["firstName","lastName","age","gender","skills","photoUrl","about"])
console.log(connectionRequestReceived)

if(!connectionRequestReceived){
    throw new Error ("Request not found")
}

const allowedStatus = ["accepted","rejected"]

if(!allowedStatus.includes(status)){
    throw new Error("Invalid status")
}

connectionRequestReceived.status = status;

await connectionRequestReceived.save();
res.status(200).json({message:"connection request" +" " + status,data:connectionRequestReceived})}
catch(err){
    res.status(400).json({error:err.message})
}

})

module.exports = requestRouter;