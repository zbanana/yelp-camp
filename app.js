var express 			= require("express"),
	app 				= express(),
	flash 				= require("connect-flash"),
	bodyParser 			= require("body-parser"),
	mongoose 			= require("mongoose"),
	passport			= require("passport"),
	LocalStrategy 		= require("passport-local"),
	expressSession 		= require("express-session"),
	User 				= require("./models/user"),
	methodOverride 		= require("method-override");
	seedDB 				= require("./seeds");

// ROUTES
var commentRoutes 		= require("./routes/comments"),
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect(process.env.DATABASEURL);
// seedDB();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(expressSession({
	secret: "dasdasdewrfewrw45as53548dwq48",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE TO PASS THE USER ON EVERY REQUEST
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.errorMessage = req.flash("error");
	res.locals.successMessage = req.flash("success");
	next();
})	

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);



app.listen(process.env.PORT, function() {
	console.log("Server listening on port " + process.env.PORT);
});