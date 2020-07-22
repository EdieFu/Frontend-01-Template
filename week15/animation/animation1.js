export class Timeline {
    tick() {
        console.log("tick");
        requestAnimationFrame(() => this.tick())
    }

    start() {
        this.tick();
    }

}

export class Animation {

}

/*

let animation = new Animation(object, property, start, end, duration, delay, timingFunction);
let animation2 = new Animation(object2, property2, start, end, duration, delay, timingFunction);

let timeline = new Timeline;

timeline.add(animation);
timeline.add(animation2);

timeline.start()
timeline.pause()
timeline.resume()
timeline.stop()

animation.start()
animation2.start()

animation.pause()
animation.resume()

animation.stop()

setTimeout
setInterval
requestAnimationFrame

*/