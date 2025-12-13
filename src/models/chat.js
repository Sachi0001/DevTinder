const  mongoose  = require("mongoose");


const messageSchema = new mongoose.Schema({
    senderId:{type:String,ref:"User"},
    messages:
        {type:String},
        
    
},{timestamps:true})



const chatSchema = new mongoose.Schema({
    participants:[{type:mongoose.Types.ObjectId,required:true,ref:"User"}],
    messages:[messageSchema]
},{timestamps:true})



module.exports = mongoose.model("Chat", chatSchema)