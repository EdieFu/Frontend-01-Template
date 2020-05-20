let currentToken = null;
let currentAttribute = null;

function emit(token) {   //把生成的Token提交出来
    if(token.type!="text")
        console.log(token);
}

const EOF = Symbol("EOF");  

function data(c) { 
    if(c == "<") {
        return tagOpen;
    } else if(c == EOF) {
        emit({          //接收EOF时提交EOF的Token
            type:"EOF"   
        });
        return ;
    } else {
        emit({        //接收到文本时提交text的Token
            type:"text",
            content:c
        });
        return data;
    }
}

function tagOpen(c){
    if(c == "/") {
        return endTagOpen;
    } else if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type:"startTag",
            tagName :""
        }
        return tagName(c);
    } else {
        emit({
            type:"text",
            content: c
        })
        return ;
    }
}

function tagName(c) {
    if(c.match(/^[\t\n\f ]$/)) {  //空格换行，\f是form feed
        return beforeAttributeName;
    } else if(c == "/") {
        return selfClosingStartTag;
    } else if(c.match(/^[A-Z]$/)) {
        currentToken.tagName += c//.toLowerCase();
        return tagName;
    } else if(c == ">" ) {
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}

function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c =="/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if(c == "=") {
        //return beforeAttributeName;
    } else {
        currentAttribute = {
            name:"",
            value:""
        }
        //console.log("currentAttribute", currentAttribute)
        return attributeName(c);
    }
}

function attributeName(c) {
    //console.log(currentAttribute);
    if(c.match(/^[\t\n\f ]$/) || c =="/" || c == ">" || c == EOF){
        return afterAttributeName(c);
    } else if(c == "=") {
        return beforeAttributeValue;
    } else if(c == "\u0000") {

    } else if(c == "\"" || c =="'" || c =="<") {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}
 
function afterAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if(c == "/") {
        return selfClosingStartTag;
    } else if(c == "=") {
        return beforeAttributeValue;
    } else if(c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name : "",
            value : ""
        };
        return attributeName(c);
    }
}

function beforeAttributeValue(c) {  //判断单双引号
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c ==">" || c == EOF) {
        return beforeAttributeValue;
    } else if(c == "\"") {
        return doubleQuotedAttributeValue;
    } else if(c == "\'") {
        return singleQuotedAttributeValue;
    } else if(c == ">") {
        //return data;
    } else {
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c) {
    if(c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c == "\u0000") {

    } else if(c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c) {
    if(c == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c == "\u0000") {

    } else if(c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
    
}

function afterQuotedAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c == "/") {
        return selfClosingStartTag;
    } else if(c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == EOF) {
    
    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(c) {  //加value
    if(c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if(c == "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if(c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == "\u0000") {

    } else if(c == "\"" || c =="'" || c == "<" || c == "=" || c == "`") {

    } else if(c == EOF) {

    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

function selfClosingStartTag(c) {
    if(c == ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if(c == "EOF"){

    } else {

    }
}

function endTagOpen(c) {
    if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName : ""
        };
        return tagName(c);
    } else if(c == ">") {

    } else if(c == EOF) {

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