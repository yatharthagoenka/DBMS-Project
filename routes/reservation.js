const express = require('express');
const router = express.Router();
var path = require('path');
const User = require('../models/users');
const Reservation = require('../models/reservations');

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

router.get('/', isLoggedIn, async(req, res) => {
    res.render('reserve/newRes', {username: req.user.username})
})

router.get('/bookings',isLoggedIn, async (req, res) => {
    try{
        const reserves = await Reservation.find()
        res.render('reserve/viewRes',{
            reserves: reserves,
            username: req.user.username,
            type: req.user.guest_type
        })
    }catch{
        res.redirect('/')
    }
    
})

router.post('/',isLoggedIn,async(req,res)=>{
    const reserve = new Reservation({
        checkin: req.body.checkin,
        checkout: req.body.checkout,
        room_type: req.body.room_type,
        user: req.user.username,
        room_no: req.body.room_no,
        occupancy: req.body.occupancy,
        status: req.body.status,
        Reg_num: req.body.regnum
    })
    try{
        const sendRes = await reserve.save()
        res.redirect('/')
    }catch(err){
        console.log(err);
        res.redirect('/reservations')
    }
})

 
module.exports = router