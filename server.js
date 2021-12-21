// thư viện
const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT || 3000;
const userRoute = require("./routes/user");
const courseRoute = require("./routes/course");
const adminRoute = require('./routes/admin')
const Markdown = require('markdown-to-html').Markdown;
const fs = require('fs');
dotenv.config();

// 
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
// middlewere
app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use('/admin', adminRoute)

app.get('/' , (req , res)=>{
   const md = new Markdown();
   md.bufmax = 2048;
   const fileName = __dirname + '/README.md';
   const opts = {title: 'Read Me', stylesheet: 'styles/readme.css', charset: 'utf-8'};
   // Write a header.
   md.render(fileName, opts, function(err) {
      if (err) {
         console.error('>>>' + err);
         process.exit();
      }
      md.pipe(res);
   });
})



app.listen(PORT, ()=>{console.log("server is running!")});