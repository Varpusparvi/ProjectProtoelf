

/* Module functions:
- getResourceRate
- getCostToNextLevel
- getResourcesPerSecond
- getResourcesDuringTime
- chechCanUpgrade
*/

const eqRateRes1Hour = (n) => {
    return (Math.pow(n,2));
}
const eqRateRes2Hour = (n) => {
    return (3*n);
}
const eqRateRes3Hour = (n) => {
    return (15/n+(3/n));
}
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
export function getResourceRate(resource, level, bonus=0) {
    var n = level;
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

// To upgrade to level X
export function getCostToNextLevel(resource, level){
    var c = level;
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

export function getResourcesPerSecond(resource,level,bonus=0){
    return (getResourceRate(resource,level,bonus)/3600);
}

// Level when started
// For one resource at the time
export function getResourcesDuringTime(resource, level, time_from, time_to, level_upgrade_array, bonus=0){

    var total_resources=0;
    var total_arr = [];
    var unstable_level = level;
    
    if(typeof level_upgrade_array !== 'undefined' && level_upgrade_array.length > 0){
        if(level_upgrade_array.length === 1){
            time_difference_ms = level_upgrade_array[0] - time_from;
            total_arr.push( getResourcesPerSecond(resource, unstable_level, bonus)/1000*time_difference_ms);
            unstable_level = unstable_level + 1;
            time_difference_ms = time_to - level_upgrade_array[0];
            total_arr.push((getResourcesPerSecond(resource, unstable_level, bonus)/1000*time_difference_ms));
            for(var i = 0; i<total_arr.length;i++){
                total_resources = total_resources + total_arr[i];
            }
            return total_resources;
        }
        else{
            time_difference_ms = level_upgrade_array[0] - time_from;
            
            total_arr.push( getResourcesPerSecond(resource, unstable_level, bonus)/1000*time_difference_ms);
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

function chechCanUpgrade(resource, level, r1, r2){
    var arr = getCostToNextLevel(resource, level);
    if(arr[0]>=r1 && arr[1]>=r2){
        return true;
    }
    else{
        return false;
    }
}

export { getResourceRate, getCostToNextLevel, getResourcesPerSecond, getResourcesDuringTime, chechCanUpgrade };
// This is a alternative for "export" in front of each function
