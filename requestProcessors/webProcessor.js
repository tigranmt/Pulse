
var fs   = require("fs"); 
var path = require('path');


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


exports.welcome 	   = welcome; 
exports.dashboard    = dahsboard;
exports.userstat     = userstat;
exports.errors       = errors;
exports.actions      = actions;
exports.process 	   = process; 