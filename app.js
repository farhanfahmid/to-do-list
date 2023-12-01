const express = require('express');
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const { write } = require('fs');
const { name } = require('ejs');
const _ = require("lodash")

// const https = require('https');

const date = require(__dirname + "/date.js")

const app = express()
const port = 3000

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static('public'))

// let day = date();


//create mongoose database
mongoose.connect("mongodb://localhost:27017/todolistDB")


//create schema for the database
const itemSchema = new mongoose.Schema (
   {
    name: String
   }
)
  
//create model "Item"
const Item = mongoose.model("Item", itemSchema)

//create documents 
const item1 = new Item({
    name: "Welcome to your To-Do-List"
})

const item2 = new Item({
    name: "Hope you have a great day!"
})

//create an array of default items
const defaultItems = [item1, item2]

const day = date()

// var items = [];
// var workItems = [];

app.get("/", (req, res) => {

    //extract the items and put them in foundItems, render foundItems as "items" on list.ejs (check this file for some stuff, line 18 prolly)
    Item.find({}, "name")
    .then((foundItems) => {
        console.log(foundItems);

        // let day = gettheDate();


        if(foundItems.length === 0){
            //insert defaultItems array into the Item model
            Item.insertMany(defaultItems)
            .then(() => {
                console.log("Successful")
            })
            .catch((error) => {
                console.log("Error faced")


        res.redirect("/")
})
        }
        else{
            //this render function must be inside the scope of the Model.find function to get passed the foundItems array
            res.render('list', {
                listTitle: day,
                items: foundItems,
            })
        }
  
    })
    .catch((error) => {
        console.log("Error faced")
    })
   

})

app.post("/", (req, res) => {

    const itemName = req.body.addItem;

    const listName = req.body.list; //check the button code in list.ejs if you don't get it

    const item = new Item({
        name: itemName
    })

    //when the + button is clicked, check if the name of the list to which the item is being added is a "day" or a custom list made by the user

    if(listName === day){

        item.save();
        res.redirect("/")

    }
    else{
        //find the name of the custom list from the List model
        List.findOne({name: listName})
            //store the custom list in the foundList variable
            .then((foundList) => {
                foundList.items.push(item) //tap into the items of the custom list and push in the new item given by the user
                foundList.save();
                res.redirect("/" + listName) //redirect to the page rendering the custom list
            })
            .catch((error) => {
                console.log("Error")
            })
    }

    console.log(listName)
    console.log(day)

})

//for deleting items
app.post("/delete", (req, res) => {

    console.log(req.body.checkbx)

    const checkedItemID = req.body.checkbx;

    const hiddenListName = req.body.hiddenListName;

    if(hiddenListName == day) {
        Item.deleteOne({ _id:  checkedItemID})
        .then(() => {
            console.log("Successfully deleted")
            res.redirect("/")
        })
        .catch((error) => {
            console.log("Error")
        })
    }
    else{
        List.findOneAndUpdate(
            {
                name: hiddenListName
            },
            {
                $pull: { items: {_id: checkedItemID} } //pull the document with _id: checkedItemID from the array called "items"
            },
        )
            .then(()=>{
                console.log("Successfull pulling " + hiddenListName)
                res.redirect("/" + hiddenListName)
            })
            .catch((error) => {
                console.log("Error")
            })
    }
   
})



//defining new schema, model, and documents for dynamic routes

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List", listSchema)


//defining new dynamic routes
app.get("/:customListName", (req, res) => {

    console.log(req.params.customListName)

    const customListName = _.capitalize(req.params.customListName)

    //first check if a custom list by that same name already exists
    List.findOne({name: customListName})
        .then((foundList) => {
            //if it does, then just render that list
            res.render("list.ejs", {
                listTitle: customListName,
                items: foundList.items
            })
        })
        .catch((error) => {
            
            //if not, then create the new custom list document 
            const list = new List({
                name: customListName,
                items: defaultItems
            })

            list.save();
            res.redirect("/" + customListName)
        })

})


app.get("/about", (req, res) => {
    res.render('about')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })







