var express               = require ("express"),
	mongoose              = require("mongoose"),
	passport              = require("passport"),
	bodyParser            = require("body-parser"),
	User                  = require("./models/user"),
	LocalStrategy         = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose");


mongoose.connect("mongodb://localhost/auth_demo_app",{useNewUrlParser: true, useUnifiedTopology: true});
var app = express();

app.use(require("express-session")({
	secret : "Rusty is the best and the cutest dog in the world",
	resave : false,
	saveUninitialized : false
}));


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine','ejs');
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//++++++++++++++++++++++++++++++++++++
//routes
//++++++++++++++++++++++++++++++++++++

app.get("/",function(req,res){
	res.render("home");
});	

app.get("/secret", isLoggedIn ,function(req,res){
	res.render("secret");
});

//AUTH ROUTES

//show sign up form
app.get("/register",(req,res)=>{
	res.render("register");
});
//handliing user sign up
app.post("/register",(req,res)=>{
	// res.send("RESGISTER POST ROUTE");
	req.body.username
	req.body.password
	//we dont pass password to the new user as it will instead store the actual password which is not a good practice, instead what we do, we pass in the password as second arguement to the register function which will via process of hashing will change the password in certain another hexa code which will be used to store furrther int the database.
	User.register(new User({username : req.body.username }), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/secret");
		});
	});	
});
//login routes
app.get("/login",function(req,res){
	res.render("login");	
});
//login logic
//MIDDLE-WARE
app.post("/login",passport.authenticate("local",{
		successRedirect: "/secret",
		faliureRedirect: "/login"
	}),function(req,res){
});

//logout routes
app.get("/logout",function(req,res){
	// res.send("OK, I'LL LOG YOU OUT...!!!!")
	req.logout();
	res.redirect("/");
});

//middleware , ourselves designed

function isLoggedIn (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

// starting the server
app.listen(3000,process.env.IP, function() { 
  console.log('the Auth_Test server has started!!!!!'); 
});