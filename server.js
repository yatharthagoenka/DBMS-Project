// IMPORTS
const   express = require('express'),
        app = express(),
        expressLayouts = require('express-ejs-layouts'),
        passport = require('passport'),
        LocalStrategy = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        bodyParser = require('body-parser');

var path = require('path');

// MODELS
const Users = require('./models/users');
const Reservations = require("./models/reservations");

// ROUTES
const userRouter = require('./routes/user');
const indexRouter = require('./routes/index');
const resRouter = require('./routes/reservation');

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({limit: '10mb',extended: false}))

// DATABASE CONNECTION
const mongoose = require('mongoose');
const { appendFile } = require('fs');
const { env } = require('process');

const dotenv = require('dotenv');
dotenv.config();
mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(()=>{
        console.log("Database connected!");
    })


//PASSPORT SETUP
app.use(require("express-session")({
    secret:"secretword",       //decode or encode session
    resave: false,          
    saveUninitialized:false    
}));
passport.serializeUser(Users.serializeUser());       //session encoding
passport.deserializeUser(Users.deserializeUser());   //session decoding
passport.use(new LocalStrategy(Users.authenticate()));
app.use(passport.initialize());
app.use(passport.session());


// USING ROUTERS
app.use('/', userRouter)
app.use('/index', indexRouter)
app.use('/reservations', resRouter)

app.listen(process.env.PORT || 8000, function(err){
    if(err){
        console.log(err);
    }else{
        console.log("Server Running at port 8000")
    }
});