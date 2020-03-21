export const gForceEquations = {
    "Military1" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "requirements" : {
            "Tech1" : 1,
            "Tech2" : 1
        },
        "damage" : 10,
        "hp" : 20,
        "damage_type" : "light",
        "armor_type" : "none",
        "type" : "ground",
        "position" : 3
    },
    "FlyingShip1" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "requirements" : {
            "Tech1" : 3,
            "Tech2" : 1
        },
        "damage" : 30,
        "hp" : 200,
        "damage_type" : "medium",
        "armor_type" : "medium",
        "type" : "flying",
        "position" : 1
    }
};
