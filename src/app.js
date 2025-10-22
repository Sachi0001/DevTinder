
const express = require('express');
const app = express();

app.use((req,res)=>{
    res.send("hello world 1")
})


app.listen(7777,()=>{
    console.log("server connected")
})