const socket = require("socket.io");
const Chat = require("../models/chat");

 const initialiseScoket = (server)=>{

const io = socket(server,{
    cors:{
        origin:"http://localhost:5173"
    }
})

io.on("connection",(socket)=>{


socket.on("joinChat",({userId,targetId})=>{

const room = [userId,targetId].sort().join("_")
socket.join(room)
});



socket.on("sendMessage",async({firstName,userId,targetId,text})=>{

const room = [userId,targetId].sort().join("_");
console.log(firstName+":"+text)

let chat = await Chat.findOne({
    participants:{$all:[userId,targetId]}
})

if(!chat){

    chat = new Chat({
        participants:[userId,targetId],
        messages:[]
    })
}

chat.messages.push({
    senderId:userId,
    messages:text
})

await chat.save();
io.to(room).emit("messageReceived",{firstName,text})})
})

}

module.exports=initialiseScoket;