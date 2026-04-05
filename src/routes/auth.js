const express = require("express");
const authRouter = express.Router();
const {userModel} = require("../models/user");
const {validateEnteredData} = require("../utils/validation");
const bcrypt = require("bcrypt");


// 1st Signup API
authRouter.post("/signup", async (req,res)=>{

    try{

        // validation
        validateEnteredData(req);

         // Encrypt Password
        const {password,firstName,lastName,emailId} = req.body;

        const enryptedPassword = await bcrypt.hash(password,10);
        
        const user = new userModel({
            password : enryptedPassword,
            firstName,
            lastName,
            emailId
        });

        const savedUser = await user.save();      // it will return promise, so used await

        // For Signup , we need to create jwt and cookie as well as user can sign-up in our application
        const token = await savedUser.getJWT(); 
        res.cookie("token",token,{expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}); // Add the jwt token to the cookie and send back to client, here cookie will be expire in 7 days

        res.json({
            message : "User Added Succesfully!",
            data : savedUser
        });

        //res.send("User Added Succesfully!!");

    }catch (err) {
        res.status(400).send("Error while saving the user : "+ err.message);
    }

});

// Login API
authRouter.post("/login", async (req,res) => {

    try{
        const {emailId, password} = req.body;

        const user = await userModel.findOne({emailId:emailId});

        if(!user){
            throw new Error("Invalid Credentials!");
        }

        // we can offload this code also to built-in schema methods as well like we did for generating JWT token
        //const isPasswordValid = await bcrypt.compare(password,user.password); // password -> input password entered by user and user.password -> hashed password

        const isPasswordValid = await user.validatePassword(password);

        if(!isPasswordValid){
            throw new Error("Invalid Credentials!")
        }
        else{

            //const token = await jwt.sign({"_id" : user?._id}, process.env.JWT_SECRET, {expiresIn : "7d"}); // old fine working code, Creating JWT token // 1h or 7d for expiring jwt token only

            const token = await user.getJWT();

            res.cookie("token",token,{expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}); // Add the jwt token to the cookie and send back to client, here cookie will be expire in 7 days
            
            res.status(200).send(user);
        }

    }
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }

});

// Logout API

authRouter.post("/logout", (req,res) => {
    res
    .cookie("token",null,{expires: new Date(Date.now())})
    .send("Logged out Succesfull!");

});


module.exports = {authRouter};