const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;
const userRoute = require("./routes/user");
const courseRoute = require("./routes/course");
dotenv.config();

// middlewere
app.use(express.json());
app.use("/user", userRoute);
app.use("/course", courseRoute);

app.get('/' , (req , res)=>{
   res.send('hello from simple server :)');
})

app.listen(PORT, ()=>{console.log("server is running!")});