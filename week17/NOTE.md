# 轮播组件遗留

## 处理flick
```
通过onPanend里判断dx是否>0来处理flick
if(dx + offset > 250 || dx > 0 && event.isFlick) {  //用dx是否>0才判断flick
    direction = 1; 
}else if(dx + offset < -250 || dx < 0 && event.isFlick) {
    direction = -1;
}
```


# 工具链

## 工具tools

按照项目开发的阶段来分类：
+ 初始化
  + yeoman
  + create-react-app
  + vue-cli 

+ 开发/调试
  + dev-tool/chrome
  + webpack-dev-server
  + mock
  + wireshark
  + charles
  + vite

+ 测试
  + mocha
  + jest

+ 发布
  + lint
  + jenkins

## 初始化工具之YEOMAN

### 安装YEOMAN

https://yeoman.io/learning/  

https://yeoman.io/authoring/index.html  
全局安装yeoman：npm install -g yo

npm link：相当于在系统里建了一个软连接，把开发中的generator-fu连接到了node_module中的generator-fu  
tip:npm link失败，可以先 yo ./app/index.js

https://yeoman.io/authoring/running-context.html

### user-interactions  
https://yeoman.io/authoring/user-interactions.html


### managing dependencies
https://yeoman.io/authoring/dependencies.html
```
async prompting() {
    this.dependency = await this.prompt([
        {
            type: "input",
            name: "name",
            message: "Would you like to enable the Cool feature?"
        }
    ]);
}
    
writing() {
    const pkgJson = {
        dependencies: {
            [this.dependency.name]: '*'
        }
    };
    
    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
}
    
install() {
    this.npmInstall();
}
```

### 跟文件系统交互
https://yeoman.io/authoring/file-system.html


如何用YEOMAN做generator

## YEOMAN底层原理

### 1. 输入（收集用户信息）  

+ 命令行      
```
var tty = require('tty');
var ttys = require('ttys');
var rl = require('readline');

var stdin = ttys.stdin;
var stdout = ttys.stdout;

console.log("hello!");
```

edit the terminal output after it's already been printed：  
https://stackoverflow.com/questions/10585683/how-do-you-edit-existing-text-and-move-the-cursor-around-in-the-terminal/10830168


```
var tty = require('tty');
var ttys = require('ttys');

var stdin = ttys.stdin;
var stdout = ttys.stdout;

stdout.write("Hello world!\n");       
stdout.write("\033[1A"); //向上一格
stdout.write("Edie\n"); 
```

+ readline 
https://nodejs.org/docs/latest-v13.x/api/readline.html  

```
var tty = require('tty');
var ttys = require('ttys');

var stdin = ttys.stdin;
var stdout = ttys.stdout;

async function ask(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            resolve(answer)
        });
    })
}

void async function() {
    console.log(await ask("your project name?"))
}();
```

+ 输入字符
```
var stdin = process.stdin;

stdin.setRawMode( true );

stdin.resume();

stdin.setEncoding( 'utf8');

stdin.on( 'data', function ( key ){
    if ( key === '\u0003') {
        process.exit();
    }

    process.stout.write( key.toString().charCodeAt(0).toString());
});
```

+ 实现一个控制台工具，光标能上下移\打印，实现选择的选项卡交互
```
var tty = require('tty');
var ttys = require('ttys');
var rl = require('readline');

var stdin = ttys.stdin;
var stdout = ttys.stdout;

stdin.setRawMode( true );
stdin.resume();
stdin.setEncoding( 'utf8');

function getChar(){
    return new Promise(resolve => {
        stdin.once( 'data', function( key ){
            resolve(key);
        });
    }) ; 
}

function up( n = 1) {
    stdout.write('\033['+n+'A');
}
function down( n = 1) {
    stdout.write('\033['+n+'B');
}
function right( n = 1) {
    stdout.write('\033['+n+'C');
}
function left( n = 1) {
    stdout.write('\033['+n+'D');
}

void async function (){  //上下左右
    stdout.write('which framework do you want to use?\n');
    let answer = await select(["vue", "react", "angular"]);
    stdout.write('You selected ' + answer + "!\n");
    process.exit();
}()

async function select(choices) {
    let selected = 0;
    for(let i = 0; i < choices.length; i++) {
        let choice = choices[i];
        if( i === selected) {
            stdout.write("[x] " + choice + "\n");
        } else {
            stdout.write("[ ] " + choice + "\n");
        }
    }
    up(choices.length);
    right();
    while(true) {
        let char = await getChar();
        if(char === "\u0003") {
            process.exit();
            break;
        }
        if(char === "w" && selected > 0) {
            stdout.write(" ");
            left();
            selected --;
            up();
            stdout.write("x");
            left();
        }
        if(char === "s" && selected < choices.length - 1) {
            stdout.write(" ");
            left();
            selected ++;
            down();
            stdout.write("x");
            left();
        }
        if(char === "\r") { //回车表示选中
            down(choices.length - selected);
            left();
            return choices[selected];
        }
    } 
}
```


### 2. NPM（安包）
### 3. 文件模板（目录结构）