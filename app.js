const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require("https");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.render("Home", {});
})

app.get("/news", (req, res)=>{
    res.render("news", {});
})


app.listen(4000, ()=>{
    console.log("listening");
})