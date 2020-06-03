//作业：编写match函数

function match(selector, element) {
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

match("div #id.class", document.getElementById("id"));


 // 处理带空格的 class 属性
 var selectorClassName = selector.replace(".", "")
 if (attr && attr.value && attr.value.split(" ").indexOf(selectorClassName) >= 0)
   return true;
} else { 
 if (element.tagName === selector)
   return true;
}