/* Module functions

*/
// Building costs stored in a map
var building_equations_res1 = [
    {name: "b1", eq: (n) => { return 2*n}},
    {name: "b2", eq: (n) => { return 1*n}}
];

var building_equations_res2 = [
    {name: "b1", eq: (n) => { return 2*n}},
    {name: "b2", eq: (n) => { return 1*n}}
];




function getBuildingCost(name_id, colony_id){
    var level = 5// migi, haetaan databasesta colony_idllä
    var i = 0;
    var eq_1;
    var eq_2;
    // Res1
    for ( j in building_equations_res1 ){
        if(building_equations_res1[i].name === name_id){
            eq_1 = building_equations_res1[i].eq(level);
        }
        else{
            ++i;
        }
    }
    i = 0;
    // Res2
    for ( j in building_equations_res2 ){
        if(building_equations_res2[i].name === name_id){
            eq_2 = building_equations_res2[i].eq(level);
        }
        else{
            ++i;
        }
    }
    var arr = [eq_1,eq_2];
    // Error check
    if (typeof arr[0] === 'undefined' || typeof arr[1] === 'undefined') {
        return "res1 or res2 is undefined, name_id is propably non-existent";
    }
    else{
        return arr;
    }

}

console.log(getBuildingCost("b2",5))