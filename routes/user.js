const express = require('express'),
    passport = require('passport'),
    LocalStrategy = require('passport-local');
const router = express.Router();
var path = require('path');
const User = require('../models/users');
const Reservation = require('../models/reservations');

router.get('/', async(req, res) => {
    // res.sendFile(path.join(__dirname, '../views','auth.html'));
    res.render('auth')
})

router.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
});

router.post("/login",passport.authenticate("local",{
    failureRedirect:"/"
}), (req, res)=>{
    if(req.user.guest_type=="admin"){
        res.redirect('/adminindex')
    }else{
        res.redirect('/index')
    }
});

router.post("/register",(req,res)=>{
    User.register(new User({username: req.body.username,phone:req.body.phone,email: req.body.email,guest_type: req.body.relation}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/");
    })    
    })
})

// ADMIN ROUTES

function adminLogin(req,res,next) {
    if(req.isAuthenticated()){
        if(req.user.guest_type=="admin"){
            return next();
        }
    }
    res.redirect('/')
}

router.get('/adminindex', adminLogin, async(req, res) => {
    try{
        const reserves = await Reservation.find()
        res.render('admin/index',{
            reserves: reserves
        })
    }catch{
        res.redirect('/')
    }
    // res.render('ad/min/index')
})

router.get('/users', adminLogin, async(req, res) => {
    try{
        const users = await User.find()
        res.render('admin/users',{
            users: users
        })
    }catch{
        res.redirect('/')
    }
})


module.exports = router