
require("dotenv").config();


const express = require("express");
const app = express();
const connectDB = require("./configue/database")
const cookie = require("cookie-parser")
const cors = require("cors")
const http = require("http")

const authRouter = require("./routers/authRouters");
const profileRouter = require("./routers/profileRouter");
const requestRouter = require("./routers/requestRouter");
const userRouter = require("./routers/userRouter")
const useAuth = require("./middlewares/auth");
const paymentRouter = require("./routers/paymentRouter");
const initialiseScoket  = require("./utils/socket");
const chatRouter = require("./routers/chatRouter");

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
app.use("/",chatRouter)
const server = http.createServer(app)
initialiseScoket(server)
connectDB().then(()=>{
    console.log("DB connected")
    server.listen(7777,()=>{
    console.log("server is running")
})
}).catch((err)=>{
    console.log("DB cannot be connected")
})
