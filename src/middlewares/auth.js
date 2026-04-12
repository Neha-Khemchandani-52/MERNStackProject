const jwt = require("jsonwebtoken");
const { userModel } = require("../models/user");
require('dotenv').config();

const userAuth = async (req,res,next) =>{

    try{

    const cookie = req.cookies; // get the token from cookie

    const {token} = cookie;

    if(!token){
        //throw new Error("Something went wrong... Please try login again!");
        return res.status(401).send("Please Login");
    }
    // validate token
    //console.log(process.env.JWT_SECRET);
    const decodedMessage = jwt.verify(token,process.env.JWT_SECRET);

    const {_id} = decodedMessage;
    
    const userInfo = await userModel.findById(_id);

    req.userInfo = userInfo;
    
    next();  // to move to the request handler

    } 
    catch(err){
        res.status(400).send("ERROR : "+err.message);
    }

}

module.exports = {userAuth};