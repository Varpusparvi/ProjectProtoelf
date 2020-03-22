import express from 'express';
import * as ServerHelper from '../server_functions.js';
const router = express.Router();


// middleware that is specific to this router
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update '*'' match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log('Time: ', Date.now())
  next()
})

// define the home page route
router.post('/building',  async (req, res) => {
  console.log('--------------------------------------------------------------------------------------------');
  console.log("Address: "+ '/building' + ' POST');
  console.log(req.body);
  var username = req.body.username;
  var upgradeId = req.body.upgradeId;
  var upgradeLevel = req.body.upgradeLevel
  var colonyId = req.body.colonyId;
  
  // Upgrade a colony
  try {
    var upgradedColony = await ServerHelper.upgrade(upgradeId, upgradeLevel, colonyId, username);
  } catch (error) {
    console.log(error);
  }
  
  // Upgrade the entity if costs are matched
  res.send(JSON.stringify(upgradedColony)); // PLACEHOLDER
})

export { router as buildingRoute };