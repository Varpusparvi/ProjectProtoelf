import * as Resource from '../../modules/Mines.js';
import * as Database from '../db_functions.js';
import * as Obj from '../../modules/Objects.js';
import * as DB from '../db.js';
import { default as Mongodb } from 'mongodb';
let ObjectId = Mongodb.ObjectId;



/**
 * Check if the user is in database.
 * If user is not, create user.
 * Otherwise get user.
 * @param {*} username username
 * @returns [user, colony]
 */
export const login = (username, password) => new Promise(async (resolve, reject) => {
  let userQuery = { username: username };
  let passwordQuery = { password: password }; // TODO

  try {
    // Try to find user from database
    let user = await Database.findDocumentFromDatabase("player", userQuery);
    if (user !== undefined && user !== null) {
      let colonyId = user.colonies[0];
      let colonyQuery = { _id: new ObjectId(colonyId) };

      // Try to find user's first colony from database
      let colony = await Database.findDocumentFromDatabase("colony", colonyQuery);
      let levelsArray = Object.entries(colony.buildings);
      let time = new Date().getTime();

      // Mine levels for r1,r2,r3
      levelsArray = [
        levelsArray[0][1],
        levelsArray[1][1],
        levelsArray[2][1],
      ];
      let currentResources = [
        colony.resource1,
        colony.resource2,
        colony.resource3
      ];

      // Update resources in the colony to be up to date
      let resources = Resource.updateResourcesFromProduction(levelsArray[0], levelsArray[1],
                                                          levelsArray[2], colony.time, time);
      // Updated resource count
      resources = [
        currentResources[0] + resources[0],
        currentResources[1] + resources[1],
        currentResources[2] + resources[2]
      ];

      // Set updated resources into database in the same colony, update time modified
      colony = await Database.findAndUpdateFromDatabase("colony", colonyQuery, 
      {
        $set: {
          time: new Date().getTime(),
          resource1: resources[0],
          resource2: resources[1],
          resource3: resources[2],
        }
      });
      
      // Return user and colony to the calling function
      resolve([user, colony]);
      return;
    } else {
      // Create new user if not found in database
      user = await createUser(username);
      resolve(user);
      return;
    }
  } catch (error) {
    console.error(error);
  }
})



/**
 * Creates user with given username and gives user a colony
 * @param {*} username username to create account with
 * @returns array [user, colony]
 */
const createUser = (username) => new Promise( async (resolve, reject) => {
  const dbo = DB.getDb();
  const db = dbo.db("protoelf");

  // Create colony for the user
  let buildings = Obj.buildingEquations;
  // Colony with no resources or buildings, time created
  let colony = {
    resource1: 0,
    resource2: 0,
    resource3: 0,
    buildings: {},
    time: new Date().getTime()
  }

  // set levels for buildings (mines lvl 1)
  for (let i = 0; i < buildings.length; i++) {
    if (buildings[i].isResourceGenerator == true) {
      colony.buildings[buildings[i].name] = 1;
    } else {
      colony.buildings[buildings[i].name] = 0;
    }
  }

  // Create user to be saved
  // TODO saving password
  // authentication?
  let user = {
    username: username,
    password: "hash",
    email: "email@asd.com",
    colonies: []
  }

  // Insert colony into db
  db.collection("colony").insertOne(colony, (err) => {
    if (err) return;
    user.colonies.push(colony._id); // ID from db after operation

    // Insert user into db
    db.collection("player").insertOne(user, (err) => {
      if (err) return;
      // Return user and colony info for calling function
      resolve([user, colony]);
      return;
    })
  })
})