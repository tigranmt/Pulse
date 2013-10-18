
var fs   = require("fs"); 
var path = require('path');
var url = require('url');
var db = require("../database/database_mysql"); 


function loadHtmlPage(req, res, pageName) {
    fs.readFile(pageName, function (err, html) {
    if(!err) {
      res.setHeader("Content-Length", html.length);
      res.setHeader("Content-Type", "text/html");
      res.statusCode = 200;
      res.end(html);
    } else {
      res.writeHead(500);
      res.end();
    }
   
  });
}

function welcome(req, res) {	
	 loadHtmlPage(req, res, './web/welcome/welcome.html');
}

function dahsboard(req, res) {
    loadHtmlPage(req, res, './web/stats/dashboard.html');
}

function userstat(req, res) {
    loadHtmlPage(req, res, './web/stats/userstat.html');
}


function errors(req, res) {
    loadHtmlPage(req, res, './web/stats/errors.html');
}

function actions(req, res) {
    loadHtmlPage(req, res, './web/stats/actions.html');
}


function processResources(res, res, filename, mimeType) {

 	var localPath = __dirname;
	//move to upper level (..) and got to the requested file
    localPath = path.join(localPath, "..", filename);

    fs.exists(localPath, function(exists) {
      if(exists) {
        

          //read the file requested JS, CSS, image
          fs.readFile(localPath, function(err, contents) {
                if(!err) {
                    res.setHeader("Content-Length", contents.length);
                    res.setHeader("Content-Type", mimeType);
                    res.statusCode = 200;
                    res.end(contents);
                } 
                else {
                	//error happened
                	res.writeHead(500);
                	res.end();
                }
          });
          // ------
      } 
      else {
          console.log("File not found: " + localPath);
          res.writeHead(404);
          res.end();
      }
    });

}

function process(req, res) {



    var validExtensions = {
      ".js"   : "application/javascript",
      ".css"  : "text/css",      
      ".jpg"  : "image/jpeg",
      ".gif"  : "image/gif",
      ".png"  : "image/png",
      ".svg"  : "image/svg",
      ".1"    : "image/.1", 
      ".html" : "text/html",
      ".woff" : "application/x-font-woff"    
    };     

   
    var filename = req.url || "welcome.html";
    var ext = path.extname(filename);


    //check if requested extension is valid one
    var ext = validExtensions[ext];
 
    //success, this is a valid extension
    if (ext) {       

        processResources(req,res, filename, ext);     
    } 
    else 
    {
       console.log("Invalid file extension detected: " + ext);      
    }
}



function toDbFormattedDate(date) {
   var splits = date.split("-"); 
   return splits[2] + "/" + splits[1] + "/" + splits[0];
}


function getAppVersionsDistribution(req, res) {

 
   var url_parts = url.parse(req.url, true);
   var query = url_parts.query;

   var startDate = toDbFormattedDate(query.startDate); 
   var endDate = toDbFormattedDate(query.endDate);

   var done = function(data)  {
      var jsonData = JSON.stringify(data); 
      console.log("Version distribution json: " + jsonData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonData);
   }

   var err = function(err) {
      res.writeHead(500, err.message);
   }

   var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      done : done,           //done callback 
      err: err               //error callback
   };

   
   db.getAppVersionsDistribution(params);

}



function getAvgUseTimePerDay(req, res) {

 
   var url_parts = url.parse(req.url, true);
   var query = url_parts.query;

   var startDate = toDbFormattedDate(query.startDate); 
   var endDate = toDbFormattedDate(query.endDate);

   var done = function(data)  {


      var returnData = []; 


      var currentDate = "";     
      var totMinutes = 0; 

      var startToMinutes = 0;
    
      if(data.length >0)
        currentDate = data[0].RegistrationDate;

      var length = data.length;


      for(var i=0; i<length;i++) {
        var d = data[i];

        /*For every second row caclulate difference in total minutes*/
        if(d.Opened[0] === 0 && startToMinutes != undefined) {
           var time = d.RegistrationHour.split(":"); 
           time = parseInt(time[0]) * 60 + parseInt(time[1]);  //calculate total time in monutes
             
           totMinutes += (time - startToMinutes); //get the difference between current and previous row (in minutes)           
           startToMinutes = undefined;

        }
        else {
           startToMinutes= d.RegistrationHour.split(":"); 
           startToMinutes = parseInt(startToMinutes[0]) * 60 + parseInt(startToMinutes[1]);
        }

        if(currentDate !== d.RegistrationDate || i === length - 1) {      
          returnData.push({date:currentDate, totMin : totMinutes});
          currentDate = d.RegistrationDate;
          totMinutes = 0;
        }

        opened = d.Opened;
    
      }

      var jsonData = JSON.stringify(returnData); 
      console.log("Time per day json: " + jsonData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonData);
   }

   var err = function(err) {
      res.writeHead(500, err.message);
   }

   var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      done : done,           //done callback 
      err: err               //error callback
   };

   
   db.getAvgUseTimePerDay(params);

}

function getAvgUseTimePerDayByUser(req, res) {
   var url_parts = url.parse(req.url, true);
   var query = url_parts.query;

   var startDate = toDbFormattedDate(query.startDate); 
   var endDate = toDbFormattedDate(query.endDate);
   var clientID = query.clientID;

   var done = function(data)  {


      var returnData = []; 


      var currentDate = "";     
      var totMinutes = 0; 

      var startToMinutes = 0;
    
      if(data.length >0)
        currentDate = data[0].RegistrationDate;

      var length = data.length;


      for(var i=0; i<length;i++) {
        var d = data[i];

        /*For every second row caclulate difference in total minutes*/
        if(d.Opened[0] === 0 && startToMinutes != undefined) {
           var time = d.RegistrationHour.split(":"); 
           time = parseInt(time[0]) * 60 + parseInt(time[1]);  //calculate total time in monutes
             
           totMinutes += (time - startToMinutes); //get the difference between current and previous row (in minutes)           
           startToMinutes = undefined;

        }
        else {
           startToMinutes= d.RegistrationHour.split(":"); 
           startToMinutes = parseInt(startToMinutes[0]) * 60 + parseInt(startToMinutes[1]);
        }

        if(currentDate !== d.RegistrationDate || i === length - 1) {      
          returnData.push({date:currentDate, totMin : totMinutes});
          currentDate = d.RegistrationDate;
          totMinutes = 0;
        }

        opened = d.Opened;
    
      }

      var jsonData = JSON.stringify(returnData); 
      console.log("Time per day json: " + jsonData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonData);
   }

   var err = function(err) {
      res.writeHead(500, err.message);
   }

   var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      clientID  : clientID,  //clientID    
      done : done,           //done callback 
      err: err               //error callback
   };

   
   db.getAvgUseTimePerDay(params);
}



function getErrorsDistributionInPeriod(req, res) 
{
   var url_parts = url.parse(req.url, true);
   var query = url_parts.query;

   var startDate = toDbFormattedDate(query.startDate); 
   var endDate = toDbFormattedDate(query.endDate);


   var done = function(data) {
      var jsonData = JSON.stringify(data); 
      console.log("Errors distribution: " + jsonData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonData);
   }

   var err = function(err) {
      res.writeHead(500, err.message);
   }

   var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      done : done,           //done callback 
      err: err               //error callback
   };

   
   console.log("GET ERROR DISTRIBUTION");
   db.getErrorsDistributionInPeriod(params);
}

function getErrorDistributionInPeriodByType(req, res) {
   var url_parts = url.parse(req.url, true);
   var query = url_parts.query;

   var startDate = toDbFormattedDate(query.startDate); 
   var endDate = toDbFormattedDate(query.endDate);


   var done = function(data) {
      var jsonData = JSON.stringify(data); 
      console.log("Errors distribution: " + jsonData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonData);
   }

   var err = function(err) {
      res.writeHead(500, err.message);
   }

   var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      done : done,           //done callback 
      err: err               //error callback
   };

   
   console.log("GET ERROR DISTRIBUTION BY DATE AND TYPE");
   db.getErrorDistributionInPeriodByType(params);
}


function getErrorsDistributionInPeriodByUser(req, res) 
{
   var url_parts = url.parse(req.url, true);
   var query = url_parts.query;

   var startDate = toDbFormattedDate(query.startDate); 
   var endDate = toDbFormattedDate(query.endDate);
   var clientID = query.clientID;


   var done = function(data) {
      var jsonData = JSON.stringify(data); 
      console.log("Errors distribution: " + jsonData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonData);
   }

   var err = function(err) {
      res.writeHead(500, err.message);
   }

   var params ={
      startDate     : startDate, //start date 
      endDate       : endDate,   //end date 
      clientID      : clientID,  //client ID
      done          : done,      //done callback 
      err           : err        //error callback
   };

   
   console.log("GET ERROR DISTRIBUTION");
   db.getErrorsDistributionInPeriod(params);
}


function getErrorLogInPeriod(req, res) {
   var url_parts = url.parse(req.url, true);
   var query = url_parts.query;

   var startDate = toDbFormattedDate(query.startDate); 
   var endDate = toDbFormattedDate(query.endDate);


   var done = function(data) {
      var jsonData = JSON.stringify(data); 
      console.log("Errors getErrorLogInPeriod: " + jsonData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonData);
   }

   var err = function(err) {
      res.writeHead(500, err.message);
   }

   var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      done : done,           //done callback 
      err: err               //error callback
   };
   
   console.log("GET ERRORS LOG");
   db.getErrorLogInPeriod(params);
}


function getOrdersStat(req, res) {

   var url_parts = url.parse(req.url, true);
   var query = url_parts.query;

   var startDate = toDbFormattedDate(query.startDate); 
   var endDate = toDbFormattedDate(query.endDate);


   var done = function(data) {
      var jsonData = JSON.stringify(data); 
      console.log("Errors distribution: " + jsonData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonData);
   }

   var err = function(err) {
      res.writeHead(500, err.message);
   }

   var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      done : done,           //done callback 
      err: err               //error callback
   };
   
   console.log("GET ORDERS STAT");
   db.getOrdersStat(params);
}


function getOrderStatByUser(req, res) {
  var url_parts = url.parse(req.url, true);
   var query = url_parts.query;

   var startDate = toDbFormattedDate(query.startDate); 
   var endDate = toDbFormattedDate(query.endDate);
   var clientID = query.clientID;


   var done = function(data) {
      var jsonData = JSON.stringify(data); 
      console.log("Errors distribution: " + jsonData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonData);
   }

   var err = function(err) {
      res.writeHead(500, err.message);
   }

   var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      clientID  : clientID,  //lcient ID
      done : done,           //done callback 
      err: err               //error callback
   };
   
   console.log("GET ORDERS STAT");
   db.getOrdersStat(params);
}


function getUserInfo(req, res) 
{
   var url_parts = url.parse(req.url, true);
   var query = url_parts.query;

   var startDate = toDbFormattedDate(query.startDate); 
   var endDate = toDbFormattedDate(query.endDate);
   var clientID = query.clientID;


   var done = function(data) {
      var jsonData = JSON.stringify(data); 
      console.log("Errors distribution: " + jsonData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonData);
   }

   var err = function(err) {
      res.writeHead(500, err.message);
   }

   var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date 
      clientID  : clientID,  //client ID
      done : done,           //done callback 
      err: err             //error callback
   };
   
   console.log("GET USER INFO");
   db.getUserInfo(params);
}


function getHardwareOverallInfo(req, res) {
   var url_parts = url.parse(req.url, true);
   var query = url_parts.query;

   var startDate = toDbFormattedDate(query.startDate); 
   var endDate = toDbFormattedDate(query.endDate);
 
   var done = function(data) {
      var jsonData = JSON.stringify(data); 
      console.log("Errors distribution: " + jsonData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonData);
   }

   var err = function(err) {
      res.writeHead(500, err.message);
   }

   var params ={
      startDate : startDate, //start date 
      endDate   : endDate,   //end date      
      done : done,           //done callback 
      err: err             //error callback
   };
   
   console.log("GET HARDWARE OVERALL INFO");
   db.getHardwareOverallInfo(params);
}




exports.welcome 	                              = welcome; 
exports.dashboard                               = dahsboard;
exports.userstat                                = userstat;
exports.errors                                  = errors;
exports.actions                                 = actions;
exports.process 	                              = process; 
exports.getAppVersionsDistribution              = getAppVersionsDistribution;
exports.getAvgUseTimePerDay                     = getAvgUseTimePerDay;
exports.getAvgUseTimePerDayByUser               = getAvgUseTimePerDayByUser;
exports.getErrorsDistributionInPeriod           = getErrorsDistributionInPeriod;
exports.getErrorDistributionInPeriodByType      = getErrorDistributionInPeriodByType;
exports.getErrorsDistributionInPeriodByUser     = getErrorsDistributionInPeriodByUser;
exports.getErrorLogInPeriod                     = getErrorLogInPeriod;
exports.getOrdersStat                           = getOrdersStat;
exports.getOrderStatByUser                      = getOrderStatByUser;
exports.getUserInfo                             = getUserInfo;
exports.getHardwareOverallInfo                  = getHardwareOverallInfo;