// https://expressjs.com/en/guide/routing.html


// REQUIRES
const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");

// just like a simple web server like Apache web server
// we are mapping file system paths to the app's virtual paths
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
app.use("/font", express.static("./public/font"));

app.get("/", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/index.html", "utf8");
    res.send(doc);
});

app.get("/signup", function(req, res) {
    let doc = fs.readFileSync("./public/signup.html", "utf8");
    res.send(doc);
});

app.get("/index", function(req, res) {
    let doc = fs.readFileSync("./public/index.html", "utf8");
    res.send(doc);
});

app.get("/login", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/login.html", "utf8");
    res.send(doc);
});

app.get("/main", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/main.html", "utf8");
    res.send(doc);
});

app.get("/nav_before_login", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/nav_before_login.html", "utf8");
    res.send(doc);
});

app.get("/nav_after_login", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/nav_after_login.html", "utf8");
    res.send(doc);
});

app.get("/footer", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/footer.html", "utf8");
    res.send(doc);
});

app.get("/reminder", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/reminder.html", "utf8");
    res.send(doc);
});

app.get("/task", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/task.html", "utf8");
    res.send(doc);
});

app.get("/create", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/create.html", "utf8");
    res.send(doc);
});

app.get("/profile", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/profile.html", "utf8");
    res.send(doc);
});

app.get("/invite", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/invite.html", "utf8");
    res.send(doc);
});

app.get("/group", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/group.html", "utf8");
    res.send(doc);
});

app.get("/notification", function(req, res) {
    //console.log(process.env);
    // retrieve and send an HTML document from the file system
    let doc = fs.readFileSync("./public/notification.html", "utf8");
    res.send(doc);
});

app.ger

// for resource not found (i.e., 404)
app.use(function (req, res, next) {
    // this could be a separate file too - but you'd have to make sure that you have the path
    // correct, otherewise, you'd get a 404 on the 404 (actually a 500 on the 404)
    res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});



// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log("Example app listening on port " + port + "!");

});
