
const validator = require("validator")
const signUpValidator = (req)=>{
    const {emailId,password,firstName,lastName}= req.body;
if(!firstName || !lastName){
    throw new Error ("Name is not valid")
}

if(!validator.isEmail(emailId)){
    throw new Error ("Email not valid");
}

if(!validator.isStrongPassword(password)){
    throw new Error ("Please enter a strong password")
}

}

module.exports = {signUpValidator}