import * as Checks from '../functions/checks.js'
import * as Resource from '../../modules/Mines.js';
import * as Database from '../db_functions.js';
import * as Buildings from '../../modules/Buildings.js';
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
      let levelsArray = Object.entries(colony.buildings);
      let time = new Date().getTime();

      // Mine levels for updated resource count
      levelsArray = [
        levelsArray[0][1],
        levelsArray[1][1],
        levelsArray[2][1],
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
      console.log("server_functions: 146",resources);

      // Upgrade costs resources
      let resourceCosts = Buildings.getBuildingUpgradeCost(upgradeId, upgradeLevel);
      console.log("UPGRADE COST: ", resourceCosts);
      if (resourceCosts === undefined) {
        console.log("Mitä helvettiä");
      }
      
      resources = [
        resources[0] - resourceCosts[0],
        resources[1] - resourceCosts[1],
        resources[2] - resourceCosts[2]
      ]

      // Set new resource amounts in colony in db, update time modified,
      // add level to building
      colony = await Database.findAndUpdateFromDatabase(collection, colonyQuery, 
      {
        $set: {
          time: new Date().getTime(),
          resource1: resources[0],
          resource2: resources[1],
          resource3: resources[2],
          buildings
        }
      });
      console.log("----------");
      console.log(colony);

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