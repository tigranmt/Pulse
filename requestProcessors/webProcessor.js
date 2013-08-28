
var fs   = require("fs"); 
var path = require('path');

function welcome(req, res) {
	console.log(req.url);
	fs.readFile('./web/welcome/welcome.html', function (err, html) {
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

function process(req, res) {



    var validExtensions = {
      ".js"  : "application/javascript",
      ".css" : "text/css",      
      ".jpg" : "image/jpeg",
      ".gif" : "image/gif",
      ".png" : "image/png",
      ".svg" : "image/svg",
      ".1"   : "image/.1",
      ".ico" : "image/ico"
    };  

    var localPath = __dirname;
    var filename = req.url || "welcome.html";
    var ext = path.extname(filename);


    //check if requested extension is valid one
    var isValidExt = validExtensions[ext];


 
    //success, this is a valid extension
    if (isValidExt) {       

        //move to upper level (..) and got to the requested file
        localPath = path.join(localPath, "..", filename);

        fs.exists(localPath, function(exists) {
          if(exists) {
            

              //read the file requested JS, CSS, image
              fs.readFile(localPath, function(err, contents) {
                    if(!err) {
                        res.setHeader("Content-Length", contents.length);
                        res.setHeader("Content-Type", isValidExt);
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
    else 
    {
       console.log("Invalid file extension detected: " + ext)
    }
}


exports.welcome = welcome; 
exports.process = process; 