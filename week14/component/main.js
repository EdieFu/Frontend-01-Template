
import {createElement, Text, Wrapper} from "./createElement";


/*

class MyComponent {
    constructor(config){
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
    }

    setAttribute(name, value) { //attribute
        this.attributes.set(name, value);
    }

    appendChild(child){
        this.children.push(child);
    }

    set title(value) {
        this.properties.set("title", value);
    }

    render(){
        
        return <article>
            <h1>{this.attributes.get("title")}</h1>
            <h2>{this.properties.get("title")}</h2>
            <header>I'm a header</header>
            {this.slot}
            <footer>I'm a footer</footer>
        </article>
    }

    mountTo(parent){
        this.slot = <div></div>
        for(let child of this.children){
            //debugger;
            this.slot.appendChild(child)
        }
        this.render().mountTo(parent)

    }


}
*/


class Carousel {
    constructor(config){
        this.children = [];
        this.attributes = new Map();
        this.properties = new Map();
    }

    setAttribute(name, value) { //attribute
        this[name] = value;
    }

    appendChild(child){
        this.children.push(child);
    }

    render(){

        let children = this.data.map( url => {
            let element = <img src={url} />;
            element.addEventListener("dragstart", event => event.preventDefault());
            return element;
        } ) 
        let root = <div class = "carousel">
          {children}
    </div>

        let position = 0;

        let nextPic = () => {
            let nextPosition = (position + 1) % this.data.length; //position循环，使用取余这技巧

            let current = children[position]; //新的移入旧的移出
            let next = children[nextPosition];

            current.style.transition = "ease 0s";
            next.style.transition = "ease 0s";

            current.style.transform = `translateX(${- 100 * position}%)`  //起始位置
            next.style.transform = `translateX(${100 - 100 * nextPosition}%)`

            setTimeout(function(){
                //current.style.transition = "ease 0.5s";
                current.style.transition = ""; //用css rule控制时间
                next.style.transition = "";
                current.style.transform = `translateX(${-100 - 100 * position}%)`  //终止位置
                next.style.transform = `translateX(${- 100 * nextPosition}%)`
            
                position = nextPosition; 
            }, 16)                       
        

            setTimeout(nextPic, 3000);
        }


        //鼠标拖拽
        root.addEventListener("mousedown", event => {
            let startX = event.clientX, startY = event.clientY;

            let lastPosition = (position - 1 + this.data.length) % this.data.length;
            let nextPosition = (position + 1) % this.data.length;


            let current = children[position];
            let last = children[lastPosition];
            let next = children[nextPosition];

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
                //console.log(event.clientX - startX, event.clientX - startY);
            };
            let up = event => {
                let offset = 0;

                if(event.clientX - startX > 250) {  //往左是1
                    offset = 1;
                } else if(event.clientX - startX < -250) {  //往右是-1
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
            document.addEventListener("mousemove", move);
            document.addEventListener("mouseup", up);
        })

        
        return root;
    }

    mountTo(parent){
    
        for(let child of this.children){
            //debugger;
            this.slot.appendChild(child)
        }
        this.render().mountTo(parent)

    }


}




/*let component = <div id="a" cls="b" style="width:100px;height:100px;background-color:lightgreen">
        <div></div>
        <p></p>
        <div></div>
        <div></div>
    </div>*/

let component = <Carousel data={[
    "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]} />


    
component.title = "I'm title 2";

component.mountTo(document.body);
/*
var component = createElement(
    Parent, 
    {
        id: "a",
        "class": "b"
    }, 
    createElement(Child, null), 
    createElement(Child, null), 
    createElement(Child, null)
);
*/

console.log(component);

//componet.setAttribute("id", "a");