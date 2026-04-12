const mongoose  = require("mongoose");
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config();

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required : true,
        minLength : 3,
        maxLength : 50,
        trim : true,
        index:true
    },

    lastName : {
        type:String,
        required : true,
        minLength : 3,
        maxLength : 50,
        trim : true
    },

    age : {
        type:Number,
        min : 18
    },

    gender : {
        type:String,
        validate(value){  // custom validation function it will run only if when we create a new users entry by default 
            if(!["male","female","other"].includes(value)){
                throw new Error("Invalid Gender!");
            }
        },
    },

    emailId : {
        type:String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Address!");
            }
        }
    },

    contactNo :{
        type:String,
        // required : true,
        // unique : true,
        trim : true
    },

    password : {
        type:String,
        trim : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please Enter Strong Password!");
            }
        }
    },

    photoUrl : {
        type:String,
        default : "https://cdn-icons-png.flaticon.com/512/195/195072.png" ,
        trim : true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL!");
            }
        }
    },

    about : {
        type:String,
        default : "This is default bio section",
        trim : true
    },

    skills : {
        type:[String],
    }

},
{
    timestamps : true, // automatically add createdAt and updatedAt timestamps
}

);

userSchema.methods.getJWT = async function () {
    const user = this;
    
    //console.log(process.env.JWT_SECRET);
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
  
    return token;
  };
  
  userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
  
    const isPasswordValid = await bcrypt.compare(
      passwordInputByUser,
      passwordHash
    );
  
    return isPasswordValid;
  };

const userModel = mongoose.model("User",userSchema);
module.exports = {userModel};
