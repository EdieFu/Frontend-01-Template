//var stdin = process.stdin;
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
            //stdout.write("[x] " + choice + "\n");
            stdout.write("[\x1b[32mx\x1b[0m] " + choice + "\n"); //加颜色
            //https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
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
            //stdout.write("x");
            stdout.write("\x1b[32mx\x1b[0m"); //加颜色
            left();
        }
        if(char === "s" && selected < choices.length - 1) {
            stdout.write(" ");
            left();
            selected ++;
            down();
            //stdout.write("x");
            stdout.write("\x1b[32mx\x1b[0m"); //加颜色
            left();
        }
        if(char === "\r") { //回车表示选中
            down(choices.length - selected);
            left();
            return choices[selected];
        }
        //console.log(char.split('').map(c => c.charCodeAt(0)));
    }
    
}


/*
var tty = require('tty');
var ttys = require('ttys');
//var rl = require('readline');

var stdin = ttys.stdin;
var stdout = ttys.stdout;


const readline = require('readline');
const { resolve } = require('path');
const { rejects } = require('assert');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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


//console.log("hello!");

//stdout.write("Hello world!\n");       
//stdout.write("\033[1A"); //向上一格
//stdout.write("Edie\n"); 
*/