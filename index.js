const express = require('express');
const bodyParser = require('body-parser');
const views = require('path').join(__dirname, 'views');
const dotenv = require('dotenv');
const session = require('express-session');
const { connect } = require('./config/config');
const axios = require("axios");
const cookieParser = require('cookie-parser');
const app = express();
const http = require("http");
const server = http.createServer(app);



// Load environment variables
dotenv.config({
    path: './config.env',
});

//Connection to MongoDB
connect();

const sessionMiddleware = session({
    key: "user_sid",
    cookie: {
        sameSite: 'lax',
    },
    secret: "thisisrandomstuff",
    resave: false,
    saveUninitialized: true,
})

//Initializing the App
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("views"))
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(sessionMiddleware);

const io = require('socket.io')(server);
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware));


const onlineUsers = {};
//Socket.io
io.on('connection', function (socket) {
    socket.join('common-room');
    onlineUsers[socket.id] = socket.request.session.user;
    const values = Object.values(onlineUsers);
    io.to('common-room').emit("onlineUsers", values);

    socket.on('disconnect', function () {
        console.log("User Disconnected");
        delete onlineUsers[socket.id];
    })
})


//Routes
app.use('/api/user', require('./routes/userRoute'));
app.get("/", (req, res) => {
    res.render("login")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get("/dashboard", (req, res) => {
    axios.get("http://localhost:5020/api/user/dashboardtable").then(user => {
        res.render("dashboard", {
            users: user.data
        })
    });


})
//Server
server.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})



