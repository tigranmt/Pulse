

SET @startDate = '06/10/2013';
SET @endDate = '06/11/2013';

/** VERSION DESTRIBUTION **/
SELECT  COUNT(*) as UsedCount, AppVersion FROM Logs WHERE 
STR_TO_DATE(RegistrationDate,'%d/%m/%Y') > STR_TO_DATE(@startDate,'%d/%m/%Y') AND 
STR_TO_DATE(RegistrationDate,'%d/%m/%Y') < STR_TO_DATE(@endDate,'%d/%m/%Y') 
GROUP BY AppVersion;
/**************************/


/**** ORDERS STAT ****/ 
 SELECT Actions.Action as ActionName, Count(Actions.Action)  as Count FROM LogActions INNER JOIN Actions ON LogActions.Action = Actions.ID WHERE  
 STR_TO_DATE(LogActions.RegistrationDate,'%d/%m/%Y') > STR_TO_DATE(@startDate,'%d/%m/%Y')  
 AND STR_TO_DATE(LogActions.RegistrationDate,'%d/%m/%Y') < STR_TO_DATE(@endDate,'%d/%m/%Y')  
 AND  Actions.Action <> 'None'  AND  (Actions.Action = 'ORDERSENT' OR  Actions.Action = 'ORDERGENERATED' OR Actions.Action = 'STLEXPORT')  GROUP BY Actions.Action;
 /**************************/
 
 
 /******** Country INFO ***************/ 
 SELECT Count(Hardwares.Country), Hardwares.Country FROM Hardwares 
 WHERE STR_TO_DATE(Hardwares.RegistrationDate,'%d/%m/%Y') > STR_TO_DATE(@startDate,'%d/%m/%Y') 
 AND STR_TO_DATE(Hardwares.RegistrationDate,'%d/%m/%Y') < STR_TO_DATE(@endDate,'%d/%m/%Y') GROUP BY Hardwares.Country;  
 /************************************/

 
 /*** HARDWARE INFO *******************/ 
 SELECT Clients.ClientID,  Hardwares.AppVersion, Hardwares.RegistrationDate,  Hardwares.RegistrationHour FROM Hardwares 
 INNER JOIN Clients ON Clients.HardwareID = Hardwares.HardwareID
 WHERE STR_TO_DATE(Hardwares.RegistrationDate,'%d/%m/%Y') > STR_TO_DATE(@startDate,'%d/%m/%Y') 
 AND STR_TO_DATE(Hardwares.RegistrationDate,'%d/%m/%Y') < STR_TO_DATE(@endDate,'%d/%m/%Y') ORDER BY STR_TO_DATE(Hardwares.RegistrationDate,'%d/%m/%Y') DESC;  
 /************************************/
 
