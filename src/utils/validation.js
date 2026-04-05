const validator = require("validator");

const validateEnteredData = (req)=>{

    const { firstName, lastName, emailId, password,photoUrl, skills } = req.body;

    if(!firstName || !lastName){

        throw new Error("Please Enter valid name!");
    }
    else if(firstName.length <4 || firstName.length > 50){

        throw new Error("Please Enter valid Name!");
    }
    // else if(!validator.isURL(photoUrl)){
    //     throw new Error("Invalid Photo URL!");
    // }
    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid Email Address!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong Password!");
    }
    // else if(skills.length > 10){
    //     throw new Error("Skills can't be more than 10!");
    // }
    
}

const validateEditedData = (req) =>{
   
    const ALLOWED_UPDATES = ["firstName","lastName","emailId","gender","photoUrl", "skills", "about", "contactNo","age"];

    const isUpdateAllowed = Object.keys(req.body).every((k) =>
        ALLOWED_UPDATES.includes(k)
    );

    if(!isUpdateAllowed){
        throw new Error("Update not allowed!");
    }

    // if(req.body?.skills.length > 10){
    //     throw new Error("Skills can't be more than 10!");
    // }

    if(!validator.isURL(req.body?.photoUrl)){
        throw new Error("Invalid Photo URL!");
    }

}

module.exports = {validateEnteredData,validateEditedData};