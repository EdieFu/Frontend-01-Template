# 有限状态机FSM  

## 一般用于
+ 做游戏，敌人的AI  
+ 编译原理里构建AST
+ 正则表达式的实现
+ __处理字符串__
+ 学界的喜欢用有限状态机描述算法

## 处理字符串
+ 每一个状态都是一个机器
    + 在每一个机器里，我们都可以做计算、存储、输出……
    + 所有的这些机器接受的输入是一致的
    + 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数（无副作用） 
+ 每一个机器知道下一个状态
    + 每个机器都有确定的下一个状态（Moore）
    + 每个机器根据输入决定下一个状态（Mealy） 

## JS中的有限状态机（Mealy）
```
//每个函数是一个状态
function state(input) //函数参数就是输入
{
    //在函数中，可以自由编写代码，处理每个状态的逻辑
    return next; //返回值作为下一个状态
}

/////以下是调用/////
while(input) {
    //获取输入
    state = state(input); //把状态机的返回值作为下一个状态
}
```

### 在一个字符串中，找到字符 “a”
```
function match(string) {
    for(let c of string) {
        if (c == "a")
            return true;
    }
    return false;
}

match("I am groot");
```

### 在一个字符串中，找到字符 “ab”
```
function match(string) {
    let foundA = false;   //用foundA标识有没有找到a
    for(let c of string) {
        if (c == "a")
            foundA = true;
        else if(foundA && c == "b")
            return true;
        else 
            foundA = false;  //重置foundA防止acb这种情况
    }
    return false;
}

match("I abm groot");
```


### 找到字符 “abcdef”
```
function match(string) {
    let foundA = false; 
    let foundB = false;
    let foundC = false;
    let foundD = false;
    let foundE = false; 
    for(let c of string) {
        if (c == "a")
            foundA = true;
        else if(foundA && c == "b")
            foundB = true;
        else if(foundB && c == "c")
            foundC = true;
        else if(foundC && c == "d")
            foundD = true;
        else if(foundD && c == "e")
            foundE = true;
        else if(foundE && c == "f")
            return true;
        else {
            foundA = false; 
            foundB = false;
            foundC = false;
            foundD = false;
            foundE = false; 
        }
    }
    return false;
}

match("I abm groot");
```

### 状态机的写法
```
function match(string) {
    let state = start;
    for(let c of string) {
        //console.log(c);
        state = state(c);
    }
    return state === end;
}

function start(c) {
    if (c === "a")
        return foundA;
    else
        return start;
}

function end(c) {
    return end;
}

function foundA(c) {
    if(c === "b")
        return foundB;
    else 
        return start;
}

function foundB(c) {
    if(c === "c")
        return foundC;
    else 
        return start;
}

function foundC(c) {
    if(c === "d")
        return foundD;
    else 
        return start;
}

function foundD(c) {
    if(c === "e")
        return foundE;
    else 
        return start;
}

function foundE(c) {
    if(c === "f")
        return end;
    else 
        return start;
}

match("I abm grabcdefoot");
```

> 如果aabcdef，以上匹配会出现问题  
> 解决方法：return start ——> return start(c)
```
function match(string) {
    let state = start;
    for(let c of string) {
        //console.log(c);
        state = state(c);
    }
    return state === end;
}

function start(c) {
    if (c === "a")
        return foundA;
    else
        return start;
}

function end(c) {
    return end;
}

function foundA(c) {
    if(c === "b")
        return foundB;
    else 
        return start(c);
}

function foundB(c) {
    if(c === "c")
        return foundC;
    else 
        return start(c);
}

function foundC(c) {
    if(c === "d")
        return foundD;
    else 
        return start(c);
}

function foundD(c) {
    if(c === "e")
        return foundE;
    else 
        return start(c);
}

function foundE(c) {
    if(c === "f")
        return end;
    else 
        return start(c);
}

match("I abm graabcdefoot");
```

### 处理“abcabx” 这样的字符串
```
function match(string) {
    let state = start;
    for(let c of string) {
        //console.log(c);
        state = state(c);
    }
    return state === end;
}

function start(c) {
    if (c === "a")
        return foundA;
    else
        return start;
}

function end(c) {
    return end;
}

function foundA(c) {
    if(c === "b")
        return foundB;
    else 
        return start(c);
}

function foundB(c) {
    if(c === "c")
        return foundC;
    else 
        return start(c);
}

function foundC(c) {
    if(c === "a")
        return foundA2;
    else 
        return start(c);
}

function foundA2(c) {
    if(c === "b")
        return foundB2;
    else 
        return start(c);
}

function foundB2(c) {
    if(c === "x")
        return end;
    else 
        return foundB(c);   //注意是回到这时候的字符有可能是c，要回到foundB
}

match("I abm grabcabxoot"); 
```

> 如何用状态机处理完全未知的pattern？  
> + 状态机与 字符串KMP算法 等效


# 解析HTML

## Step1 拆分文件
+ 为了方便文件管理，把parser单独拆到文件中  
+ parser接受HTML文本作为参数，返回一颗DOM树

## Step2 创建状态机
https://html.spec.whatwg.org/multipage/parsing.html  
12.2.5 Tokenization  
HTML标准直接给出状态机的状态和伪代码
+ 完成FSM初始化工作，data为初始状态，EOF为结束标志  
+ Toy-Brower只挑选其中一部分状态，完成一个最简版本

## Step3 解析标签
+ 主要的标签：开始标签，结束标签，自封闭标签
+ 这一步暂时忽略属性attribute

## Step4 创建元素
+ 在状态机中，除了状态迁移，还会要加入业务逻辑  
+ 在标签结束状态提交标签token

## Step5 处理属性
+ 属性值分为单引号、双引号、无引号三种写法，因此需要较多状态处理
+  处理属性的方式跟标签类似  
+  属性结束时，把属性加到标签Token上

## Step6 构建DOM树
+ 从标签构建DOM树的基本技巧是使用栈
+ 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
+ 自封闭节点可视为入栈后立即出栈
+ 任何元素的父元素是它入栈前的栈顶
+ 12.2.6 Tree construction实际过程很复杂，有各种模式下的处理

## Step7 文本节点
+ 文本节点与自封闭标签处理类似  
+ 多个文本节点需要合并 

# CSS Computing  
> 环境 npm install css
> https://www.npmjs.com/package/css  
> 直接用已有的css parser
> 只研究文件里的style标签，不研究link引入的方式

## Step1 收集CSS规则RULES
+ 只研究遇到style标签时，把CSS规则保存起来
+ 调用CSS Parser来分析CSS规则
+ 这里要仔细研究此库分析CSS规则的格式
+ 真实浏览器里也是先收集完css rules，再来一个节点计算一个css

## Step2 添加调用，准备computing
+ 当创建一个元素后，立即计算CSS，即computeCSS()写的位置很重要
+ 理论上，当我们分析一个元素时，所有CSS规则已收集完毕
+ 在真实浏览器中，可能遇到写在body的style标签，需要重新CSS计算的情况，这里忽略
+ 重新计算CSS必然造成重排，重排必然造成重绘，所以最佳实际是所有Style标签尽可能写得靠前，写在所有元素之前最好 

## Step3 获取父元素序列
+ 在computeCSS函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配；
+ 直接用形成DOM树的stack，可以获取本元素所有的父元素。
+ 因为我们首先获取的是“当前元素”，所以我们获得和计算父元素匹配的顺序是从内向外。

 <img src="cssmatch.png">

## Step4 拆分选择器
+ 选择器也要从当前元素向外排列
+ 复杂选择器拆成针对单个元素的选择器，用双数组同时循环来匹配父元素队列

## Step5 计算选择器selector与元素element匹配
+ 根据选择器类型和元素属性，计算是否与当前元素匹配
+ 这里仅实现三种基本选择器（class，id，什么都没有），实际浏览器中要处理复合选择器

## Step6 生成computed属性
+ 一旦选择匹配，就应用选择器到元素上，形成computedStyle

## Step7 确定规则覆盖关系
Specifications权重/优先级    
https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity  
Selector Types优先级依次变高：
1. Type selectors(如h1)，pseudo-elements(如::before)
2. Class selectors(.example)，attribute selectors(如[type = "radio"])，pseudo-classes(如:hover)
3. ID selectors(#example)
4. inline selectors
*,+,>,~,space,||等不增加优先级

```
<style>
a {
    color:red;
}
a {
    color:green;
}
</style>
<body>
    <div>
        <a class="x" id="y">name</a>
    </div>
</body>

//正常情况下后面覆盖前面，显示green
```

```
<style>
div a {
    color:red;
}
a {
    color:green;
}
</style>
<body>
    <div>
        <a class="x" id="y">name</a>
    </div>
</body>

//div a比a优先级高，显示red
```

```
<style>
body div a {
    color:red;
}
a#y {
    color:green;
}
</style>
<body>
    <div>
        <a class="x" id="y">name</a>
    </div>
</body>

//id选择器更高，a#y生效
```
body div a.x#y  
选择器形成三元组  
[3,1,1]
```
inline优先级更高，覆盖所有
<a class="x" id = "y" style="color:blue">name</a>
形成四元组 [3,1,1,0]
```
