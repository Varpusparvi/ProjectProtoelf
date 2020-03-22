
export const buildingEquations = {
    "Mine_res_1" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "production_eq" : function(n){return Math.round((3*n*0.555));}
    },
    "Mine_res_2" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "production_eq" : function(n){ return Math.round(4*n);}
    },
    "Mine_res_3" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "production_eq" : function(n){return Math.round(2*n);}
    },
    "shipyard" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "requirements" : {
            "tech2" : 1,
            "tech3" : 2
        }
    }
};

export const techEquations = {
    "tech1" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "requirements" : {
            "tech2" : 3
        }
    },
    "tech2" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "requirements" : {

        }
    }
};

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