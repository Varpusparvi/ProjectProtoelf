import { Db } from "mongodb";

/* Module functions

*/

// Building/Upgrade costs stored in a map
var building_equations_res1 = [
    {name: "b1", eq: (n) => { return 2*n}},
    {name: "b2", eq: (n) => { return 1*n}}
];

var building_equations_res2 = [
    {name: "b1", eq: (n) => { return 2*n}},
    {name: "b2", eq: (n) => { return 1*n}}
];

var building_equations_res3 = [
    {name: "b1", eq: (n) => { return 2*n}},
    {name: "b2", eq: (n) => { return 1*n}}
];

var upgrade_time_consuption = [
    {name: "b1", eq: (n) => { return 2*n}},
    {name: "b2", eq: (n) => { return 1*n}}
];


// name_id is the id of the building/upgrade/etc's id
function getUpgradeCost(name_id, colony_id){
    var level = 5// migi, haetaan databasesta colony_idllä
    var i = 0;
    var eq_1;
    var eq_2;
    var eq_3;
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
    // Res3
    for ( j in building_equations_res3 ){
        if(building_equations_res3[i].name === name_id){
            eq_3 = building_equations_res3[i].eq(level);
        }
        else{
            ++i;
        }
    }
    var arr = [eq_1,eq_2, eq_3];
    // Error check
    if (typeof arr[0] === 'undefined' || typeof arr[1] === 'undefined' || typeof arr[2] === 'undefined') {
        return "res1, res2 or res3 is undefined, name_id is propably non-existent";
    }
    else{
        return arr;
    }

}

function checkIfEnoughResources(name_id, colony_id){
    var cost_of_upgrade_res1 = getUpgradeCost(name_id, colony_id)[0];
    var cost_of_upgrade_res2 = getUpgradeCost(name_id, colony_id)[1];
    var cost_of_upgrade_res3 = getUpgradeCost(name_id, colony_id)[2];
    var real_res1 = 0; //migi, from database
    var real_res2 = 0; //migi, from database
    var real_res3 = 0; //migi, from database
    if( real_res1 >= cost_of_upgrade_res1 && real_res2 >= cost_of_upgrade_res2 && real_res3 >= cost_of_upgrade_res3){
        return true;
    }else{
        return false;
    }
}


// For server to use
function upgrade(colony_id, name_id){
    

    var level = 0; //migi, from database

    // Checks if there are enough of all resources
    if( checkIfEnoughResources(name_id, colony_id)){
        /*
        Databaseen resurssien kirjaus
        Resource in database -= cost_of_upgrade_resX;
        */
        // 
        for ( j in upgrade_time_consuption ){
        if(upgrade_time_consuption[i].name === name_id){
            var time = upgrade_time_consuption[i].eq(level);
        }
        else{
            ++i;
        }
        // migi ,time kirjaus databaseen siihen tulevat tapahtumat, tästä vielä neuvoteltava
        return "Modifications to the database has been made";
    }
        
    }else{
        // Returns a string to the server indicating there are not enough resources
        // to build or upgrade.
        return "Not enough resources";
    }

}



