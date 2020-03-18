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

function getResourcesPerSecondAll(level1,level2,level3){
    let a = parseInt(level1);
    let b = parseInt(level2);
    let c = parseInt(level3);
    return [Bds.buildingEquations['Mine_res_1'].production_eq(a),
            Bds.buildingEquations['Mine_res_2'].production_eq(b),
            Bds.buildingEquations['Mine_res_3'].production_eq(c)];
};

console.log(getResourcesPerSecondAll(1,1,1))