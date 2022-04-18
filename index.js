// EXPRESS
const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// SESSION
const session = require('express-session');
const sk = require("./configs/dbSecretKeys").secretOrKey;
app.use(session({
        secret: sk,
        resave: true,
        saveUninitialized: true
}));

// CORS
const cors = require("cors");
app.use(cors());

// PASSPORT
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
require("./configs/passport")(passport);

// DB CONNECT
const mongoose = require("mongoose");
const db = require("./configs/dbSecretKeys").mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("we are connected to the DB"))
        .catch(err => console.log(err));

// ROUTES
const auth = require("./routes/api/auth");
const users = require("./routes/api/users");

// USE ROUTES
app.use("/api/auth", auth);
app.use("/api/users", users);

// SET PORT
const port = process.env.PORT || 5100;
app.listen(port, () => console.log(`we are live at ${port}`));