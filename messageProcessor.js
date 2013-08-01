//var db = require("./database_redis"); 
var db = require("./database_mysql"); 

var splitChar = "#";


function canPass(packet) {

    /*CHANGE THIS LINE TO CHECK FOR APPLICATION SEOCIFIC KEY */
    /***************************************************/
    /***************************************************/
    if(packet.crypto === packet.crypto)
        return true; 
    /***************************************************/
    /***************************************************/




    return false;
}


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
         date            : split[8], //execution date
         hour            : split[9]  //execution hour
    };


    if(!canPass(packet))
        return false;
    
    db.saveStartData(packet);
};


function processStopData(stopString) {    

    var split   = stopString.split(splitChar);
    var packet = {             
         crypto          : split[0], //encrypted key
         hardwareID      : split[1], //unique hardware ID
         clientCode      : split[2], //client code 
         version         : split[3], //version of the message 
         appVersion      : split[4], //application version     
         date            : split[5], //execution date
         hour            : split[6]  //execution hour
    };


    if(!canPass(packet))
        return false;
    
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
             date            : split[7], //execution date
             hour            : split[8]  //execution hour
        };
        

        if(!canPass(packet))
            return false;

        db.saveActionData(packet);
};



//recoveres dashboard data
function showDashboardStats(req, res) {

    if(!canPass(packet))
        return false;

    console.log("Showing dashboard data");
    var data = db.getDashboardData();



    console.log(data);
}


exports.startData            = processStartData;
exports.stopData             = processStopData;
exports.actionData           = processActionData;
exports.showDashboardStats   = showDashboardStats;
