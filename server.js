var pulseProcessor = require("./requestProcessors/pulseProcessor");      //create pulse Processor
var webProcessor   = require("./requestProcessors/webProcessor");        //create web Processor
var express        = require("express");


var app= express();  

var port = process.env.PORT || 3100;

// Log the requests
app.use(express.logger('dev'));


/*** PULSE requests handlers *****/ 
var processPulseRequest = function(req, res, callback) {
    var data = "";
    req.on('data', function(chunk) {     
      data += chunk.toString();
    });
    
    req.on('end', function() {    
      var result = callback(data);
      res.send(result);
    });
};

app.post('/pulse/start', function(req, res){    
     console.log("Start pulse....");
     processPulseRequest(req, res, pulseProcessor.startData); 
     res.send("ok");
});


app.post('/pulse/stop', function(req, res){    
    console.log("Stop pulse....");
    processPulseRequest(req, res, pulseProcessor.stopData);  
});


app.post('/pulse/action', function(req, res){    
    processPulseRequest(req, res, pulseProcessor.actionData);  
});

app.post('/pulse/error', function(req, res){    
    processPulseRequest(req, res, pulseProcessor.errorData);  
});

app.post('/pulse/getAppVersionsDistribution', function(req, res){    
    processPulseRequest(req, res, pulseProcessor.getAppVersionsDistribution);  
});
/********************************/


/** WEB requests handlers ****/ 

app.get('/welcomepulse', function(req, res){     
   console.log("WELCOME PULSE");
   webProcessor.welcome(req,res);  
});

app.get('/dashboard', function(req, res){     
   console.log("DASHBOARD");
   webProcessor.dashboard(req,res);  
});

app.get('/dashboard/getAppVersionsDistribution', function(req, res){     
   console.log("DASHBOARD/APPVERSION DISTRIBUTION");
   webProcessor.getAppVersionsDistribution(req,res);  
});


app.get('/dashboard/getAvgUseTimePerDay', function(req, res){     
   console.log("DASHBOARD/AVG TIME USED PER DAY");
   webProcessor.getAvgUseTimePerDay(req,res);  
});


app.get('/dashboard/getErrorsDistributionInPeriod', function(req, res){     
   console.log("DASHBOARD/ERRORS DISTRIBUTION");
   webProcessor.getErrorsDistributionInPeriod(req,res);  
});


app.get('/dashboard/getOrdersStat', function(req, res){     
   console.log("DASHBOARD/ORDERS STAT");
   webProcessor.getOrdersStat(req,res);  
});


app.get('/userstat/getUserInfo', function(req, res){     
   console.log("USERSTAT/GET USER INFO");
   webProcessor.getUserInfo(req,res);  
});


app.get('/userstat/getOrderStatByUser', function(req, res){     
   console.log("USERSTAT/ORDERS STAT BY USER");
   webProcessor.getOrderStatByUser(req,res);  
});

app.get('/userstat/getErrorsDistributionInPeriodByUser', function(req, res){     
   console.log("USERSTAT/ERRORS DISTRIBUTION BY USER");
   webProcessor.getErrorsDistributionInPeriodByUser(req,res);  
});


app.get('/userstat/getAvgUseTimePerDayByUser', function(req, res){     
   console.log("USERSTAT/AVG TIME USED PER DAY BY USER");
   webProcessor.getAvgUseTimePerDayByUser(req,res);  
});






app.get('/userstat', function(req, res){     
   console.log("USERSTAT");
   webProcessor.userstat(req,res);  
});

app.get('/errors', function(req, res){     
   console.log("ERRORS");
   webProcessor.errors(req,res);  
});

app.get('/actions', function(req, res){     
   console.log("ACTIONS");
   webProcessor.actions(req,res);  
});

app.get('*', function(req, res) {    
  webProcessor.process(req, res);
});


/********************************/


app.use(function(err, req, res, next){  
  console.error(err.stack); 
});

console.log("Start listening on port " + port);
app.listen(port, process.env.IP);


exports._express  = express;