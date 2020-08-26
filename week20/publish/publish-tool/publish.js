const http = require('http');
const querystring = require('querystring');
const { fstat } = require('fs');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');

/*
const postData = querystring.stringify({
    'content': 'Hello World! 123'
  });
*/

//let filename = "./cat.jpg";
let packname = "./package";

//fs.stat(filename, (error, stat) => {
//唤起登录 
let redirect_uri = encodeURIComponent("http://localhost:8081/auth");
child_process.exec(`start https://github.com/login/oauth/authorize?client_id=Iv1.b05658c13748c6eb&redirect_uri=${redirect_uri}&scope=read%3Auser&state=123abc`)

//启动server，在没有接受到token时不做任何操作
const server = http.createServer((request, res) => {
    //console.log(req.url);
    let token = request.url.match(/token=([^&]+)/)[1];
    console.log("real publish!!");
    const options = {
      host: 'localhost',
      port: 8081,
      path: '/?filename=' + "package.zip",
      method: 'POST',
      headers: {
        'token': token,
        'Content-Type': 'application/octet-stream'
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
        console.log("publish success!!")
        res.end("publish success!!")
        server.close();
      })  
});
server.listen(8080);

  /*const options = {
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
      let redirect_uri = encodeURIComponent("http://localhost:8081/auth");
      //唤起浏览器https://blog.csdn.net/jiezhi2013/article/details/40050049
      child_process.exec(`start https://github.com/login/oauth/authorize?client_id=Iv1.b05658c13748c6eb&redirect_uri=${redirect_uri}&scope=read%3Auser&state=123abc`)
    })  
*/
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

