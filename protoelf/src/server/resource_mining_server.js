const DB = require('./db.js');
const ServerHelper = require('./server_functions.js');
const Database = require('./db_functions.js');
let ObjectId = require('mongodb').ObjectID
/* Module functions:
- getResourceRate
- getCostToNextLevel
- getResourcesPerSecond
- getResourcesDuringTime
- chechCanUpgrade
- updateResources
*/



// Resource generation equations
const eqRateRes1Hour = (n) => {
  return (Math.pow(n,2)) * 1000;
}
const eqRateRes2Hour = (n) => {
  return (3*n) * 1000;
}
const eqRateRes3Hour = (n) => {
  return (15/n+(3/n)) * 1000;
}

// Mine costs to the next level for each mine for each two resource
const eqCostToNextLevelMine1Res1 = (c) => {
  return (20*c+(Math.pow(1.3,c)));
}
const eqCostToNextLevelMine1Res2 = (c) => {
  return (10*c+(Math.pow(1.1,c)));
}

const eqCostToNextLevelMine2Res1 = (c) => {
  return (120*c+(Math.pow(1.4,c)));
}
const eqCostToNextLevelMine2Res2 = (c) => {
  return (50*c+(Math.pow(1.2,c)));
}

const eqCostToNextLevelMine3Res1 = (c) => {
  return (200*c+(Math.pow(1.7,c)));
}
const eqCostToNextLevelMine3Res2 = (c) => {
  return (185*c+(Math.pow(1.4,c)));
}


// Returns the mine cost for the next level as an array [resource 1, resource 2]
function getCostToNextLevel(resource, colony_id){
  var level; //migi, find mine level from database using colony id (?)
  var eq1;
  var eq2;
  if(resource === 1){
    eq1 = eqCostToNextLevelMine1Res1(level);
    eq2 = eqCostToNextLevelMine1Res2(level);
  }
  if(resource === 2){
    eq1 = eqCostToNextLevelMine2Res1(level);
    eq2 = eqCostToNextLevelMine2Res2(level);
  }
  if(resource === 3){
    eq1 = eqCostToNextLevelMine3Res1(level);
    eq2 = eqCostToNextLevelMine3Res2(level);
  }
  var arr = [eq1,eq2];
  return arr;
}


/**
 * 
 * @param {*} resource Type of resource 1, 2 , 3
 * @param {*} resLevel Corresponding level of the resource mine
 * @param {*} bonus Resource production bonus as 1.6 = 160% for corresponding resource
 */
const getResourceRate = (resource, resLevel, bonus=0) => {
  let eq;
  let bonus = bonus;
  if(resource === 1){
    eq = eqRateRes1Hour(resLevel);
  }
  if(resource === 2){
    eq = eqRateRes2Hour(resLevel);
  }
  if(resource === 3){
    eq = eqRateRes3Hour(resLevel);
  }
  return eq + eq*bonus;
}


/**
 * 
 * @param {*} time_ms Time elapsed between Time.now and lastChecked time
 * @param {*} levelsArray Mines' levels as an array 
 * @param {*} r1_bonus Bonus generation for res1
 * @param {*} r2_bonus Bonus generation for res2
 * @param {*} r3_bonus Bonus generation for res3
 * @returns Generated resources as an array
 */
const updateResources = (time_ms, levelsArray, r1_bonus=0, r2_bonus=0, r3_bonus=0) => {
  let level_res1 = levelsArray[0];
  let level_res2 = levelsArray[1];
  let level_res3 = levelsArray[2];
  let r1_bonus = r1b;
  let r2_bonus = r2b;
  let r3_bonus = r3b;
  let res1 = eqRateRes1Hour(level_res1)/3600*(time_ms/1000);
  let res2 = eqRateRes2Hour(level_res2)/3600*(time_ms/1000);
  let res3 = eqRateRes3Hour(level_res3)/3600*(time_ms/1000);
  res1 = res1 + res1*r1b;
  res2 = res2 + res2*r2b;
  res3 = res3 + res3*r3b;
  return [res1, res2, res3];
}


// Checks if the colony has enough resources for the next mine level
// Returns true or false
function checkCanUpgrade(resource, colony_id){
  var arr = getCostToNextLevel(resource, colony_id);
  var level; //migi, Tähän taas minen lvl databasesta
  var r1; //migi, Tähän pelaajan resurssit databasesta
  var r2;//migi, tähän sama toiselle resurssille
  if(arr[0]>=r1 && arr[1]>=r2){
      return true;
  }
  else{
      return false;
  }
}

//export { getResourceRate, getCostToNextLevel, getResourcesPerSecond, getResourcesDuringTime, chechCanUpgrade };
// This is a alternative for "export" in front of each function
module.exports = {
  updateResources
}