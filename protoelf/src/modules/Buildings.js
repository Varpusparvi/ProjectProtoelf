import * as Obj from './Objects.js';
/* Module functions
    -- Contains the datastructure for all equations considering buildings
    - getBuildingResourceCost
    - getTimeConsumptionOnbuildingUpgrade
    - getResourceProduction
*/


/**
 * 
 * @param {*} building_id ID of the building, ID naming still under process
 * @param {*} building_level Level of the building
 * @returns Array which contains required resources for upgrade [r1,r2,r3]
 */
export function getBuildingUpgradeCost(building_id, building_level){
    let c = parseInt(building_level);
    let r1 = Obj.buildingEquations[building_id].cost_eq.res1(c);
    let r2 = Obj.buildingEquations[building_id].cost_eq.res2(c);
    let r3 = Obj.buildingEquations[building_id].cost_eq.res3(c);
    return [r1,r2,r3];
};

/**
 * 
 * @param {*} building_id ID of the building
 * @param {*} building_level Level of the building
 * @returns Upgrade time in seconds, from start to finish
 */
export function getTimeConsumptionOnBuildingUpgrade(building_id, building_level){
    let c = parseInt(building_level);
    return Obj.buildingEquations[building_id].time_eq(c);
};

