const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    age:{type:Number},
    gender:{type:String},
    emailId:{type:String},
    password:{type:String}
    
})


module.exports = mongoose.model("User",userSchema)