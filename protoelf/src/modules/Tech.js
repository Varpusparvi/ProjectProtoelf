
const TechEquations = {
    "Tech1" : {
        "cost_eq" : {
            "res1" : function(n){return 1*n;},
            "res2" : function(n){return 2*n;},
            "res3" : function(n){return 3*n;}
        },
        "time_eq" : function(n){return 3*n;},
        "requirements" : {
            "Tech2" : 3
        }
    },
    "Tech2" : {
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



module.exports = {
    TechEquations
};