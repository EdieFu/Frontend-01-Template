# Proxy

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy  

+ 不是用来做业务的，使用不慎会让代码变得不可控，设置属性不是设置属性，获取原型不是获取原型，几乎可把所有对象的行为改变。
是给库的设计者和框架的设计者专用的语言功能。

```
let object = {
    a: 1,
    b: 2
}

let proxy = new Proxy(object, {
    get(obj, prop){
        console.log(obj, prop);
        return obj[prop];
    }
})

proxy.a
```

上例中，proxy相当于object的代理，跟直接使用object相比，提供各种各样勾子hook属性，不管对proxy做什么操作，都可以有一个hook
+ handler.apply
+ handler.construct
+ handler.defineProperty

```
let object = {
    a: 1,
    b: 2
}

let proxy = new Proxy(object, {
    get(obj, prop){
        console.log(obj, prop);
        return obj[prop];
    }
    defineProperty(obj, prop, desc){
        console.log(arguments);
        return Object.defineProperty(obj, prop, desc)
    }
})

Object.defineProperty(proxy, "a", {value:10})
//可以调进回调
```

https://github.com/vuejs/vue-next/blob/master/packages/reactivity/__tests__/effect.spec.ts 

effect(() => (dummy = counter.num))
reactive，VUE实现双向绑定的基础