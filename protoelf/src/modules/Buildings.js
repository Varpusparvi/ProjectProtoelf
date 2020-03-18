//import { Db } from "mongodb";

/* Module functions
    -- Contains the datastructure for all equations considering buildings
    - getBuildingResourceCost
    - getTimeConsumptionOnbuildingUpgrade
    - getResourceProduction
*/


// MIGI mp tästä
// "Mine_res_1" equals ID of the building
const buildingEquations = {
    "Mine_res_1" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "production_eq" : function(n){return (3*n*0.555).toFixed(5);}
    },
    "Mine_res_2" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "production_eq" : function(n){return 4*n;}
    },
    "Mine_res_3" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "production_eq" : function(n){return 4*n;}
    }
};

/**
 * 
 * @param {*} building_id ID of the building, ID naming still under process
 * @param {*} building_level Level of the building
 * @returns Array which contains required resources for upgrade [r1,r2,r3]
 */
function getBuildingUpgradeCost(building_id, building_level){
    let c = parseInt(building_level);
    let r1 = buildingEquations[building_id].cost_eq.res1(c);
    let r2 = buildingEquations[building_id].cost_eq.res2(c);
    let r3 = buildingEquations[building_id].cost_eq.res3(c);
    return [r1,r2,r3];
};

/**
 * 
 * @param {*} building_id ID of the building
 * @param {*} building_level Level of the building
 * @returns Upgrade time in seconds, from start to finish
 */
function getTimeConsumptionOnBuildingUpgrade(building_id, building_level){
    let c = parseInt(building_level);
    return buildingEquations[building_id].time_eq(c);
};

/**
 * 
 * @param {*} building_id ID of the building
 * @param {*} building_level Level of the building
 * @returns Production of the building (A mine)
 */
function getResourceProduction(building_id, building_level){
    let c = parseInt(building_level);
    return buildingEquations[building_id].production_eq(c);
};

module.exports = {
    buildingEquations,
    getBuildingUpgradeCost,
    getResourceProduction,
    getTimeConsumptionOnBuildingUpgrade
};