const express = require("express");
const useAuth = require("../middlewares/auth");
const Chat = require("../models/chat");

const chatRouter = express.Router()


chatRouter.get("/chat/:targetId",useAuth,async(req,res)=>{
const userId = req.user._id;
const {targetId} = req.params;
let chat = await Chat.findOne({
    participants:{$all:[userId,targetId]}
}).populate({
    path:"messages.senderId",
    select:"firstName"
})
if(!chat){
chat = new Chat({
    participants:[userId,targetId],
    messages:[]
})
await chat.save()
}

res.status(200).json({
   chat 
})

})



module.exports = chatRouter;