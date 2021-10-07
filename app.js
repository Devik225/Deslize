//all modules
import fetch from "node-fetch";
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import _ from "lodash";
import request from "request";
import https from "https";

// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const https = require("https");

//All api data

var fetched_data = []; 


//Js render scripts---------------------------------------------------------------------

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


//Home Page

app.get("/", (req, res)=>{

    let data_latest;
    let data_politics;
    let data_business;

    fetched_data.forEach((data)=>{
        if(data.category === "all"){
            data_latest = data;
        }
        else if(data.category === "politics"){
            data_politics = data;
        }
        else if(data.category === "business"){
            data_business = data;
        }
    });

    res.render("Home", {
        ejs_latest_data : data_latest,
        ejs_politics_data : data_politics,
        ejs_business_data : data_business
    });
})

//News Page

app.get("/:category_name", (req, res)=>{
    const category = req.params.category_name;
    let category_data = "error";

    fetched_data.forEach((data)=>{
        if(data.category === category || data.category === "all" && category === "latest"){
            // console.log(data.category);
            category_data = data;
        }
    });
    // console.log(fetched_data[1].category);

    if(category_data == "error"){
        res.render("error", {});
    }
    else{
        res.render("news", {
            ejs_section_name : _.startCase(_.toLower(category)),
            ejs_data : category_data
        });
    }

})


//Post Page

app.post("/", (req, res)=>{
    let name = req.body.user_name;
    let email = req.body.user_email;
    let phone = req.body.user_phone;
    let interest = req.body.user_interest;
    
    const data = {
        members:[
            {
                email_address : email,
                status : "subscribed",
                merge_fields : {
                    FNAME : name,
                    PHONE : phone,
                    INTEREST : interest
                },
                
            }
        ]
    }
    
    const json_data = JSON.stringify(data);
    
    var url = "https://us5.api.mailchimp.com/3.0/lists/930cb7714e";

    const options = {
        method : "POST",
        auth : "devik1:d10a86d64e3e00e3f973941d1159a1a4-us5"
    }
    
    const request = https.request(url, options, (response)=>{
        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        })
    })

    request.write(json_data);
    request.end();

    res.redirect("/");
    
})

// var PORT = 

app.listen(4000, ()=>{
    console.log("listening");
})



//Fetching data-------------------------------------------------------------------------------------------------

const urls = ["https://inshortsapi.vercel.app/news?category=all"];
let link = "https://inshortsapi.vercel.app/news?category=";

urls.push(link + "politics");
urls.push(link + "business");
urls.push(link + "sports");
urls.push(link + "science");
urls.push(link + "technology");
urls.push(link + "startup");
urls.push(link + "entertainment");
urls.push(link + "automobile");


for(var i=0; i<9; i++){
    fetch(urls[i])
    .then((res)=>{
        return res.json();
    })
    .then((data)=>{

        fetched_data.push(data)
        // console.log(fetched_data);
    })
    .catch((err)=>{
        console.log(err);
    })
};


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

//Mailchimp

//Audience id
//d10a86d64e3e00e3f973941d1159a1a4-us5

//audience key
// 930cb7714e