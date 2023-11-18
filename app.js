const express = require('express');
const bodyParser = require("body-parser")
const { write } = require('fs');
// const https = require('https');
const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('public'))

var items = [];
var workItems = [];

app.get("/", (req, res) => {
   
    var today = new Date();

    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }

    var day = today.toLocaleDateString("en-US", options)
 
    res.render('list', {
        listTitle: day,
        items: items,
    })

})

app.post("/", (req, res) => {
    var item = req.body.addItem;


    if(req.body.list==="Work"){ //look at the button in list.ejs
        workItems.push(item);
        res.redirect("/work")
    }
    else{
        items.push(item)
        res.redirect("/")
    }

    
})

app.get("/work", (req, res) => {

    res.render('list', {
        listTitle: "Work List",
        items: workItems,

    })
})

// app.post("/work", (res, req) => {
//     var item = req.body.addItem;

//     workItems.push(item)

//     console.log(item)

//     res.redirect("/work")
// })

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })