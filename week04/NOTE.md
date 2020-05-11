# JS执行过程

事件循环Event Loop不是JS里的东西，在JS引擎之外的东西，是浏览器和Node里的东西。

## JS引擎


送到JS引擎中的code有三种

+ 普通的代码片段
  ```
  <script>
    var a = 1;
    a++;
  </script>
  ```
+ 模块
  ```
  <script type="module">
    var a = 1;
    a++;
  </script>
  ```
+ 函数
  ```
  setTimeout(function(){},1000);
  ```

宏任务/微任务 or 事件循环/promise序列
同步代码/异步代码

ECMA262 8.6 RunJobs()
最初的入口，JS标准里微任务叫job

# JS执行粒度

+  JS Context => Realm
+  宏任务
+  微任务（Promise）
+  函数调用（Execution Context）
+  语句 / 声明
+  表达式
+  直接量 / 变量 / this ......

## JS Context
上下文，存了global里的所有东西；  
从粒度来讲是最大的东西；  
一般来说，JS Context对应着一个global object；  
多个宏任务之间共享了一个global object，同时多个宏任务之间，它们定义的变量，所访问的内置对象，也是相通的。

## Realm
+ Realm里有一套完整的JS内置对象
+ 多个不同的Realm互相之间 —— 比如原始的object对象/Array对象/Date对象，以及它们对应的prototype属性 —— 这些东西每个Realm都会创建一整套
+ Realm里有多少对象：重学前端里写过代码
+ ECMA262 18.The Global Object

## 函数调用（Execution Context）
```
import {foo} "foo.js"
var i = 0;
console.log(i);
foo();
console.log(i);
i++;
```
```
function foo(){
    var x = 1;
    console.log(x);
}
export foo;
```
```
JS引擎执行时：
var i = 0;
console.log(i);
    var x = 1; //此时访问不到i
    console.log(x);
console.log(i);
i++;
```

### Execution Context Stack 执行上下文栈：

当函数调用，进入一个函数时会发生一次Execution Context Stack的Push，当函数返回时会发生一次Execution Context Stack的Pop  

### Execution Context：
一个Execution Context（i:0）包含着以下内容：
+ code evaluation state
    > 主要是async函数和generator函数有用，普通函数一般不需要存code evaluation state，直接执行到底然后pop出去。
+ Function
+ Script or Module
+ Generator
  ```
  function *foo(){
      yield 1;
      yield 2;
      yield 3;
  }
  var g = foo();
  g.next();
  ```

+ Realm
    + 在JS中，函数表达式和对象直接量均会创建对象；   
    + 使用、做隐式转换也会创建对象；
    + 这些对象也是有原型的，如果我们没有Realm，就不知道它们的原型是什么。
    > 在浏览器里只有iframe能生成Realm  
    
+ LexicalEnvironment
   + this
   + new.target
   + super
   + 变量
   ```
   this.a = 1;
   super();
   x += 2;
   new.target;
   ```
+ VariableEnvironment  
  ```
  是历史遗留，仅用于处理var声明。
  {
      let y = 2;
      eval('var x= 1;');
  }

  with({a : 1}) {
      eval('var x;');
  }
  console.log(x);
  ```

#### Environment Record
>  一个链表结构
> + Environment Records
>     + Declarative Environment Records  
>           + Function Environment Records   
>           + module Environment Records 
>     + Global Environment Records
>     + Object Environment Records
>       一般由with产生

### Function - Closure
```
var y = 2;
function foo2(){
    console.log(y);
}
export foo2;
```
> 调用Function:foo2的时候，实际上带上了环境  
>   + Environment Record：y:2
>   + Code：console.log(y);