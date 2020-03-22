import * as Obj from './Objects.js';

/**
 * 
 * @param {*} id Id of the building
 * @param {*} type Type of the building ie.(building, tech, groundforce)
 * @returns Object indicating ID and required level
 * @returns If there are no requirements returns: "no requirements"
 * 
 */
export function getRequirements(id, type){
    let reqObj;
    switch(type){
        case "building":
            reqObj = Obj.buildingEquations;
            break;
        case "tech":
            reqObj = Obj.techEquations;
            break;
        case "groundforce":
            reqObj = Obj.gForceEquations;
            break;
        default:
            return "Error with type-parameter";
    }
    if("requirements" in reqObj[id] === false){
        return "no requirements";
    }else{
        var data = {};
        for(let item in reqObj[id].requirements){
            data[item] = reqObj[id].requirements[item];
        }
        return data;
    }
};

/**
 * 
 * @param {*} id Id of the building
 * @param {*} type Type of the building ie.(building, tech, groundforce)
 * @param {*} tech_obj tech tree of the player as an object {"tech2" : 1 }, {ID : level}
 * @param {*} building_obj building tree of the player as an object { "shipyard" : 2}, {ID : level}
 * @returns Either "Requirements are met" or "Requirements are not met" (or errors)
 */
export function checkRequirements(id, type, tech_obj, building_obj){
    let req = getRequirements(id, type);
    if(req==="No requirements"){
        return "No requirements";
    }
    if(req==="Error with type-parameter"){
        return "Error with type-parameter";
    }
    let hasObj = {};
    Object.assign(hasObj,tech_obj);
    Object.assign(hasObj, building_obj);

    let allgood = true;
    for(let item in req){
        if(req[item] > hasObj[item]){
            allgood = false;
        }
    }
    if(allgood){
        return "Requirements are met";
    }else{
        return "Requirements are not met";
    }
};