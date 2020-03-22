import express from 'express';
import * as ServerHelper from '../server_functions.js';
import { buildings } from '../server.js';
const router = express.Router();


// middleware that is specific to this router
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update '*'' match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  console.log('Time: ', Date.now())
  next()
})

// define the home page route
router.post('/login',  async (req, res) => {
  console.log('--------------------------------------------------------------------------------------------');
  console.log("Address: "+ '/login' + ' POST');
  console.log(req.body);
  var username = req.body.username;
  
  // Login / Create account with given username
  try {
    var user = await ServerHelper.login(username);
  } catch (error) {
    console.log(error);
  }
  user.push(buildings);
  res.send(JSON.stringify(user));
})

export { router as loginRoute };