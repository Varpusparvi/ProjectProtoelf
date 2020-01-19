"use strict";
const DB = require('./db.js');
var ObjectId = require('mongodb').ObjectID
//var ResourceMining = require('../src/modules/resource_mining.js');


/**
 * Check if the user is in database.
 * If user is not, create user.
 * Otherwise get user.
 * @param {*} username username
 * @returns user
 */
const login = (username) => new Promise((resolve, reject) => {
  // Try to find user from database
  var userQuery = { username: username };
  try {
    findDocumentFromDatabase("player", userQuery).then( async (user) => {
      if (user !== undefined && user !== null) {  // continue if user is found
        // try to find colony from database
        var colonyId = user.colonies[0];
        var colonyQuery = { _id: new ObjectId(colonyId) };
        findDocumentFromDatabase("colony", colonyQuery).then((colony) => {
          resolve([user, colony]); // Returns user and colony
        })
      } else {
        // Create new user if not found in database
        user = await createUser(username);
        resolve(user);
      }
    })
  } catch (error) {
    console.log(error);
  }
})



/**
 * Creates user with given username and gives user a colony
 * @param {*} username username to create account with
 * @returns array [user, colony]
 */
const createUser = (username) => new Promise((resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  // Create colony for the user
  var colony = {
    resource1: 0,
    resource2: 0,
    resource3: 0,
    resource1Level: 1,
    resource2Level: 1,
    resource3Level: 1,
    time: new Date().getTime()
  }

  // Create user to be saved
  var user = {
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
    })
  })
})



/**
 * Searches for a single document in the database
 * @param {*} collection Name of the collection in database
 * @param {*} query Query which to use. {username: "username"}
 * @returns Single matching document
 */
const findDocumentFromDatabase = (collection, query) => new Promise( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");

  // Database query
  try {
    var result = await db.collection(collection).findOne(query);
  } catch (error) {
    console.log(error);
  }
  console.log("findDocumentFromDatabase() called.");
  resolve(result);
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

  // Database query
  try {
    var _id = await db.collection(collection).insertOne(document).insertedId;
    console.log(_id);
  } catch (error) {
    console.log(error);
  }
  
  console.log("insertDocumentIntoDatabase() called.");
  resolve(_id);
})


/**
 * Gets the document with given username
 * @param {*} username 
 * @returns found file and boolean [object, true]. If didn't find file return [null, false]
 */
const isUserInDb = (username) => new Promise( async (resolve, reject) => {
  var query = {username: username};
  var collection = "player";
  findDocumentFromDatabase(collection,query).then((user) => {
    if (user !== null) {
      resolve(user, true);
    } else {
      resolve(null, false);
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
  var query = { _id: new ObjectId(colonyId) };
  var collection = "colony";
  findDocumentFromDatabase(collection,query).then((colony) => {
    if (colony !== null) {
      resolve(colony, true);
    } else {
      resolve(null, false);
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
  var query = { _id: new ObjectId(upgradeId) };
  var collection = "upgrade";
  findDocumentFromDatabase(collection,query).then((upgrade) => {
    if (upgrade !== null) {
      resolve(upgrade, true);
    } else {
      resolve(null, false);
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
const isEnoughResources = (upgradeId, upgradeLevel, colonyId) => new Promise( async (resolve, reject) => {
  /*
  var upgradeQuery = { _id: new ObjectId(upgradeId) };
  var colonyQuery = { _id: new ObjectId(colonyId) };
  var upgradeCollection = "upgrade";
  var colonyCollection = "colony";
  */

  resolve(true);
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
  var userExists = await isUserInDb(username);
  var colonyExists = await isColonyInDb(colonyId);
  var upgradeExists = await isUpgradeInDb(upgradeId);
  var resourceExists = await isEnoughResources(upgradeId, upgradeLevel, colonyId);

  var collection = "colony";
  var query = { _id: new ObjectId(colonyId) };

  // TODO check for if the player owns the colony
  // TODO check for if the upgrade is possible

  // Check request for problems
  if (userExists[1]) {
    console.log("User exists");
    if (colonyExists[1]) {
      console.log("Colony exists");
      if (upgradeExists[1]) {
        console.log("Upgrade exists");
        if (resourceExists[1]) {
          console.log("Resources exist");
          // Päivitä DB
          // Palauta päivitetty colony
          var colony = await findDocumentFromDatabase("colony", { _id: colonyId});
          console.log("Päivitettyd!")
          resolve(colony);
        }
      }
    }
  }
})


module.exports = {
  login,
  upgrade,
}


var colonySyntax = {
  _id: "id",
  resource1: 0,
  resource2: 0,
  resource3: 0,
  resource1Level: 1,
  resource2Level: 1,
  resource3Level: 1,
  time: "ms"
};

var userSyntax = {
  _id: "id",
  username: "username",
  password: "hash",
  email: "email",
  colonies: ["colonyID", "colonyID"]
}

var planetSyntax = {
  _id: "id",
  username: "username",
  password: "hash",
  email: "email",
  colony: ["colonyID", "colonyID"]
}