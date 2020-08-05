import {createElement, Text, Wrapper} from "./createElement";

import {Timeline, Animation} from "./animation";
import {ease, linear} from "./cubicBezier";


export class Panel {
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
        return <div class = "panel" style="border:solid 1px lightgreen;width:300px">
            <h1 style="background-color:lightgreen;width:300px;margin:0;">{this.title}</h1>
            <div style="width:300px;min-height:300px;">
                {this.children}
            </div>
        </div>;
    }

    mountTo(parent){
    
        for(let child of this.children){
            //debugger;
            this.slot.appendChild(child)
        }
        this.render().mountTo(parent)

    }


}
