const express = require("express");
const authRouter = require("./authRouters");
const useAuth = require("../middlewares/auth");
const paymentRouter = express.Router();
const instance = require("../utils/razorpayInstance")
const Payment = require("../models/payment");
const membershipAmount = require("../utils/constants");
const {validateWebhookSignature} = require('razorpay/dist/utils/razorpay-utils');
const User = require("../models/user");


paymentRouter.post("/payment/create",useAuth,async(req,res)=>{
const {firstName,lastName,emailId} = req.user
const {membershipType} = req.body
console.log(membershipAmount[membershipType],"membershiptype")
try {
    const orders = await instance.orders.create({
  "amount": membershipAmount[membershipType]*100,
  "currency": "INR",
  "receipt": "receipt#1",
  "notes": {
    firstName,
    lastName,
    emailId,
    membershipType
  }
})

const payment = new Payment({
    userId:req.user._id,
    orderId:orders.id,
    status:orders.status,
    receipt:orders.receipt,
    amount:orders.amount,
    currency:orders.currency,
    notes:orders.notes
})

const savedPayment = await payment.save()
   res.json({...savedPayment.toJSON(),keyId:process.env.RAZOR_PAY_KEY_ID}) 
} catch (error) {
    console.log(error)
    res.status(500).json({ error: error })
}   
})


paymentRouter.post("/payment/webhook",async(req,res)=>{
    try {
        /* NODE SDK: https://github.com/razorpay/razorpay-node */
const webhookSignature = req.get("X-Razorpay-Signature")
const isWebhookValid = validateWebhookSignature(JSON.stringify(req.body), webhookSignature, process.env.WEBHOOK_STRONG_KEY)


if(!isWebhookValid){
    res.status(400).json({message:"webhook not valid"})
}


const paymentDetails = req.body.payload.payment.entity;

const payment = await Payment.findOne({orderId:paymentDetails.order_id}) 

payment.status = paymentDetails.status;
await payment.save();

const user = await User.findOne({_id:payment.userId})
user.isPremium = true
user.membershipType = paymentDetails.notes.membershipType;
await user.save();

return res.status(200).json({message:"webhook received successfully"})

    } catch (error) {
        res.status(500).json({error:error})
    }
})


paymentRouter.get("/premium/verify",useAuth,async(req,res)=>{
    try {
        const user = req.user;
        if(user.isPremium ){
            res.status(200).json({isPremium:true,membershipType:user.membershipType})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Something went wrong"})
    }
})



module.exports = paymentRouter;