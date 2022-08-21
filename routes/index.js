const express = require('express');
const router = express.Router();
var path = require('path');
const User = require('../models/users');

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

router.get('/', isLoggedIn,async(req, res) => {
    res.render('index', {username: req.user.username})
})

module.exports = router