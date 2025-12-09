
require("dotenv").config();


const express = require("express");
const app = express();
const connectDB = require("./configue/database")
const cookie = require("cookie-parser")
const cors = require("cors")


const authRouter = require("./routers/authRouters");
const profileRouter = require("./routers/profileRouter");
const requestRouter = require("./routers/requestRouter");
const userRouter = require("./routers/userRouter")
const useAuth = require("./middlewares/auth");
const paymentRouter = require("./routers/paymentRouter");

app.use(express.json());
app.use(cookie());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true

}))
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",paymentRouter)




connectDB().then(()=>{
    console.log("DB connected")
    app.listen(7777,()=>{
    console.log("server is running")
})
}).catch((err)=>{
    console.log("DB cannot be connected")
})
