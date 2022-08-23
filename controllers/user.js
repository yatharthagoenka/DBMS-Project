var mysql = require('mysql');
var nodemailer = require('nodemailer');

//authentication check
exports.authentication = (req, res, next) => {

   if (req.session.mail != undefined) {
      next();
   }
   else {
      res.render('user/home', { user: "" });
   }
}

// show the home page
exports.getHome = (req, res, next) => {

   if (req.session.mail != undefined) {
      return res.render('user/home', { user: req.session.mail});
   }
   else {
      return res.render('user/home', { user: "" });
   }
}

//show the login page
exports.getLogin = (req, res, next) => {
   res.render('user/loginAccount', { user: "", msg: [], err: [] });
}

exports.postLogin = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "visitor_hostel"
   });

   data = "SELECT * FROM  user WHERE name = " + mysql.escape(req.body.username) + " AND password = " + mysql.escape(req.body.pass);

   connectDB.query(data, (err, result) => {
      if (err) throw err; // show if any error have
      else {
         if (result.length) {
            req.session.mail = result[0].email;
            res.render('user/home', {user: result[0].email, username: result[0].name});
         }
         else {
            res.render('user/loginAccount', { user: "", msg: [], err: ["Please Check Your information again"] });
         }

      }
   })

}


// show create account page
exports.getCreateAccount = (req, res, next) => {
   res.render('user/createAccount', { user: "", msg: [], err: [] })
}

// post req for creating acc
exports.postCreateAccount = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "visitor_hostel"
   });

   var p1 = req.body.pass;
   var p2 = req.body.con_pass;

   if (p1 != p2) { // if password doesn't match 
      return res.render("user/createAccount", { user: "", msg: [], err: ["Password Doesn't Match"] })
   }

   var data = "INSERT INTO user VALUES ( '" + req.body.name + "' ,'" + req.body.mail + "' ,'" + req.body.phone + "' ,'" + p1 + "')";

   connectDB.query(data, (err, result) => {
      if (err) throw err;// if db has error, show that 
      else {
         res.render('user/loginAccount', { user: "", msg: ["Account Create Successfuly"], err: [] }); //show login page
      }
   })
}

//get request for category
exports.getCategory = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "visitor_hostel"
   });

   data = "SELECT * FROM  category WHERE available > 0";

   connectDB.query(data, (err, result) => {
      if (err) throw err; //show if error found
      else {
         //console.log(result);
         return res.render('user/showCategory', { user: req.session.mail, rooms: result })
      }
   })
}

// get booking data 
exports.postBooking = (req, res, next) => {
   res.render('user/bookingConfirm.ejs', { user: req.session.mail, name: req.body.name, type: req.body.type, cost: req.body.cost, img: req.body.img });
}

//post status request
exports.postStatus = (req, res, next) => {

   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "visitor_hostel"
   });
   var date = req.body.date;
   //console.log(date)
   data = "INSERT INTO bookingstatus " +" VALUES ('" + req.session.mail + "','" + req.body.name + "','" + req.body.type + "','" + req.body.occupancy + "','" + req.body.meal + "','" + 0 + "','" + date + "')"

   data1 = "SELECT * " +
      " FROM  bookingstatus " +
      " WHERE email = " + mysql.escape(req.session.mail);
      
   connectDB.query(data, (err, reslt) => {
      if (err) throw err;
      else {
         connectDB.query(data1, (err1, result) => {
            for (i in result) {
               var a = result[i].date
               a = a.toString()
               result[i].date = a.slice(0, 15);
            }
            res.redirect('/showStatus');
      
         })
      }
   })
}


//get status
exports.getShowStatus = (req, res, next) => {

   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "visitor_hostel"
   });

   data = "SELECT * FROM  bookingstatus WHERE email = " + mysql.escape(req.session.mail);

   connectDB.query(data, (err, result) => {

      if (err) throw err;
      else {
         for (i in result) {
            var a = result[i].date
            a = a.toString()
            result[i].date = a.slice(0, 15);
         }
         if (result.length < 1) {
            res.render('user/statusShow', { user: req.session.mail, msg: "", err: "You dont have any data", data: result });
         }
         else {
            res.render('user/statusShow', { user: req.session.mail, msg: "", err: "", data: result });
         }
      }
   })
}


//delete booking request
exports.deleteBooking =(req,res,next)=>{
   //console.log(req.body);
   var connectDB = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "visitor_hostel"
   });

   data = "DELETE FROM bookingstatus WHERE email = " + mysql.escape(req.body.mail) + " AND type = " + mysql.escape(req.body.type) + " AND category = " + mysql.escape(req.body.cat)+" AND occupancy = "+mysql.escape(req.body.want)
  
   connectDB.query(data,(err,result)=>{
      if(err) throw err;
      else{
         next();
      }
   })

}


//show contact page
exports.getContact =(req,res,next)=>{
   if(req.session.mail== undefined){
      res.render('user/contact', { user: "" });
   }
   else{
      res.render('user/contact', { user: req.session.mail });
   }
   
}

//logout
exports.logout = (req, res, next) => {
   req.session.destroy();
   res.render('user/home', { user: ""});

}