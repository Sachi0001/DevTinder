const mongoose = require("mongoose");
const connectDB = async ()=>{
    mongoose.connect(process.env.DB_SECRET_KEY)
}

module.exports = connectDB