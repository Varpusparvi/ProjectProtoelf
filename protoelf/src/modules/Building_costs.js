/* Module functions

*/
// Building costs stored in a map
var building_equations = [
    {name: "b1", eq: (n) => { return 2*n}},
    {name: "b2", eq: (n) => { return 1*n}}
];




function getBuildingCost(name_id, colony_id){
    var level = 5// migi, haetaan databasesta colony_idllä
    var i = 0;
    for ( j in building_equations ){
        if(building_equations[i].name === name_id){
            return building_equations[i].eq(level);
        }
        else{
            ++i;
        }
    }
    return "error";
    
    
    
}

console.log(getBuildingCost("b2",5))