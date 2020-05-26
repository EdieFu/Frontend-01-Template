const net = require('net');
const parser = require("./parser.js");
const render = require("./render.js");
const images = require('images');

class Request{
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
//   参考Methods —— XMLHttpRequest.open()
/* 需要的信息：
     method，url = host + port + path
     body：k/v，如name=Edie
     headers
        Context-Type: 就用最简单的application/x-www-form-urlencoded
*/
    constructor(options){
        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.path = options.path || "/"
        this.body = options.body || {};
        this.headers = options.headers || {};
        if(!this.headers["Content-Type"]) {
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }

        if(this.headers["Content-Type"] === "application/json")
            this.bodyText = JSON.stringify(this.body);
        else if(this.headers["Content-Type"] === "application/x-www-form-urlencoded") 
            this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');  //可以产生出name=Edie这类东西

        this.headers["Content-Length"] = this.bodyText.length;  //计算content-length
    } 

    toString(){
        return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}`
        }

    send(connection) {
        return new Promise((resolve, reject) => {
            const parser = new ResponseParser;
            if(connection) {
                connection.write(this.toString());
            } else {
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    connection.write(this.toString());
                }) 
            }    
                connection.on('data', (data) => {
                    parser.receive(data.toString());
                    //resolve(data.toString());
                    if(parser.isFinished) {
                        resolve(parser.response);
                    }
                    //console.log(parser.statusLine);
                    // console.log(parser.headers);
                    connection.end();
                });  
                connection.on('error',(err) => {
                    reject(err);
                    connection.end();
                });

        }); 
          
    }

}


class Response{


}

class ResponseParser {  //不知道connection.on中的'data'是否完整，要负责产生response这个class
    constructor(){
        this.WAITING_STATUS_LINE = 0;
        this.WAITING_STATUS_LINE_END = 1;  //换行/r/n
        this.WAITING_HEADER_NAME = 2;  // content-type
        this.WAITING_HEADER_SPACE = 3;
        this.WAITING_HEADER_VALUE = 4;  // 如果name后有一个“：”，则后面跟随一个value，如text/html
        this.WAITING_HEADER_LINE_END = 5;
        this.WAITING_HEADER_BLOCK_END = 6; //head后的两个空行
        this.WAITING_BODY = 7;

        this.current = this.WAITING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.bodyParser = null;
    }
    get isFinished(){
            return this.bodyParser && this.bodyParser.isFinished;
    }
    get response(){
        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
        return {
            statusCode: RegExp.$1,
            statusText: RegExp.$2,
            headers: this.headers,
            body: this.bodyParser.content.join('')
        }
    }
    receive(string) {  //net的Event:'data'
        for(let i = 0; i < string.length; i++) {
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char){
        if(this.current === this.WAITING_STATUS_LINE) {
            if(char === '\r') {
                this.current = this.WAITING_STATUS_LINE_END;
            } else {
                this.statusLine += char;
            }
        } else if(this.current === this.WAITING_STATUS_LINE_END) {
            if(char === '\n') {
                this.current = this.WAITING_HEADER_NAME;
            }
        } else if(this.current === this.WAITING_HEADER_NAME) {
            //console.log(char); //看进入headername时拿到哪些字符
            if(char === ':') {
                this.current = this.WAITING_HEADER_SPACE;
                //console.log("//////"); 
            } else if(char === '\r') {
                this.current = this.WAITING_HEADER_BLOCK_END;
                if(this.headers['Transfer-Encoding'] === 'chunked')
                    this.bodyParser = new TrunkedBodyParser();
                //console.log("//////"); 
            } else {
                this.headerName += char;
            }
        } else if(this.current === this.WAITING_HEADER_SPACE) {
            if(char === ' ') {
                this.current = this.WAITING_HEADER_VALUE;
            }
        } else if(this.current === this.WAITING_HEADER_VALUE) {
            if(char === '\r') {
                this.current = this.WAITING_HEADER_LINE_END;
                this.headers[this.headerName] = this.headerValue; //header有多行，这样HEADER就会存进headers里
                this.headerName = "";  //value结束后把name和value清空
                this.headerValue = "";
            } else {
                this.headerValue += char;
            }
        } else if(this.current === this.WAITING_HEADER_LINE_END) {
            if(char === '\n') {
                this.current = this.WAITING_HEADER_NAME; 
            }
        }  else if(this.current === this.WAITING_HEADER_BLOCK_END) {
            if(char === '\n') {
                this.current = this.WAITING_BODY;
            }
        } else if(this.current === this.WAITING_BODY) {
            this.bodyParser.receiveChar(char); 
        }
    }
}

class TrunkedBodyParser {
    constructor( ){
        this.WAITING_LENGTH = 0;
        this.WAITING_LENGTH_LINE_END = 1;
        this.READING_TRUNK = 2;
        this.WAITING_NEW_LINE = 3;
        this.WAITING_NEW_LINE_END = 4;
        this.length = 0;
        this.content = [];
        this.isFinished = false;
        this.current = this.WAITING_LENGTH;
    }
    receiveChar(char) {  
        //console.log(JSON.stringify(char));
        if(this.current === this.WAITING_LENGTH) {
            if(char === '\r') {
                if(this.length === 0) {
                    //console.log(this.content);
                    //console.log("////////");
                    this.isFinished = true;
                }
                this.current = this.WAITING_LENGTH_LINE_END;
            } else {
                this.length *= 16;
                this.length += parseInt(char, 16);
            }
        } else if(this.current === this.WAITING_LENGTH_LINE_END) {
            // console.log("WAITING_LENGTH_LINE_END");
            if(char === '\n') {
                this.current = this.READING_TRUNK;
            } 
        } else if(this.current === this.READING_TRUNK) {
            this.content.push(char);
            this.length --;
            if(this.length === 0) {
                this.current = this.WAITING_NEW_LINE;
            }
        } else if(this.current === this.WAITING_NEW_LINE) {
            if(char === '\r') {
                this.current = this.WAITING_NEW_LINE_END;
            } 
        } else if(this.current === this.WAITING_NEW_LINE_END) {
            if(char === '\n') {
                this.current = this.WAITING_LENGTH;
            } 
        }  
    }
}



void async function (){
        let request = new Request({
            method: "POST",
            host: "127.0.0.1",
            port: "8088",
            path: "/",
            headers: {
                ["X-Foo2"]: "customed"
            },
            body: {
                name:"Edie"
            }
        });
        
        let response = await request.send();
        //console.log(response);

        let dom = parser.parseHTML(response.body);
        // console.log(dom);

        let viewport = image(800, 600); //viewport对应于浏览器里的渲染的区域

        render(viewport, dom.children[0].children[3].children[1].children[3]);

        viewport.save("viewport.jpg");

}();


//用net的库去访问server（而不采用http的xrh）
// http://nodejs.org/dist/latest-v12.x/docs/api/net.html
//    Class: net.Socket
//        socket.connect(options[, connectListener])

 /*
   const client = net.createConnection({ 
        host:"127.0.0.1",
        port: 8088 }, () => {
      // 'connect' listener.
      console.log('connected to server!');  

      let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
            ["X-Foo2"]: "customed"
        },
        body: {
              name:"Edie"
        }
    }) 
    
    console.log(request.toString());
    client.write(request.toString());


      client.write(`
POST /HTTP/1.1\r
Content-Type: application/x-www-form-urlencoded\r
Content-Length: 11\r
\r
name=Edie`)  

   // client.write("POST /HTTP/1/1\r\nContent-Type: application/x-www-form-urlencoded\r\nContent-Length: 11\r\n\r\nname=Edie")
});



    client.on('data', (data) => {
      console.log(data.toString());
      client.end();
    });
    client.on('end', () => {
      console.log('disconnected from server'); 
    });
    client.on('error',(err) => {
      console.log(err);
      client.end()
    });

    */