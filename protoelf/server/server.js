"use strict";
import express from 'express';
import * as ServerHelper from './server_functions.js';

const app = express();
const port = process.env.PORT || 8080;


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
app.get('/', async (req, res) => {
  console.log(`${port} ` + "Address: "+ '/' + ' GET');

  var user = await ServerHelper.findSingleFromDatabase("player", {username: "Migi"})
  user = JSON.stringify(user);
  res.send({user});
});


/*
* Create a POST route to login or create user
*/
app.post('/login', async (req, res) => {
  console.log('--------------------------------------------------------------------------------------------');
  console.log(`${port} ` + "Address: "+ '/login' + ' POST');
  console.log(req.body);
  var username = req.body.username;

  // Login / Create account with given username
  await ServerHelper.login(username).then((user) => {
    console.log("Send: " + user);
    res.send(JSON.stringify(user));
  })
});


var colonySyntax = {
  _id: "id",
  resource1: "",
  resource2: "",
  resource3: "",
  resource1Level: "",
  resource2Level: "",
  resource3Level: "",
  time: "ms"
};

var userSyntax = {
  _id: "id",
  username: "username",
  password: "hash",
  email: "email",
  colony: ["colonyID", "colonyID"]
}

var planetSyntax = {

}