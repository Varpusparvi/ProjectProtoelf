/* Module functions

*/
// Building costs stored in a map
var building_equations = [
    {name: "b1", eq: function formula(n) { return 2*level}},
    {name: "b2", eq: "3 * level + ( level + level ) / 3"}
];




export function getBuildingCost(name_id, colony_id){
    var level = 5// migi, haetaan databasesta colony_idllä
    var equation = building_equations.map(name_id); // Voiko mapissa olla 3 
    return equation(level);
    console.log(equation)
}

