import * as ResourceMining from '../Modules/Resource_mining.js';
import express from 'express';
import MongoClient from 'mongodb';
import ObjectId from 'mongodb';
/*
import { createRequire } from 'module'
const require = createRequire(import.meta.url);
const { MongoClient } = require('mongodb');
*/
const app = express();
const port = process.env.PORT || 8080;
var url = "mongodb://localhost:27017/";
/*
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
*/

/*
* console.log that your server is up and running
*/
app.listen(port, () => console.log(`Listening on port ${port}`));

/*
* Routing and headers for connections
*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update '*'' match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.urlencoded());
app.use(express.json());


/*
* Create a GET route to get the recipe list
*/
app.get('/', (req, res) => {
  console.log(`${port} ` + "Address: "+ '/' + ' GET');
  res.send({});
});


/*
* Create a POST route to remove a recipe
*/
app.post('/login', async (req, res) => {
  console.log('--------------------------------------------------------------------------------------------');
  console.log(`${port} ` + "Address: "+ '/login' + ' POST');
  console.log(req.body);
  var user = req.body.username;

  // If user is not in database, create user
  const login = (user) => new Promise(async (resolve, reject) => {
    await isUserInDB(user).then(async (bool) => {
      console.log("Nytkö");
      if (bool) {
        console.log("In database: " + user);
        user = await getUser(user);
        resolve(user);
        } else {
        console.log("Not in database: " + user);
        user = await createUser(user);
        resolve(user);
        }
      })
    })
  await login(user).then((user) => {
    console.log("Send: " + user);
    res.send(JSON.stringify(user));
    //res.send("Sended.");
  })
});


/*
* Boolean of whether the username is in database
*/
const isUserInDB = (username) => new Promise((resolve, reject) => {
  var player;
  var query = { username: username }   // Construct a query

  // Connect to database
  MongoClient.connect(url, {useUnifiedTopology: true}, async (err, db) => {
    if (err) throw err;
    var dbo = db.db('protoelf'); // Change

    // Access db and find user
    player = await dbo.collection('player').findOne(query);
    db.close();

    console.log("User: " + JSON.stringify(player) + " isUserInDB()");
    if (player === null) {
      resolve(false);
    } else {
      resolve(true);
    }
  })
})


/*
* Get user from database
*/
const getUser = (username) => new Promise((resolve, reject) => {
  var player; 
  var query = { username: username };   // Construct a query
  
  MongoClient.connect(url, {useUnifiedTopology: true}, async (err, db) => {
    if (err) throw err;
    var dbo = db.db('protoelf'); // Change
    
    // Access db and get user
    player = await dbo.collection('player').findOne(query);
    //player = await dbo.collection('player').find().toArray();
    db.close();
    
    console.log("User: " + JSON.stringify(player) + " getUser()");
    resolve(player);
  })
})


/*
* Create and return a user
*/
const createUser = (username) => new Promise((resolve, reject) => {
  var player; 
  var query = { username: username }; // Construct a query for database
  // Create user to be saved
  var user = {
    username: username,
    password: "hash",
    email: "email@asd.com",
  }

  // Connect to database
  MongoClient.connect(url, {useUnifiedTopology: true}, async (err, db) => {
    if (err) throw err;
    var dbo = db.db('protoelf'); // Change

    // Access db and create user
    await dbo.collection('player').insertOne(user);
    player = await dbo.collection('player').findOne(query);
    db.close();

    console.log("Created user: " + JSON.stringify(player));
    resolve(player);
  })
})


var colonySyntax = {

};
var userSyntax = {
  _id: "id",
  username: "username",
  password: "hash",
  email: "email"
}
var planetSyntax = {

}