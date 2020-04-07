import * as Checks from '../functions/checks.js'
import * as Resource from '../../modules/Mines.js';
import * as Database from '../db_functions.js';
import * as Buildings from '../../modules/Buildings.js';
import { upgrades } from '../server.js';
import { default as Mongodb } from 'mongodb';

let ObjectId = Mongodb.ObjectId;



/**
 * Upgrades selected entity in selected colony for user
 * @param {*} upgradeId 
 * @param {*} upgradeLevel level to be upgraded to
 * @param {*} colonyId 
 * @param {*} username 
 * @returns upgraded or unupgraded colony
 */
export const upgrade = (upgradeId, upgradeLevel, colonyId, username) => new Promise( async (resolve, reject) => {
  let collection = "colony";
  let colonyQuery = { _id: new ObjectId(colonyId) };

  // Check if upgrading is allowed
  let check = await Checks.isUpgradeAllowed(upgradeId, upgradeLevel, colonyId, username);
  if (check[0]) {
    // Set updated level
    check[1][upgradeId] = upgradeLevel; 
    let buildings = check[1];
    try {
      // Find colony from database
      let colony = await Database.findDocumentFromDatabase("colony", colonyQuery);
      let time = new Date().getTime();
      let levelsArray = Object.entries(colony.buildings);

      // Mine levels for updated resource count
      levelsArray = [
        levelsArray[0][1],  //res1mine
        levelsArray[1][1],  //res2mine
        levelsArray[2][1],  //res3mine
      ];
      let currentResources = [
        colony.resource1,
        colony.resource2,
        colony.resource3
      ];

      // Update resources to be up to date before trying to upgrade
      let resources = Resource.updateResourcesFromProduction(levelsArray[0], levelsArray[1], 
                                                            levelsArray[2], colony.time, time);
      resources = [
        currentResources[0] + resources[0],
        currentResources[1] + resources[1],
        currentResources[2] + resources[2]
      ];
      console.log("Colony resources:",resources);

      // Upgrade costs resources
      let resourceCosts = Buildings.getBuildingUpgradeCost(upgradeId, upgradeLevel);
      console.log("Upgrade cost:", resourceCosts);
      if (resourceCosts === undefined) {
        console.log("getBuildingUpgradeCost bug");
      }
      // check cost
      resources = [
        resources[0] - resourceCosts[0],
        resources[1] - resourceCosts[1],
        resources[2] - resourceCosts[2]
      ]

      let upgradeStarted = upgradeStart(upgradeId, upgradeLevel, colonyId);
      console.log("-------------------------------------------------");

      // Return new colony information to the calling function
      resolve(colony);
      return;
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Upgrade not allowed!");
  }
})



/**
 * Finish the started upgrade with "upgrades" DB table
 * @param {*} upgradeId upgradeId or name
 * @param {*} colonyId 
 */
export const upgradeFinish = async (upgradeId, colonyId) => {
  try {
    let upgradeQuery = { colony: new ObjectId(colonyId) };
    let upgrade = await Database.findDocumentFromDatabase("upgrades", upgradeQuery);
  
    let colonyQuery = { _id : new ObjectId(colonyId) };
    let colony = await Database.findDocumentFromDatabase("colony", colonyQuery);
    
    // Update resources to be up to date
    let currentResources = [
      colony.resource1,
      colony.resource2,
      colony.resource3
    ];
    let levelsArray = Object.entries(colony.buildings);
    // Mine levels for updated resource count
    levelsArray = [
      levelsArray[0][1],  //res1mine
      levelsArray[1][1],  //res2mine
      levelsArray[2][1],  //res3mine
    ]
    // With old levels
    let resources = Resource.updateResourcesFromProduction(levelsArray[0], levelsArray[1], 
      levelsArray[2], colony.time, upgrade.time);
      resources = [
        currentResources[0] + resources[0],
        currentResources[1] + resources[1],
        currentResources[2] + resources[2]
      ];
      
    colony.buildings[upgradeId] = upgrade.level; // set new level
    let buildings = colony.buildings;
    colony = await Database.findAndUpdateFromDatabase("colony", colonyQuery, 
    {
      $set: {
        time: upgrade.time,
        resource1: resources[0],
        resource2: resources[1],
        resource3: resources[2],
        buildings
      }
    });

    await Database.removeDocumentFromDatabase("upgrades", upgradeQuery);
    console.log("UPGRADE FINISHED:", colony);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}



/**
 * Starts the upgrade
 * @param {*} upgradeId 
 * @param {*} upgradeLevel 
 * @param {*} colonyId 
 * @returns Boolean telling if upgrade started or not
 */
const upgradeStart = async (upgradeId, upgradeLevel, colonyId) => {
  try {
    let timeToUpgrade = Buildings.getTimeConsumptionOnBuildingUpgrade(upgradeId, upgradeLevel);
    console.log("TIME TO UPGRADE:", timeToUpgrade);
  
    // Saved to DB so not removed when server crashes or restarts.
    let upgradeNotice = {
      colony: new ObjectId(colonyId),
      name: upgradeId,
      level: upgradeLevel,
      time: new Date().getTime() + timeToUpgrade
    }
    await Database.insertDocumentIntoDatabase("upgrades", upgradeNotice);
    console.log(upgradeNotice);
    upgrades = await Database.getClosestUpgrades(600); // Global variable const????
    return true;
  } catch (e) {
    console.log("CANT START UPGRADE", e)
    return false;
  }
}