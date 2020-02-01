

/* Module functions:
- getResourceRate
- getCostToNextLevel
- getResourcesPerSecond
- getResourcesDuringTime
- chechCanUpgrade
- updateResources
*/

// Setting up the database variable
var dbo = db.db('protoelf'); // Change

// Resource generation equations
const eqRateRes1Hour = (n) => {
    return (Math.pow(n,2));
}
const eqRateRes2Hour = (n) => {
    return (3*n);
}
const eqRateRes3Hour = (n) => {
    return (15/n+(3/n));
}

// Mine costs to the next level for each mine for each two resource
const eqCostToNextLevelMine1Res1 = (c) => {
    return (20*c+(Math.pow(1.3,c)));
}
const eqCostToNextLevelMine1Res2 = (c) => {
    return (10*c+(Math.pow(1.1,c)));
}

const eqCostToNextLevelMine2Res1 = (c) => {
    return (120*c+(Math.pow(1.4,c)));
}
const eqCostToNextLevelMine2Res2 = (c) => {
    return (50*c+(Math.pow(1.2,c)));
}

const eqCostToNextLevelMine3Res1 = (c) => {
    return (200*c+(Math.pow(1.7,c)));
}
const eqCostToNextLevelMine3Res2 = (c) => {
    return (185*c+(Math.pow(1.4,c)));
}



// Bonus is in format 20% which means 120%
// Need resource, colony_id
// await dbo.collection('colony').findOne(playerQuery)
// Returns the resource rate for spesific resource per hour with possible resource generation bonus
export function getResourceRate(resource, colony_id) {
    var n = level; //migi, find mine level from database using player/colony id (?)
    var bonus = 0; //migi, find resource generation bonus from database using id
    var eq;
    if(resource === 1){
        eq = eqRateRes1Hour(level);
    }
    if(resource === 2){
        eq = eqRateRes2Hour(level);
    }
    if(resource === 3){
        eq = eqRateRes3Hour(level);
    }
    return eq + eq*(bonus/100);
}

// Returns the mine cost for the next level as an array [resource 1, resource 2]
export function getCostToNextLevel(resource, colony_id){
    var level; //migi, find mine level from database using colony id (?)
    var eq1;
    var eq2;
    if(resource === 1){
        eq1 = eqCostToNextLevelMine1Res1(level);
        eq2 = eqCostToNextLevelMine1Res2(level);
    }
    if(resource === 2){
        eq1 = eqCostToNextLevelMine2Res1(level);
        eq2 = eqCostToNextLevelMine2Res2(level);
    }
    if(resource === 3){
        eq1 = eqCostToNextLevelMine3Res1(level);
        eq2 = eqCostToNextLevelMine3Res2(level);
    }
    var arr = [eq1,eq2];
    return arr;
}

// Returns the resource rate for spesific resource per second
export function getResourcesPerSecond(resource, colony_id){
    return (getResourceRate(resource, colony_id)/3600);
}

// migi, tutkis tää, voiko kirjottaa databaseen suoraan?
// Updates the resources before server applys the consequences of the new event
// Should be called every time action is being made/event happening
//
// Returns the amount of generated resources in spesific colony in certain time as an array [resource 1, resource 2, resource 3]
export function updateResources(colony_id, time_ms){
    // Setting up the mine levels and bonuses for resource generation
    var level_res1; //migi, nää databasesta xd
    var level_res2;
    var level_res3;

    return [(getResourcesPerSecond(1,colony_id)/1000)*time_ms, 
            (getResourcesPerSecond(2,colony_id)/1000)*time_ms,
            (getResourcesPerSecond(3,colony_id)/1000)*time_ms];

    // Jos tää voi kirjottaa suoraan databaseen niiin:
    /*
    var res1 = getResourcesPerSecond(1,colony_id)/1000)*time_ms;
    var res2 = getResourcesPerSecond(1,colony_id)/1000)*time_ms;
    var res3 = getResourcesPerSecond(1,colony_id)/1000)*time_ms;

    Tähän sitten miten ikinä sinne databaseen kirjotetaankaan :)

    */
}

// Ei tarvita mihinkään?
// migi, HUOM kesken, ei varmuutta miten tulevat/menneet tapahtumat varastoitu databaseen, eli ei tähän toistaiseksi muutoksia
// Level when started
// For one resource at the time
// migi, pohdin tähän myös että voiko ainakin ton time_from parametrin ottaa databasesta?
export function getResourcesDuringTime(resource, colony_id, time_from, time_to){

    var total_resources=0;
    var total_arr = [];
    var bonus = 0; // Tähän mahd generation bonus databasesta
    var level = //migi, tähän minen level databasesta colony id:llä
    var unstable_level = level; 
    var level_upgrade_array = // migi, tähän ne madh päivitykset mineen databasesta, oletus arvona annetaan [] eli tyhjä array
    
    if(typeof level_upgrade_array !== 'undefined' && level_upgrade_array.length > 0){
        if(level_upgrade_array.length === 1){
            time_difference_ms = level_upgrade_array[0] - time_from;
            total_arr.push( getResourcesPerSecond(resource, colony_id)/1000*time_difference_ms);
            unstable_level = unstable_level + 1;
            time_difference_ms = time_to - level_upgrade_array[0];
            total_arr.push((getResourcesPerSecond(resource, colony_id)/1000*time_difference_ms));
            for(var i = 0; i<total_arr.length;i++){
                total_resources = total_resources + total_arr[i];
            }
            return total_resources;
        }
        else{
            time_difference_ms = level_upgrade_array[0] - time_from;
            
            total_arr.push( getResourcesPerSecond(resource, colony_id)/1000*time_difference_ms);
            unstable_level = unstable_level + 1;

            for(var i = 0; i < level_upgrade_array.length-1;i++){
                time_difference_ms = level_upgrade_array[i+1] - level_upgrade_array[i];
                total_arr.push( getResourcesPerSecond(resource, unstable_level, bonus)/1000*time_difference_ms);
                unstable_level = unstable_level + 1;
                
            }
            
            time_difference_ms = time_to - level_upgrade_array[level_upgrade_array.length-1];
            total_arr.push( getResourcesPerSecond(resource, unstable_level, bonus)/1000*time_difference_ms);
            for(var i = 0; i<total_arr.length;i++){
                total_resources = total_resources + total_arr[i];
            }
            
            return total_resources;
        }
            
    }
    else{

        var time_difference_ms = time_to - time_from;

        return ((getResourcesPerSecond(resource, unstable_level, bonus)/1000)*time_difference_ms);
    }

}

// Checks if the colony has enough resources for the next mine level
// Returns true or false
export function checkCanUpgrade(resource, colony_id){
    var level = //migi, Tähän taas minen lvl databasesta
    var r1 = //migi, Tähän pelaajan resurssit databasesta
    var r2 //migi, tähän sama toiselle resurssille
    var arr = getCostToNextLevel(resource, player_id);
    if(arr[0]>=r1 && arr[1]>=r2){
        return true;
    }
    else{
        return false;
    }
}

//export { getResourceRate, getCostToNextLevel, getResourcesPerSecond, getResourcesDuringTime, chechCanUpgrade };
// This is a alternative for "export" in front of each function
