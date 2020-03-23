import * as Obj from './Objects.js';

/* Module functions:
    -getResourcesPerSecond
    -getResourcesPerSecondAll
    updateResourcesFromProduction
*/

/**
 * 
 * @param {*} building_id Id of the building
 * @param {*} building_level Level of the building
 * @returns Resource generation rate per one second
 */
export function getResourcesPerSecond(building_id, building_level) {
    for (let i = 0; i < Obj.buildingEquations.length; i++) {
        if (Obj.buildingEquations[i].name === building_id) {
            return Obj.buildingEquations[i].production_eq(building_level);
            break;
        }
    }
    return;
};


/**
 * Helper function
 * @param {*} level1 Level of mine 1
 * @param {*} level2 Level of mine 2
 * @param {*} level3 Level of mine 3
 * @returns Array of three with the resource production rate per second [r1,r2,r3]
 */
export function getResourcesPerSecondAll(level1, level2, level3) {
    let resourcePerSecArray = [];
    let x = Obj.buildingEquations[0].production_eq(level1);
    let y = Obj.buildingEquations[1].production_eq(level2);
    let z = Obj.buildingEquations[2].production_eq(level3);
    resourcePerSecArray.push(x, y, z);
    return resourcePerSecArray;
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
export function updateResourcesFromProduction(level1, level2, level3, from, to){
    let resource_rate_arr = getResourcesPerSecondAll(level1,level2,level3);
    // To seconds
    let time_difference_seconds = (to-from)/1000;
    for(let i = 0; i<resource_rate_arr.length;i++){
        resource_rate_arr[i] = resource_rate_arr[i]*time_difference_seconds;
    }
    return resource_rate_arr;
};
