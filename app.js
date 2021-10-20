/*jshint esversion: 6 */

// Import node libraries
const ejs = require("ejs");
const bodyParser = require("body-parser");

// Set up express application object
const express = require("express");
const app = express();

// Use EJS template engine
app.set('view engine', 'ejs');

// Parses urlencoded bodies, body object returns key-value pair of anytype when extended true
app.use(bodyParser.urlencoded({
  extended: true
}));

// Serve static files in public directory
app.use(express.static("public"));

// Import the mongoose module
const mongoose = require("mongoose");

// Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/wikiDB";
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//  Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// Define a schema
const Schema = mongoose.Schema;

const herbSchema = new Schema({
  title: String,
  depth: String,
  spacing: String,
  height: String,
  days_to_germ: String,
  days_to_harvest: String,
  min_pot_diameter: String
});

// Compile model from schema
const Herb = mongoose.model("Herb", herbSchema);

// create get route to fetch articles
app.get("/herbs", function(req, res) {

  Herb.find(function(err, foundHerbs) {
    // log all articles in console
     // console.log(foundHerbs);

    if (!err) {
      // send articles to client in browser as JSON
      res.send(foundHerbs);
    } else {
      res.render(err);
    }
  });
});

app.get("/", function(req, res){
  res.send("Hello catnip!");
});


app.listen(3000, function(req, res) {
  console.log("Server up and running on port 3000");
});
