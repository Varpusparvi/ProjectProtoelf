const Bds = require('./Buildings.js');
/* Module functions:

*/

function getResourcesPerSecond(building_id, building_level){
    let c = parseInt(building_level);
    return Bds.buildingEquations[building_id].production_eq(c);
};

console.log(Bds.buildingEquations)
console.log(getResourcesPerSecond("Mine_res_1", 5));
