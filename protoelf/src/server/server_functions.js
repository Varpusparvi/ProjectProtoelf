const Resource = require('./resource_mining_server.js');
const Database = require('./db_functions.js');
const DB = require('./db.js');
let ObjectId = require('mongodb').ObjectID;


/**
 * Check if the user is in database.
 * If user is not, create user.
 * Otherwise get user.
 * @param {*} username username
 * @returns user
 */
const login = (username) => new Promise(async (resolve, reject) => {
  let userQuery = { username: username };
  // Try to find user from database
  try {
    let user = await Database.findDocumentFromDatabase("player", userQuery);
    if (user !== undefined && user !== null) {
      let colonyId = user.colonies[0];
      let colonyQuery = { _id: new ObjectId(colonyId) };

      let colony = await Database.findDocumentFromDatabase("colony", colonyQuery);
      let levelsArray = Object.entries(colony.buildings);
      let time = new Date().getTime();
      time = time - colony.time;
      levelsArray = [
        levelsArray[0][1],
        levelsArray[1][1],
        levelsArray[2][1],
      ];
      currentResources = [
        colony.resource1,
        colony.resource2,
        colony.resource3
      ];
      let resources = Resource.updateResources(time, levelsArray);
      resources = [
        currentResources[0] + resources[0],
        currentResources[1] + resources[1],
        currentResources[2] + resources[2]
      ];
      colony = await Database.findAndUpdateFromDatabase("colony", colonyQuery, 
      {
        $set: {
          time: new Date().getTime(),
          resource1: resources[0],
          resource2: resources[1],
          resource3: resources[2],
        }
      });
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
 * Upgrades selected entity in selected colony for user
 * @param {*} upgradeId 
 * @param {*} upgradeLevel 
 * @param {*} colonyId 
 * @param {*} username 
 * @returns upgraded or unupgraded colony
 */
const upgrade = (upgradeId, upgradeLevel, colonyId, username) => new Promise( async (resolve, reject) => {
  let userExists;
  let colonyExists;
  let upgradeExists;
  let resourceExists;
  let collection = "colony";
  let query = { _id: new ObjectId(colonyId) };

  try {
    userExists = await isUserInDb(username);
    colonyExists = await isColonyInDb(colonyId);
    upgradeExists = await isUpgradeInDb(upgradeId);
    resourceExists = await isEnoughResources(upgradeId, upgradeLevel, colonyId);
  } catch (error) {
    console.log(error);
  }

  // TODO Correct the fields
  let array = colonyExists[0].buildings;
  let buildings = array;
  buildings[upgradeId] = upgradeLevel;

  console.log(upgrade);
  // TODO check for if the player owns the colony
  // TODO check for if the upgrade is possible
  if (userExists[1]) {
    console.log("User exists");
    if (colonyExists[1]) {
      console.log("Colony exists");
      if (upgradeExists[1]) {
        console.log("Upgrade exists");
        if (resourceExists) {
          try {
            console.log("Resources exist");
            let colony = await Database.findDocumentFromDatabase("colony", query);
            let levelsArray = Object.entries(colony.buildings);
            let time = new Date().getTime();
            time = time - colony.time;
            levelsArray = [
              levelsArray[0][1],
              levelsArray[1][1],
              levelsArray[2][1],
            ];
            currentResources = [
              colony.resource1,
              colony.resource2,
              colony.resource3
            ];
            let resources = Resource.updateResources(time, levelsArray);
            resources = [
              currentResources[0] + resources[0],
              currentResources[1] + resources[1],
              currentResources[2] + resources[2]
            ];
            colony = await Database.findAndUpdateFromDatabase(collection, query, 
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
            resolve(colony);
            return;
          } catch (error) {
            console.log(error);
          }
        }
        resolve("Not enough resources");
        return;
      }
      resolve("Upgrade doesn't exist");
      return;
    }
    resolve("Colony doesn't exist");
    return;
  }
  resolve("User doesn't exist");
  return;
})


/**
 * Creates user with given username and gives user a colony
 * @param {*} username username to create account with
 * @returns array [user, colony]
 */
const createUser = (username) => new Promise( async (resolve, reject) => {
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
  
  let colony = {
    resource1: 0,
    resource2: 0,
    resource3: 0,
    buildings: {},
    time: new Date().getTime()
  }

  // set levels for buildings
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
    user.colonies.push(colony._id);

    // Insert user into db
    db.collection("player").insertOne(user, (err) => {
      if (err) return;
      console.log(user);
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
const isUserInDb = (username) => new Promise( async (resolve, reject) => {
  let query = {username: username};
  let collection = "player";
  Database.findDocumentFromDatabase(collection,query).then((user) => {
    if (user !== null) {
      resolve([user, true]);
      return;
    } else {
      resolve([null, false]);
      return;
    }
  }).catch((err) => {
    console.log(err);
  })
})


/**
 * Gets the document with given colonyId
 * @param {*} colonyId 
 * @returns found file and boolean [object, true]. If didn't find file return [null, false]
 */
const isColonyInDb = (colonyId) => new Promise( async (resolve, reject) => {
  let query = { _id: new ObjectId(colonyId) };
  let collection = "colony";
  Database.findDocumentFromDatabase(collection,query).then((colony) => {
    if (colony !== null) {
      resolve([colony, true]);
      return;
    } else {
      resolve([null, false]);
      return;
    }
  }).catch((err) => {
    console.log(err);
  })
})


/**
 * Gets the document with given upgradeId
 * @param {*} upgradeId 
 * @returns found file and boolean [object, true]. If didn't find file return [null, false]
 */
const isUpgradeInDb = (upgradeId) => new Promise( async (resolve, reject) => {
  let query = { _id: new ObjectId(upgradeId) };
  let collection1 = "buildings";
  let collection2 = "tech";

  try {
    let document = await Database.findDocumentFromDatabase(collection1, query); // is in building db?
    if (document === null) {
      document = await Database.findDocumentFromDatabase(collection2, query);  // is in tech db?
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
const isEnoughResources = (upgradeId, upgradeLevel, colonyId) => new Promise( async (resolve, reject) => {
  /*
  let upgradeQuery = { _id: new ObjectId(upgradeId) };
  let colonyQuery = { _id: new ObjectId(colonyId) };
  let upgradeCollection = "upgrade";
  let colonyCollection = "colony";
  */
  // TODO
  resolve(true);
  return;
})


module.exports = {
  login,
  upgrade,
  isUserInDb,
  isColonyInDb,
  isUpgradeInDb,
  isEnoughResources,
}