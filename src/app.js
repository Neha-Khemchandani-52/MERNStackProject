//console.log("Staring Express Server!!");

const express = require("express"); // express module of node_modules
const app = express(); // creating express js applicaton or instance

// app.use((req,res) =>{   // Handle Request and Response  
//     res.send("Hello From the Server!!!");
// });

// app.use("/",(req,res) =>{   // Handle Request and Response  
//     res.send("Hi Gannu Bha!!!");
// });

app.use("/test",(req,res) =>{   // Handle Request and Response  
    res.send("Hello From the Server!!!");
});

app.use("/dashboard",(req,res) =>{   // Handle Request and Response  
    res.send("Dashboard Devlopers Tinder!!!");
});

app.use("/hello",(req,res) =>{   // Handle Request and Response  
    res.send("Hello from Neha Khemchandani !!!");
});

app.use("/",(req,res) =>{   // Handle Request and Response  
    res.send("Hi !!!");
});

app.listen(3002, ()=>{
    console.log("Server is listening on port 3002...");

});   // listen to incoming requests .i.e created server and listening on 3002 port
 