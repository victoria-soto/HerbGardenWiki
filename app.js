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

///////////////////Requests Targeting ALL Herbs /////////////////
// express chainable route handlers
app.route("/herbs")

  .get(function(req, res) {

    Herb.find(function(err, foundHerbs) {
      // log all herbs in console
      // console.log(foundHerbs);

      if (!err) {
        // send herbs to client in browser as JSON
        res.send(foundHerbs);
      } else {
        res.render(err);
      }

    });
  })

  .post(function(req, res) {

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
  })

  .delete(function(req, res) {
    Herb.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all herbs");
      } else {
        res.send(err);
      }
    });
  });


///////Requests Targeting a SINGLE Herb /////////
app.route("/herbs/:herbName")
  .get(function(req, res) {

    Herb.findOne({
      name: req.params.herbName
    }, function(err, foundHerb) {
      if (foundHerb) {
        res.send(foundHerb);
      } else {
        res.send("No herb matching that title was found.");
      }
    });
  })

  .put(function(req, res) {
    Herb.findOneAndUpdate({
        name: req.params.herbName
      }, {
        name: req.body.name,
        depth: req.body.depth,
        spacing: req.body.spacing,
        height: req.body.height,
        days_to_germ: req.body.days_to_germ,
        days_to_harvest: req.body.days_to_harvest,
        min_pot_diameter: req.body.min_pot_diameter
      }, {
        overwrite: true
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated herb.");
        } else {
          console.log(err);
        }
      }
    );
  })

  .patch(function(req, res) {

    // returns JS object of whatever client sent
    // console.log(req.body);

    Herb.findOneAndUpdate({
        name: req.params.herbName
      }, {
        $set: req.body
      },
      function(err) {
        if (!err) {
          res.send("Successfully updated herb.");
        } else {
          res.send(err);
        }
      }
    );
  })

  .delete(function(req, res) {
    Herb.findOneAndDelete({
        name: req.params.herbName
      },
      function(err) {
        if (!err) {
          res.send("Successfully deleted herb.");
        } else {
          res.send(err);
        }
      }
    );
  });

app.listen(3000, function(req, res) {
  console.log("Server up and running on port 3000");
});
