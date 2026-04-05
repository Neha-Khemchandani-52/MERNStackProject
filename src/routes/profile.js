const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const {validateEditedData} = require("../utils/validation");

// Profile API

profileRouter.get("/profile/view", userAuth, async (req,res) => {

    try{   
        res.send(req.userInfo);
    } catch(err){
        res.status(400).send("ERROR : "+err.message);
    }

});

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {

    try{

        if(validateEditedData(req)){
            throw new Error("Invalid Edit Request!");
        }

        const loggedinUserData = req.userInfo;
        const editData = req.body;
       
        Object.keys(editData).forEach((key) => { 
            loggedinUserData[key] = editData[key]
        });

        await loggedinUserData.save();

        //res.send(`${loggedinUserData.firstName}! your profile updated successfully`);

        res.json({
            message : `${loggedinUserData.firstName}! your profile updated successfully!`,
            data : loggedinUserData
        });

    } catch(err){
        res.status(400).send("ERROR : "+err.message);
    }

});

module.exports = {profileRouter};