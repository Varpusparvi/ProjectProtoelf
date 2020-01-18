"use strict";
import MongoClient from 'mongodb';
var url = "mongodb://localhost:27017/";


/**
 * Checks if given username is already in database
 * @param {*} username "username" which to use to check the database for matches
 * @returns boolean whether or not user is in database
 */
export const isUserInDB = (username) => new Promise((resolve, reject) => {
  var query = { username: username }   // Construct a query

  // Connect to database
  MongoClient.connect(url, {useUnifiedTopology: true}, async (err, db) => {
    if (err) throw err;
    var dbo = db.db('protoelf'); // Change

    // Access db and find user
    var player = await dbo.collection('player').findOne(query);
    db.close();

    console.log("User: " + JSON.stringify(player) + " isUserInDB()");
    if (player === null) {
      resolve(false);
    } else {
      resolve(true);
    }
  })
})



/**
 * Check if the user is in database.
 * If user is not, create user.
 * Otherwise get user.
 * @param {*} user 
 * @returns user
 */
export const login = (username) => new Promise(async (resolve, reject) => {
  await isUserInDB(username).then(async (bool) => {
    if (bool) {
      console.log("In database: " + username);
      var user = await getUser(username);
      resolve(user);
    } else {
      console.log("Not in database: " + username);
      var user = await createUser(username);
      resolve(user);
    }
  })
})


/**
 * Searches for a single document in the database
 * @param {*} collection Name of the collection in database
 * @param {*} query Query which to use. {username: "username"}
 * @returns Matching document
 */
export const findSingleFromDatabase = (collection, query) => new Promise((resolve, reject) => {
  MongoClient.connect(url, {useUnifiedTopology: true}, async (err, db) => {
    if (err) throw err;
    var database = db.db("protoelf");

    // Database query
    var result = await database.collection(collection).findOne(query);
    console.log("findSingleFromDatabase() called.");
    db.close();
    resolve(result);
  })
})



/**
 * Searches for user by its "username" in database
 * @param {*} username "username" of the user
 * @returns array with [user, colony]
 */
export const getUser = (username) => new Promise((resolve, reject) => {
  var query = { username: username };   // Construct a query
  
  MongoClient.connect(url, {useUnifiedTopology: true}, async (err, db) => {
    if (err) throw err;
    var dbo = db.db('protoelf'); // Change
    
    // Access db and get user
    var player = await dbo.collection('player').findOne(query);
    var colony = await dbo.collection('colony').findOne({_id: player.username});
    db.close();
    
    console.log("User: " + JSON.stringify(player) + " getUser()");
    resolve([player, colony]);
  })
})



/**
 * Creates user with given username and gives user a colony
 * @param {*} username username to create account with
 * @returns array [user, colony]
 */
export const createUser = (username) => new Promise((resolve, reject) => {
  // Create user to be saved
  var user = {
    username: username,
    password: "hash",
    email: "email@asd.com",
    colonies: [username]
  }

  // Create colony for the user
  var colony = {
    _id: username,
    res1: 0,
    res2: 0,
    res3: 0,
    res1Lvl: 1,
    res2Lvl: 1,
    res3Lvl: 1,
    time: new Date().getTime
  }

  var player;
  var colony = colony;

  // Connect to database
  MongoClient.connect(url, {useUnifiedTopology: true}, async (err, db) => {
    if (err) throw err;

    // Variable for the database
    var dbo = db.db('protoelf'); // Change

    // Access db and create user
    await dbo.collection('colony').insertOne(colony);
    await dbo.collection('player').insertOne(user).then( async () => {
      player = await dbo.collection('player').findOne({username: username});
    })
    db.close();

    console.log("Created user: " + JSON.stringify(user));
    console.log("With colony: " + JSON.stringify(colony));
  
    // Return fulfilled promise
    resolve([player, colony]);
  })
})