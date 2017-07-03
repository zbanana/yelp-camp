var express = require("express");
var Campground = require("../models/campground");
var middleware = require("../middleware");
var router = express.Router();


// INDEX
router.get("/", function(req, res) {
	var user = req.user;
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", 
				{
					campgrounds: allCampgrounds,
					currentUser: user
				});
		}
	})
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
	var newCampground = req.body.campground;
	newCampground.author = {id: req.user._id, username: req.user.username};

	Campground.create(newCampground, function(err, campground) {
		if (err) {
			res.redirect("/campgrounds/new");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

// SHOW
router.get("/:id", function(req, res) {
	var id = req.params.id;
	Campground.findById(id).populate("comments").exec(function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: campground});
		}
	});
});


// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	var id = req.params.id;
	var campground = res.campground;
	res.render("campgrounds/edit", {campground: campground});
});


// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	var id = req.params.id;
	var editedCampground = req.body.campground;
	// Campground.findByIdAndUpdate(id, editedCampground, function(err, updatedCampground) {
	Campground.update({_id: id}, {$set: editedCampground}, function(err, updatedCampground) {
		if (err) {
			req.flash("error", "Something went wrong");
			return res.redirect("/campgrounds/" + id);
		}
		req.flash("success", "Campground succesfully updated");
		res.redirect("/campgrounds/" + id);
	})
});


// DELETE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	var id = req.params.id;
	// Campground.findByIdAndRemove(id, function(err) {
	Campground.remove({ _id: id }, function(err) {
		if (err) {
			req.flash("error", "Something went wrong");
			return res.redirect("/campgrounds/" + id);
		}
		req.flash("success", "Campground succesfully deleted");
		res.redirect("/campgrounds");
	})
});


module.exports = router;