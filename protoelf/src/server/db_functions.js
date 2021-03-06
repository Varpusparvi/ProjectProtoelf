import * as DB from './db.js';


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
    console.log("findDocumentFromDatabase() called.");
  } catch (error) {
    console.log(error);
  }
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
    console.log("findAndUpdateFromDatabase() called.");
  } catch (error) {
    console.log(error);
  }
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
    console.log("insertDocumentIntoDatabase() called.");
  } catch (error) {
    console.log(error);
  }
  
  resolve(_id);
  return;
})


/**
 * Deletes a single document from the database
 * @param {*} collection Name of the collection in database
 * @param {*} query Query used to find target document
 * @returns ????
 */
export const removeDocumentFromDatabase = (collection, query) => new Promise( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  let deleted;
  try {
    deleted = await db.collection(collection).removeOne(query);
    console.log("removeDocumentFromDatabase() called.");
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


/**
 * Get the next closest upgrades from database upgrades table
 * @param {*} timeSec how far in the future to fetch
 */
export const getClosestUpgrades = async (timeSec) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");
  let timeDistance = new Date().getTime() + timeSec * 1000;
  let query = { time: { $lt: timeDistance } };
  let upgradesArray = await db.collection("upgrades").find(query).toArray();
  if (upgradesArray.length === 0 || upgradesArray === undefined) {
    return [];
  }
  return upgradesArray;
}