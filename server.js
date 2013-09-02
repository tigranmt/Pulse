var pulseProcessor = require("./requestProcessors/pulseProcessor");      //create pulse Processor
var webProcessor   = require("./requestProcessors/webProcessor");        //create web Processor
var express        = require("express");


var app= express();                                


var port = process.env.VCAP_APP_PORT || 3000;


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