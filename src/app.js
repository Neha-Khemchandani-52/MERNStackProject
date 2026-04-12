const express = require("express"); // express module of node_modules
const app = express(); // creating express js applicaton or instance
const cors = require("cors");

const {connectDB} = require("./config/database");
const {userModel} = require("./models/user");
const validator = require("validator");
const cookieParser = require("cookie-parser");
require('dotenv').config(); // Load variables from .env into process.env

const {authRouter} = require("./routes/auth");
const {profileRouter} = require("./routes/profile");
const {requestRouter} = require("./routes/request");
const {userRouter} = require("./routes/user");


//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");
//const {validateEnteredData} = require("./utils/validation");
//const {userAuth} = require("./middlewares/auth");

app.use(express.json()); // Express Json Middleware
app.use(cookieParser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


connectDB()
.then(() => {
    console.log("Database Connection Established!!!");

    app.listen(process.env.PORT, ()=>{
        console.log("Server is listening on port 3002...");
    
    });   // listen to incoming requests .i.e created server and listening on 3002 port
     
})
.catch(() => {
    console.log("Database cannot be connected!!!");
});



