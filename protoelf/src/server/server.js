import * as ServerHelper from './server_functions.js';
import * as Database from './db_functions.js';
import * as DB from './db.js';
import express from 'express';
import bodyParser from 'body-parser';

import { loginRoute } from './routing/login.js';
import { buildingRoute } from './routing/building.js';
//import { techRoute } from './routing/tech.js';
//import { fleetRoute } from './routing/fleet.js';

const app = express();
const port = process.env.PORT || 8080;

export var buildings = [];
var tech = [];


/*
* Starts connection to db and listens to port
*/
DB.initDb( async () => {
  let buildingIds = await Database.addBuildingsToDb();
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
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update '*'' match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
}, [loginRoute, buildingRoute]);

/* ??????????????????????????? /*
app.use('/login', loginRoute);
app.use('/building', buildingRoute);
app.use('/tech', techRoute);
app.use('/fleet', fleetRoute);
*/
