import express from 'express';
import * as reqHandlers from '../requestHandlers/requestHandlers.js';
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
  // Log to server console
  // TODO better logging
  log(req);

  // Check if request is readable
  if(req != null && req != undefined && req.body != undefined && req.body != null) {
    let dataToSend = await reqHandlers.handleLogin(req.body);
    dataToSend = JSON.stringify(dataToSend);
    console.log(dataToSend);
    res.send(dataToSend);
  } else {
    res.send(JSON.stringify("Something went wrong :("));
  }
})


/**
 * Logs to server console
 */
const log = (req) => {
  console.log('--------------------------------------------------------------------------------------------');
  console.log("Address: "+ '/login' + ' POST');
  console.log("Time: ", Date.now().toLocaleString("en-US"));
  console.log(req.body);
}

export { router as loginRoute };