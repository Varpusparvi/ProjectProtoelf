import * as Upgrade from '../functions/upgrade.js';
import * as Login from '../functions/login.js';
import { buildings } from '../server.js';


/**
 * 
 * @param {*} body client request body
 * @returns data to send back to client
 */
export const handleLogin = async (body) => {
  let dataToSend;
  let username = body.username;
  let password = body.password;

  /*
  if (username.includes('$') || username.includes('%')) {
    console.log("Login failed: Illegal character in user input");
    dataToSend = [false]; //IsTransactionSuccesful 
    return dataToSend;
  }

  if (password.includes('$') || password.includes('%')) {
    console.log("Login failed: Illegal character in user input");
    dataToSend = [false]; //IsTransactionSuccesful 
    return dataToSend;
  }
  */

  try {
    dataToSend = await Login.login(username, password);
    dataToSend.push(buildings);
  } catch (error) {
    console.log(error);
    dataToSend = [false]; //IsTransactionSuccesful 
  }

  return dataToSend;
}


/**
 * 
 * @param {*} body client request body
 * @returns data to send back to client
 */
export const handleUpgrade = async (body) => {
  let dataToSend;
  // Upgrade a colony
  let username = body.username;
  let upgradeId = body.upgradeId;
  let upgradeLevel = body.upgradeLevel
  let colonyId = body.colonyId;

  /*
  if (username.includes('$') || username.includes('%')) {
    console.log("Upgrade failed: Illegal character in user input");
    dataToSend = [false]; //IsTransactionSuccesful 
    return dataToSend;
  }

  if (upgradeId.includes('$') || upgradeId.includes('%')) {
    console.log("Upgrade failed: Illegal character in user input");
    dataToSend = [false]; //IsTransactionSuccesful 
    return dataToSend;
  }

  if (String.toString(upgradeLevel).includes('$') || String.toString(upgradeLevel).includes('%')) {
    console.log("Upgrade failed: Illegal character in user input");
    dataToSend = [false]; //IsTransactionSuccesful 
    return dataToSend;
  }

  if (colonyId.includes('$') || colonyId.includes('%')) {
    console.log("Upgrade failed: Illegal character in user input");
    dataToSend = [false]; //IsTransactionSuccesful 
    return dataToSend;
  }
  */

  try {
    dataToSend = await Upgrade.upgrade(upgradeId, upgradeLevel, colonyId, username);
  } catch (error) {
    console.log(error);
    dataToSend = [false]; // IsTransactionSuccesful 
  }
  return dataToSend;
}


const handleUpgradeCancel = () => {

}


const handleBuildArmy = () => {

}


const handleBuildFleet = () => {

}


const handleSendArmy = () => {

}


const handleSendFleet = () => {

}