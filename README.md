# Herb Garden Wiki
The Herb Garden Wiki a RESTful API that contains an herb database using MongoDB.

## Add Herbs Database
Create wikiDB database, herbs collection, and a new document using [`insertMany`](https://docs.mongodb.com/manual/crud/) in the Mongo Shell.

```
use wikiDB
db.createCollection("herbs")
db.herbs.insertMany([{
    name: "Basil",
    depth: "1/4 in.",
    spacing: "10 in.",
    height: "18-24 in.",
    days_to_germ: "5-7",
    days_to_harvest: 80,
    min_pot_diameter: "12 in."
  }, {
    name: "Catnip",
    depth: "1/4 in.",
    spacing: "20 in.",
    height: "25-35 in.",
    days_to_germ: "8-12",
    days_to_harvest: 70,
    min_pot_diameter: "12 in."
  }, {
    name: "Chamomile",
    depth: "Do Not Cover",
    spacing: "6 in.",
    height: "20-30 in.",
    days_to_germ: "7-14",
    days_to_harvest: 80,
    min_pot_diameter: "12 in."
  },
  {
    name: "Peppermint",
    depth: "1/8-1/4 in.",
    spacing: "12 in.",
    height: "18 in.",
    days_to_germ: "12-16",
    days_to_harvest: 60,
    min_pot_diameter: "18 in."
  },
  {
    name: "Rosemary",
    depth: "1/4 in.",
    spacing: "12 in.",
    height: "16-24 in.",
    days_to_germ: "10-20",
    days_to_harvest: 85,
    min_pot_diameter: "12 in."
  }]
)
```

## Initialize NPM and Install NPM Packages
In another terminal inside a newly created HerbsWiki directory, initialize NPM and install dependencies.

```
npm init -y
npm install body-parser mongoose ejs express
```

## Set up Server
Set up the server in app.js to listen on port 3000.
```
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

app.listen(3000, function(req, res) {
  console.log("Server up and running on port 3000");
});

```

## Connect to MongoDB
Connect to the MongoDB using [MongooseODM](https://mongoosejs.com/).
```
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
```

### Define a Mongoose Schema and Model
Document fields for the herbs collection is defined using a [Mongoose Schema](https://mongoosejs.com/docs/guide.html#definition), then the schema is converted into a [Model](https://mongoosejs.com/docs/guide.html#model) so it can be used.

```
// Define a schema
const Schema = mongoose.Schema;

const herbSchema = new Schema({
  name: String,
  depth: String,
  spacing: String,
  height: String,
  days_to_germ: String,
  days_to_harvest: Number,
  min_pot_diameter: String
});

// Compile model from schema
const Herb = mongoose.model("Herb", herbSchema);

```

## RESTful API Implementation

<img src="/images/RestfulRouting.png" /><br>
