

/* Module functions:
- Get_resource_rate
- Get_cost_to_next_level
- Get_resources_per_hour

*/


var eq_rate_res1_hour = n^2;
var eq_rate_res2_hour = 3*n;
var eq_rate_res3_hour = 15*(1/n);

function Get_resource_rate(resource, level, bonus=0) {
    var n = level;
    var eq;
    if(resource === 1){
        eq = eq_rate_res1_hour;
    }
    if(resource === 2){
        eq = eq_rate_res2_hour;
    }
    if(resource === 3){
        eq = eq_rate_res3_hour;
    }
    return eq + eq*(bonus/100);
}

Get_resource_rate(1,2,130);