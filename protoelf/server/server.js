import express from 'express';
import MongoClient from 'mongodb';
const app = express();
const port = process.env.PORT || 8080;
var url = "mongodb://localhost:27017/";


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
* Create a POST route to login or create user
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


/*
* Create and return a user
*/
const createUser = (username) => new Promise((resolve, reject) => {
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

  var _resolve = [undefined, colony];

  // Connect to database
  MongoClient.connect(url, {useUnifiedTopology: true}, async (err, db) => {
    if (err) throw err;
    var dbo = db.db('protoelf'); // Change

    // Access db and create user
    await dbo.collection('colony').insertOne(colony);
    await dbo.collection('player').insertOne(user);
    _resolve[0] = await dbo.collection('player').findOne({username: username});
    db.close();
  })

  console.log("Created user: " + JSON.stringify(user));
  console.log("With colony: " + JSON.stringify(colony));

  // Return fulfilled promise
  resolve(_resolve);
})


/*
* Create a colony
*/
const createColony = (user_id) => new Promise((resolve, reject) => {
  var playerQuery = { _id: user_id };
  var colonyQuery = { _id: _id  }

  var colony = {
    res1: 0,
    res2: 0,
    res3: 0,
    res1lvl: 1,
    res2lvl: 1,
    res3lvl: 1
  }

  var update = { $addToSet: {colonies: _id}};
  var options = {returnNewDocument: true};

  // Connect to database
  MongoClient.connect(url, {useUnifiedTopology: true}, async (err, db) => {
    if (err) throw err;
    var dbo = db.db('protoelf'); // Change

    // Access db and create user
    var player =  await dbo.collection('player').findOneAndUpdate(playerQuery, update, options); // Find and modify user to include new colony
                  await dbo.collection('colony').insert(colony);
    db.close();

    console.log("Created colony: " + JSON.stringify(colony));
    resolve([player, colony]);
  })
})


var colonySyntax = {
  _id: "id",
  res1: "",
  res2: "",
  res3: "",
  res1lvl: "",
  res2lvl: "",
  res3lvl: "",
};

var userSyntax = {
  _id: "id",
  username: "username",
  password: "hash",
  email: "email"
}

var planetSyntax = {

}