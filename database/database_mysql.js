 var mysql 	= require("mysql");



 var dbName = "Pulse";
 var clientsTableName = "Clients";
 var hardwareTableName = "Hardwares";
 var logTableName = "Logs"; 
 var logActionsTableName = "LogActions";
 var actionsTableName = "Actions";
 var logErrorsTableName = "LogErrors";
 var errorsTableName = "Errors";
 var licenseTable = "LogLicenses";
 var connection = undefined;





var getConnection = function() {
	if (connection && connection._socket
            && connection._socket.readable
            && connection._socket.writable) {
        return  connection;
    }

    console.log("Connection is closed or dead. Recreate it.");
    var remoteConfig = process.env.VCAP_SERVICES;

	if(remoteConfig) {

	   console.log("Found remote configuration"); 

	   var credentials = JSON.parse(remoteConfig)['mysql-5.1'][0].credentials;

	   console.log(credentials);

	   dbName = credentials.name;

		//remote connection
		connection = mysql.createConnection({
			host     :  credentials.hostname,
			user     :  credentials.user,
			password :  credentials.password,				
		});

	 }
	 else {

	 	console.log("Local configuration");

	 	//local connection
	 	connection = mysql.createConnection({
	 		host     : 'localhost',
	  		user     : 'root',
	  		password : ''
	 
		});
	 }


	connection.connect(function(err) {
	     if(err != null) {
	     	console.log(err);
	     }
	    
	});

	connection.on("close", function (err) {
	    console.log("SQL CONNECTION CLOSED.");
	});
	connection.on("error", function (err) {
	    console.log("SQL CONNECTION ERROR: " + err);
	});


	return connection;
}


 //**********************************************************************************************************************************
 //**********************************************************************************************************************************
 // CHECK IF DATABASE EXISTS, IF NOT, CREATE IT
 //**********************************************************************************************************************************
 //**********************************************************************************************************************************
getConnection().query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '" + dbName + "'", function( error, rows) {
 

     if ( error ) {
       console.log( "Error on database presence identification: " + error );
       return;
     }
 
      //No any database is present on server, so let's create database and tables
     if(rows.length === 0) {
     	console.log("No any  database '" + dbName + "' found. Start creating it: ");

     	//Create Database 
        getConnection().query("DROP DATABASE IF EXISTS " + dbName, function(err) {
		  	//if (err) { throw err; }

		  	// create database
			getConnection().query("CREATE DATABASE " + dbName, function(err) {
			  	//if (err) { throw err; }

			  	console.log("Database " + dbName + " created");
				console.log("Start creating tables");

				getConnection().query("USE " + dbName, function(err) {
					if (err) { throw err; }

			        //Create Clients table
					var createClientTable = "CREATE TABLE " +  clientsTableName + " (" +
													"ClientID SMALLINT(6)," + 
													"HardwareID VARCHAR(20)," + 
													"RegistrationDate VARCHAR(10)," + 
													"RegistrationHour VARCHAR(5)," + 
													"ID MEDIUMINT NOT NULL AUTO_INCREMENT," + 
												    "PRIMARY KEY (ID));";

 					console.log("Create " + clientsTableName + " table");

					getConnection().query(createClientTable, function(err){
								if (err) { throw err; }


								//Create Hardware table
								var createHardwareTable = "CREATE TABLE " + hardwareTableName + " (	" + 
																"HardwareID VARCHAR(20)," + 
						    									"AppVersion VARCHAR(16)," + 
						    									"OS         VARCHAR(50),"+ 
						    									"Processor  VARCHAR(50)," + 
						    									"Country    VARCHAR(50), " +  
																"RegistrationDate VARCHAR(10), " +
																"RegistrationHour VARCHAR(5)," + 
																"ID MEDIUMINT NOT NULL AUTO_INCREMENT," + 
																"PRIMARY KEY (ID));";

						 		getConnection().query(createHardwareTable, function(err){
										if (err) { throw err; }


										//Create Log table 
										var createLogTable = "CREATE TABLE " + logTableName +" ( " + 
																		"ClientID SMALLINT(6), " + 
																		"HardwareID VARCHAR(20)," + 
																		"Opened BIT," + 	
																		"RegistrationDate VARCHAR(10)," +  
																		"RegistrationHour VARCHAR(5)," + 	
																		"ID MEDIUMINT NOT NULL AUTO_INCREMENT," +      								
     																	 "PRIMARY KEY (ID))";

										getConnection().query(createLogTable, function(err){
												if (err) { throw err; }


												//Create Action log table 
												var createLogActionTable = "CREATE TABLE "  + logActionsTableName + " (" + 
																				"ClientID SMALLINT(6)," + 
																				"HardwareID VARCHAR(20)," + 
																				"Action MEDIUMINT," + 
																				"ActionValue VARCHAR(30)," + 
																				"AppVersion VARCHAR(16)," +
																				"RegistrationDate VARCHAR(10)," + 
																				"RegistrationHour VARCHAR(5)," + 
																				"ID MEDIUMINT NOT NULL AUTO_INCREMENT," +      								
     																			"PRIMARY KEY (ID))"; 

												console.log("ActionLog table SQL: " + createLogActionTable);

												getConnection().query(createLogActionTable, function(err){
														if (err) { throw err; }

														var createActionsTable = "CREATE TABLE " + actionsTableName + " ( " + 	
																					"Action VARCHAR(30), " + 
																					"Description VARCHAR(30), " + 
																					"ID MEDIUMINT NOT NULL AUTO_INCREMENT, " + 
    																				"PRIMARY KEY (ID))";

														console.log("Actions table SQL: " + createActionsTable);

														getConnection().query(createActionsTable, function(err){
																
																if (err) { throw err; }
														

																//create ErrorLog table 
																var createLogErrorTable = "CREATE TABLE " + logErrorsTableName + " (" + 
																				"ClientID SMALLINT(6)," + 
																				"HardwareID VARCHAR(20)," + 
																				"Error MEDIUMINT," + 
																				"ErrorValue VARCHAR(1000)," + 
																				"AppVersion VARCHAR(16)," + 
																				"RegistrationDate VARCHAR(10)," + 
																				"RegistrationHour VARCHAR(5)," + 
																				"ID MEDIUMINT NOT NULL AUTO_INCREMENT," +      								
     																			"PRIMARY KEY (ID))"; 
																getConnection().query(createLogErrorTable, function(err){

																	if (err) { throw err; }

																	var createErrorTable = "CREATE TABLE "  + errorsTableName + " ( " + 	
																					"Error VARCHAR(30), " + 
																					"Description VARCHAR(1000), " + 
																					"ID MEDIUMINT NOT NULL AUTO_INCREMENT, " + 
    																				"PRIMARY KEY (ID))";

																	getConnection().query(createErrorTable, function(err){

																		if (err) { throw err; }

																		console.log("Database " + dbName + " and its scheme creation completed succesfully");
																	});	
																});

														});


														
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
     	getConnection().query("USE " + dbName);
     }
	 
   
 });
 //**********************************************************************************************************************************
 //**********************************************************************************************************************************


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
         processor       : split[6], //processor name 
         architecture    : -- architeture available from new version
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



	
	var clientIDEscaped =  getConnection().escape(startData.clientCode);  	
 	var hardwareIDEscaped =  getConnection().escape(startData.hardwareID);  	
 	var openedEscaped = getConnection().escape(opened);
 	var appVersionEscaped = getConnection().escape(startData.appVersion);
 	var registrationDateEscaped = getConnection().escape(startData.date);
	var registrationHourEscaped = getConnection().escape(startData.hour);
	

 	

 	var insertQuery = "INSERT INTO " + logTableName + " (ClientID, HardwareID, Opened, AppVersion, RegistrationDate, RegistrationHour) VALUES(" + 
 										clientIDEscaped + "," + hardwareIDEscaped + "," + openedEscaped + "," + appVersionEscaped + ","  + registrationDateEscaped + "," + registrationHourEscaped + ")";

 	getConnection().query(insertQuery, function(err, rows) {
 		if(err) {
 			console.log( "Error on " +  logTableName + " table query: " + err);
 			error(err);
 			return; 
 		}
 	});

}


function saveLicense(startData) {


    /*var startData = {             
         crypto          : split[0], //encrypted key
         hardwareID      : split[1], //unique hardware ID
         clientCode      : split[2], //client code 
         version         : split[3], //mesage  version
         date            : split[4], //execution date
         hour            : split[5], //execution hour   
         licenseID       : split[6], //license ID   
		 validTill		 : split[7], // valid till date
         appVersion      : split[8], //application version      
         
    };*/


	var hardwareIDEscaped =  getConnection().escape(startData.hardwareID);  	
    var clientIDEscaped =  getConnection().escape(startData.clientCode);  		
 	var registrationDateEscaped = getConnection().escape(startData.date);
	var registrationHourEscaped = getConnection().escape(startData.hour);
	var licenseIDEscaped = getConnection().escape(startData.licenseID);
	var validTillEscaped = getConnection().escape(startData.validTill);
	var appVersionEscaped = getConnection().escape(startData.appVersion);

	var insertQuery = "INSERT INTO " + licenseTable + " (ClientID, HardwareID, RegistrationDate, RegistrationHour, LicenseID, ValidTill, AppVersion) VALUES(" + 
 										clientIDEscaped + "," + hardwareIDEscaped + "," + registrationDateEscaped + "," + registrationHourEscaped + ","  + licenseIDEscaped 
 										+ "," + validTillEscaped + "," + appVersionEscaped + ")";

 	getConnection().query(insertQuery, function(err, rows) {
 		if(err) {
 			throw err;
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

 	var hardwareIDEscaped =  getConnection().escape(startData.hardwareID); 
 	var appVersionEscaped =  getConnection().escape(startData.appVersion); 
 	var osEscaped =  getConnection().escape(startData.os);
 	var processorEscaped =  getConnection().escape(startData.processor);
 	var countryEscaped =  getConnection().escape(startData.country);


   	var query = "SELECT HardwareID FROM " + hardwareTableName + " WHERE HardwareID=" + hardwareIDEscaped + " AND appVersion=" +  appVersionEscaped + 
 			" AND OS=" + osEscaped + " AND processor=" + processorEscaped + " AND country=" + countryEscaped; 

    console.log(query);

 	getConnection().query(query, function(err, rows) {

 		if(err) {
 			console.log( "Error on " +  hardwareTableName + " table query: " + err);
 			error(err);
 			return; 
 		}

        console.log("rows recieved"); 
        console.log(rows);

 		if(rows.length === 0) {
 			var registrationDateEscaped = getConnection().escape(startData.date);
		    var registrationHourEscaped = getConnection().escape(startData.hour);
			console.log("No data found in " + hardwareTableName + " table. Start inserting data.");

			
 			var architecture = startData.architecture || "";
			if(architecture!= "")
				architecture =getConnection().escape(architecture);
			else 
				architecture = null;

			var insertQuery = "INSERT INTO " + hardwareTableName + " (HardwareID, AppVersion, OS, Processor, Architecture, Country, RegistrationDate, RegistrationHour) VALUES(" + 
											hardwareIDEscaped + "," + appVersionEscaped  + "," + osEscaped + "," + processorEscaped + "," + architecture +  ","+ countryEscaped + "," + 
														registrationDateEscaped + "," + registrationHourEscaped + ")";

 			console.log("Insert into " + hardwareTableName + " : " + insertQuery);
			getConnection().query(insertQuery, function(e, rows) {				

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

	var hardwareIDEscaped =  getConnection().escape(startData.hardwareID); 
	var clientIDEscaped =  getConnection().escape(startData.clientCode); 

	

    var query = "SELECT ClientID FROM " + clientsTableName + " WHERE HardwareID=" + hardwareIDEscaped + " AND ClientID=" +  clientIDEscaped; 
    console.log(query);

	getConnection().query(query, function(er, rows) {

	  		 if ( er ) {
		       console.log( "Error on " +  clientsTableName + " table query: " + er );
		       error(er);
		       return;
		     }

		     if(rows.length === 0) {

		     	var registrationDateEscaped = getConnection().escape(startData.date);
		     	var registrationHourEscaped = getConnection().escape(startData.hour);
		     	console.log("No data found in " + clientsTableName + " table. Start inserting data.");


		     	var queryInsert = "INSERT INTO " + clientsTableName + " (HardwareID, ClientID, RegistrationDate, RegistrationHour) VALUES("  + hardwareIDEscaped + "," + clientIDEscaped + 
		     							"," + registrationDateEscaped + "," + registrationHourEscaped + ")";
				console.log(queryInsert);

		     	//start inserting  
		     	getConnection().query(queryInsert, function(e, rows) {

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


function  saveErrorData(errorData) {


 	var hardwareIDEscaped 		= getConnection().escape(errorData.hardwareID); 
 	var clientIDEscaped 		= getConnection().escape(errorData.clientCode);  
 	var errorNameEscaped 		= getConnection().escape(errorData.errorName);  
 	var errorValueEscaped 		= getConnection().escape(errorData.errorValue);  
 	var appVersionEscaped 		= getConnection().escape(errorData.appVersion);  
 	var registrationDateEscaped = getConnection().escape(errorData.date);
	var registrationHourEscaped = getConnection().escape(errorData.hour);
 	

	//first check if specified SAction is present in DB 


    var selectErrorQuery =  "SELECT ID FROM " +  errorsTableName + " WHERE ERROR=" + errorNameEscaped;
    getConnection().query(selectErrorQuery, function(er, rows) {


    	if(!rows || rows.length === 0) {

         

    		//not any record for specified action present, so first we have to register it
    		console.log("Error " + errorNameEscaped + " wasn't found. Start insert into " + errorsTableName);
    		var insertError = "INSERT INTO "  + errorsTableName + "(Error,Description) VALUES(" + errorNameEscaped + ", '')";
    		console.log(insertError);

    		getConnection().query(insertError, function(er, rows) {
    				if(er) {
		 				console.log( "Error on " +  errorsTableName + " table query: " + er);
		 				throw er;		    
		 			}

		 			//Select again to retrive assigned ID 
 					getConnection().query(selectErrorQuery, function(er, rows) {
 						if(er) throw er;

 						//insert into log errors with specified action ID
 						var id = rows[0].ID;
 						console.log("rows"); 
 						console.log(rows);


 						var insertQuery = "INSERT INTO " + logErrorsTableName + " (ClientID, HardwareID, Error, ErrorValue, AppVersion, RegistrationDate, RegistrationHour) VALUES(" + 
	 										clientIDEscaped + "," + hardwareIDEscaped + "," + id + "," + errorValueEscaped + "," + appVersionEscaped
	 											 + "," + registrationDateEscaped + "," + registrationHourEscaped + ")";


 						console.log(insertQuery);

					 	getConnection().query(insertQuery, function(er, rows) {
					 		if(er) {
					 			console.log( "Error on " +  logErrorsTableName + " table query: " + er);
					 			throw er;		    
					 		}
					 	});
					 	// ---- 

 					});


    		});

			
    	}
    	else {

			//insert into log errors with specified action ID
    		var id = rows[0].ID;
	    	var insertQuery = "INSERT INTO " + logErrorsTableName + " (ClientID, HardwareID, Error, ErrorValue, AppVersion, RegistrationDate, RegistrationHour) VALUES(" + 
	 										clientIDEscaped + "," + hardwareIDEscaped + "," + id + "," + errorValueEscaped + "," + appVersionEscaped + "," 
	 											+ registrationDateEscaped + "," + registrationHourEscaped + ")";

		 	getConnection().query(insertQuery, function(er, rows) {
		 		if(er) {
		 			console.log( "Error on " +  logErrorsTableName + " table query: " + er);
		 			throw er;		    
		 		}
		 	});
		 	// ------------
		}

    });

}

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

 	var hardwareIDEscaped 		= getConnection().escape(actionData.hardwareID); 
 	var clientIDEscaped 		= getConnection().escape(actionData.clientCode);  
 	var actionNameEscaped 		= getConnection().escape(actionData.actionName);  
 	var actionValueEscaped 		= getConnection().escape(actionData.actionValue);  
 	var appVersionEscaped 		= getConnection().escape(actionData.appVersion); 
 	var registrationDateEscaped = getConnection().escape(actionData.date);
	var registrationHourEscaped = getConnection().escape(actionData.hour);
 	

	//first check if specified SAction is present in DB 

    var selectActionsQuery =  "SELECT ID FROM " +  actionsTableName + " WHERE ACTION=" + actionNameEscaped;
    getConnection().query(selectActionsQuery, function(er, rows) {


    	if(!rows || rows.length === 0) {

         

    		//not any record for specified action present, so first we have to register it
    		console.log("Action " + actionNameEscaped + " wasn't found. Start insert into " + actionsTableName);
    		var insertAction = "INSERT INTO "  + actionsTableName + "(Action,Description) VALUES(" + actionNameEscaped + ", '')";
    		console.log(insertAction);

    		getConnection().query(insertAction, function(er, rows) {
    				if(er) {
		 				console.log( "Error on " +  actionsTableName + " table query: " + er);
		 				throw er;		    
		 			}

		 			//Select again to retrive assigned ID 
 					getConnection().query(selectActionsQuery, function(er, selectedRows) {
 						if(er) throw er;

 						//insert into log actions with specified action ID
 						var id = selectedRows[0].ID;						

 						var insertQuery = "INSERT INTO " + logActionsTableName + " (ClientID, HardwareID, Action, ActionValue, AppVersion, RegistrationDate, RegistrationHour) VALUES(" + 
	 										clientIDEscaped + "," + hardwareIDEscaped + "," + id + "," + actionValueEscaped + "," + appVersionEscaped  
	 												+  "," + registrationDateEscaped + "," + registrationHourEscaped + ")";


 						console.log(insertQuery);

					 	getConnection().query(insertQuery, function(er, insertRows) {
					 		if(er) {
					 			console.log( "Error on " +  logActionsTableName + " table query: " + er);
					 			throw er;		    
					 		}
					 	});
					 	// ---- 

 					});


    		});

			
    	}
    	else {

			//insert into log actions with specified action ID

    		var id = rows[0].ID;
	    	var insertQuery = "INSERT INTO " + logActionsTableName + " (ClientID, HardwareID, Action, ActionValue, AppVersion, RegistrationDate, RegistrationHour) VALUES(" + 
	 										clientIDEscaped + "," + hardwareIDEscaped + "," + id + "," + actionValueEscaped + ","  + appVersionEscaped + "," 
	 										+ registrationDateEscaped + "," + registrationHourEscaped + ")";

		 	getConnection().query(insertQuery, function(er, rows) {
		 		if(er) {
		 			console.log( "Error on " +  logActionsTableName + " table query: " + er);
		 			throw er;		    
		 		}
		 	});
		 	// ------------
		}

    });

}; 



/* var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      done : done,           //done callback 
      err: err               //error callback
 };*/

function getAppVersionsDistribution(params) {

    var start = getConnection().escape(params.startDate); 
    var end   =  getConnection().escape(params.endDate); 
	var querySelect = "SELECT  COUNT(*) as UsedCount, AppVersion FROM " + logTableName + " WHERE " + 
		"STR_TO_DATE(RegistrationDate,'%d/%m/%Y') > STR_TO_DATE(" + start + ",'%d/%m/%Y') AND " + 
		"STR_TO_DATE(RegistrationDate,'%d/%m/%Y') < STR_TO_DATE(" + end + ",'%d/%m/%Y') GROUP BY AppVersion";
	
	
	console.log(querySelect);
    getConnection().query(querySelect, function(er, rows) { 

		if(er) {
	 			console.log( "Error on  getAppVersionsDistribution  query: " + er);
	 			params.err(er);	    
	    }
	    else {
			if(!rows || rows.length === 0) {
				console.log("empty data"); 
				params.done([]);
			}
			else {			
				params.done(rows); 
			}
		}

    });
}


/* var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
       clientID  : clientID,  //CAN be present, but optional. In case there is, slice on clientID too.
      done : done,           //done callback 
      err: err               //error callback
 };*/
function getAvgUseTimePerDay(params) {

	var start =  getConnection().escape(params.startDate); 
    var end   =  getConnection().escape(params.endDate); 

 	var client = " ";
    if(params.clientID) {
    	client = params.clientID;
    	if(client.trim() !== "") {
    		client = " AND ClientID=" + getConnection().escape(client);
    	}
    	else {
    		client = " ";
    	}
    }
	var querySelect = "SELECT ClientID, HardwareID, Opened, RegistrationDate, RegistrationHour FROM " + logTableName + " WHERE STR_TO_DATE(RegistrationDate,'%d/%m/%Y') > STR_TO_DATE(" +  start +",'%d/%m/%Y') " + 
						" AND STR_TO_DATE(RegistrationDate,'%d/%m/%Y') < STR_TO_DATE(" + end + ",'%d/%m/%Y') " + client + " ORDER BY STR_TO_DATE(RegistrationDate,'%d/%m/%Y'), ID ASC "; 
						
	console.log(querySelect);
	
	getConnection().query(querySelect, function(er, rows) { 

		if(er) {
	 			console.log( "Error on getAvgUseTimePerDay query: " + er);
	 			params.err(er);	    
	    }
	    else {
			if(!rows || rows.length === 0) {
				console.log("empty data"); 
				params.done([]);
			}
			else {			
				params.done(rows); 
			}
		}

    });
	
}


/* var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      clientID  : clientID,  //CAN be present, but optional. In case there is, slice on clientID too.
      done : done,           //done callback 
      err: err               //error callback
 };*/
function getErrorsDistributionInPeriod(params) {
	var start = getConnection().escape(params.startDate); 
    var end   =  getConnection().escape(params.endDate); 

    var client = " ";
    if(params.clientID) {
    	client = params.clientID;
    	if(client.trim() !== "") {
    		client = " AND LogError.ClientID=" + getConnection().escape(client);
    	}
    	else {
    		client = " ";
    	}
    }

	var querySelect = "SELECT " + errorsTableName + ".Error as ErrorTitle, Count(" + logErrorsTableName + ".Error) as Count FROM " + logErrorsTableName + 
					" INNER JOIN " + errorsTableName + " ON " + logErrorsTableName + ".Error = " + errorsTableName + ".ID  WHERE STR_TO_DATE(" + logErrorsTableName + ".RegistrationDate,'%d/%m/%Y') > STR_TO_DATE(" + start +  ",'%d/%m/%Y') " + 
 					" AND STR_TO_DATE(" + logErrorsTableName + ".RegistrationDate,'%d/%m/%Y') < STR_TO_DATE(" + end + ",'%d/%m/%Y')  " + client +  "  GROUP BY " + logErrorsTableName + ".Error"; 

    console.log(querySelect);
	
	getConnection().query(querySelect, function(er, rows) { 

		if(er) {
	 			console.log( "Error on getErrorsDistributionInPeriod query: " + er);
	 			params.err(er);	    
	    }
	    else {
			if(!rows || rows.length === 0) {
				console.log("empty data"); 
				params.done([]);
			}
			else {			
				params.done(rows); 
			}
		}

    });
}


/* var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      clientID  : clientID,  //CAN be present, but optional. In case there is, slice on clientID too.
      done : done,           //done callback       
      err: err               //error callback
 };*/
function getOrdersStat(params) {

	var client = " ";
    if(params.clientID) {
    	client = params.clientID;
    	if(client.trim() !== "") {
    		client = " AND LogAction.ClientID=" + getConnection().escape(client);
    	}
    	else {
    		client = " ";
    	}
    }


    var start 	 =  getConnection().escape(params.startDate); 
    var end   	 =  getConnection().escape(params.endDate); 
   

	var querySelect = "SELECT  " + actionsTableName + ".Action as ActionName, Count(" + actionsTableName + ".Action)  as Count " + 
				" FROM " + logActionsTableName + " INNER JOIN " + actionsTableName + " ON " + logActionsTableName + ".Action = " + actionsTableName + ".ID WHERE  " + 
				" STR_TO_DATE(" + logActionsTableName + ".RegistrationDate,'%d/%m/%Y') > STR_TO_DATE(" + start +  ",'%d/%m/%Y') " + 
				" AND STR_TO_DATE(" + logActionsTableName + ".RegistrationDate,'%d/%m/%Y') < STR_TO_DATE(" + end + ",'%d/%m/%Y') " + 
				" AND " + actionsTableName + ".Action <> 'None'  AND  (" + actionsTableName + ".Action = 'ORDERSENT' OR  " + actionsTableName + ".Action = 'ORDERGENERATED' OR " + actionsTableName + ".Action = 'STLEXPORT') " + 
				client + " GROUP BY " + actionsTableName + ".Action"; 

	console.log(querySelect);
	
	getConnection().query(querySelect, function(er, rows) { 

		if(er) {
	 			console.log( "Error on getOrdersStat query: " + er);
	 			params.err(er);	    
	    }
	    else {
			if(!rows || rows.length === 0) {
				console.log("empty data"); 
				params.done([]);
			}
			else {			
				params.done(rows); 
			}
		}

    });

}


/* var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      clientID  :  id,	      //client ID
      done : done,           //done callback 
      err: err               //error callback
 };*/
function getUserInfo(params) {

	var start 	 =  getConnection().escape(params.startDate); 
    var end   	 =  getConnection().escape(params.endDate); 
    var client   =  getConnection().escape(params.clientID); 

	var querySelect = "SELECT Clients.ClientID, Hardware.HardwareID, Hardware.RegistrationDate, Hardware.RegistrationHour, Hardware.AppVersion, " + 
					   "Hardware.OS, Hardware.Processor, Hardware.Country FROM Clients INNER JOIN Hardware ON Clients.HardwareID = Hardware.HardwareID " + 
					   " WHERE ClientID = " + client   + 
					   " AND STR_TO_DATE(Hardware.RegistrationDate,'%d/%m/%Y') > STR_TO_DATE(" + start +  ",'%d/%m/%Y') " + 
					   " AND STR_TO_DATE(Hardware.RegistrationDate,'%d/%m/%Y') < STR_TO_DATE(" + end + ",'%d/%m/%Y') " + 
					   " ORDER BY STR_TO_DATE(Hardware.RegistrationDate,'%d/%m/%Y'), Hardware.HardwareID";

	console.log(querySelect);
	
	getConnection().query(querySelect, function(er, rows) { 

		if(er) {
	 			console.log( "Error on getUserInfo query: " + er);
	 			params.err(er);	    
	    }
	    else {
			if(!rows || rows.length === 0) {
				console.log("empty data"); 
				params.done([]);
			}
			else {			
				params.done(rows); 
			}
		}

    });

}


/* var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date     
      done : done,           //done callback 
      err: err               //error callback
 };*/
function getOSDistribution(params) {

	var start 	 =  getConnection().escape(params.startDate); 
    var end   	 =  getConnection().escape(params.endDate); 
    var client   =  getConnection().escape(params.clientID); 

	var querySelect = "SELECT " + clientsTableName + ".ClientID, " + hardwareTableName + ".HardwareID, " + hardwareTableName + ".RegistrationDate, " + hardwareTableName + ".RegistrationHour, " + hardwareTableName + ".AppVersion, " + 
					    +  hardwareTableName + ".OS, " + hardwareTableName + ".Processor, " + hardwareTableName + ".Country FROM " + clientsTableName + " INNER JOIN " + hardwareTableName + " ON " + clientsTableName + ".HardwareID = " + hardwareTableName + ".HardwareID " + 
					   " WHERE ClientID = " + client   + 
					   " AND STR_TO_DATE(" + hardwareTableName + ".RegistrationDate,'%d/%m/%Y') > STR_TO_DATE(" + start +  ",'%d/%m/%Y') " + 
					   " AND STR_TO_DATE(" + hardwareTableName + ".RegistrationDate,'%d/%m/%Y') < STR_TO_DATE(" + end + ",'%d/%m/%Y') " + 
					   " ORDER BY STR_TO_DATE(" + hardwareTableName + ".RegistrationDate,'%d/%m/%Y'), " + hardwareTableName + ".HardwareID";

	console.log(querySelect);
	
	getConnection().query(querySelect, function(er, rows) { 

		if(er) {
	 			console.log( "Error on getOSDistribution query: " + er);
	 			params.err(er);	    
	    }
	    else {
			if(!rows || rows.length === 0) {
				console.log("empty data"); 
				params.done([]);
			}
			else {			
				params.done(rows); 
			}
		}

    });


}



exports.saveStartData    				= saveStartData;
exports.saveStopData     				= saveStopData;
exports.saveActionData   				= saveActionData;
exports.saveErrorData	 				= saveErrorData;
exports.getAppVersionsDistribution 		= getAppVersionsDistribution;
exports.getAvgUseTimePerDay 			= getAvgUseTimePerDay;
exports.getErrorsDistributionInPeriod 	= getErrorsDistributionInPeriod;
exports.getOrdersStat 					= getOrdersStat;
exports.getUserInfo						= getUserInfo;
exports.saveLicense						= saveLicense;

