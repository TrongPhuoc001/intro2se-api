// thư viện
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const exphbs = require("express-handlebars");
const path = require("path");
const session = require("express-session");
const PORT = process.env.PORT || 3000;
const userRoute = require("./routes/user");
const courseRoute = require("./routes/course");
const adminRoute = require("./routes/admin");
const Markdown = require("markdown-to-html").Markdown;
const passport = require("./config/passport");
const express_handlebars_sections = require("express-handlebars-sections");
const apiUserRouter = require("./api/user");
const apiCourseRouter = require("./api/course");

const fs = require("fs");
dotenv.config();

//

const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
  helper: {
    section(name, options) {
      if (!this._sections) {
        this._sections = {};
      }
      this._sections[name] = options.fn(this);
      return null;
    },
  },
});
express_handlebars_sections(hbs);
app.engine("hbs", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },

    secret: "cats",
  })
);
app.use("/api/course", apiCourseRouter);
app.use("/api/user", apiUserRouter);
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.user = req.user;
  // res.locals.authenticated = !req.user.anonymous;
  next();
});
// middlewere
app.use("/user", userRoute);
app.use("/course", courseRoute);
app.use("/admin", adminRoute);

app.get("/", (req, res) => {
  const md = new Markdown();
  md.bufmax = 2048;
  const fileName = __dirname + "/README.md";
  const opts = {
    title: "Read Me",
    stylesheet: "styles/readme.css",
    charset: "utf-8",
  };

  // Write a header.
  md.render(fileName, opts, function (err) {
    if (err) {
      console.error(">>>" + err);
      process.exit();
    }
    md.pipe(res);
  });
});

app.listen(PORT, () => {
  console.log("server is running!");
});
