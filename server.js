/****************************************************************************
* Author: Kabir Sharan *
This file is part of the application NodeJsExpressFileUploadDemo.

NodeJsExpressFileUploadDemo is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

NodeJsExpressFileUploadDemo is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
****************************************************************************/


var http = require('http');
var express = require('express');
var fs = require('fs');

var startServer = function() {
    // Create the server using Express APIs.
    // No need to call http.createServer. This server instance does expose some more aggregated APIs
    var app = express();
    var host = '127.0.0.1'; // Local host.
    var port = 4444;
    var publicDir = __dirname + '/public/';
    var uploadFileTempDir = 'uploadTemp';
    var uploadFileDir = publicDir + 'uploadedFiles/';

    app.use(express.bodyParser({uploadDir: uploadFileTempDir})); // If the path is not mentioned, default is "/tmp"
    app.use('/', express.static(publicDir));
    
    // Default home to the uploader page
    app.get('/', function(req, res) {
            console.log('Request received for file uploader page.');
            res.setHeader('Content-Type', 'text/html');
            res.send(fs.readFileSync('./public/uploader.html'));
        });
    
    app.post('/uploadFile', function(req, res) {
            console.log('File upload path: ' + req.files.fileToUpload.path);
            console.log('File upload name: ' + req.files.fileToUpload.name);
            console.log('File upload type: ' + req.files.fileToUpload.type);
            console.log('File upload size: ' + req.files.fileToUpload.size);
             
            /*** Move to a public folder ***/
            // Move file from path to the upload directory using original file name.
            // Note: path uses the temp file name
            var fileDestPath = uploadFileDir + req.files.fileToUpload.name;
            fs.rename(req.files.fileToUpload.path, fileDestPath, function(err) {
                  if (err) {
                        console.log('File could not be moved to proper directory.');
                        // Delete the temp file.
                        fs.unlink(req.files.fileToUpload.path, function(err2) {
                            if (err2) {
                                console.log('Temp file could not be deleted.');
                                throw err2;
                            }
                        });
                        console.log('Temp file deleted.');
                        throw err;
                  }
                  
                  // Log and send response success
                  console.log('Upload done!');
                      
                  res.setHeader('Content-Type', 'text/html');
                  var resContent = '<html><body>Upload done. <a href="uploadedFiles/' + req.files.fileToUpload.name + '">link to the file</a></body></html>';
                  res.send(resContent);
            });
            
        });
    
    app.listen(port, host);
    console.log('Server started at http://127.0.0.1:4444/');
};

startServer();

/* END */