"use strict";
const DB = require('./db.js');
const ServerHelper = require('./server_functions.js');
const express = require('express')
const app = express()
const port = process.env.PORT || 8080;

var buildings = [];
var tech = [];



/*
* Starts connection to db and listens to port
*/
DB.initDb( async () => {
  let buildingIds = await ServerHelper.addBuildingsToDb();
  buildings = await Promise.all(buildingIds.map(( async (buildingId) => {
    let b = await ServerHelper.isUpgradeInDb(buildingId);
    return b[0];
  })))
  console.log("Loaded buildings into memory!");

  app.listen(port, () => console.log(`Listening on port ${port}`));
})



/*
* Routing and headers for connections
*/
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update '*'' match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.use(express.urlencoded());
app.use(express.json());


/*
* POST Login / Register
*/
app.post('/login', async (req, res) => {
  var username = req.body.username;
  
  console.log('--------------------------------------------------------------------------------------------');
  console.log(`${port} ` + "Address: "+ '/login' + ' POST');
  console.log(req.body);
  
  // Login / Create account with given username
  try {
    var user = await ServerHelper.login(username);
  } catch (error) {
    console.log(error);
  }
  user.push(buildings);
  res.send(JSON.stringify(user));
})


/*
* POST Upgrade
*/
app.post('/building', async (req, res) => {
  var username = req.body.username;
  var upgradeId = req.body.upgradeId;
  var upgradeLevel = req.body.upgradeLevel
  var colonyId = req.body.colonyId;
  
  console.log('--------------------------------------------------------------------------------------------');
  console.log(`${port} ` + "Address: "+ '/building' + ' POST');
  console.log(req.body);
  
  try {
    var upgradedColony = await ServerHelper.upgrade(upgradeId, upgradeLevel, colonyId, username);
  } catch (error) {
    console.log(error);
  }
  
  // Upgrade the entity if costs are matched
  res.send(JSON.stringify(upgradedColony)); // PLACEHOLDER
})