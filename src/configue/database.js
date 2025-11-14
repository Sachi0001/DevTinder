const mongoose = require("mongoose");
const connectDB = async ()=>{
    mongoose.connect("mongodb+srv://sachin1234chandran1_db_user:sachin@cluster0.k2usm5j.mongodb.net/devTinder")
}

module.exports = connectDB