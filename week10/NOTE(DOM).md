# DOM

+ DOM就是HTML能干的事，DOM也有对应的操作
+ CSSOM就是CSS能干的事，对应的CSSOM也有操作

## Range API

```
问题： 把一个元素所有的子元素逆序
    1      5  
    2      4
    3  =>  3
    4      2
    5      1
```
RANGE代表DOM树里的一个片段，这个片段不需要遵循DOM的层级关系，它可以是第一个元素的某个子元素的一个点，到第二个元素的结束位置的点。    

### Range最重要的API

+ var range = new Range()
+ range.setStart(element, 9)
+ range.setEnd(element, 4)

    > 可以理解range跟HTML里面代码的一个区段是完全等效的。如果创建一个range，一般用setStart和setEnd来设置它的起点和终点。  

    >注意，setStart和setEnd是可以设置到文本节点里单个文字的前或后的，也就是操作的时候不需要整个DOM节点操作，可以把一个节点切成半个，可以把文本节点中间挖一个洞。

+ var range = document.getSelection().getRangeAt(0);

    > range还有一种获取的方式，利用selection。如果写一个网页，在页面上是可以用鼠标做选择，可以用selection的getRangeAt这个API来获取range。


### Range的一些辅助快捷的API

+ range.setStartBefore
+ range.setEndBefore
+ range.setStartAfter
+ range.setEndAfter
+ range.selectNode
+ range.selectNodeContents 
  > range.selectNodeContents(document.getElementsByTagName("style")[0]);  
  把style切掉 


### 选中了Range能干嘛

+ var fragment = range.extractContents()
    > 最主要的能力是extractContents，把里面的一些内容摘出来，创建一个fragment

    > fragment其实是一种文档片段，当append一个fragment到一个节点的时候，实际上append上去的是fragment节点里所有的子元素，fragment自己在外面，即DOM树里永远不会出现fragment这个节点的

+ range.insertNode(document.createTextNode("aaa"))
    > 在range的位置插入一个元素。用insertBefore和appendChild只能在元素和元素之间的缝里面插，但通过range可以直接往文本和本文，两个文字之间插，十分精细

> insertNode和fragment配合使用有奇效

做contenteditable这种编辑器的时候特别需要这种操作



## CSSOM

### document.styleSheets

+ document.styleSheets

+ Rules  
    + document.styleSheets[0].cssRules
    + document.styleSheets[0].insertRule("p {color:pink;}", 0)
      > 如果页面上没有style标签就加不了规则，如果有style空标签就可以用cssom加规则。不能insert对象，只能用字符串写文本 
    + document.styleSheet[0].removeRule(0)

    > CSS的Rules虽然是数组，但是没办法直接以数组方式操作，只有在stylesheet上操作 
   
+ Rule
    + CSSStyleRule
        + selectorText String
        + style K-V结构
    + CSSCharsetRule
    + CSSImportRule
    + CSSMediaRule
    + CSSFontFaceRule
    + CSSPageRule
    + CSSNamespaceRule
    + CSSKeyframesRule
    + CSSKeyframeRule
    + CSSSupportsRule

> JS去操作元素时，常用style属性；有时想批量操作元素属性，可以考虑用cssom去修改CSSRule，如遇到海量列表的需求，就可以考虑CSSOM，或者精确的改伪元素的样式。


### getComputedStyle

+ window.getComputedStyle(elt,pseudoElt);
    + elt 想要获取的元素
    + pseudoElt 可选，伪元素 

> 可以取到元素身上的伪元素计算出的style。  
> 取伪元素本质上取的是盒  
> 取出的ComputedStyle没有办法修改，但是可以用style属性去修改，因为style属性优先级比较高，ComputedStyle属性可以随着style属性变，又能把那些通过CSS加上去的属性计算出来，是最能反应真实元素情况的样式


### CSSOM 视图VIEW

#### 窗口API

+ let childWindow = window.open("about:blank","_blank");

+ let childWindow = window.open("about:blank","_blank","width=100,height=100,left=100,top=100");
   > window.open本来的API没有第三个参数，但CSSOM VIEW的部分允许操作window，但是和浏览器安全策略有关，有的不一定生效

+ childWindow.moveBy(-50,-50);  可移动位置
+ childWindow.resizeBy(50,50);  还有莫veTo，resizeTO，都是操作子window的方法
  
#### 滚动API

+ 视口viewport滚动
    + window.screenX
    + window.screenY
    + window.scroll(0,30)
    + window.scrollBy(0,30)

+ 元素滚动
    + $0.scrollBy(30, 30)
    + $0.scrollTo(0, 100)
    + $0.scrollTop
    + $0.scrollLeft
    + $0.scrollHeight 获取比如DIV里面的高度

+ 获取元素的重要信息，做拖拽的时候可以去获取元素精确的位置，然后和transform来控制盒的位置
    + $0.getClientRects() 获得元素在端上占据的空间，是非常准确的位置
    + $0.getBoundingClientRect() 包裹这些盒的盒的位置


#### 其他API
+ window.innerHeight/innerWidth 视口的尺寸
    > window.outerHeight/outerWidth 浏览器大小，一般没有这个需求  

+ window.devicePoxelRatio 
    > RETINA屏一般是2，一个逻辑像素(1px)等于4个物理像素；高端安卓屏可到3，一个逻辑像素等于9个物理像素；

+ document.documentElement.getBoundingClientRect(); 取innerHeight/Width的另一个办法



## 所有API