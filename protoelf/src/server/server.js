import * as DB from './db.js';
import * as Obj from '../modules/Objects.js';
import express from 'express';
import bodyParser from 'body-parser';
import * as DBFunction from './db_functions.js';
import { upgradeFinish } from './functions/upgrade.js';

import { loginRoute } from './routing/login.js';
import { buildingRoute } from './routing/building.js';
//import { techRoute } from './routing/tech.js';
//import { fleetRoute } from './routing/fleet.js';

const app = express();
const port = process.env.PORT || 8080;

export var buildings = [];
var upgrades = [];
const setUpgrades = (array) => {
  upgrades = array;
}

export {upgrades, setUpgrades};
export var tech = [];


/*
* Starts connection to db and listens to port
*/
DB.initDb( async () => {
  buildings = Obj.buildingEquations;

  upgrades = await DBFunction.getClosestUpgrades(600); // 10min upgrades
  if (upgrades.length !== 0) {
    for (let i = 0; i < upgrades.length; i++) {
      if (upgrades[i].time < new Date().getTime()) {
        let success = upgradeFinish(upgrades[i].name, upgrades[i].colony);
        if (success) {
          upgrades.splice(i, 1);
        }
      }
    }
  }
  console.log(upgrades);
  console.log("FETCHED UPGRADES", upgrades);

  // Timer to fetch upgrades at intervals
  setAsyncInterval(async () => {
    upgrades = await DBFunction.getClosestUpgrades(600); // 10min upgrades
    if (upgrades.length !== 0) {
      for (let i = 0; i < upgrades.length; i++) {
        if (upgrades[i].time < new Date().getTime()) {
          let success = upgradeFinish(upgrades[i].name, upgrades[i].colony);
          if (success) {
            upgrades.splice(i, 1);
          }
        }
      }
    }
    console.log("FETCHED UPGRADES", upgrades);
  }, 10000)

  console.log(buildings);
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


const asyncIntervals = [];

const runAsyncInterval = async (cb, interval, intervalIndex) => {
  await cb();
  if (asyncIntervals[intervalIndex]) {
    setTimeout(() => runAsyncInterval(cb, interval, intervalIndex), interval);
  }
};

const setAsyncInterval = (cb, interval) => {
  if (cb && typeof cb === "function") {
    const intervalIndex = asyncIntervals.length;
    asyncIntervals.push(true);
    runAsyncInterval(cb, interval, intervalIndex);
    return intervalIndex;
  } else {
    throw new Error('Callback must be a function');
  }
};

const clearAsyncInterval = (intervalIndex) => {
  if (asyncIntervals[intervalIndex]) {
    asyncIntervals[intervalIndex] = false;
  }
};