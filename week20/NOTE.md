# Check  

## 无头浏览器PhantomJS
https://phantomjs.org/download  
检查渲染结果

> 安装：exe直接拷进node的文件夹

### 调试环境
https://phantomjs.org/quick-start.html

+ render图片：
```
var page = require('webpage').create();
page.open('http://www.baidu.com', function(status) {
  console.log("Status: " + status);
  if(status === "success") {
    page.render('baidu.png');
  }
  phantom.exit();
});
```

+ 获取网页title
```
var page = require('webpage').create();
page.open('http://www.baidu.com', function(status) {
    console.log("Status: " + status);
    if(status === "success") {
        var title = page.evaluate(function() {
            return document.title;
        });
        console.log(title);
    }
    phantom.exit();
});
```

### 测试
+ 启动local server
+ 对其中的元素assert断言  

页面渲染出来的DOM结构：
```
var page = require('webpage').create();
page.open('http://baidu.com', function(status) {
    console.log("Status: " + status);
    if(status === "success") {
        var body = page.evaluate(function() {
            var toString = function(pad, element) {
                var children = element.children;
                var childrenString = '';
                for(var i = 0; i < element.children.length; i++){
                    childrenString += toString("  " + pad, element.children[i]) + "\n";
                }
                return pad + element.tagName + (childrenString ? "\n" + childrenString : "")
            }
            return toString("", document.body);
        });
        console.log(body);
    }
    phantom.exit();
});
```

PhantomJS Mocha
https://github.com/nathanboktae/mocha-phantomjs
https://www.npmjs.com/package/mocha-phantomjs

 
## eslint
https://eslint.org/docs/user-guide/getting-started
检查code style

https://www.npmjs.com/package/eslint-plugin-react

配置.eslintrc.js的rules：
https://eslint.org/docs/user-guide/configuring  
一般改动rules需要团队通过



# OAuth

https://developer.github.com/v3/#authentication 

## 手动完成一次OAuth

步骤：
https://developer.github.com/apps/building-oauth-apps/

#### step1：创建github app
https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/

+ 登录GitHub——settings——Developer settings——new github app
+ 填写名字和url（http://localhost），取消勾选webhook的active
+ 获得在鉴权中使用的重要信息：
    + App ID: 78009
    + Client ID: Iv1.b05658c13748c6eb（公开的，很容易被猜到）
    + Client secret: 491f31f5e1fd552a3c9ae52220ff2958152f1acf（保存在服务器永远不会被二次传播）


#### step2：Authorizing OAuth Apps
https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/

+ 获得code（浏览器端，publish-tool唤起浏览器）
    + https://github.com/login/oauth/authorize?
    + client_id=Iv1.b05658c13748c6eb&
    + redirect_uri=http%3A%2F%2Flocalhost%3A8000&
    + scope=read%3Auser&
    + state=123abc
    + 以上地址访问，通过authorize，得到link中的code:d3141fb93808e84ac29d，用与去换取token

+ 拿code换取token（服务器端publish-server）
```
{
    let code = "c51d4d56e89bdf2b650b";
    let state = "abc123";
    let client_secret = "491f31f5e1fd552a3c9ae52220ff2958152f1acf";
    let client_id = "Iv1.b05658c13748c6eb";
    let redirect_uri = encodeURIComponent("http://localhost:8000");

    let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`

    let xhr = new XMLHttpRequest;

    xhr.open("POST", `https://github.com/login/oauth/access_token?${params}`, true)
    xhr.send(null);

    xhr.addEventListener("readystatechange", function(event){
        if(xhr.readyState === 4) {
            debugger;
            console.log(xhr.responseText);
        }
    });
}
```
在console-network-response中得到access_token：  
access_token=563d0f4fc139e73bea0821c791a85ac336f3bd36&expires_in=28800&refresh_token=r1.bd58f25b0481fa867c533aed7812884a52cc5feddcf30b779de372c0b4386960c80dd27e635f986b&refresh_token_expires_in=15897600&scope=&token_type=bearer


+ 调user API，取用户信息（客户端/服务端 publish-tool/publish-server）
https://developer.github.com/v3/users/#get-the-authenicated-user

```
{
    let xhr = new XMLHttpRequest;

    xhr.open("GET", `https://api.github.com/user`, true)
    xhr.setRequestHeader("Authorization", "token 563d0f4fc139e73bea0821c791a85ac336f3bd36");
    xhr.send(null);

    xhr.addEventListener("readystatechange", function(event){
        if(xhr.readyState === 4) {
            debugger;
            console.log(xhr.responseText);
        }
    });
}
```

得到用户信息：
```
{
  "login": "EdieFu",
  "id": 63287146,
  "node_id": "MDQ6VXNlcjYzMjg3MTQ2",
  "avatar_url": "https://avatars3.githubusercontent.com/u/63287146?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/EdieFu",
  "html_url": "https://github.com/EdieFu",
  "followers_url": "https://api.github.com/users/EdieFu/followers",
  "following_url": "https://api.github.com/users/EdieFu/following{/other_user}",
  "gists_url": "https://api.github.com/users/EdieFu/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/EdieFu/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/EdieFu/subscriptions",
  "organizations_url": "https://api.github.com/users/EdieFu/orgs",
  "repos_url": "https://api.github.com/users/EdieFu/repos",
  "events_url": "https://api.github.com/users/EdieFu/events{/privacy}",
  "received_events_url": "https://api.github.com/users/EdieFu/received_events",
  "type": "User",
  "site_admin": false,
  "name": null,
  "company": null,
  "blog": "",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": null,
  "twitter_username": null,
  "public_repos": 3,
  "public_gists": 0,
  "followers": 0,
  "following": 0,
  "created_at": "2020-04-07T08:48:09Z",
  "updated_at": "2020-08-23T05:07:13Z"
}

```


## Node环境完成OAuth

#### step1 browser给code给server，server给出token

publish-tool:
+ npm install child_process
+ 唤起浏览器命令；https://blog.csdn.net/jiezhi2013/article/details/40050049
```
archive.on('end', () => {
      req.end();
      child_process.exec("start https://github.com/login/oauth/authorize?client_id=Iv1.b05658c13748c6eb&redirect_uri=http%3A%2F%2Flocalhost%3A8081&scope=read%3Auser&state=123abc")
    })  
```

server:
```
const http = require('http');
const fs = require('fs');
const unzip = require('unzipper');
const https = require('https');

// Create an HTTP server
const server = http.createServer((req, res) => {
    if(req.url.match(/^\/auth/)) {
        return auth(req, res)
    }

    if(!req.url.match(/^\/$/)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('not found');
        return;
    }

    let writeStream = unzip.Extract({path:'../server/public'});
    req.pipe(writeStream);

    req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('okay');
    })
}); 

function auth(req, res) {
    let code = req.url.match(/code=([^&]+)/)[1];
    let state = "abc123";
    let client_secret = "491f31f5e1fd552a3c9ae52220ff2958152f1acf";
    let client_id = "Iv1.b05658c13748c6eb";
    let redirect_uri = encodeURIComponent("http://localhost:8081/auth");

    let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`
    let url = `https://github.com/login/oauth/access_token?${params}`;
    
    
    const options = {
        hostname: 'github.com',
        port: 443,
        path: `/login/oauth/access_token?${params}`,
        method: 'POST'
    };


    const request = https.request(options, (response) => {
        response.on('data', (d) => {
            let result = d.toString().match(/access_token=([^&]+)/);
            if(result) {
                let token = result[1];
                res.writeHead(200, { 
                    'access_token': token,
                    'Content-Type': 'text/plain' 
                });
                res.end('okay');
            } else {
                res.writeHead(200, { 
                    'Content-Type': 'text/plain' 
                });
                res.end('error');
            }
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
}

server.listen(8081);
```

#### step2 server的token给到brower然后到tool
publish tool:
```
let redirect_uri = encodeURIComponent("http://localhost:8081/auth");
child_process.exec(`start https://github.com/login/oauth/authorize?client_id=Iv1.b05658c13748c6eb&redirect_uri=${redirect_uri}&scope=read%3Auser&state=123abc`)
const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log("real publish!!");
});
server.listen(8080);
```

publish-server:
```
const request = https.request(options, (response) => {
    response.on('data', (d) => {
        let result = d.toString().match(/access_token=([^&]+)/);
        if(result) {
            let token = result[1];
            res.writeHead(200, { 
                'access_token': token,
                'Content-Type': 'text/html' 
            });
            res.end(`<a href="http://localhost:8080/publish?token=${token}">publish</a>`);
        } else {
            res.writeHead(200, { 
                'Content-Type': 'text/plain' 
            });
            res.end('error');
        }
    });
});
```

#### step3 publish-tool真正发起pubulish，向server发出请求

browser返回的url中带token，给到publish-tool，publish-tool真正发起pubulish，向server发出请求。server从请求的header中拿到token，会向github api拉取user信息，然后得到当前用户信息（id等），即可做权限检查。检查完权限，才实际的读publish-tool的流（whiteStream），然后返回客户端OK。  

publish-tool:
```
const http = require('http');
const querystring = require('querystring');
const { fstat } = require('fs');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');

let packname = "./package";

//唤起登录 
let redirect_uri = encodeURIComponent("http://localhost:8081/auth");
child_process.exec(`start https://github.com/login/oauth/authorize?client_id=Iv1.b05658c13748c6eb&redirect_uri=${redirect_uri}&scope=read%3Auser&state=123abc`)

//启动server，在没有接受到token时不做任何操作
const server = http.createServer((request, res) => {
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
```

publish-server:
```
const http = require('http');
const fs = require('fs');
const unzip = require('unzipper');
const https = require('https');

// Create an HTTP server
const server = http.createServer((req, res) => {
    if(req.url.match(/^\/auth/)) {
        return auth(req, res);
    }

    if(!req.url.match(/^\/?/)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('not found');
        return;
    }

    const options = {
        hostname: 'api.github.com',
        port: 443,
        path: `/user`,
        method: 'GET',
        headers: {
            Authorization: "token" + req.headers.token,
            "User-Agent": "toy-publish-server"
        }
    };
    const request = https.request(options, (response) => {
        let body = "";
        response.on('data', (d) => {
            body += d.toString()
        });
        response.on('end', () => {
            //console.log(body);
            let user = JSON.parse(body);
            console.log(user)
            //权限检查
            let writeStream = unzip.Extract({path:'../server/public'});
            req.pipe(writeStream);

            req.on('end', () => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('okay');
            })
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
}); 


function auth(req, res) {
    let code = req.url.match(/code=([^&]+)/)[1];
    let state = "abc123";
    let client_secret = "491f31f5e1fd552a3c9ae52220ff2958152f1acf";
    let client_id = "Iv1.b05658c13748c6eb";
    let redirect_uri = encodeURIComponent("http://localhost:8081/auth");

    let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`
    let url = `https://github.com/login/oauth/access_token?${params}`;
     
    const options = {
        hostname: 'github.com',
        port: 443,
        path: `/login/oauth/access_token?${params}`,
        method: 'POST'
    };

    const request = https.request(options, (response) => {
        response.on('data', (d) => {
            let result = d.toString().match(/access_token=([^&]+)/);
            if(result) {
                let token = result[1];
                res.writeHead(200, { 
                    'access_token': token,
                    'Content-Type': 'text/html' 
                });
                res.end(`<a href="http://localhost:8080/publish?token=${token}">publish</a>`);
            } else {
                res.writeHead(200, { 
                    'Content-Type': 'text/plain' 
                });
                res.end('error');
            }
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
}

server.listen(8081);
```