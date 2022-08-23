var mysql = require('mysql');
var formidable = require('formidable');
const path = require('path');
var nodemailer = require('nodemailer');


// login get request
exports.getLogin = (req, res, next) => {
    if (req.session.admin == undefined) {
        res.render('admin/login', { msg: "", err: "" });
    }
    else {
        var connectDB = mysql.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "visitor_hostel"
        });
        data1 = "SELECT * FROM  bookingstatus WHERE status = 0 ";
        connectDB.query(data1, (err1, result1) => {
            if (err1) throw err1;
            else {
                for (i in result1) {
                    var a = result1[i].date;
                    result1[i].date = a.toString().slice(0, 15);
                }
                return res.render('admin/index', { msg: "", err: "", data: result1 });
            }
        })
    }

}

//login post request
exports.postLogin = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "visitor_hostel"
    });

    data = "SELECT * FROM admin WHERE name = " + mysql.escape(req.body.name) + "AND pass = " + mysql.escape(req.body.pass);

    data1 = "SELECT * FROM  bookingstatus WHERE status = 0 ";

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            if (result.length) {
                req.session.admin = result[0].name;
                connectDB.query(data1, (err1, result1) => {
                    if (err1) throw err1;
                    else {
                        for (i in result1) {
                            var a = result1[i].date;
                            result1[i].date = a.toString().slice(0, 15);
                        }
                        return res.render('admin/index', { msg: "", err: "", data: result1 });
                    }
                })

            }
            else {
               return res.redirect('/admin');
            }
        }
    })
}

//change booking status
exports.postChnageStatus = (req, res, next) => {
    //console.log(req.body);

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "visitor_hostel"
    });

    var value = 0;

    if (req.body.click == "Approve") {
        value = 1;
        data = "UPDATE bookingstatus SET  status = " + mysql.escape(value) +
        " WHERE email = " + mysql.escape(req.body.mail) +
        " AND type = " + mysql.escape(req.body.type) +
        " AND category = " + mysql.escape(req.body.cat) +
        " AND occupancy = " + mysql.escape(req.body.occupancy) +
        " AND mealplan = " + mysql.escape(req.body.meal)

    } else {
        data = "DELETE FROM bookingstatus WHERE email = " + mysql.escape(req.body.mail) +" AND type = " + mysql.escape(req.body.type) + " AND category = " + mysql.escape(req.body.cat) + " AND occupancy = " + mysql.escape(req.body.occupancy) + " AND mealplan = " + mysql.escape(req.body.meal)
    }
    
    data1 = "SELECT * FROM  bookingstatus WHERE status = 0 ";

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            connectDB.query(data1, (err1, result1) => {
                if (err1) throw err1;
                else {
                    for (i in result1) {
                        var a = result1[i].date; 
                        result1[i].date = a.toString().slice(0, 15);
                    }
                    return res.render('admin/index', { msg: "", err: "", data: result1 });
                }
            })
            
            updateav = "UPDATE category SET available = available - 1 WHERE name = " + mysql.escape(req.body.cat) + " AND type = "+ mysql.escape(req.body.type) +" AND available > 0";

            connectDB.query(updateav, (err, result) => { 

                if (err){
                    console.log(err);
                }
                else {
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                        user: 'hmsiiitdmj@gmail.com',
                        pass: 'default@123'
                        }
                    });
                    
                    var mailOptions = {
                        from: 'hmsiiitdmj@gmail.com',
                        to: req.body.mail,
                        subject: 'HMS IIITDMJ',
                        text: 'Booking confirmed: \n Category: '+ mysql.escape(req.body.cat) + "\n Room Type: " + mysql.escape(req.body.type) + "\n Occupancy: " + req.body.occupancy + "\n Meal: " + req.body.meal + "\n Status: Confirmed"
                    };
            
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }
            })
            
        }
    })

}

//get add hotel page
exports.getaddRoom = (req, res, next) => {
    res.render('admin/addRoom', { msg: "", err: "" });
}

//add new hotel info
exports.postaddRoom = (req, res, next) => {
   
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "visitor_hostel"
    });
    var cat = "", type = "", cost = 0, avlvl = 0, des = ""
   var imgPath="img/rooms/room1.jpg"
    var wrong = 0;

    new formidable.IncomingForm().parse(req)
        .on('field', (name, field) => {
            if (name === "cat") {
                cat = field;
            }
            else if (name === "type") {
                type = field;
            }
            else if (name === "cost") {
                cost = parseInt(field);
            }
            else if (name === "avlvl") {
                avlvl = parseInt(field);
            }
            else if (name === "des") {
                des = field
            }

        })
        .on('aborted', () => {
            console.error('Request aborted by the user')
        })
        .on('error', (err) => {
            console.error('Error', err)
            throw err
        })
        .on('end', () => {

            if (wrong == 1) {
                console.log("Error")
            }
            else {

                //saveDir = __dirname + '/uploads/';
                
                data = "INSERT INTO `category`(`name`, `type`, `cost`, `available`, `img`, `dec`) "+"VALUES('" +cat + "','" + type + "', '" + cost + "','" +avlvl + "' ,'" + imgPath + "' ,'" + des + "' )"
                connectDB.query(data, (err, result) => {

                    if (err) {
                        throw err;
                    }
                    else {
                        res.render('admin/addRoom', { msg: "Data Insert Successfuly", err: "" });
                    }
                });
            }
        })
}

exports.getSearch = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "visitor_hostel"
    });

    data = "SELECT * FROM category " ;

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            return res.render('admin/update', { msg: "", err: "", data: result });
        }
    })

}

exports.getUpdate = (req, res, next) => {
    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "visitor_hostel"
    });

    data = "SELECT * FROM category WHERE name = " + mysql.escape(req.body.cat) + " AND type = " + mysql.escape(req.body.type) + " AND cost = " + mysql.escape(req.body.cost);

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            req.session.info = result[0];
            res.render('admin/updatePage', { data: result[0] });
        }
    })
}

//update room data
exports.updatePrevData = (req, res, next) => {

    var connectDB = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "visitor_hostel"
    });

    data = "UPDATE category SET type = " + mysql.escape(req.body.type) +
        ", cost = " + mysql.escape(parseInt(req.body.cost)) +
        ", available = " + mysql.escape(parseInt(req.body.avlvl)) +
        ", `dec` = " + mysql.escape(req.body.des) +
        " WHERE name = " + mysql.escape(req.session.info.name) +
        " AND type = " + mysql.escape(req.session.info.type) +
        " AND cost = " + mysql.escape(parseInt(req.session.info.cost))    

    connectDB.query(data, (err, result) => {
        if (err) throw err;
        else {
            res.redirect('/admin/Search')
        }
    })

}

//logout
exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/admin');
}