const express = require("express"); // express module of node_modules
const app = express(); // creating express js applicaton or instance

const {connectDB} = require("./config/database");

const {userModel} = require("./models/user");

app.use(express.json()); // Express Json Middleware

// Creating a new Instance of the User Model
//const User = new UserModel(userObj);

// 1st Signup API
app.post("/signup", async (req,res)=>{  

    // const user = new userModel({
    //     firstName : "Neha",
    //     lastName : "Khemchandani",
    //     age : 32,
    //     gender : "female",
    //     contactNo : "90283335645",
    //     emailId : "neha.khemchandani@gmail.com",
    //     password : "test@123"

    // });

    // Creating a new user
    //console.log(req.body);
    const user = new userModel(req.body); // Adding dynamic data recevied from sign-up API

    try{
        await user.save(); // it will return promise, so used await
        res.send("User Added Succesfully!!");
    }catch (err) {
        res.status(400).send("Error while saving the user : "+ err.message);
    }

});


// 2nd API : Feed API : Get all the users from Database
app.get("/feed", async (req,res) => {

    try{
        const users = await userModel.find({}) // it will return all documents from DB collection
        res.send(users);

    }catch (err) {
        res.status(400).send("Something went wrong : "+ err.message);
    }
});

// 3rd API /user for our study to get data based on particular field value using find() or findOne()
app.get("/user", async (req,res) => {

    const userEmail = req.body.emailId;
    console.log(userEmail);

    //const userId = req.body._id;
    const userId = req.body.userId;

    console.log(userId);

    try{
        // const users = await userModel.find({emailId : userEmail}) 
        // if(users.length === 0){
        //     res.status(404).send("User Not Found!");
        // }
        // else{
        //     res.send(users);
        // }

        // const user = await userModel.findOne({emailId : userEmail});
        // if(!user){
        //     res.status(404).send("User Not Found!");
        // }
        // else{
        //     res.send(user);
        // }

        //const user = await userModel.findById('69c95c23ebf8119491ad4c26');

        const user = await userModel.findById({_id : userId });
        if (!user) {
            console.log("User not found");
            res.status(404).send("User Not Found!");
        } else {
            console.log(user.firstName);
            res.send(user.firstName);
        }

    }catch (err) {
        res.status(400).send("Something went wrong : "+ err.message);
    }
});

// 4th API : Delete API - Delete Users from Database

app.delete("/deleteUser", async (req,res) =>{

    const userId = req.body.userId;

    try{

        //const user = await userModel.findByIdAndDelete({_id : userId }); // Working
        //const user = await userModel.findOneAndDelete({_id : userId }); // Working
        const user = await userModel.findByIdAndDelete(userId); // working
        console.log(user);
        if(user)
            res.send("User Deleted Successfully!");
        else
            res.send("Not Found this User for Deletion!");

    }catch (err) {
        res.status(400).send("Something went wrong : "+ err.message);
    }

});


// 5th API : Update API - Update User details in Database - using patch http method

app.patch("/updateUser", async (req,res) =>{

    const userId = req.body.userId;
    const data = req.body;

    try{
        //const user = await userModel.findByIdAndUpdate(userId,data,{returnDocument : "before"} ); // working

        const user = await userModel.findByIdAndUpdate(userId,data,{returnDocument : "after"} ); 
        console.log(user);
        if(user)
            res.send("User Updated Successfully!");
        else
            res.send("Unable to update data as user not found!");

    }catch (err) {
        res.status(400).send("Something went wrong : "+ err.message);
    }

});


connectDB()
.then(() => {
    console.log("Database Connection Established!!!");

    app.listen(3002, ()=>{
        console.log("Server is listening on port 3002...");
    
    });   // listen to incoming requests .i.e created server and listening on 3002 port
     
})
.catch(() => {
    console.log("Database cannot be connected!!!");
});



