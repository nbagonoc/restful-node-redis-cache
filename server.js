// INITIALIZATION
const express = require('express');
const app = express();

// DB CONNECT
const mongoose = require("mongoose");
const { mongoURI } = require("./configs/dbSecretKeys");
const connectToDatabase = () => {
    try {
        mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to the DB");
    } catch (err) {
        console.log("Error connecting to the DB:", err);
    }
};
connectToDatabase();

// MIDDLEWARE
const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
const auth = require('./routes/api/auth');
const users = require('./routes/api/users');
app.use('/api/auth', auth);
app.use('/api/users', users);

// SESSION
const session = require('express-session');
const sk = require('./configs/dbSecretKeys').secretOrKey;
app.use(
    session({
        secret: sk,
        resave: true,
        saveUninitialized: true,
    })
);

// PASSPORT
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());
require('./configs/passport')(passport);

// SET PORT, and START SERVER
const port = process.env.PORT || 5100;
const server = () => {
    try {
        app.listen(port);
        console.log(`We are live at: ${port}`);
    } catch (err) {
        console.log(`Server startup failed: ${err}`);
    }
};
server();

module.exports = {
    app,
    server,
};
