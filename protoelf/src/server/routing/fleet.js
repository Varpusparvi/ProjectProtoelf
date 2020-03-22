import express from 'express';
export const router = express.Router();


// middleware that is specific to this router
router.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update '*'' match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})

// define the home page route
router.post('/fleet',  (req, res) => {
  res.send('Birds home page')
})

export { router as fleetRoute };