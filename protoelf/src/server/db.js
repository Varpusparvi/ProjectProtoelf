/*
const assert = require('assert');
const client = require('mongodb').MongoClient;
*/

/*
module.exports = {
  getDb,
  initDb
}
*/

import assert from 'assert';
import client from 'mongodb';

const url = "mongodb://localhost:27017/";

let _db;



/**
 * Returns database
 */
export const getDb = () => {
  assert.ok(_db, "Db has not been initialized. Please called init first.");
  return _db;
}


/**
 * Initializes the database connection
 * @param {*} callback 
 */
export const initDb = (callback) => {
  if (_db) {
      console.warn("Trying to init DB again!");
      return callback(null, _db);
  }
  client.connect(url, {useUnifiedTopology: true}, connected);
function connected(err, db) {
      if (err) {
          return callback(err);
      }
      console.log("DB initialized - connected to: " + url);
      _db = db;
      return callback(null, _db);
  }
}