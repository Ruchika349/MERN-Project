var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
  name: String,
  reminderTime: String,  // Example: "10:00 AM"
  notificationMethod: String,
};

const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({ name: "Coding" });
const item2 = new Item({ name: "Meditate" });
const item3 = new Item({ name: "Gym" });

const d = [item1, item2, item3];

const reminders = require("./reminders");


app.get("/", async (req, res) => {
  try {
    const items = await Item.find({}).exec();

    if (items.length === 0) {
      await Item.insertMany(d);
      console.log("Successfully saved items to the database");
      res.redirect("/");
    } else {
      // Call the scheduleReminders function from the reminders module
      reminders.scheduleReminders(items);

      res.render("list", { newListItem: items });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



app.post("/", function (req, res) {
  i = req.body.n;
  const item = new Item({
    name: i,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  
  Item.findOneAndDelete({ _id: checkedItemId })
    .then(result => {
      if (result) {
        console.log("Successfully deleted");
        res.redirect("/");
      } else {
        console.log("Item not found");
        res.redirect("/");
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

app.post("/", function (req, res) {
  const newItem = new Item({
    name: req.body.name,
    reminderTime: req.body.reminderTime,
    notificationMethod: req.body.notificationMethod,
  });
  newItem.save();
  res.redirect("/");
});

app.post("/", function (req, res) {
  const newItem = new Item({
    name: req.body.name,
    reminderTime: req.body.reminderTime || "12:00 PM",  // default
    notificationMethod: req.body.notificationMethod,
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  });

  newItem.save()
    .then(result => {
      console.log('Successfully added a new item:', result);
      res.redirect("/");
    })
    .catch(error => {
      console.error('Error adding a new item:', error);
      res.status(500).send('Internal Server Error');
    });
});



app.listen(3000, function () {
  console.log("listening on port 3000.");
});