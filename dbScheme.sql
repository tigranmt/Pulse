
USE Pulse; 


DROP TABLE Actions ;
DROP TABLE Clients ;
DROP TABLE Errors ;
DROP TABLE Hardware ;
DROP TABLE LogAction;
DROP TABLE LogError;
DROP TABLE Log;


CREATE TABLE Clients (
	ClientID MEDIUMINT, 
	HardwareID VARCHAR(50), 
	RegistrationDate VARCHAR(10), 
	RegistrationHour VARCHAR(5), 
	ID MEDIUMINT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (ID)
);


CREATE TABLE Hardware ( 
	HardwareID VARCHAR(50), 
	AppVersion VARCHAR(16), 
	OS         VARCHAR(50), 
	Processor  VARCHAR(50), 
	Country    VARCHAR(50),  
	RegistrationDate VARCHAR(10),
	RegistrationHour VARCHAR(5), 
	ID MEDIUMINT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (ID)
);

CREATE TABLE Log ( 
	ClientID MEDIUMINT, 
	HardwareID VARCHAR(50), 
	Opened BIT,	
	AppVersion VARCHAR(16),
	RegistrationDate VARCHAR(10),  
	RegistrationHour VARCHAR(5), 	
	ID MEDIUMINT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (ID)
);


CREATE TABLE LogAction ( 
	ClientID MEDIUMINT, 
	HardwareID VARCHAR(50), 
	Action MEDIUMINT, 
	ActionValue VARCHAR(30), 
	AppVersion VARCHAR(16),
	RegistrationDate VARCHAR(10), 
	RegistrationHour VARCHAR(5), 
	ID MEDIUMINT NOT NULL AUTO_INCREMENT,      								
    PRIMARY KEY (ID)
 );


CREATE TABLE Actions ( 	
	Action VARCHAR(60), 
	Description VARCHAR(30), 	
	ID MEDIUMINT NOT NULL AUTO_INCREMENT,      								
    PRIMARY KEY (ID)
 );

 CREATE TABLE LogError ( 
	ClientID MEDIUMINT,
	HardwareID VARCHAR(50),
	Error MEDIUMINT,
	ErrorValue VARCHAR(1000),
	AppVersion VARCHAR(16),
	RegistrationDate VARCHAR(10),
	RegistrationHour VARCHAR(5),
	ID MEDIUMINT NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (ID));

CREATE TABLE Errors ( 	
	Error VARCHAR(30), 
	Description VARCHAR(30), 	
	ID MEDIUMINT NOT NULL AUTO_INCREMENT,      								
    PRIMARY KEY (ID)
 );