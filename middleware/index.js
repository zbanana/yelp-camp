var Campground = require("../models/campground");
var Comment = require("../models/comment")

var middleware = {};

middleware.isLoggedIn = function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash("error", "You need to be signed in");
		res.redirect("/login");
	}
};

middleware.checkCampgroundOwnership = function checkCampgroundOwnership(req, res, next) {
	if (!req.isAuthenticated()) {
		req.flash("error", "You need to be signed in");
		res.redirect("/campgrounds");
	} else {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				req.flash("error", "Campground not found");
				res.redirect("/campgrounds");
			} else {
				if (foundCampground.author.id.equals(req.user._id)) {
					res.campground = foundCampground;
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("/campgrounds");
				}
			}
		})
	}
};

middleware.checkCommentOwnership = function checkCommentOwnership(req, res, next) {
	if (!req.isAuthenticated()) {
		req.flash("error", "You need to be signed in");
		res.redirect("/campgrounds");
	} else {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				req.flash("error", "Comment not found");
				res.redirect("/campgrounds");
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					res.comment = foundComment;
					next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("/campgrounds");
				}
			}
		})
	}
}



module.exports = middleware;