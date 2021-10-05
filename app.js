//all modules
import fetch from "node-fetch";
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import _ from "lodash";

// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const https = require("https");

//All api data

let latest_data;
let politics_data;
let business_data;
let sports_data;
let science_data;
let technology_data;
let startup_data;
let entertainment_data;
let automobile_data;


//Js render scripts

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
    res.render("news", {ejs_section_name : _.startCase(_.toLower(category))});
})


app.listen(4000, ()=>{
    console.log("listening");
})


//Fetching data

var fetched_data = []; 
const urls = ["https://inshortsapi.vercel.app/news?category=national"];
let link = "https://inshortsapi.vercel.app/news?category=";

urls.push(link + "politics");
urls.push(link + "business");
urls.push(link + "sports");
urls.push(link + "science");
urls.push(link + "technology");
urls.push(link + "startup");
urls.push(link + "entertainment");
urls.push(link + "automobile");


const all_category = ["latest_data", "politics_data", "business_data", "sports_data", "science_data", 
                "technology_data", "startup_data", "entertainment_data", "automobile_data"];

for(var i=0; i<9; i++){
    fetch(urls[i])
    .then((res)=>{
        return res.json();
    })
    .then((data)=>{

        fetched_data.push(data)
        console.log(fetched_data);
    })
    .catch((err)=>{
        console.log(err);
    })
};




console.log(latest_data);

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