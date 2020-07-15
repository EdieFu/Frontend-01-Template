#   JSX

https://webpack.js.org/concepts/  

https://babeljs.io/docs/en/babel-plugin-transform-react-jsx/  

https://github.com/babel/babel-loader  

# 轮播组件

### Step1 架子代码

```
<html>
    <head>
        <title>carousel component</title>
        <style>

        </style>
    </head>
    <body>
        <div id="container"></div>
        <script>
            class Carousel {
                constructor(){
                    this.root = null;
                    this.data = null;
                }
                render() {
                    this.root = document.createElement("div");
                }
            }

            //create
            let carousel = new Carousel();

            //update
            carousel.data = [
                "1.jpg",
                "2.jpg",
                "3.jpg",
                "4.jpg",
            ];
            carousel.render();

            //mount
            document.getElementById("container").appendChild(carousel.root);
        </script>
    </body>
</html>
```

### Step2 渲染
```
======CSS部分======
 <style>
        .carousel {
            width: 500px;
            height: 300px;
            white-space: nowrap;
            outline: solid 1px blue;
            overflow: hidden;
        }
        .carousel>img {
            width: 500px;
            height: 300px;
            display: inline-block;
        }
</style>

=====render部分=====
render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for(let d of this.data) {
        let element = document.createElement("img");
        element.src = d;
        this.root.appendChild(element);
    }
}
```

### Step3 图片动起来

Step2中四张图片已排成一横排，如何transform？
+ 思路一：整体把图片一张张右移，存在一直transform的操作的问题，且只能往一个方向transform，最后transform的面积会越来越大，在某些实现不好的浏览器里造成性能损耗
+ 思路二：只移动当前应该展示的两张

```
let position = 0;
let nextPic = () => {
    let nextPosition = (position + 1) % this.data.length; //position循环，使用取余这技巧

    let current = this.root.childNodes[position];  //新的移入旧的移出
    let next = this.root.childNodes[nextPosition];

    current.style.transform = `translateX(${-100 - 100 * position}%)`
    next.style.transform = `translateX(${- 100 * nextPosition}%)`

    position = nextPosition; 
                        
    setTimeout(nextPic, 3000);
}
nextPic();
```

### Step4 实现轮播

```
current.style.transition = "ease 0s";
next.style.transition = "ease 0s";

current.style.transform = `translateX(${- 100 * position}%)`  //起始位置
next.style.transform = `translateX(${100 - 100 * nextPosition}%)`
  
setTimeout(function(){
    current.style.transition = "ease 0.5s";
    next.style.transition = "ease 0.5s";

    current.style.transform = `translateX(${-100 - 100 * position}%)`  //终止位置
    next.style.transform = `translateX(${- 100 * nextPosition}%)`
                        
    position = nextPosition; 
}, 16)                    
```

冷知识：如果setTimeout换成requestAnimationFrame，需要套两层：
```
requestAnimationFrame(function(){
    requestAnimationFrame(function(){
        current.style.transition = "ease 0.5s";
        next.style.transition = "ease 0.5s";

        current.style.transform = `translateX(${-100 - 100 * position}%)`  //终止位置
        next.style.transform = `translateX(${- 100 * nextPosition}%)`
                            
        position = nextPosition; 
    })
})  
```

### Step5 鼠标拖拽

鼠标拖动的是current，尝试找到鼠标怎么拖会找到next
```
this.root.addEventListener("mousedown", event => {
    let startX = event.clientX, startY = event.clientY;

    let lastPosition = (position - 1 + this.data.length) % this.data.length;
    let nextPosition = (position + 1) % this.data.length;

    let current = this.root.childNodes[position];
    let last = this.root.childNodes[lastPosition];
    let next = this.root.childNodes[nextPosition];

    current.style.transition = "ease 0s";
    last.style.transition = "ease 0s";
    next.style.transition = "ease 0s";

    current.style.transform = `translateX(${-500 * position}px)` 
    last.style.transform = `translateX(${-500 - 500 * lastPosition}px)`
    next.style.transform = `translateX(${500 - 500 * nextPosition}px)`

    let move = event => {                            
        current.style.transform = `translateX(${event.clientX - startX - 500 * position}px)` 
        last.style.transform = `translateX(${event.clientX - startX - 500 - 500 * lastPosition}px)` 
        next.style.transform = `translateX(${event.clientX - startX + 500 - 500 * nextPosition}px)` 
        let up = event => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", up);
        }
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
})
```

### Step6 MouseUp的逻辑

上一步完成MouseDown的逻辑，这一步完成MouseUp，完成整个拖拽功能  

Up逻辑是，如果拖动时间短，则回到原来的图不动，如果拖动时间长，则往前/后滚一张
```
let up = event => {
    let offset = 0;

    if(event.clientX - startX > 250) {
        offset = 1;
    } else if(event.clientX - startX < -250) {
        offset = -1;
    }

    current.style.transition = ""; //transition为空表示transition打开
    last.style.transition = "";
    next.style.transition = "";

    current.style.transform = `translateX(${ offset * 500 - 500 * position}px)` 
    last.style.transform = `translateX(${ offset * 500 - 500 - 500 * lastPosition}px)` 
    next.style.transform = `translateX(${ offset * 500 + 500 - 500 * nextPosition}px)` 
                            
    position = (position - offset + this.data.length) % this.data.length;

    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
}
```

## 把轮播组件迁移到JSX环境下，能正常工作

把真实的DOM操作（如render出来的真实DOM），包装成虚拟的DOM操作