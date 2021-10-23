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
    days_to_harvest: "80",
    min_pot_diameter: "12 in."
  }, {
    name: "Catnip",
    depth: "1/4 in.",
    spacing: "20 in.",
    height: "25-35 in.",
    days_to_germ: "8-12",
    days_to_harvest: "70",
    min_pot_diameter: "12 in."
  }, {
    name: "Chamomile",
    depth: "Do Not Cover",
    spacing: "6 in.",
    height: "20-30 in.",
    days_to_germ: "7-14",
    days_to_harvest: "80",
    min_pot_diameter: "12 in."
  },
  {
    name: "Peppermint",
    depth: "1/8-1/4 in.",
    spacing: "12 in.",
    height: "18 in.",
    days_to_germ: "12-16",
    days_to_harvest: "60",
    min_pot_diameter: "18 in."
  },
  {
    name: "Rosemary",
    depth: "1/4 in.",
    spacing: "12 in.",
    height: "16-24 in.",
    days_to_germ: "10-20",
    days_to_harvest: "85",
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
  days_to_harvest: String,
  min_pot_diameter: String
});

// Compile model from schema
const Herb = mongoose.model("Herb", herbSchema);

```

## RESTful API
REST stands for Representation State Transfer which means that a representation of the state of the resource (pieces of information such as a name, address, phone number, etc.) gets transferred between client and server in a JSON or XML format. This architectural style of APIs conforms to six constraints which are: having a uniform interface, stateless, client-server, cacheable, layered-system, code on demand.

### Uniform Interface
An interface is defined between client and server using HTTP verbs (GET, POST, PUT, PATCH, DELETE), URIs (resource name), and an HTTP response (status, body).

<img src="/images/RestfulRouting.png" /><br>

### Stateless
The server contains no client state—each request has enough information for the server to process the message. Any session state that does exists is only held on the client side.

### Client-Server
Assumes a disconnected system so the client may not always have access to a database.

### Cacheable
Server responses are cacheable.

### Layered-System
RESTful architecture could have multiple layers of software so the client may not know if they're interacting directly with a database or something that's been cached.

### Code on Demand
From a RESTful service standpoint, this means that the server can temporarily extend to the client by transferring logic to the client—for example, sending executable JavaScript snippets. Code on demand is the only optional constraint of the six that makeup the RESTful architectural style.

## RESTful Implementation
The following demonstrates the usage of the HTTP verbs GET, POST, PUT, PATCH, and DELETE for the herb wikiDB.

### GET
A get route was created to fetch all of the herbs that were previously added in the database in the Mongo Shell using [`insertMany`](https://mongoosejs.com/docs/api.html#model_Model.insertMany).

<img src="/images/get.png" /><br>
```
// create get route to fetch herbs
app.get("/herbs", function(req, res) {
  Herb.find(function(err, foundHerbs) {
    if (!err) {

      // send articles to client in browser as JSON
      res.send(foundHerbs);
    } else {
      res.render(err);
    }
  });
});

```
After starting up the server using [nodemon](https://www.npmjs.com/package/nodemon), the herbs can be viewed nicely formatted as a JSON with the Google Chrome extension [JSON Viewer Pro](https://chrome.google.com/webstore/detail/json-viewer-pro/eifflpmocdbdmepbjaopkkhbfmdgijcc?hl=en-US).

<img src="/images/herbsRoute.png" /><br>


### POST
When a user makes a post request to the herbs route, a new herb will be inserted into the collection of the wikiDB. For RESTful APIs, a post request must be made to a collection of resources (in this case, the herbs route) rather than a specific resource (for example /herbs/basil) by convention.

<img src="/images/post.png" /><br>

The client will be sending this data to the server without a front-end using the [Postman](https://www.postman.com/downloads/) App. Within the app, information about the herb terragon was entered.

<img src="/images/postman.png" /><br>

```
app.post("/herbs", function(req, res){
  console.log(req.body.name, req.body.depth, req.body.spacing, req.body.height, req.body.days_to_germ, req.body.days_to_harvest, req.body.min_pot_diameter);

});
```

<img src="/images/postmanTerminal.png" /><br>

This confirms that the client can use Postman to post data about new herbs so now code can be added to the post request to save that data into the MongoDB using Mongoose.

```
app.post("/herbs", function(req, res) {
  // console.log(req.body.name, req.body.depth, req.body.spacing, req.body.height, req.body.days_to_germ, req.body.days_to_harvest, req.body.min_pot_diameter);

  const newHerb = new Herb({
    name: String,
    depth: String,
    spacing: String,
    height: String,
    days_to_germ: String,
    days_to_harvest: String,
    min_pot_diameter: String
  });
  newHerb.save(function(err) {
    if (!err) {
      res.send("Successfully added a new herb.");
    } else {
      console.log(err);
    }
  });
});
```

Using [Robo 3T GUI](https://robomongo.org/) confirms that the new herb, terragon, was stored into the MongoDB via Postman.

### DELETE
When a client sends an HTTP DELETE request to the /herbs route, all of the herbs will get deleted from the herbs collection.

<img src="/images/delete.png" /><br>

The method [`deleteMany`](https://mongoosejs.com/docs/api.html#model_Model.deleteMany), is used to delete all herbs from the collection.

```
app.delete("/herbs", function(req,res){
  Herb.deleteMany(function(err){
    if(!err){
      res.send("Successfully deleted all herbs");
    } else {
      res.send(err);
    }
  });
});

```

Successful implementation of the `deleteMany` Mongoose method using the HTTP verb `delete` can be tested using Postman.

<img src="/images/postmanDelete.png" /><br>

### PUT
<img src="/images/put.png" /><br>


### PATCH
<img src="/images/patch.png" /><br>
