const express = require('express');
/*
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = "mongodb://localhost:27017/";
const app = express();
const port = process.env.PORT || 8080;
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
  console.log(`${port}` + ' GET');
});


/*
* Create a POST route to remove a recipe
*/
app.post('/', (req, res) => {
  console.log(`${port}` + ' POST');
});


/*
*"Main"
*/


/*
* Get the recipe list from mongodb database
*/
async function useDatabase() {
  MongoClient.connect(url, {useUnifiedTopology: true}, async (err, db) => {
    if (err) throw err;
    var dbo = db.db('databasename'); // Change

    // Retrieve all recipes
    recipeListFetched = await dbo.collection('collectionName').find().toArray(); // Change
    console.log("DB Used!");
    db.close();
  })
}