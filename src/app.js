const express = require("express");
const app = express();

app.use("/",(req,res)=>{
    res.send("you are home now")
})


app.listen(7777,()=>{
    console.log("server is running")
})