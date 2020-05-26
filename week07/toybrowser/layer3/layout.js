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


    var isAutoMainSize = false;  //父元素没设置mainSize，在flex里会撑开
    if (!style[mainSize]) {  //auto sizing
        elementStyle[mainSize] = 0;  
        for (var i = 0; i < items.length; i++) { //所有子元素mainSize之和就是父元素mainSize
            var item = items[i];
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0))
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
        }
        isAutoMainSize = true;
        //style.flexWrap = 'nowrap';
    }

    
    
    var flexLine = []; //flexLine表示一行，因为要放进多个元素，所以用数组
    var flexLines = [flexLine];

    var mainSpace = elementStyle[mainSize]; //一行里的剩余空间。初始值为父元素的mainSize
    var crossSpace = 0; //每一行的交叉轴尺寸

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        var itemStyle = getStyle(item);

        if(itemStyle[mainSize] === null) {  //元素没有设主轴尺寸，就是0
            itemStyle[mainSize] = 0;
        }


        if (itemStyle.flex) {  //如果元素有flex属性
            flexLine.push(item); //能伸缩，这一行不管有多少元素都可以放进去
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {  //nowrap，硬塞进一行
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            flexLine.push(item);
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {  //如果一个元素就超过一行宽度
                itemStyle[mainSize] = style[mainSize]
            }
            if (mainSpace < itemStyle[mainSize]) {  //正常情况
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;

                flexLine = []; //创建新的flexLine
                flexLines.push(flexLine);

                flexLine.push(item);

                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);  //一行的高度取决于最高的元素的高度
            mainSpace -= itemStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }


    if (mainSpace < 0) {
        //overflow剩余宽度为负 (happens only if container is single line),scale every item
        var scale = style[mainSize] / (style[mainSize] - mainSpace); //缩放值
        var currentMain = mainBase;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain;  //算主轴尺寸
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }

    } else {
        //多行情况
        flexLine.forEach(function (item) {

            var mainSpace = items.mainSpace;
            var flexTotal = 0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var itemStyle = getStyle(item);

                if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex;
                    continue;
            }
        }

        if (flexTotal > 0) {
            //There is flexible flex items
            var currentMain = mainBase;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var itemStyle = getStyle(item);

                if (itemStyle.flex) {
                    itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                }
                itemStyle[mainStart] = currentMain;
                itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                currentMain = itemStyle[mainEnd];
            }
        } else {
            //If NO flexible flex items,意味着，justifyContent should work
            if (style.justifyContent === 'flex-start') {
                var currentMain = mainBase;
                var step = 0;  //step表示额外空间，即元素间距
            }
            if (style.justifyContent === 'flex-end') {
                var currentMain = mainSpace * mainSign + mainBase;
                var step = 0;
            }
            if (style.justifyContent === 'center') {
                var currentMain = mainSpace / 2 * mainSign + mainBase;
                var step = 0;
            }
            if (style.justifyContent === 'space-between') {
                var step = mainSpace / (items.length - 1) * mainSign;
                var currentMain = mainBase;
            }
            if (style.justifyContent === 'space-around') {
                var step = mainSpace / items.length * mainSign;
                var currentMain = step / 2 + mainBase;
            }
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                itemStyle[mainStart] = currentMain;
                itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                currentMain = itemStyle[mainEnd] + step;
            }
        }

    })

    }

    console.log(items);
}

module.exports = layout;