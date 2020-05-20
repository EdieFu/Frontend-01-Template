const EOF = Symbol("EOF");  //标识文件结尾

function data(c) { //html标准里data是初始状态
    if(c == "<") {
        return tagOpen;
    } else if(c == EOF) {
        return ;
    } else {
        return data;
    }
}

function tagOpen(c){
    if(c == "/") {
        return endTagOpen;
    } else if(c.match(/^[a-zA-Z]$/)) {
        return tagName(c);
    } else {
        return ;
    }
}

function endTagOpen(c) {
    if(c.match(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName : ""
        }
        return tagName(c);
    } else if(c == ">") {

    } else if(c == EOF) {

    } else {

    }
}

function tagName(c) {
    if(c.match(/^[\t\n\f ]$/)) {  //空格换行，\f是form feed
        return beforeAttributeName;
    } else if(c == "/") {
        return selfClosingStartTag;
    } else if(c.match(/^[a-zA-Z]$/)) {
        return tagName;
    } else if(c == ">" ) {
        return data;
    } else {
        return tagName;
    }
}

function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c == ">") {
        return data;
    } else if(c == "=") {
        return beforeAttributeName;
    } else {
        return beforeAttributeName;
    }
}

function selfClosingStartTag(c) {
    if(c == ">") {
        currentToken.isSelfClosing = true;
        return data;
    } else if(c == "EOF"){

    } else {

    }
}

module.exports.parseHTML = function parseHTML(html) {  //先写接口，运行起来，再写里面的肉
    //console.log(html);
    let state = data;
    for(let c of html) {
        state = state(c);
    }
    state = state(EOF);
}