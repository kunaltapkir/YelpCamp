var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/yelp_camp", { useUnifiedTopology: true, useNewUrlParser: true });


app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


//Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//         name: "Granite Hill",
//         image: "https://images.pexels.com/photos/1743165/pexels-photo-1743165.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//         description: "This is a huge granite hill, no bathrooms, no water , beautiful granite!"

//     }, function(err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("New Campground Added");
//             console.log(campground);
//         }
//     }

// );


app.get("/", function(req, res) {
    res.render("landing");
});

//Index - show all campgrounds
app.get("/campgrounds", function(req, res) {
    // get all campgrounds from db
    Campground.find({}, function(err, allcampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { campgrounds: allcampgrounds });
        }
    });
});

//Create - add new campground to db
app.post("/campgrounds", function(req, res) {
    //get data from form and add to campground array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = { name: name, image: image, description: desc }
        //create new campground and save to db
    Campground.create(newCampground, function(err, newCreated) {
        if (err) {
            console.log(err);
        } else {
            //redirect back to campground page
            res.redirect("/campgrounds");
        }
    });
});

//New - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
    res.render("new");
});

//Show - shows moore info about one campground
app.get("/campgrounds/:id", function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", { campground: foundCampground });
        }
    });
});

app.listen(3000, '127.0.0.1', function(req, res) {
    console.log("The YelpCamp Server has Started !!!");
});