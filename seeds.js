var mongoose = require("mongoose");
var Campground = require("./models/campground")
var Comment = require("./models/comment");

var data = [
	{
		name: "Cloud's Rest",
		image: "https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg",
		description: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec velit ut sapien facilisis vulputate. Praesent dictum augue non auctor congue. In eu ligula et metus auctor scelerisque. Vivamus posuere tellus vel placerat bibendum. Cras massa ante, fermentum ultricies aliquet ut, posuere vitae est. Nullam vel augue id risus placerat tempor. Sed maximus tempor libero, eu laoreet ante vestibulum vel.</p><p>Curabitur euismod nisl nec leo pretium ultricies. Cras eget magna risus. Maecenas accumsan erat eget magna ullamcorper, ac vestibulum arcu malesuada. In laoreet efficitur augue, vitae accumsan tellus bibendum nec. Sed nec faucibus est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu lacus non turpis malesuada facilisis. Nam ac ex ut libero vehicula imperdiet elementum ac augue.</p>"
	},
	{
		name: "Shooting Stars",
		image: "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
		description: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec velit ut sapien facilisis vulputate. Praesent dictum augue non auctor congue. In eu ligula et metus auctor scelerisque. Vivamus posuere tellus vel placerat bibendum. Cras massa ante, fermentum ultricies aliquet ut, posuere vitae est. Nullam vel augue id risus placerat tempor. Sed maximus tempor libero, eu laoreet ante vestibulum vel.</p><p>Curabitur euismod nisl nec leo pretium ultricies. Cras eget magna risus. Maecenas accumsan erat eget magna ullamcorper, ac vestibulum arcu malesuada. In laoreet efficitur augue, vitae accumsan tellus bibendum nec. Sed nec faucibus est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu lacus non turpis malesuada facilisis. Nam ac ex ut libero vehicula imperdiet elementum ac augue.</p>"
	},
	{
		name: "Forest's Soul",
		image: "https://farm3.staticflickr.com/2311/2123340163_af7cba3be7.jpg",
		description: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nec velit ut sapien facilisis vulputate. Praesent dictum augue non auctor congue. In eu ligula et metus auctor scelerisque. Vivamus posuere tellus vel placerat bibendum. Cras massa ante, fermentum ultricies aliquet ut, posuere vitae est. Nullam vel augue id risus placerat tempor. Sed maximus tempor libero, eu laoreet ante vestibulum vel.</p><p>Curabitur euismod nisl nec leo pretium ultricies. Cras eget magna risus. Maecenas accumsan erat eget magna ullamcorper, ac vestibulum arcu malesuada. In laoreet efficitur augue, vitae accumsan tellus bibendum nec. Sed nec faucibus est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eu lacus non turpis malesuada facilisis. Nam ac ex ut libero vehicula imperdiet elementum ac augue.</p>"
	},
];

function seedDB() {
	Campground.remove({}, function(err) {
		if (err) {
			console.log(err);
		} else {
			// Add new Campgrounds
			data.forEach(function(seed) {
				Campground.create(seed, function(err, campground) {
					if (err) {
						console.log(err);
					} else {
						console.log("Campground added");
						// Create a comment
						Comment.create(
						{
							text: "This place is great, but I wish there was internet",
							author: "Homer"
						}, function(err, comment) {
							campground.comments.push(comment);
							campground.save();
							console.log("Created new comment");
						});
					}
				})
			});
		}
	});
}

module.exports = seedDB;