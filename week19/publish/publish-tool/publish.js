const http = require('http');
const querystring = require('querystring');
const { fstat } = require('fs');
const fs = require('fs');
var archiver = require('archiver');

/*
const postData = querystring.stringify({
    'content': 'Hello World! 123'
  });
*/

//let filename = "./cat.jpg";
let packname = "./package";

//fs.stat(filename, (error, stat) => {
  const options = {
    host: 'localhost',
    port: 8081,
    //path: '/?filename=' + filename,
    path: '/?filename=' + "package.zip",
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream',
        //'Content-Length': stat.size
        //'Content-Length': 0
      }
    };

  const req = http.request(options, (res) => {
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });

  // Make a request
  req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
  });


    
    var archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    archive.directory(packname, false);

    archive.finalize();
    

    archive.pipe(req);

    archive.on('end', () => {
      req.end();
    }) 
    // Write data to request body
  /*
    let readStream = fs.createReadStream("./" + filename);
    readStream.pipe(req);
    readStream.on('end', () => {
        req.end();
    }) */
   //req.write(postData);
    //req.end();
//})

/*
const options = {
    host: 'localhost',
    port: 8081,
    path: '/?filename=z.html',
    method: 'POST',
    headers: {
       // 'Content-Type': 'application/x-www-form-urlencoded',
        //'Content-Length': Buffer.byteLength(postData)
        'Content-Type': 'application/octet-stream'
      }
};
*/

