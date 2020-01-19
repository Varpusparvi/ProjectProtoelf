/*
import Router from 'express'

var router = Router()

// middleware that is specific to this router
router.use(function timeLog (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update '*'' match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log('Time: ', Date.now())
    next()
})

// define the about route
router.post('/upgrade', async (req, res) => {
 const db = req.app.locals.db;
    console.log('--------------------------------------------------------------------------------------------');
    console.log(`${port} ` + "Address: "+ '/login' + ' POST');
    console.log(req.body);
    //var user_id = req.body.user_id;
    var user_id = req.body.username;
    var colony_id = req.body.colony_id;
    var upgrade_Id = req.body.upgrade_Id;
  
    try {
      var upgradedColony = await ServerHelper.upgrade(upgrade_Id, colony_id, user_id);
    } catch (error) {
      console.log(error);
    }
  
    // Upgrade the entity if costs are matched
    res.send(JSON.stringify(upgradedColony));
})


// define the about route
router.post('/login', async (req, res) => {
    const db = req.app.locals.db;
    var username = req.body.username;
  
    console.log('--------------------------------------------------------------------------------------------');
    console.log(`${port} ` + "Address: "+ '/login' + ' POST');
    console.log(req.body);
  
    // Login / Create account with given username
    ServerHelper.openDbConnection();
    try {
      var user = await ServerHelper.login(username);
    } catch (error) {
      console.log(error);
    }
    ServerHelper.close
    console.log("Send: " + user);
    res.send(JSON.stringify(user));
})

export default router;

*/