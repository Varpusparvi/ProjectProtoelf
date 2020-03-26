import * as Database from '../db_functions.js';
import { default as Mongodb } from 'mongodb';
let ObjectId = Mongodb.ObjectId;



/**
 * Checks if upgrade is allowed
 * @param {*} upgradeId 
 * @param {*} upgradeLevel 
 * @param {*} colonyId 
 * @param {*} username 
 * @returns [true, array of buildings] or [false, null]
 */
export const isUpgradeAllowed = (upgradeId, upgradeLevel, colonyId, username) => new Promise(async (resolve, reject) => {
  // Get information of if requirements for upgrade are met
  try {
    let userExists = await isUserInDb(username);
    let colonyExists = await isColonyInDb(colonyId);
    let upgradeExists = isUpgradeInDb(upgradeId);
    //let resourceExists = await isEnoughResources(upgradeId, upgradeLevel, colonyId);
    let buildings = colonyExists[0].buildings;

    // TODO check for if the player owns the colony
    // If allowed return array of [true, array of buildings]
    if (userExists[1]) {
      if (colonyExists[1]) {
        if (upgradeExists[1]) {
          //if (resourceExists[1]) {
            resolve([true, buildings]);
          //}
        }
      }
    } else { // else [false, null]
      resolve([false, null]);
    }
  } catch (error) {
    console.log(error);
  }
})



/**
 * Gets the document with given username
 * @param {*} username 
 * @returns found file and boolean [object, true]. If didn't find file return [null, false]
 */
export const isUserInDb = (username) => new Promise( async (resolve, reject) => {
  let query = {username: username};
  let collection = "player";
  try {    
    let user = await Database.findDocumentFromDatabase(collection, query);
    if (user !== null) {
      resolve([user, true]);
      return;
    } else {
      resolve([null, false]);
      return;
    }
  } catch (error) {
    console.log(error);
  }
})



/**
 * Gets the document with given colonyId
 * @param {*} colonyId 
 * @returns found file and boolean [object, true]. If didn't find file return [null, false]
 */
export const isColonyInDb = (colonyId) => new Promise( async (resolve, reject) => {
  let query = { _id: new ObjectId(colonyId) };
  let collection = "colony";
  try {
    let colony = await Database.findDocumentFromDatabase(collection,query);
    if (colony !== null) {
      resolve([colony, true]);
      return;
    } else {
      resolve([null, false]);
      return;
    }
  } catch (error) {
    console.log(error);
  }
})



/**
 * Gets the document with given upgradeId
 * @param {*} upgradeId 
 * @returns found file and boolean [object, true]. If didn't find file return [null, false]
 */
export const isUpgradeInDb = (upgradeId) => {
  // TODO
  return [null, true];
}