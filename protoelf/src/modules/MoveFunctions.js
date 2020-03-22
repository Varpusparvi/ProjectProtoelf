

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
 * @returns [[res1,res2,res3], to_as_ColId]
 */
export function transport(event){
    let resources = [event.resources[0],event.resources[1],event.resources[2]];
    let to = event.to;
    return [resources, to];
};

/**
 * 
 * @param {*} event Event object from the database/server
 * @returns [[res1,res2,res3], to_as_colID, ["ship1",5 as how many ship1],...,["shipN",3]]
 */
export function deploy(event){
    let resources = [event.resources[0],event.resources[1],event.resources[2]];
    let to = event.to;
    let return_arr = [resources, to];
    for(let item in event.forces){
        return_arr.push([item,event.forces[item]]);
    }
    return return_arr;
};
