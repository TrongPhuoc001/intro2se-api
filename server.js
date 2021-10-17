const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;
const userRoute = require("./routes/user");
const courseRoute = require("./routes/course");
const adminRoute = require('./routes/admin')
dotenv.config();


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// middlewere
app.use(express.json());
app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use('/admin', adminRoute)

app.get('/' , (req , res)=>{
   res.send('hello from intro2se api :)');
})



app.listen(PORT, ()=>{console.log("server is running!")});