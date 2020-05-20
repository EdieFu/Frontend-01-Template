const css = require('css');

const EOF = Symbol("EOF");  

let currentToken = null;
let currentAttribute = null;

let stack = [{type: "document", children:[]}];
let currentTextNode = null;


//加入addCSSRules函数，把CSS规则暂存到一个数组里
let rules = [];
function addCSSRules(text) {
    var ast = css.parse(text);
    console.log(JSON.stringify(ast, null, "     "));
    rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
    if(!selector || !element.attributes)
        return false;

    if(selector.charAt(0) == "#") {
        var attr = element.attributes.filter(attr => attr.name === "id")[0]
        if(attr && attr.value === selector.replace("#", ''))
            return true;
    } else if(selector.charAt(0) == ".") {
        var attr = element.attributes.filter(attr => attr.name === "class")[0]
        if(attr && attr.value === selector.replace(".", ''))
            return true;
    } else {
        if(element.tagName === selector) {
            return true;
        }
    }
    return false;
}

function computeCSS(element){
    //console.log(rules);   step2调试用
    //console.log("compute CSS for Element", element);  step2调试用
    
    //reverse()，CSS匹配时，先找当前元素是否匹配，再往父元素找
    var elements = stack.slice().reverse();  //获取父元素序列

    if(!element.computedStyle)
        element.computedStyle = {};

    for(let rule of rules) {
        var selectorParts = rule.selectors[0].split(" ").reverse();

        if(!match(element, selectorParts[0]))
            continue;

        let matched = false;

        var j = 1; //同时循环elements和selector，看两者是否匹配
        for(var i = 0; i < elements.length; i++) {
            if(match(elements[i], selectorParts[j])) {
                j++;
            }
        }
        if(j >= selectorParts.length) 
            matched = true;

        if(matched) {
            //如果element和selector匹配到，要加入
            //console.log("Element", element, "matched rule", rule);
            var computedStyle = element.computedStyle;
            for(var declaration of rule.declarations) {
                if(!computedStyle[declaration.property])
                    computedStyle[declaration.property] = {}

                computedStyle[declaration.property].value = declaration.value
            }
            console.log(element.computedStyle);
        }
        
    }
}

function emit(token) {   //把生成的Token提交出来
    //if(token.type === "text")  调试时先忽略文本节点
    //    return;
    let top = stack[stack.length - 1];

    if(token.type == "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: []
        };

        element.tagName = token.tagName;

        for(let p in token) {
            if(p != "type" && p != "tagName")
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
        }

        computeCSS(element); //理解这句话放置的位置。
        // 只要有一个HTML element创建过程，就对应一个CSS-Computing过程
        //跟Style不一样，我们尽可能希望CSS的计算早，如果像Style在整个POP结束再计算CSS，就会有很大的父标签

        top.children.push(element);
        element.parent = top;

        if(!token.isSelfClosing)
            stack.push(element);

        currentTextNode = null;

    } else if(token.type == "endTag") {
        if(top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!")
        } else {
            //+++++遇到style标签时，执行添加CSS规则的操作++++++++++//
            if(top.tagName === "style") {
                addCSSRules(top.children[0].content);
            } 
            stack.pop();
        }
        currentTextNode = null;
    }  else if(token.type == "text") {
        if(currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}



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
       // return beforeAttributeName;
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
        }
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
    //console.log(stack[0]);
    return stack[0];
}