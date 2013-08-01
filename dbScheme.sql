
USE Pulse; 

CREATE TABLE Clients (
	ClientID SMALLINT(6),
	HardwareID VARCHAR(20),
	RegistrationDate VARCHAR(8), 
	RegistrationHour VARCHAR(5),
	PRIMARY KEY ( ClientID )							
);

CREATE TABLE Hardware (	
	HardwareID VARCHAR(20),
    AppVersion VARCHAR(16),
    OS         VARCHAR(20),
    Processor  VARCHAR(20),
    Country    VARCHAR(20),  
	RegistrationDate VARCHAR(8), 
	RegistrationHour VARCHAR(5),
	PRIMARY KEY ( HardwareID )						
);

CREATE TABLE Log (
	ClientID SMALLINT(6),
	HardwareID VARCHAR(20),	
	RegistrationDate VARCHAR(8), 
	RegistrationHour VARCHAR(5),	
	PRIMARY KEY ( ClientID )							
);


CREATE TABLE LogAction (
	ClientID SMALLINT(6),
	HardwareID VARCHAR(20),	
	Action VARCHAR(20),	
	ActionValue VARCHAR(30),	
	RegistrationDate VARCHAR(8), 
	RegistrationHour VARCHAR(5),
	PRIMARY KEY ( ClientID )								
);