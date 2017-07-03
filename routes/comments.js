var express = require("express");
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

var router = express.Router({mergeParams: true});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
	var id = req.params.id;
	Campground.findById(id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	})
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
	var id = req.params.id;
	var author = {id: req.user._id, username: req.user.username};
	var text = req.body.text;
	var comment = {text: text, author: author}
	Campground.findById(id, function(err, campground) {
		if (err) { 
			console.log(err);
		} else {
			Comment.create(comment, function(err, comment) {
				if (err) {
					console.log(err);
				} else {
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment succesfully created");
					res.redirect("/campgrounds/" + id);
				}
			});
		}
	});
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	var campgroundId = req.params.id;
	var comment = res.comment;
	res.render("comments/edit", {campgroundId: campgroundId, comment: comment});
});

// UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	var campgroundId = req.params.id;
	var editedText = req.body.text;
	comment = res.comment;
	comment.text = editedText;
	Comment.update({_id: comment._id}, {$set: comment}, function(err, comment) {
		if (err) {
			req.flash("error", "Something went wrong");
		} else {
			req.flash("success", "Comment succesfully updated");
			res.redirect("/campgrounds/" + campgroundId);
		}
	});
});

// DELETE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	var campgroundId = req.params.id;
	var comment = res.comment;
	Comment.remove({_id: comment._id}, function(err) {
		if (err) {
			req.flash("error", "Something went wrong");
			return res.redirect("back");
		}
		req.flash("success", "Comment succesfully removed");
		res.redirect("/campgrounds/" + campgroundId);
	})
});

module.exports = router;