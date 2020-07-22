# VUE的SFC

https://vuejs.org/v2/guide/single-file-components.html  

+ template容纳HTML，可以包含任何标签，里面的东西不会实际渲染，很适合做VUE文件里顶层元素
+ script，JS代码遵循export结构语法
+ style

做SFC风格的组件  
写webpack的loader：  
https://webpack.js.org/contribute/writing-a-loader/


https://html.spec.whatwg.org/multipage/parsing.html#tokenization
12.2.5.15~12.2.5.31 补充script的/部分到parser中
```
```

# 动画

如果用css做动画，动画怎么停下：改transition
```
<style>
    #el {
        width: 100px;
        height: 100px;
        background-color: skyblue;
    }
</style>
<div id="el"></div>

console：
> let el = document.getElementById("el")
< undefined
> el.style.transition = "ease 3s"
< "ease 3s"
> el.style.transform = "translate(300px, 300px)"
< "translate(300px, 300px)"
> el.style.transform = "translate(0px, 0px)"
< "translate(0px, 0px)"
> el.style.transform = "translate(300px, 300px)"
< "translate(300px, 300px)"
> el.style.transition = "none"
< "none"
```
动画并没有停在当前位置，而是迅速移到尾部的帧  

如果要停在当前帧 ，则应同时设置translate到当前位置  
如何获取当前位置：
+ getBoundingRect
+ getComputedStyle

## JS动画

按照业界常识，一般有Timeline和Animation两个类做抽象，然后export

+ animation.start()
+ animation2.start()

+ animation.pause()
+ animation.resume()

+ animation.stop()

+ setTimeout
+ setInterval
+ requestAnimationFrame

两个animation，用timeline来实现

+ timeline.add(animation);
+ timeline.add(animation2);

+ timeline.start()
+ timeline.pause()
+ timeline.resume()
+ timeline.stop()
