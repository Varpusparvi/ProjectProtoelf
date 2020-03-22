import * as Resource from '../modules/Mines.js';
import * as Upgrades from '../modules/Buildings.js'
import * as Database from './db_functions.js';
import * as DB from './db.js';
import { default as Mongodb } from 'mongodb';
let ObjectId = Mongodb.ObjectId;



/**
 * Check if the user is in database.
 * If user is not, create user.
 * Otherwise get user.
 * @param {*} username username
 * @returns user
 */
export const login = (username) => new Promise(async (resolve, reject) => {
  let userQuery = { username: username };

  try {
    // Try to find user from database
    let user = await Database.findDocumentFromDatabase("player", userQuery);
    if (user !== undefined && user !== null) {
      let colonyId = user.colonies[0];
      let colonyQuery = { _id: new ObjectId(colonyId) };

      // Try to find user's first colony from database
      let colony = await Database.findDocumentFromDatabase("colony", colonyQuery);
      let levelsArray = Object.entries(colony.buildings);
      let time = new Date().getTime();

      // Mine levels for r1,r2,r3
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

      // Update resources in the colony to be up to date
      let resources = Resource.updateResourcesFromProduction(levelsArray[0], levelsArray[1],
                                                          levelsArray[2], colony.time, time);
      // Updated resource count
      resources = [
        currentResources[0] + resources[0],
        currentResources[1] + resources[1],
        currentResources[2] + resources[2]
      ];
      console.log("server_functions: 52",resources);

      // Set updated resources into database in the same colony, update time modified
      colony = await Database.findAndUpdateFromDatabase("colony", colonyQuery, 
      {
        $set: {
          time: new Date().getTime(),
          resource1: resources[0],
          resource2: resources[1],
          resource3: resources[2],
        }
      });
      
      // Return user and colony to the calling function
      resolve([user, colony]);
      return;
    } else {
      // Create new user if not found in database
      user = await createUser(username);
      resolve(user);
      return;
    }
  } catch (error) {
    console.error(error);
  }
})



/**
 * Checks if upgrade is allowed
 * @param {*} upgradeId 
 * @param {*} upgradeLevel 
 * @param {*} colonyId 
 * @param {*} username 
 * @returns [true, array of buildings] or [false, null]
 */
const isUpgradeAllowed = (upgradeId, upgradeLevel, colonyId, username) => new Promise(async (resolve, reject) => {
  // Get information of if requirements for upgrade are met
  try {
    let userExists = await isUserInDb(username);
    let colonyExists = await isColonyInDb(colonyId);
    let upgradeExists = await isUpgradeInDb(upgradeId);
    //let resourceExists = await isEnoughResources(upgradeId, upgradeLevel, colonyId);
    let buildings = colonyExists[0].buildings;

    // TODO check for if the player owns the colony
    // If allowed return array of [true, array of buildings]
    if (userExists[1]) {
      if (colonyExists[1]) {
        if (upgradeExists[1]) {
          //if (resourceExists[1]) {
            resolve([true, buildings]);
          //}
        }
      }
    } else { // else [false, null]
      resolve([false, null]);
    }
  } catch (error) {
    console.log(error);
  }
})



/**
 * Upgrades selected entity in selected colony for user
 * @param {*} upgradeId 
 * @param {*} upgradeLevel 
 * @param {*} colonyId 
 * @param {*} username 
 * @returns upgraded or unupgraded colony
 */
export const upgrade = (upgradeId, upgradeLevel, colonyId, username) => new Promise( async (resolve, reject) => {
  let collection = "colony";
  let colonyQuery = { _id: new ObjectId(colonyId) };

  // Check if upgrading is allowed
  let check = await isUpgradeAllowed(upgradeId, upgradeLevel, colonyId, username);
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
      let resources = Resource.updateResourcesFromProduction(levelsArray[0], levelsArray[1], levelsArray[2], colony.time, time);
      resources = [
        currentResources[0] + resources[0],
        currentResources[1] + resources[1],
        currentResources[2] + resources[2]
      ];
      console.log("server_functions: 146",resources);

      // Upgrade costs resources
      // let resourceCosts = Upgrades.getBuildingUpgradeCost();
      let resourceCosts = [1000, 1000, 1000];
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



/**
 * Creates user with given username and gives user a colony
 * @param {*} username username to create account with
 * @returns array [user, colony]
 */
export const createUser = (username) => new Promise( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  // Create colony for the user
  let buildingIds;
  try {
    buildingIds = await db.collection("buildings").find().toArray();

  } catch (error) {
    console.log("Cannot access buildings. Aborting createUser!");
    return;
  }
  
  // Colony with no resources or buildings, time created
  let colony = {
    resource1: 0,
    resource2: 0,
    resource3: 0,
    buildings: {},
    time: new Date().getTime()
  }

  // set levels for buildings (mines lvl 1)
  for (let i = 0; i < buildingIds.length; i++) {
    if (i < 3) { // while building is resource building ie. first 3 buildings
      let id = buildingIds[i]._id;
      colony.buildings[id] = 1;
    } else {
      let id = buildingIds[i]._id;
      colony.buildings[id] = 0;
    }
  }

  // Create user to be saved
  // TODO saving password
  // authentication?
  let user = {
    username: username,
    password: "hash",
    email: "email@asd.com",
    colonies: []
  }

  // Insert colony into db
  db.collection("colony").insertOne(colony, (err) => {
    if (err) return;
    console.log(colony);
    user.colonies.push(colony._id); // ID from db after operation

    // Insert user into db
    db.collection("player").insertOne(user, (err) => {
      if (err) return;
      console.log(user);
      // Return user and colony info for calling function
      resolve([user, colony]);
      return;
    })
  })
})



/**
 * Gets the document with given username
 * @param {*} username 
 * @returns found file and boolean [object, true]. If didn't find file return [null, false]
 */
export const isUserInDb = (username) => new Promise( async (resolve, reject) => {
  let query = {username: username};
  let collection = "player";
  try {    
    let user = await Database.findDocumentFromDatabase(collection, query);
    if (user !== null) {
      resolve([user, true]);
      return;
    } else {
      resolve([null, false]);
      return;
    }
  } catch (error) {
    console.log(error);
  }
})



/**
 * Gets the document with given colonyId
 * @param {*} colonyId 
 * @returns found file and boolean [object, true]. If didn't find file return [null, false]
 */
export const isColonyInDb = (colonyId) => new Promise( async (resolve, reject) => {
  let query = { _id: new ObjectId(colonyId) };
  let collection = "colony";
  try {
    let colony = await Database.findDocumentFromDatabase(collection,query);
    if (colony !== null) {
      resolve([colony, true]);
      return;
    } else {
      resolve([null, false]);
      return;
    }
  } catch (error) {
    console.log(error);
  }
})



/**
 * Gets the document with given upgradeId
 * @param {*} upgradeId 
 * @returns found file and boolean [object, true]. If didn't find file return [null, false]
 */
export const isUpgradeInDb = (upgradeId) => new Promise( async (resolve, reject) => {
  let query = { _id: new ObjectId(upgradeId) };
  let collection1 = "buildings";
  let collection2 = "tech";

  try {
    // TODO Change db structure?
    // is in building db?
    let document = await Database.findDocumentFromDatabase(collection1, query); 
    if (document === null) {
      // is in tech db?
      document = await Database.findDocumentFromDatabase(collection2, query);  
      if (document === null) {
        resolve([null, false]);
        return;
      } else {
        resolve([document, true]);
        return;
      }
    } else {
      resolve([document, true]);
      return;
    }
  } catch (error) {
    console.log(error);
    reject();
    return;
  }
})



/**
 * Gets the document with given upgradeId
 * @param {*} upgradeId 
 * @returns found file and boolean [object, true]. If didn't find file return [null, false]
 */
export const isEnoughResources = (upgradeId, upgradeLevel, colonyId) => new Promise( async (resolve, reject) => {
  let upgradeQuery = { _id: new ObjectId(upgradeId) };
  let colonyQuery = { _id: new ObjectId(colonyId) };
  let upgradeCollection = "upgrade";
  let colonyCollection = "colony";
  /*
  */
  // TODO
  resolve(true);
  return;
})