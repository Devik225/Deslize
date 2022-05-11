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
const m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]; 

const month = new Map();
for(var i=0; i<12; i++){
    month.set(m[i], i);
};


//Js render scripts---------------------------------------------------------------------

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


//Home Page

collect_data();

app.get("/", (req, res)=>{
    collect_data();   

    let data_latest = "empty";
    let data_politics = "empty";
    let data_business = "empty";

    fetched_data.forEach((data)=>{
        if(data.category === "all"){
            data_latest = data;
            // data_latest.data.time.sort();
        }
        else if(data.category === "politics"){
            data_politics = data;
        }
        else if(data.category === "business"){
            data_business = data;
        }
    });


    if(data_latest === "empty" || data_politics === "empty" || data_business === "empty"){
        res.render("error", {});
    }
    else{
        
        // data_latest.data.sort((a, b) => (a.date < b.date) ? 1 : (a.date === b.date) ? ((a.time > b.time) ? 1 : -1) : -1);
        // data_latest.data.sort((a, b) => (a.date < b.date) ? 1 : (a.date === b.date) ? ((a.time.slice(6, 8) < b.time.slice(6, 8)) ? 1 : -1) : -1);
        // data_latest.data.sort((a, b) => (month.get(a.date.slice(3, 6)) < month.get(b.date.slice(3, 6))) ? 1 : (month.get(a.date.slice(3, 6)) === month.get(b.date.slice(3, 6))) ? 1 : -1);
        

        // data_politics.data.sort((a, b) => (a.date < b.date) ? 1 : (a.date === b.date) ? ((a.time > b.time) ? 1 : -1) : -1);
        // data_politics.data.sort((a, b) => (a.date < b.date) ? 1 : (a.date === b.date) ? ((a.time.slice(6, 8) < b.time.slice(6, 8)) ? 1 : -1) : -1);
        // data_politics.data.sort((a, b) => (month.get(a.date.slice(3, 6)) < month.get(b.date.slice(3, 6))) ? 1 : (month.get(a.date.slice(3, 6)) === month.get(b.date.slice(3, 6))) ? 1 : -1);


        // data_business.data.sort((a, b) => (a.date < b.date) ? 1 : (a.date === b.date) ? ((a.time > b.time) ? 1 : -1) : -1);
        // data_business.data.sort((a, b) => (a.date < b.date) ? 1 : (a.date === b.date) ? ((a.time.slice(6, 8) < b.time.slice(6, 8)) ? 1 : -1) : -1);
        // data_business.data.sort((a, b) => (month.get(a.date.slice(3, 6)) < month.get(b.date.slice(3, 6))) ? 1 : (month.get(a.date.slice(3, 6)) === month.get(b.date.slice(3, 6))) ? 1 : -1);



        setTimeout(() => {
            res.render("Home", {
                ejs_latest_data : data_latest,
                ejs_politics_data : data_politics,
                ejs_business_data : data_business
            });
        }, 1000);
        
    }

    

    
})

//News Page

app.get("/:category_name", (req, res)=>{
    collect_data();
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

        //sorting data
        // category_data.data.sort((a, b) => (a.date < b.date) ? 1 : (a.date === b.date) ? ((a.time > b.time) ? 1 : -1) : -1);
        // category_data.data.sort((a, b) => (a.date < b.date) ? 1 : (a.date === b.date) ? ((a.time.slice(6, 8) < b.time.slice(6, 8)) ? 1 : -1) : -1);
        // category_data.data.sort((a, b) => (month.get(a.date.slice(3, 6)) < month.get(b.date.slice(3, 6))) ? 1 : (month.get(a.date.slice(3, 6)) === month.get(b.date.slice(3, 6))) ? 1 : -1);

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

    console.log(name);
    
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





//Fetching data-------------------------------------------------------------------------------------------------


function collect_data(){

    // https://inshortsv2.vercel.app/news?type=all_news&limit=30
    const urls = ["https://inshorts-news.vercel.app/all"];
    let link = "https://inshorts-news.vercel.app/";

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
            res.redirect("error", {});
        })
    };

}


app.listen(process.env.PORT || 4040, ()=>{
    console.log("listening");
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

//Mailchimp

// fcaebe6af64bb7ab081de4043c7dc249-us5

//Audience id
//d10a86d64e3e00e3f973941d1159a1a4-us5

//audience key
// 930cb7714e