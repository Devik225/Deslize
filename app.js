//all modules
import fetch from "node-fetch";
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";

// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const https = require("https");


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", (req, res)=>{
    res.render("Home", {});
})

app.get("/:category_name", (req, res)=>{
    const category = req.params.category_name;
    console.log(category);
    res.render("news", {});
})


app.listen(4000, ()=>{
    console.log("listening");
})


//Fetching data

const url = "https://inshortsapi.vercel.app/news?category=national";
fetch(url)
.then((res)=>{
    return res.json();
})
.then((data)=>{
    console.log(data);
})
.catch((err)=>{
    console.log(err);
})


//API -------------------------------------------------------------------------------------------------------------------------
// https://inshortsapi.vercel.app/news?category=all

//Categories

// latest
// business
// sports
// politics
// technology
// startup
// entertainment
// science
// automobile