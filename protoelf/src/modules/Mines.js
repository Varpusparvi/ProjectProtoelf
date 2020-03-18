const Bds = require('./Buildings.js');
/* Module functions:

*/

/**
 * 
 * @param {*} building_id Id of the building
 * @param {*} building_level Level of the building
 * @returns Resource generation rate per one second
 */
function getResourcesPerSecond(building_id, building_level){
    let c = parseInt(building_level);
    return Bds.buildingEquations[building_id].production_eq(c);
};

/**
 * Helper function
 * @param {*} level1 Level of mine 1
 * @param {*} level2 Level of mine 2
 * @param {*} level3 Level of mine 3
 * @returns Array of three with the resource production rate per second [r1,r2,r3]
 */
function getResourcesPerSecondAll(level1,level2,level3){
    let a = parseInt(level1);
    let b = parseInt(level2);
    let c = parseInt(level3);
    return [Bds.buildingEquations[Bds.IdMine1].production_eq(a),
            Bds.buildingEquations[Bds.IdMine2].production_eq(b),
            Bds.buildingEquations[Bds.IdMine3].production_eq(c)];
};

/**
 * Good function to use with database's lastChecked-time with Time.now
 * Good to call this function before any event that might affect resources
 * @param {*} level1 Level of the mine 1
 * @param {*} level2 Level of the mine 2
 * @param {*} level3 Level of the mine 3
 * @param {*} from Time as milliseconds, from where to begin the calculation
 * @param {*} to Time as milliseconds, to where to end the calculation
 * @returns Array of three with the amount of each resource generated from time period [r1,r2,r3]
 */
function updateResourcesFromProduction(level1, level2, level3, from, to){
    let resource_rate_arr = getResourcesPerSecondAll(level1,level2,level3);
    let time_difference_seconds = (to-from)/1000;
    for(let i = 0; i<resource_rate_arr.length;i++){
        resource_rate_arr[i] = resource_rate_arr[i]*time_difference_seconds;
    }
    return resource_rate_arr;
};

module.exports = {
    getResourcesPerSecond,
    getResourcesPerSecondAll,
    updateResourcesFromProduction
};