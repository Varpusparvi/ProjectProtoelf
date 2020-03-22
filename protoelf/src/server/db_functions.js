/*
const DB = require('./db.js');
let ObjectId = require('mongodb').ObjectID;
*/
import * as DB from './db.js';
import ObjectId from 'mongodb';



/**
 * Searches for a single document in the database
 * @param {*} collection Name of the collection in database
 * @param {*} query Query used to find target document
 * @returns Single matching document
 */
export const findDocumentFromDatabase = (collection, query) => new Promise( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  let result;

  // Database query
  try {
    result = await db.collection(collection).findOne(query);
  } catch (error) {
    console.log(error);
  }
  console.log("findDocumentFromDatabase() called.");
  resolve(result);
  return;
})


/**
 * Updates a single document in the database
 * @param {*} collection Name of the collection in database
 * @param {*} query Query used to find target document
 * @param {*} updatedDocument modification or updated document {<operator1>: { <field1>: <value1>, ... },}
 * @returns Updated document
 * https://docs.mongodb.com/manual/reference/operator/update/#id1
 */
export const findAndUpdateFromDatabase = (collection, query, updatedDocument) => new Promise( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  let result;

  // Database query
  try {
    result = await db.collection(collection).findOneAndUpdate(query, updatedDocument, {returnOriginal: false});
    console.log("@219" + JSON.stringify(result.value, null, 1));
  } catch (error) {
    console.log(error);
  }
  console.log("findDocumentFromDatabase() called.");
  resolve(result.value);
  return;
})


/**
 * Inserts a single document into the database
 * @param {*} collection Name of the collection in database
 * @param {*} document Document which to insert. JSON.
 * @returns Generated _id of the document
 */
export const insertDocumentIntoDatabase = (collection, document) => new Promise( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  let _id;

  // Database query
  try {
    _id = await db.collection(collection).insertOne(document).insertedId;
    console.log(_id);
  } catch (error) {
    console.log(error);
  }
  
  console.log("insertDocumentIntoDatabase() called.");
  resolve(_id);
  return;
})


/**
 * Deletes a single document from the database
 * @param {*} collection Name of the collection in database
 * @param {*} query Query used to find target document
 * @returns ????
 */
export const removeDocumentFromDatabase = (collection, query) => new Promise( async () => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  let deleted;
  try {
    deleted = await db.collection(collection).removeOne(query);
    console.log(deleted)
  } catch (error) {
    console.log(error);
  }
  resolve(deleted);
  return;
})


/**
 * Adds buildings to database
 * buildings are defined in server_functions.js
 * @returns array of ids of buildings
 */
export const addBuildingsToDb = () => new Promise ( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  const collection = "buildings";

  let array = await db.collection(collection).find().toArray()

  if ( array.length === 0) { // if buildings are not in database
    try {
      let buildingIds = await db.collection(collection).insertMany(BUILDINGS);
      buildingIds = buildingIds.insertedIds;
      array = Object.values(buildingIds).map(building => {
        return building;
      })
    } catch (error) {
      console.log(error);
    }
  } else {    // if buildings are in database
    try {
      array = array.map(building => {
        return building._id;
      });
    } catch (error) {
      console.log(error);
    }
  }
  resolve(array);
  return;
})


let resGen1 = {
  name: "Resource 1 generator",
  cost_eq : {
    res1 : function(n){return 1*n;},
    res2 : function(n){return 2*n;},
    res3 : function(n){return 3*n;}
  },
  time_eq : function(n){return 3*n;},
  production_eq : function(n){return Math.round((3*n*0.555));}
}

let resGen2 = {
  name: "Resource 2 generator",
  cost_eq : {
    res1 : function(n){return 1*n;},
    res2 : function(n){return 2*n;},
    res3 : function(n){return 3*n;}
  },
  time_eq : function(n){return 3*n;},
  production_eq : function(n){return Math.round(4*n);}
}

let resGen3 = {
  name: "Resource 3 generator",
  cost_eq : {
    res1 : function(n){return 1*n;},
    res2 : function(n){return 2*n;},
    res3 : function(n){return 3*n;}
  },
  time_eq : function(n){return 3*n;},
  production_eq : function(n){return Math.round(2*n);}
}

let starport = {
  name: "Starport",
  cost_eq : {
    res1 : function(n){return 1*n;},
    res2 : function(n){return 2*n;},
    res3 : function(n){return 3*n;}
  },
  time_eq : function(n){return 3*n;},
  requirements : {
    tech2 : 1,
    tech3 : 2
}
}

let barracks = {
  name: "Barracks",
  cost_eq : {
    res1 : function(n){return 1*n;},
    res2 : function(n){return 2*n;},
    res3 : function(n){return 3*n;}
  },
  time_eq : function(n){return 3*n;},
  requirements : {
    tech2 : 1,
    tech3 : 2
}
}

let tradingPost = {
  name: "Trading post",
  cost_eq : {
    res1 : function(n){return 1*n;},
    res2 : function(n){return 2*n;},
    res3 : function(n){return 3*n;}
  },
  time_eq : function(n){return 3*n;},
  requirements : {
    tech2 : 1,
    tech3 : 2
}
}

const BUILDINGS = [
  resGen1,
  resGen2,
  resGen3,
  starport,
  barracks,
  tradingPost
]

/*
module.exports= {
  findDocumentFromDatabase,
  findAndUpdateFromDatabase,
  insertDocumentIntoDatabase,
  removeDocumentFromDatabase,
  addBuildingsToDb
}
*/