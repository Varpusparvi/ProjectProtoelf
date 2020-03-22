

/**
 * 
 * @param {*} xy_from [x,y] from
 * @param {*} xy_to [x,y] to
 * @param {*} speed Speed of the slowest vessel
 * @returns Time needed to move
 */
export function getMoveTime(xy_from, xy_to, speed){
    let euc = Math.sqrt(Math.pow(xy_from[0]-xy_to[0],2)+Math.pow(xy_from[1]-xy_to[1],2));
    return euc/speed;
};

/**
 * 
 * @param {*} event Event object from the database/server
 * @returns If phase === start : [new_phase,[res1,res2,res3],[force:number_of_the_force],...]
 * @returns If phase === arrival : [new_phase, resources_carried_by_fleet as [res1,res2,res3], resource to be delivered as [res1,res2,res3], resources to delivered to as ColID, [force:number_of_the_force],...]
 * @returns If phase === end : [resources_carried_by_fleet as [res1,res2,res3], added troops to as ColID, [force:number_of_the_force],...]
 * @returns Error if problems with event.phase
 */
export function transport(event){
    let resources = [event.resources[0],event.resources[1],event.resources[2]];
    let to = event.to;
    if(event.phase === "start"){
        return ["arrival",resources, gatherForces(event)];
    }
    if(event.phase === "arrival"){
        return ["end", [0,0,0], resources, to, gatherForces(event)];
    }
    if(event.phase === "end"){
        return [[0,0,0], event.from, gatherForces(event)];
    }
    return "Error with event.phase";
};

/**
 * 
 * @param {*} event Event object from the database/server
 * @returns If phase === start : [new_phase,[res1,res2,res3], troops to be removed from as ColID, ["ship1",5 as how many ship1],...,["shipN",3]]
 * @returns If phase === arrival : [[res1,res2,res3], to_as_colID, ["ship1",5 as how many ship1],...,["shipN",3]]
 * @returns Error with event.phase
 */
export function deploy(event){
    let resources = [event.resources[0],event.resources[1],event.resources[2]];
    let to = event.to;
    
    if(event.phase === "start"){
        return ["arrival",resources, event.from, gatherForces(event)];
    }
    if(event.phase === "arrival"){
        return [resources, event.to, gatherForces];
    }
    return "Error with event.phase";
};




function gatherForces(event){
    let return_arr = [];
    for(let item in event.forces){
        return_arr.push([item,event.forces[item]]);
    }
    return return_arr;
}