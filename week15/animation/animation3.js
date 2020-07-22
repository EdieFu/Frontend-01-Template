export class Timeline {
    constructor(){
        this.animations = [];
    }

    tick() {
        let t = Date.now() - this.startTime ;

        for(let animation of this.animations) {
            if(t > animation.duration + animation.delay)
                continue;
            let {object, property, template, start, end, duration, timingFunction, delay} = animation;
            
            let progression = timingFunction((t - delay)/duration); // 0-1之间的数

            let value = start + progression * (end - start); //value就是根据progression算出的当前值

            object[property] = template(value);
        }

        requestAnimationFrame(() => this.tick())
    }

    start() {
        this.startTime = Date.now();
        this.tick();
    }

    add(animation) {
        this.animation.push(animation);
    }

}

export class Animation {
    constructor(object, property, template, start, end, duration, delay, timingFunction) {
        this.object = object;
        this.template = template;
        this.property = property;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction


    }
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