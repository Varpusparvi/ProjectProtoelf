"use strict";
const DB = require('./db.js');
let ObjectId = require('mongodb').ObjectID
const Resource = require('./resource_mining.js');

//let ResourceMining = require('../src/modules/resource_mining.js');


/**
 * Check if the user is in database.
 * If user is not, create user.
 * Otherwise get user.
 * @param {*} username username
 * @returns user
 */
const login = (username) => new Promise((resolve, reject) => {
  // Try to find user from database
  let userQuery = { username: username };
  try {
    findDocumentFromDatabase("player", userQuery).then( async (user) => {
      if (user !== undefined && user !== null) {  // continue if user is found
        // try to find colony from database
        let colonyId = user.colonies[0];
        let colonyQuery = { _id: new ObjectId(colonyId) };
        findDocumentFromDatabase("colony", colonyQuery).then((colony) => {
          resolve([user, colony]); // Returns user and colony
          return;
        })
      } else {
        // Create new user if not found in database
        user = await createUser(username);
        resolve(user);
        return;
      }
    })
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
const upgrade = (upgradeId, upgradeLevel, colonyId, username) => new Promise( async (resolve, reject) => {
  let userExists;
  let colonyExists;
  let upgradeExists 
  let resourceExists
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
            let colony = await findDocumentFromDatabase("colony", query);
            colony.resource1;
            colony.resource2;
            colony.resource3;
            let time = new Date().getTime();
            time = time - colony.time;
            let resources = Resource.updateResources(colonyId, time);

            colony = await findAndUpdateFromDatabase(collection, query, 
            {
              $set: {
                time: new Date().getTime(),
                resource1: resources[0],   // TODO
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
 * Searches for a single document in the database
 * @param {*} collection Name of the collection in database
 * @param {*} query Query used to find target document
 * @returns Single matching document
 */
const findDocumentFromDatabase = (collection, query) => new Promise( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  let result;

  // Database query
  try {
    result = await db.collection(collection).findOne(query);
  } catch (error) {
    console.log(error);
  }
  console.log("findDocumentFromDatabase() called.");
  resolve(result);
  return;
})


/**
 * Updates a single document in the database
 * @param {*} collection Name of the collection in database
 * @param {*} query Query used to find target document
 * @param {*} updatedDocument modification or updated document {<operator1>: { <field1>: <value1>, ... },}
 * @returns Updated document
 * https://docs.mongodb.com/manual/reference/operator/update/#id1
 */
const findAndUpdateFromDatabase = (collection, query, updatedDocument) => new Promise( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  let result;

  // Database query
  try {
    result = await db.collection(collection).findOneAndUpdate(query, updatedDocument, {returnOriginal: false});
    console.log("@219" + JSON.stringify(result.value, null, 1));
  } catch (error) {
    console.log(error);
  }
  console.log("findDocumentFromDatabase() called.");
  resolve(result.value);
  return;
})


/**
 * Inserts a single document into the database
 * @param {*} collection Name of the collection in database
 * @param {*} document Document which to insert. JSON.
 * @returns Generated _id of the document
 */
const insertDocumentIntoDatabase = (collection, document) => new Promise( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  let _id;

  // Database query
  try {
    _id = await db.collection(collection).insertOne(document).insertedId;
    console.log(_id);
  } catch (error) {
    console.log(error);
  }
  
  console.log("insertDocumentIntoDatabase() called.");
  resolve(_id);
  return;
})


/**
 * Deletes a single document from the database
 * @param {*} collection Name of the collection in database
 * @param {*} query Query used to find target document
 * @returns ????
 */
const removeDocumentFromDatabase = (collection, query) => new Promise( async () => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  let deleted;
  try {
    deleted = await db.collection(collection).removeOne(query);
    console.log(deleted)
  } catch (error) {
    console.log(error);
  }
  resolve(deleted);
  return;
})


/**
 * Adds buildings to database
 * buildings are defined in server_functions.js
 * @returns array of ids of buildings
 */
const addBuildingsToDb = () => new Promise ( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  const collection = "buildings";

  let array = await db.collection(collection).find().toArray()

  if ( array.length === 0) { // if buildings are not in database
    try {
      let buildingIds = await db.collection(collection).insertMany(BUILDINGS);
      buildingIds = buildingIds.insertedIds;
      array = Object.values(buildingIds).map(building => {
        return building;
      })
    } catch (error) {
      console.log(error);
    }
  } else {    // if buildings are in database
    try {
      array = array.map(building => {
        return building._id;
      });
    } catch (error) {
      console.log(error);
    }
  }
  resolve(array);
  return;
})


/**
 * Gets the document with given username
 * @param {*} username 
 * @returns found file and boolean [object, true]. If didn't find file return [null, false]
 */
const isUserInDb = (username) => new Promise( async (resolve, reject) => {
  let query = {username: username};
  let collection = "player";
  findDocumentFromDatabase(collection,query).then((user) => {
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
  findDocumentFromDatabase(collection,query).then((colony) => {
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
    let document = await findDocumentFromDatabase(collection1, query); // is in building db?
    if (document === null) {
      document = await findDocumentFromDatabase(collection2, query);  // is in tech db?
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
  findDocumentFromDatabase,
  findAndUpdateFromDatabase,
  insertDocumentIntoDatabase,
  removeDocumentFromDatabase,
  addBuildingsToDb,
  isUserInDb,
  isColonyInDb,
  isUpgradeInDb,
  isEnoughResources,
}


let colonySyntax = {
  _id: "id",
  resource1: 0,
  resource2: 0,
  resource3: 0,
  buildings: ["id", "id"],
  time: "ms"
};

let userSyntax = {
  _id: "id",
  username: "username",
  password: "hash",
  email: "email",
  colonies: ["colonyID", "colonyID"]
}

let planetSyntax = {
  _id: "id",
  username: "username",
  password: "hash",
  email: "email",
  colony: ["colonyID", "colonyID"]
}



let buildingIds = [];

let resGen1 = {
  name: "Resource 1 generator",
  priceResource1: 1,
  priceResource2: 3,
  priceResource3: 18
}

let resGen2 = {
  name: "Resource 2 generator",
  priceResource1: 1,
  priceResource2: 3,
  priceResource3: 18
}

let resGen3 = {
  name: "Resource 3 generator",
  priceResource1: 1,
  priceResource2: 3,
  priceResource3: 18
}

let starport = {
  name: "Starport",
  priceResource1: 1,
  priceResource2: 3,
  priceResource3: 18
}

let barracks = {
  name: "Barracks",
  priceResource1: 1,
  priceResource2: 3,
  priceResource3: 18
}

let tradingPost = {
  name: "Trading post",
  priceResource1: 1,
  priceResource2: 3,
  priceResource3: 18
}

const BUILDINGS = [
  resGen1,
  resGen2,
  resGen3,
  starport,
  barracks,
  tradingPost
]