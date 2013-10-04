//var db = require("./database_redis"); 
var db = require("../database/database_mysql"); 

var splitChar = "#";


function canPass(packet) {

    /*CHANGE THIS LINE TO CHECK FOR APPLICATION SPECIFIC KEY */
    /***************************************************/
    /***************************************************/
    if("125D3F3F-17FB-4CF6-B7D3-DEF29E4F9E8E" === packet.crypto)
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


    if(!canPass(packet)) {
        
        throw "Non valid app key";
        return false;

    }
    
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



function processErrorData(actionString) {
    var split   = actionString.split(splitChar);
       var packet = {             
             crypto          : split[0], //encrypted key
             hardwareID      : split[1], //unique hardware ID
             clientCode      : split[2], //client code 
             version         : split[3], //version of the message 
             appVersion      : split[4], //application version
             errorName      : split[5],  //error name
             errorValue     : split[6],  //error value            
             date            : split[7], //execution date
             hour            : split[8]  //execution hour
        };
        

        if(!canPass(packet))
            return false;

        db.saveErrorData(packet);
};



exports.startData                    = processStartData;
exports.stopData                     = processStopData;
exports.actionData                   = processActionData;
exports.errorData                    = processErrorData;


