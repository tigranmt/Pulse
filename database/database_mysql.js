 var start 	= require("../start"); 
 var mysql 	= require("mysql");


 var dbName = "Pulse";
 var clientsTableName = "Clients";
 var hardwareTableName = "Hardware";
 var logTableName = "Log"; 
 var logActionsTableName = "Logaction";

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
 
});



connection.connect(function(err) {
     if(err != null) {
     	throw err;
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
		  	//if (err) { throw err; }

		  	// create database
			connection.query("CREATE DATABASE " + dbName, function(err) {
			  	//if (err) { throw err; }

			  	console.log("Database " + dbName + " created");
				console.log("Start creating tables");

				connection.query("USE " + dbName, function(err) {
					if (err) { throw err; }

			        //Create Clients table
					var createClientTable = "CREATE TABLE Clients (" +
													"ClientID SMALLINT(6)," + 
													"HardwareID VARCHAR(20)," + 
													"RegistrationDate VARCHAR(10)," + 
													"RegistrationHour VARCHAR(5)," + 
													"PRIMARY KEY ( ClientID ));";


					connection.query(createClientTable, function(err){
								if (err) { throw err; }


								//Create Hardware table
								var createHardwareTable = "CREATE TABLE Hardware (	" + 
																"HardwareID VARCHAR(20)," + 
						    									"AppVersion VARCHAR(16)," + 
						    									"OS         VARCHAR(50),"+ 
						    									"Processor  VARCHAR(50)," + 
						    									"Country    VARCHAR(50), " +  
																"RegistrationDate VARCHAR(10), " +
																"RegistrationHour VARCHAR(5)," + 
																"PRIMARY KEY ( HardwareID ));";

						 		connection.query(createHardwareTable, function(err){
										if (err) { throw err; }


										//Create Log table 
										var createLogTable = "CREATE TABLE Log ( " + 
																		"ClientID SMALLINT(6), " + 
																		"HardwareID VARCHAR(20)," + 
																		"Opened BIT," + 	
																		"RegistrationDate VARCHAR(10)," +  
																		"RegistrationHour VARCHAR(5)," + 	
																		"ID MEDIUMINT NOT NULL AUTO_INCREMENT," +      								
     																	 "PRIMARY KEY (ID))";

										connection.query(createLogTable, function(err){
												if (err) { throw err; }


												//Create Action log table 
												var createLogActionTable = "CREATE TABLE LogAction (" + 
																				"ClientID SMALLINT(6)," + 
																				"HardwareID VARCHAR(20)," + 
																				"Action VARCHAR(30)," + 
																				"ActionValue VARCHAR(30)," + 
																				"RegistrationDate VARCHAR(10)," + 
																				"RegistrationHour VARCHAR(5)," + 
																				"ID MEDIUMINT NOT NULL AUTO_INCREMENT," +      								
     																			"PRIMARY KEY (ID))"; 

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
     else {
     	connection.query("USE " + dbName);
     }
	 
   
 });


 function handleerror(error) {
 	throw error;
 }
       
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


    console.log("Got startData on saveStartData: ");
    console.log(startData);

    var log =  function(data, opened) {
    	insertLog(data, opened, handleerror);
    }

    var hardware = function(data) {
    	hardwareTableCheck(data, log, handleerror);
    }

	clientsTableCheck(startData, hardware, handleerror);   
	
};


function insertLog(startData, opened, error) {
	 /*var startData = {             
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


   /* CREATE TABLE Log (
	ClientID SMALLINT(6),
	HardwareID VARCHAR(20),	
	RegistrationDate VARCHAR(8), 
	RegistrationHour VARCHAR(5),	
	PRIMARY KEY ( ClientID ));*/


	
 	var hardwareIDEscaped =  connection.escape(startData.hardwareID); 
 	var clientIDEscaped =  connection.escape(startData.clientCode);  	
 	var registrationDateEscaped = connection.escape(startData.date);
	var registrationHourEscaped = connection.escape(startData.hour);
	var openedEscaped = connection.escape(opened);
 	

 	var insertQuery = "INSERT INTO " + logTableName + " (ClientID, HardwareID, Opened, RegistrationDate, RegistrationHour) VALUES(" + 
 										clientIDEscaped + "," + hardwareIDEscaped + "," + openedEscaped + "," +  registrationDateEscaped + "," + registrationHourEscaped + ")";

 	connection.query(insertQuery, function(err, rows) {
 		if(err) {
 			console.log( "Error on " +  logTableName + " table query: " + err);
 			error(err);
 			return; 
 		}
 	});


}


function hardwareTableCheck(startData, next, error) {


    /*var startData = {             
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

	/*CREATE TABLE Hardware (	
		HardwareID VARCHAR(20),
    	AppVersion VARCHAR(16),
    	OS         VARCHAR(20),
   	 	Processor  VARCHAR(20),
    	Country    VARCHAR(20),  
		RegistrationDate VARCHAR(8), 
		RegistrationHour VARCHAR(5),
		PRIMARY KEY ( HardwareID )						
	);*/

 	var hardwareIDEscaped =  mysql.escape(startData.hardwareID); 
 	var appVersionEscaped =  mysql.escape(startData.appVersion); 
 	var osEscaped =  mysql.escape(startData.os);
 	var processorEscaped =  mysql.escape(startData.processor);
 	var countryEscaped =  mysql.escape(startData.country);

   	var query = "SELECT HardwareID FROM " + hardwareTableName + " WHERE HardwareID=" + hardwareIDEscaped + " AND appVersion=" +  appVersionEscaped + 
 			" AND OS=" + osEscaped + " AND processor=" + processorEscaped + " AND country=" + countryEscaped; 

    console.log(query);

 	connection.query(query, function(err, rows) {

 		if(err) {
 			console.log( "Error on " +  hardwareTableName + " table query: " + err);
 			error(err);
 			return; 
 		}

        console.log("rows recieved"); 
        console.log(rows);

 		if(rows.length === 0) {
 			var registrationDateEscaped = connection.escape(startData.date);
		    var registrationHourEscaped = connection.escape(startData.hour);
			console.log("No data found in " + hardwareTableName + " table. Start inserting data.");

			
			var insertQuery = "INSERT INTO " + hardwareTableName + " (HardwareID, AppVersion, OS, Processor, Country, RegistrationDate, RegistrationHour) VALUES(" + 
											hardwareIDEscaped + "," + appVersionEscaped  + "," + osEscaped + "," + processorEscaped + "," + countryEscaped + "," + 
														registrationDateEscaped + "," + registrationHourEscaped + ")";

 			console.log("Insert into " + hardwareTableName + " : " + insertQuery);
			connection.query(insertQuery, function(e, rows) {				

		 			if ( e ) {
				       console.log( "Error on " +  hardwareTableName + " table query: " + e );
				       error(e);
				       return;
				    }

				    next(startData, 1);
				   
			});
 		}
 		else  {
 			next(startData, 1);
 		}


 	});


}


function clientsTableCheck(startData, next, error) {

	/*var startData = {             
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



	/*
		CREATE TABLE Clients (
		ClientID SMALLINT(6),
		HardwareID VARCHAR(20),
		RegistrationDate VARCHAR(8), 
		RegistrationHour VARCHAR(5),
		PRIMARY KEY ( ClientID )							
		);
	*/

	var hardwareIDEscaped =  connection.escape(startData.hardwareID); 
	var clientIDEscaped =  connection.escape(startData.clientCode); 

	

    var query = "SELECT ClientID FROM " + clientsTableName + " WHERE HardwareID=" + hardwareIDEscaped + " AND ClientID=" +  clientIDEscaped; 
    console.log(query);

	connection.query(query, function(er, rows) {

	  		 if ( er ) {
		       console.log( "Error on " +  clientsTableName + " table query: " + er );
		       error(er);
		       return;
		     }

		     if(rows.length === 0) {

		     	var registrationDateEscaped = connection.escape(startData.date);
		     	var registrationHourEscaped = connection.escape(startData.hour);
		     	console.log("No data found in " + clientsTableName + " taable. Start inserting data.");


		     	var queryInsert = "INSERT INTO " + clientsTableName + " (HardwareID, ClientID, RegistrationDate, RegistrationHour) VALUES("  + hardwareIDEscaped + "," + clientIDEscaped + 
		     							"," + registrationDateEscaped + "," + registrationHourEscaped + ")";
				console.log(queryInsert);

		     	//start inserting  
		     	connection.query(queryInsert, function(e, rows) {

				 		if ( e ) {
					       console.log( "Error on " +  clientsTableName + " table query: " + e );
					       error(e);
					       return;
					    }
					    
					    next(startData);
					    

		     	});


		     }
		     else {		     
		     	next(startData); //call next method		     				     
		     }

	});
}

function saveStopData (stopData) {

	insertLog(stopData, 0, handleerror);
	
};

function saveActionData (actionData) {
	
	 /*
         * var packet = {             
         crypto          : split[0], //encrypted key
         hardwareID      : split[1], //unique hardware ID
         clientCode      : split[2], //client code 
         version         : split[3], //version of the message 
         appVersion      : split[4], //application version
         actionName      : split[5], //action name
         actionValue     : split[6], //action value            
         date            : split[7], //execution date
         hour            : split[8]  //execution hour
     }; */

	/*CREATE TABLE LogAction (
	ClientID SMALLINT(6),
	HardwareID VARCHAR(20),	
	Action VARCHAR(20),	
	ActionValue VARCHAR(30),	
	RegistrationDate VARCHAR(8), 
	RegistrationHour VARCHAR(5),
	PRIMARY KEY ( ClientID ));*/

 	var hardwareIDEscaped 		= connection.escape(actionData.hardwareID); 
 	var clientIDEscaped 		= connection.escape(actionData.clientCode);  
 	var actionNameEscaped 		= connection.escape(actionData.actionName);  
 	var actionValueEscaped 		= connection.escape(actionData.actionValue);  
 	var registrationDateEscaped = connection.escape(actionData.date);
	var registrationHourEscaped = connection.escape(actionData.hour);
 	

 	var insertQuery = "INSERT INTO " + logActionsTableName + " (ClientID, HardwareID, Action, ActionValue, RegistrationDate, RegistrationHour) VALUES(" + 
 										clientIDEscaped + "," + hardwareIDEscaped + "," + actionNameEscaped + "," + actionValueEscaped + "," + registrationDateEscaped + "," + registrationHourEscaped + ")";

 	connection.query(insertQuery, function(er, rows) {
 		if(er) {
 			console.log( "Error on " +  logActionsTableName + " table query: " + er);
 			throw er;		    
 		}
 	});



};        


//Get overall information about data present in base
function getDashboardData() {
	
}



exports.saveStartData    = saveStartData;
exports.saveStopData     = saveStopData;
exports.saveActionData   = saveActionData;
exports.getDashboardData = getDashboardData;

