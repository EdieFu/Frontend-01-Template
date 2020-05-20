const EOF = Symbol("EOF");  //标识文件结尾

function data(c) { //html标准里data是初始状态
  
}

module.exports.parseHTML = function parseHTML(html) {  //先写接口，运行起来，再写里面的肉
    //console.log(html);
    let state = data;
    for(let c of html) {
        state = state(c);
    }
    state = state(EOF);
}