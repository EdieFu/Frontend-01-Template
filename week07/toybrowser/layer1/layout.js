function getStyle(element) {
    if(!element.style)
        element.style = {};

    //console.log("----style----")
    for(let prop in element.computedStyle) {  //把computedStyle的内容依次抄到element.style对象上
        //console.log(prop);
        var p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;


        if(element.style[prop].toString().match(/px$/)) {  //当单位是px，就变成number类型的数字
            element.style[prop] = parseInt(element.style[prop]); 
        }
        if(element.style[prop].toString().match(/^[0-9\.]+$/)) {  //当是数字，也变成number类型
            element.style[prop] = parseInt(element.style[prop]);
        }
    }
    return element.style; //这样style可以直接参与运算，不需要根据单位来进行处理
}

function layout(element) { //准备工作
    
    if(!element.computedStyle)  //没有style的就直接return
        return ;

    var elementStyle = getStyle(element); //有style的就getStyle做预处理

    if(elementStyle.display !== 'flex') //不是flex的元素本例中不做layout
        return
    
    var items = element.children.filter(e => e.type === 'element'); //不是element就直接filter掉，过滤了文本节点

    items.sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);  //根据order对元素进行排序
    });

    var style = elementStyle;


    ['width', 'height'].forEach(size => {  //处理width和height
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    })

    if (!style.flexDirection || style.flexDirection === 'auto')  //设置一些style属性的默认值
        style.flexDirection = 'row';
    if (!style.alignItems || style.alignItems === 'auto')
        style.alignItems = 'stretch';    
    if (!style.justifyContent || style.justifyContent === 'auto')
        style.justifyContent = 'flex-start';    
    if (!style.flexWrap || style.flexWrap === 'auto')
        style.flexWrap = 'nowrap';  
    if (!style.alignContent || style.alignContent === 'auto')
        style.alignContent = 'stretch';    
    
    //mainBase排版起点，从左向右排起点是0，从右向左排起点是元素宽度值（因为在代码计算时永远取左上轴为坐标）    
    //mainSign排布方向，从左到右就是在base基础上加，从右到左就是在base基础上减
    var mainSize, mainStart, mainEnd, mainSign, mainBase, 
        crossSize, crossStart, crossEnd, crossSign, crossBase; 
    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;  //container的宽度

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexWrap === 'wrap-reverse') {
        var tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }
}

module.exports = layout;