
USE Pulse; 

CREATE TABLE Clients (
	ClientID SMALLINT(6), 
	HardwareID VARCHAR(20), 
	RegistrationDate VARCHAR(10), 
	RegistrationHour VARCHAR(5), 
	ID MEDIUMINT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (ID)
);


CREATE TABLE Hardware ( 
	HardwareID VARCHAR(20), 
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
	ClientID SMALLINT(6), 
	HardwareID VARCHAR(20), 
	Opened BIT,	
	RegistrationDate VARCHAR(10),  
	RegistrationHour VARCHAR(5), 	
	ID MEDIUMINT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (ID)
);


CREATE TABLE LogAction ( 
	ClientID SMALLINT(6), 
	HardwareID VARCHAR(20), 
	Action MEDIUMINT(30), 
	ActionValue VARCHAR(30), 
	RegistrationDate VARCHAR(10), 
	RegistrationHour VARCHAR(5), 
	ID MEDIUMINT NOT NULL AUTO_INCREMENT,      								
    PRIMARY KEY (ID)
 );


CREATE TABLE Actions ( 	
	Action VARCHAR(30), 
	Description VARCHAR(30), 	
	ID MEDIUMINT NOT NULL AUTO_INCREMENT,      								
    PRIMARY KEY (Action)
 );

 CREATE TABLE LogError ( 
	ClientID SMALLINT(6),
	HardwareID VARCHAR(20),
	Error MEDIUMINT,
	ErrorValue VARCHAR(30),
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


