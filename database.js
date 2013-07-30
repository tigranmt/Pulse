 var start = require("./start");
 var redis = require("redis");
 var client = redis.createClient();



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
         date            : split[8] //execution date
    };*/


	if(clientReady === false) {
		console.log("Client is not ready"); 
		return false;
	}

    console.log("Saving start data: " + startData.hardwareID + " " + startData.clientCode);
	client.set(startData.clientCode, startData.hardwareID, redis.print);
	
};

function saveStopData (stopData) {
	if(clientReady === false) {
		console.log("Client is not ready"); 
		return false;
	}
};

function saveActionData (actionData) {
	if(clientReady === false) {
		console.log("Client is not ready"); 
		return false;
	}
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

