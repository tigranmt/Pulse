 /**NOT USED FOR NOW */

 var start = require("../server");
 var redis = require("redis");
 var client = redis.createClient();


 var clientPreChar 		= "%";
 var hardwarePreChar 	= "$";
 var startPre			= "$start_";	
 var stopPre			= "$stop_";	
 var actionPre			= "$a_";

 /*The maximum supproted count of a hardware IDs possible store FOR SINGLE CLIENT
   Can be changed in the future, to meet the needs of bigger systems
 */
 var maxHardwareIDsSupported = 10;



 var clientReady = false;

 client.on("error", function (err) {
    console.log("Error " + err);
 });

 client.on("ready", function() {
 	clientReady = true;
 	console.log("Client is ON");
 });

 client.on("end", function() {
 	clientReady = false;
 	console.log("Client is OFF");
 });



       
//Saves stop data in database
function saveStartData(startData) {


    /*var packet = {             
         crypto          : split[0], //encrypted key
         hardwareID      : split[1], //unique hardware ID
         clientCode      : split[2], //client code 
         version         : split[3], //version of the message 
         appVersion      : split[4], //application version
         os              : split[5], //OS name (XP, Vista, Windows7, Ubuntu....)
         processor       : split[6], //processor info
         country         : split[7], 
         date            : split[8], //execution date
         hour           :  split[9], //execution hour
    };*/

    var clientComplete 		=  clientPreChar + startData.clientCode;
    var hardwareComplete 	=  hardwarePreChar +  startData.hardwareID;

    var startComplete 		=  startPre + hardwareComplete;


	if(clientReady === false) {
		console.log("Client is not ready"); 
		return false;
	}

    console.log("Saving start data: " + startData.hardwareID + " " + startData.clientCode);
    

    //save hardware IDs in corriposndence with client ID
	client.lrange(clientComplete, 0, 10, function (err, reply) {			
			
			
     		var arr = null;

            console.log("reply: " + reply.toString());

     		if(reply !== null) 
				arr = reply.toString(); //get all hardware IDs related to this client code 

			if(arr !== "") {
				console.log("arr value is: " + arr);
				var split = arr.split(',');  //construct array 

				//check if in the list of the available hardware IDs there is already one with the same name
				var foundIndex = split.indexOf(hardwareComplete);  
				if(foundIndex < 0) {
				  	console.log("Not present any hardwareID: " + hardwareComplete);
				   
				    //get the length of the list of hardware IDs associated with specified client ID
				  	client.llen(clientComplete, function (err, reply) {
						
						//guess correct index of the new element
						var insertIndex = reply; 
						// check if this NEW hardware ID  can be pushged on list and list
						// still remains in the accepted listst dimensions
						if(insertIndex === maxHardwareIDsSupported) {
							insertIndex = maxHardwareIDsSupported - 1; 
							client.lset(clientComplete, insertIndex, hardwareComplete);
						}
						else {
							// dimension of the list is less maxHardwareIDsSupported, so just append this new 
							// hardware ID to the list of client code 
							client.lpush(clientComplete, hardwareComplete);
						}				
						
						
				  	});

					
				}
				else {
					
					console.log("Found hardwareID: " + hardwareComplete);
				}
			}
			else {

				//there is no ANY data present for specified client ID , so just insert at 0 index
				console.log("setting " + clientComplete + " at index 0 the value: " + hardwareComplete);
				client.lpush(clientComplete, hardwareComplete);
			}
			   


	}); 

	//save hardware ID info in relation to properties of machine 
 	client.hmset(hardwareComplete, "client", clientComplete, "appVersion", startData.appVersion, "os", startData.os, "processor", startData.processor, "country", startData.country, redis.print );
 	client.hmset(startComplete, "hardware", hardwareComplete, "client", clientComplete, "date", startData.date, "hour", startData.hour, redis.print );			
	
};

function saveStopData (stopData) {
	if(clientReady === false) {
		console.log("Client is not ready"); 
		return false;
	}

 	
	/* var packet = {             
         crypto          : split[0], //encrypted key
         hardwareID      : split[1], //unique hardware ID
         clientCode      : split[2], //client code 
         version         : split[3], //version of the message 
         appVersion      : split[4], //application version     
         date            : split[5], //execution date
         hour			 : split[6]  //execution hour
     };*/

 	var clientComplete 		= clientPreChar + stopData.clientCode;
    var hardwareComplete 	= hardwarePreChar +  stopData.hardwareID;
    var stopComplete 		= stopPre + hardwareComplete;


    
 	client.hmset(stopComplete, "hardware", hardwareComplete, "client", clientComplete, "date", stopData.date, "hour", stopData.hour, redis.print );			
	

};

function saveActionData (actionData) {
	if(clientReady === false) {
		console.log("Client is not ready"); 
		return false;
	}

 	/*
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
 	*/

	var clientComplete 		= clientPreChar + actionData.clientCode;
    var hardwareComplete 	= hardwarePreChar +  actionData.hardwareID;
    var actionComplete 		= actionPre + hardwareComplete;

	
	var concat = hardwareComplete + "|" + clientComplete + "|" + actionData.actionName + "|" +  actionData.actionValue + "|" + actionData.date + "|" + actionData.hour;

    client.lpush(actionComplete, concat, redis.print );		


};        


//Get overall information about data present in base
function getDashboardData() {
	console.log("Getting dashborad data from DB...");
	if(clientReady === false) {
		console.log("Client is not ready"); 
		return false;
	}
	return client.get("W -DCW2CVE464248", function (err, reply) {
        console.log(reply.toString()); // prints "Value" to the console
       // console.log(err.toString());   // prints error
    });
}



exports.saveStartData    = saveStartData;
exports.saveStopData     = saveStopData;
exports.saveActionData   = saveActionData;


exports.getDashboardData = getDashboardData;

