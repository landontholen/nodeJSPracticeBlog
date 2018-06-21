var bodyParser = require("body-parser"),
    expressSanitizer = require("express-sanitizer"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express(); 

//First time you connect to the database it will create the database under the following name
mongoose.connect("mongodb://localhost/restfulpractice"); 

app.set("view engine", "ejs"); 
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended: true})); 
app.use(expressSanitizer()); 
app.use(methodOverride("_method")); 

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
}); 

var Blog = mongoose.model("Blog", blogSchema); 

//Blog.create({
//    title: "BMW Blog",
//    image: "https://pixabay.com/get/ee33b90920fc1c22d2524518b7444795ea76e5d004b014439df9c670a7eeb5_340.jpg",
//    body: "Sexy cars"
//});

// RESTful Routes

app.get("/", function(req, res){
    res.redirect("/blogs"); 
}); 

// INDEX 
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("Error!"); 
        } else { 
            res.render("index", {blogs, blogs}); 
        } 
    }); 
}); 

// NEW 
app.get("/blogs/new", function(req, res){
    res.render("new"); 
}); 

// CREATE
app.post("/blogs", function(req, res){
    //Create the new blog in the database
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            console.log(err); 
            res.render("new"); 
        } else {
            //After succcessful creation redirect
            res.redirect("/blogs"); 
        }
    });
}); 

// SHOW 
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err); 
            res.redirect("/blogs"); 
        } else {
            res.render("show", { blog: foundBlog });
        } 
    }); 
}); 

// EDIT
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err); 
            res.redirect("/blogs"); 
        } else {
            res.render("edit", { blog: foundBlog }); 
        }
    }); 
}); 

// UPDATE 
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, udpatedBlog){
        if(err){
            console.log(err); 
            res.redirect("/blogs"); 
        } else {
            res.redirect("/blogs/" + req.params.id); 
        } 
    }); 
}); 

// DESTROY
app.delete("/blogs/:id/", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err); 
            res.redirect("/blogs"); 
        } else {
            res.redirect("/blogs"); 
        }
    }); 
}); 

//app.listen(process.env.PORT, process.env.IP, function(){
app.listen(3000, ()=> console.log("The server has started."))   
