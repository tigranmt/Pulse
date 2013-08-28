var pulseProcessor = require("./pulseProcessor");      //create Processor
var express = require("express");
var app= express();                                 //create express object


var port = process.env.PORT || 3000;

/*app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));*/

var processRequest = function(req, res, callback) {
    var data = "";
    req.on('data', function(chunk) {     
      data += chunk.toString();
    });
    
    req.on('end', function() {    
      var result = callback(data);
      res.send(result);
    });
};

var showDashboardStats = function(req, res) {
  pulseProcessor.showDashboardStats(req, res);
}


app.post('/pulse/start', function(req, res){    
     console.log("Start pulse....");
     processRequest(req, res, pulseProcessor.startData); 
     res.send("ok");
});


app.post('/pulse/stop', function(req, res){    
    console.log("Stop pulse....");
    processRequest(req, res, pulseProcessor.stopData);  
});


app.post('/pulse/action', function(req, res){    
    processRequest(req, res, pulseProcessor.actionData);  
});


app.get('/stats/dashboard', function(req, res) {
  console.log("Getting dashboard data...");
  showDashboardStats(req, res);
});



app.use(function(err, req, res, next){
  console.error(err.stack);
 
});

console.log("Start listening on port " + port);
app.listen(port, process.env.IP);


exports._express  = express;