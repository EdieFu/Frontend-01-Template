
//鼠标事件监听抽象

let element = document.body;

element.addEventListener("mousedown", (event) =>{
    start(event);
    let mousemove = event => {
        //console.log(event.clientX, event.clientY);
        move(event);
    }
    let mouseend = event => {
        end(event);
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseend);
    }
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseend);
})



//监听touchEvent抽象
element.addEventListener("touchstart", event => {
    //console.log(event.changedTouches[0]);
    for(let touch of event.changedTouches){
        start(touch)
    }
})

element.addEventListener("touchmove", event => {
    //console.log(event.changedTouches[0]);
    for(let touch of event.changedTouches){
        move(touch)
    }
})

element.addEventListener("touchend", event => {
    //console.log(event);
    for(let touch of event.changedTouches){
        end(touch)
    }
})

element.addEventListener("touchcancel", event => {
    //console.log(event);
    for(let touch of event.changedTouches){
        cancel(touch)
    }
})

let start = (point) => {
    //console.log("start");
    console.log("start", point.clientX, point.clientY);
}

let move = (point) => {
    //console.log("move");
    console.log("move", point.clientX, point.clientY);
}

let end = (point) => {
    //console.log("end");
    console.log("end", point.clientX, point.clientY);
}

let cancel = (point) => {
    console.log("cancel");
}