# 整合工具链

### 配置环境

yeoman：  
https://yeoman.io/authoring/index.html  
通过yeoman将component和工具链整合起来

+ 建立toytool文件夹，npm init，协议建议MIT
+ npm install yeoman-generator
+ 建立目录结构toy-tool>generators>app>index.js
```
测试代码：
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
      }
      method1() {
        this.log('method 1 just ran');
      }
};
```
+ npm link
+ yo toytool

templates：  
https://yeoman.io/authoring/file-system.html

+ 建立目录结构generators>app>templates>index.html
```
测试代码：
<html>
  <head>
    <title><%= title %></title>
  </head>
</html>
```
+ yo toytool


### 整合component

+ 在creating模板之前进行npm初始化，即配置package.json  
https://yeoman.io/authoring/dependencies.html
+ tt-demo目录下yo toytool
+ 把component中的createElement，gesture，animation等用yo toytool拷贝至tt-demo
+ webpack-dev-server启动项目
+ npm start
+ 调试build(webpack)命令，安装html-webpack-plugin  
https://webpack.js.org/api/node/#compiler-instance

+ 调试Mocha


# Publish

### 环境

VirtualBox免费虚拟机当服务器：
https://www.virtualbox.org/wiki/Downloads  
https://ubuntu.com/download/desktop

### express搭web服务
https://expressjs.com/en/starter/installing.html  

+ 线上服务server
  + npm init
  + npm install express --save
  + index.js中运行hello world代码，node index.js调试
  + Express generator：npx express-generator
  + npm install,npm start，调试express环境是否跑起来
  + basic routing
  + 往public里放东西，可直接发布

+ 内网publish-server
  + npx express-generator --no-view
  + npm install,npm start，调试express环境是否跑起来

+ 创建要发布的文件  
https://nodejs.org/docs/latest-v13.x/api/fs.html
```
routes中的index.js：

var express = require('express');
var router = express.Router();
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
    //console.log(req);
    fs.writeFileSync("../server/public/1.html", "Hello world")
});

module.exports = router;

```
> 通过publish-tool将publish-server上的文件发布到server上去
 fs.writeFileSync("../server/public/1.html", "Hello world")  
 publish-tool要做的是将文件名和内容从客户端取  
 最后publish-tool进入到toolchain里作为整个工具链最后一环

+ init publish-tool  
https://nodejs.org/docs/latest-v13.x/api/http.html
  + 指定文件名："../server/public/" + req.query.filename
  + 指定文件内容
```
publish.js:

const http = require('http');
const querystring = require('querystring');

const postData = querystring.stringify({
    'content': 'Hello World! 123'
  });

const options = {
    host: 'localhost',
    port: 8081,
    path: '/?filename=x.html',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
};

// Make a request
const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });
  
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  
  // Write data to request body
  req.write(postData);
  req.end();
  ```

  ```
index.js:

var express = require('express');
var router = express.Router();
const fs = require('fs');
const { request } = require('http');

/* GET home page. */
router.post('/', function(request, res, next) {
    fs.writeFileSync("../server/public/" + request.query.filename, request.body.content)
});

module.exports = router;
  ```

+ 流式处理，传输大文件
https://nodejs.org/docs/latest-v13.x/api/fs.html#fs_fs_createwritestream_path_options  

fs.createWriteStream(path[, options])
```
publish-server：index.js:

const http = require('http');
const fs = require('fs');

// Create an HTTP server
const server = http.createServer((req, res) => {
    //console.log(req);
    let matched = req.url.match(/filename=([^&]+)/);  
    let filename = matched && matched[1];
    if(!filename)
        return;
    let writeStream = fs.createWriteStream("../server/public/" + filename);
    req.pipe(writeStream);
    req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('okay');
    })
}); 

server.listen(8081);
```

+ 把一个文件(cat.jpg)读出来，并POST上传
```
publish-tool:

const http = require('http');
const querystring = require('querystring');
const { fstat } = require('fs');
const fs = require('fs');

let filename = "./cat.jpg";

fs.stat(filename, (error, stat) => {
  const options = {
    host: 'localhost',
    port: 8081,
    path: '/?filename=cat.jpg',
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size
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
    
    // Write data to request body
  
    let readStream = fs.createReadStream("./cat.jpg");
    readStream.pipe(req);
    readStream.on('end', () => {
        req.end();
    })
})

```

+ 批量发布文件：打包一个目录，然后上传  
文件压缩：  
https://www.npmjs.com/package/archiver

```
publish:

const http = require('http');
const querystring = require('querystring');
const { fstat } = require('fs');
const fs = require('fs');
var archiver = require('archiver');

let packname = "./package";

  const options = {
    host: 'localhost',
    port: 8081,
    path: '/?filename=' + "package.zip",
    method: 'POST',
    headers: {
        'Content-Type': 'application/octet-stream',
      }
    };

    
    var archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    archive.directory(packname, false);

    archive.finalize();
    
    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    });

    // Make a request
    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    archive.pipe(req);

    archive.on('end', () => {
      req.end();
    }) 
```

+ 服务端解压
https://www.npmjs.com/package/unzipper

```
publish-server：

const http = require('http');
const fs = require('fs');
const unzip = require('unzipper');

// Create an HTTP server
const server = http.createServer((req, res) => {
    let writeStream = unzip.Extract({path:'../server/public'});
    req.pipe(writeStream);

    req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('okay');
    })
}); 

server.listen(8081);
```