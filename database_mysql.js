 var start 	= require("./start");
 
 var mysql 	= require("mysql");


 var dbName = "Pulse";
 var clientsTableName = "Clients";
 var hardwareTableName = "Hardware";
 var logTableName = "Log"; 
 var logActionsTableName = "LogActions";

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'tigran',
  password : 'ararat',
 
});



connection.connect(function(err) {
     if(err != null) {
     	console.log("Error no connection: " + err);
     }
});


//check if DB 'Pulse' exists, if not ctreate it and construct tables 
connection.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '" + dbName + "'", function( error, rows) {
 

     if ( error ) {
       console.log( "Error on database presence identification: " + error );
       return;
     }
 
      //No any database is present on server, so let's create database and tables
     if(rows.length === 0) {
     	console.log("No any  database '" + dbName + "' found. Start creating it: ");

     	//Create Database 
        connection.query("DROP DATABASE IF EXISTS " + dbName, function(err) {
		  	if (err) { throw err; }

		  	// create database
			connection.query("CREATE DATABASE " + dbName, function(err) {
			  	if (err) { throw err; }

			  	console.log("Database " + dbName + " created");
				console.log("Start creating tables");

				connection.query("USE " + dbName, function(err) {
					if (err) { throw err; }

			        //Create Clients table
					var createClientTable = "CREATE TABLE Clients (" +
													"ClientID SMALLINT(6)," + 
													"HardwareID VARCHAR(20)," + 
													"RegistrationDate VARCHAR(8)," + 
													"RegistrationHour VARCHAR(5)," + 
													"PRIMARY KEY ( ClientID ));";


					connection.query(createClientTable, function(err){
							if (err) { throw err; }


								//Create Hardware table
								var createHardwareTable = "CREATE TABLE Hardware (	" + 
																"HardwareID VARCHAR(20)," + 
						    									"AppVersion VARCHAR(16)," + 
						    									"OS         VARCHAR(20),"+ 
						    									"Processor  VARCHAR(20)," + 
						    									"Country    VARCHAR(20), " +  
																"RegistrationDate VARCHAR(8), " +
																"RegistrationHour VARCHAR(5)," + 
																"PRIMARY KEY ( HardwareID ));";

						 		connection.query(createHardwareTable, function(err){
										if (err) { throw err; }


										//Create Log table 
										var createLogTable = "CREATE TABLE Log ( " + 
																		"ClientID SMALLINT(6), " + 
																		"HardwareID VARCHAR(20)," + 	
																		"RegistrationDate VARCHAR(8)," +  
																		"RegistrationHour VARCHAR(5)," + 	
																		"PRIMARY KEY ( ClientID ));";

										connection.query(createLogTable, function(err){
												if (err) { throw err; }


												//Create Action log table 
												var createLogActionTable = "CREATE TABLE LogAction (" + 
																				"ClientID SMALLINT(6)," + 
																				"HardwareID VARCHAR(20)," + 
																				"Action VARCHAR(20)," + 
																				"ActionValue VARCHAR(30)," + 
																				"RegistrationDate VARCHAR(8)," + 
																				"RegistrationHour VARCHAR(5)," + 
																				"PRIMARY KEY ( ClientID ));"
												console.log("Log table SQL: " + createLogActionTable);

												connection.query(createLogActionTable, function(err){
														if (err) { throw err; }


														console.log("Database " + dbName + " and its scheme creation completed succesfully");
												});

										});

																				//--------------------
								});
								//---------------------
					});
					// ---------------


				}); //USE DB
			});
			// -------------



		});

		

		//----------------

     }//if Database does not exist
	 
   
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




   
	
};

function saveStopData (stopData) {
	
};

function saveActionData (actionData) {
	

};        


//Get overall information about data present in base
function getDashboardData() {
	
}



exports.saveStartData    = saveStartData;
exports.saveStopData     = saveStopData;
exports.saveActionData   = saveActionData;


exports.getDashboardData = getDashboardData;

