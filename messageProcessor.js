var db = require("./database"); 

var splitChar = "#";
function processStartData(startString) {    

    
    var split   = startString.split(splitChar);
    var packet = {             
         crypto          : split[0], //encrypted key
         hardwareID      : split[1], //unique hardware ID
         clientCode      : split[2], //client code 
         version         : split[3], //version of the message 
         appVersion      : split[4], //application version
         os              : split[5], //OS name (XP, Vista, Windows7, Ubuntu....)
         processor       : split[6], //processor info
         country         : split[7], 
         date            : split[8] //execution date
    };
    
    db.saveStartData(packet);
};


function processStopData(startString) {    

    var split   = startString.split(splitChar);
    var packet = {             
         crypto          : split[0], //encrypted key
         hardwareID      : split[1], //unique hardware ID
         clientCode      : split[2], //client code 
         version         : split[3], //version of the message 
         appVersion      : split[4], //application version     
         date            : split[4], //execution date
    };
    
    db.saveStopData(packet);
};


function processActionData(actionString) {
    var split   = actionString.split(splitChar);
       var packet = {             
             crypto          : split[0], //encrypted key
             hardwareID      : split[1], //unique hardware ID
             clientCode      : split[2], //client code 
             version         : split[3], //version of the message 
             appVersion      : split[4], //application version
             actionName      : split[5], //action name
             actionValue     : split[6], //action value            
             date            : split[7]  //execution date
        };
        
        db.saveActionData(packet);
};



//recoveres dashboard data
function showDashboardStats(req, res) {

    console.log("Showing dashboard data");
    var data = db.getDashboardData();
    console.log(data);
}


exports.startData            = processStartData;
exports.stopData             = processStopData;
exports.actionData           = processActionData;
exports.showDashboardStats   = showDashboardStats;
