

var processor = require("./messageProcessor");
var express = require("express");
var app= express();


var processRequest = function(req, callback) {
    var data = "";
    req.on('data', function(chunk) {     
      data += chunk.toString();
    });
    
    req.on('end', function() {    
      callback(data);
    });
};


app.post('/pulse/start', function(req, res){    
     processRequest(req,  processor.startData); 
});


app.post('/pulse/stop', function(req, res){    
    processRequest(req,   processor.stopData);  
});


app.post('/pulse/action', function(req, res){    
    processRequest(req, processor.actionData);  
});


app.listen(process.env.PORT, process.env.IP);

