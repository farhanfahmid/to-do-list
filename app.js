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
        day: day,
        items: items,
        
    })

})

app.post("/", (req, res) => {
    var item = req.body.addItem;

    items.push(item)

    console.log(item)

    res.redirect("/")
})




















app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })