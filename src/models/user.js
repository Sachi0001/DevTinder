const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = mongoose.Schema({
    firstName:{type:String,
        required:true,
        minLength:4
    },
    lastName:{type:String,
        required:true,
        minLength:2
    },
    age:{type:Number,
        min:18
    },

    about:{
        type:String,
        default:"This is about the user"
    },
    gender:{type:String,
        validate(value){
            const allowedGender=["male","female","others"]
            if(!allowedGender.includes(value)){
                throw new Error ("Gender not defined correctly")
            }
        }
    },
    emailId:{type:String,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email validation failed")
            }
        }
    },
    password:{type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please enter a strong password")
            }
        }
    },
    photoUrl:{
        type:String,
        default:"https://kristalle.com/wp-content/uploads/2020/07/dummy-profile-pic-1.jpg"
    },
    skills:{
        type:[String]
    }

    
},
{timestamps:true})


module.exports = mongoose.model("User",userSchema)