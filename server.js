const express = require('express');
const session = require('express-session');
var mysql = require('mysql');
const ejs = require('ejs'); // view engine service
const flash = require('express-flash'); //To display flash message in fronend
const cors = require('cors'); //To make API calls from frontend to backend
require("dotenv").config(); //To use protected variables from .env file
 //Set config to use variables

const { response } = require('express');

const app = express();

app.use(cors()); // If any incoming API call, it will send the data to backend

app.use(session({
	secret: 'secret-key',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(function(req, res, next){
    res.locals.message = req.flash();
    next();
});


//Render static files to public folder(JS looks default inside views folder)
app.use(express.static('public'));

// Set the view engine to ejs
app.set('view engine', 'ejs');


//Routes
app.get('/', (req, res) => {
    res.render("pages/index")
});

var connection = mysql.createConnection({
	host     : process.env.HOST,
	user     : process.env.USERDB,
	password : process.env.PASSWORD,
	database : process.env.DATABASE
    //port     : process.env.DB_PORT
});
console.log(process.env['DATABASE']);
console.log(process.env['HOST']);
console.log(process.env['PASSWORD']);
console.log(process.env['USERDB']);
console.log(process.env['PORT']);

module.exports = connection;

// http://localhost:3000/auth
app.post('/dashboard', function(req, res) {
	// Capture the input fields
	let username = req.body.username;
	let password = req.body.password;
    if(username && password)
	{
	if (username==101101) {	
		connection.query('SELECT * FROM student WHERE REG_NO = ? AND PASSWORD = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to home page
				let cie1_avg = 85;
				let cie2_avg = 75;
				let cie3_avg = 80;
				let academics_avg = ((85 + 75 + 80)  / 3);
				let softskills_avg = 78;
                let aptitude_avg = 69;
				let technical_avg = 70;
				let attendance_avg = 81.5;
				let placement_avg = ((78 +69 +70) / 3 );

				res.render('pages/admin', {
                    username: results[0].REG_NO,
					attendance_avg: attendance_avg,
					cie1_avg: cie1_avg,
					cie2_avg: cie2_avg,
					cie3_avg: cie3_avg,
					softskills_avg: softskills_avg,
					aptitude_avg: aptitude_avg,
					technical_avg: technical_avg,
					academics_avg: academics_avg,
					placement_avg: placement_avg.toFixed(2)
					
                });
			} else {
                req.flash('failure', 'Incorrect Username and/or Password!');
                res.redirect("/");
			}			
			res.end();
			
		});

		} else  {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM student WHERE REG_NO = ? AND PASSWORD = ?', [username, password], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to home page
				let cie1 = ((results[0].CIE1_S1 + results[0].CIE1_S2 + results[0].CIE1_S3 + results[0].CIE1_S4 + results[0].CIE1_S5) / 5) * 2;
        		let cie2 = ((results[0].CIE2_S1 + results[0].CIE2_S2 + results[0].CIE2_S3 + results[0].CIE2_S4 + results[0].CIE2_S5 + results[0].CIE2_S6) / 6) * 2;
        		let cie3 = ((results[0].CIE3_S1 + results[0].CIE3_S2 + results[0].CIE3_S3 + results[0].CIE3_S4 + results[0].CIE3_S5 + results[0].CIE3_S6) / 6) * 2;
        		let placement = (results[0].SOFTSKILLS + results[0].APTITUDE + results[0].TECHNICAL) / 3;
				// To find max marks
				let cie1_max = Math.max(results[0].CIE1_S1, results[0].CIE1_S2, results[0].CIE1_S3, results[0].CIE1_S4, results[0].CIE1_S5);
				let cie2_max = Math.max(results[0].CIE2_S1, results[0].CIE2_S2, results[0].CIE2_S3, results[0].CIE2_S4, results[0].CIE2_S5, results[0].CIE2_S6);
				let cie3_max = Math.max(results[0].CIE3_S1, results[0].CIE3_S2, results[0].CIE3_S3, results[0].CIE3_S4, results[0].CIE3_S5, results[0].CIE3_S6);
				res.render('pages/dashboard', {
                    username: results[0].REG_NO,
                    attendance: results[0].ATTENDANCE,
					cie1: cie1.toFixed(2),
					cie2: cie2.toFixed(2),
					cie3: cie3.toFixed(2),
					placement: placement,
					cie1_max: cie1_max,
					cie2_max: cie2_max,
					cie3_max: cie3_max
                });
			} else {
                req.flash('failure', 'Incorrect Username and/or Password!');
                res.redirect("/");
			}			
			res.end();
		});
	    } 
   }
});

app.get('/academics', function(req, res) {
	// Capture the input fields
	let username = req.session.username;

	if (username) {		
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM student WHERE REG_NO = ?', [username], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to academics page
				res.render('pages/academics', {
                    username: results[0].REG_NO,
                    attendance: results[0].ATTENDANCE,
					cie1_s1: results[0].CIE1_S1,
					cie1_s2: results[0].CIE1_S2,
					cie1_s3: results[0].CIE1_S3,
					cie1_s4: results[0].CIE1_S4,
					cie1_s5: results[0].CIE1_S5,
					cie2_s1: results[0].CIE2_S1,
					cie2_s2: results[0].CIE2_S2,
					cie2_s3: results[0].CIE2_S3,
					cie2_s4: results[0].CIE2_S4,
					cie2_s5: results[0].CIE2_S5,
					cie2_s6: results[0].CIE2_S6,
					cie3_s1: results[0].CIE3_S1,
					cie3_s2: results[0].CIE3_S2,
					cie3_s3: results[0].CIE3_S3,
					cie3_s4: results[0].CIE3_S4,
					cie3_s5: results[0].CIE3_S5,
					cie3_s6: results[0].CIE3_S6

					
                });
			} else {
                req.flash('failure', 'Incorrect Username and/or Password!');
                res.redirect("/");
			}			
			res.end();
		});
	} else {
		res.end();
	}
});
app.get('/placement', function(req, res) {
	// Capture the input fields
	let username = req.session.username;

	if (username) {		
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM student WHERE REG_NO = ?', [username], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to academics page
				res.render('pages/placement', {
                    username: results[0].REG_NO,
                    attendance: results[0].ATTENDANCE,
					softskills: results[0].SOFTSKILLS,
					aptitude: results[0].APTITUDE,
					technical: results[0].TECHNICAL,
					

					
                });
			} else {
                req.flash('failure', 'Incorrect Username and/or Password!');
                res.redirect("/");
			}			
			res.end();
		});
	} else {
		res.end();
	}
});

app.get('/csea', function(req, res) {
	// Capture the input fields
	let username = req.session.username;

	if (username) {		
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM student WHERE REG_NO = ?', [username], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to academics page
				let cie1_avgA = 75;
				let cie2_avgA = 85;
				let cie3_avgA =90;
				let academics_avgA = ((75 + 85 + 90)  / 3);
				let softskills_avgA = 77;
                let aptitude_avgA= 69;
				let technical_avgA = 80;
				let attendance_avgA = 75.5;
				let placement_avgA = ((77 +69 +80) / 3 );
					
				res.render('pages/csea', {
                    username: results[0].REG_NO,
					attendance_avgA: attendance_avgA,
					cie1_avgA: cie1_avgA,
					cie2_avgA: cie2_avgA,
					cie3_avgA: cie3_avgA,
					softskills_avgA: softskills_avgA,
					aptitude_avgA: aptitude_avgA,
					technical_avgA: technical_avgA,
					academics_avgA: academics_avgA,
					placement_avgA: placement_avgA.toFixed(2)

                    
                });
			} else {
                req.flash('failure', 'Incorrect Username and/or Password!');
                res.redirect("/");
			}			
			res.end();
		});
	} else {
		res.end();
	}
});

app.get('/cseb', function(req, res) {
	// Capture the input fields
	let username = req.session.username;

	if (username) {		
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM student WHERE REG_NO = ?', [username], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to academics page
				let cie1_avgB = 82;
				let cie2_avgB = 79;
				let cie3_avgB =89;
				let academics_avgB = ((82 + 79 + 89)  / 3);
				let softskills_avgB = 66;
                let aptitude_avgB= 70;
				let technical_avgB = 60;
				let attendance_avgB = 75.5;
				let placement_avgB = ((66 +70 +60) / 3 );
					
				res.render('pages/cseb', {
                    username: results[0].REG_NO,
					attendance_avgB: attendance_avgB,
					cie1_avgB: cie1_avgB,
					cie2_avgB: cie2_avgB,
					cie3_avgB: cie3_avgB,
					softskills_avgB: softskills_avgB,
					aptitude_avgB: aptitude_avgB,
					technical_avgB: technical_avgB,
					academics_avgB: academics_avgB,
					placement_avgB: placement_avgB.toFixed(2)

                    
                });
			} else {
                req.flash('failure', 'Incorrect Username and/or Password!');
                res.redirect("/");
			}			
			res.end();
		});
	} else {
		res.end();
	}
});

app.get('/csec', function(req, res) {
	// Capture the input fields
	let username = req.session.username;

	if (username) {		
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM student WHERE REG_NO = ?', [username], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				req.session.loggedin = true;
				req.session.username = username;
				// Redirect to academics page
				let cie1_avgC = 90;
				let cie2_avgC = 87;
				let cie3_avgC = 81;
				let academics_avgC = ((90 + 87 + 81)  / 3);
				let softskills_avgC = 80;
                let aptitude_avgC= 72;
				let technical_avgC = 79;
				let attendance_avgC = 75.5;
				let placement_avgC = ((80 +72 +79) / 3 );
					
				res.render('pages/csec', {
                    username: results[0].REG_NO,
					attendance_avgC: attendance_avgC,
					cie1_avgC: cie1_avgC,
					cie2_avgC: cie2_avgC,
					cie3_avgC: cie3_avgC,
					softskills_avgC: softskills_avgC,
					aptitude_avgC: aptitude_avgC,
					technical_avgC: technical_avgC,
					academics_avgC: academics_avgC,
					placement_avgC: placement_avgC.toFixed(2)

                    
                });
			} else {
                req.flash('failure', 'Incorrect Username and/or Password!');
                res.redirect("/");
			}			
			res.end();
		});
	} else {
		res.end();
	}
});


    

app.listen(process.env.PORT, () => console.log('App is running'));