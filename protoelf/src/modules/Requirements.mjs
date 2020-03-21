import * as Bds from './Buildings.js';
import * as T from './Tech.js';
import * as G from './GroundForces.js';


function getRequirements(id, type){

    let reqObj;
    let id = toString(id);
    switch(type){
        case "building":
            reqObj = Bds.buildingEquations;
            break;
        case "tech":
            reqObj = T.techEquations;
            break;
        case "groundforce":
            reqObj = G.gForceEquations;
            break;
        default:
            return "Error with type-parameter";
    }
    if(reqObj[id].requirements === undefined){
        return [];
    }else{
        var data = [];
        for(let item in reqObj){
            data.push([item.keys(),item[item]]);
        }
        return data;
    }
};

console.log(getRequirements("shipyard", "building"));

