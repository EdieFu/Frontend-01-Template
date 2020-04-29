# Special Object

> JS中的Speicial Object主要在ECMA262的 ___9.4 Built-in Exotic Object Internal Methods and Slots___

## 1. Bound Function Exotic Object

Bound Function跟原来的函数相关联, 它有[[call]]私有字段，也可能有[[construct]]私有字段。

Bound Function的internal slot跟普通函数对象的不同，如下:

### internal slots

+ [[BoundTargetFunction]] (与该Bound函数相关联的函数)
+ [[BoundThis]]
+ [[BoundArguments]] 
  
###  internal methods
+ [[Call]]( thisArgument, argumentsList )  
+ [[Construct]] ( argumentsList, newTarget )  
+ BoundFunctionCreate ( targetFunction, boundThis, boundArgs ) 用来创建新的Bound Function对象


## 2. Array Exotic Object  

+ Array的 length 属性在用构造函数 Array() 创建数组时被初始化，但是length属性会根据最大的下标自动发生变化，即给数组添加新元素时，将更新 length 的值。  
  
+ 设置 length 属性可改变数组的大小。如果设置的值比其当前值小，数组将被截断，其尾部的元素将丢失。如果设置的值比它的当前值大，数组将增大，新的元素被添加到数组的尾部，它们的值为 undefined。

```
var arr = [];
//此时长度为0

arr[8] = 4;
//此时长度为9
arr[5];
//值为undefined

arr.length = 5;
//此时长度为5
arr[8];
//值为undefined

```

## 3. String Exotic Objects  

+ 对于String里的每个字符，都有一个虚拟的正整数索引值来对应，这样就可以支持各种下标运算  
  
+ string.length属性返回字符串中字符编码单元的数量
  
+ 字符串中每个字符的属性和string.length属性都是non-writable/non-configurable.


## 4. Arguments Exotic Objects  

+  Arguments Exotic Objects的非负整数型下标属性跟其函数对应的变量联动
  
+  对于可以传递可变数量的参数的函数很有用。使用 arguments.length来确定传递给函数参数的个数，然后使用arguments对象来处理每个参数。


## 5. Integer-Indexed Exotic Objects  

+ 和普通对象比，有一些特殊的internal slots：
    + [[ViewedArrayBuffer]]
    + [[ArrayLength]]
    + [[ByteOffset]
    + [[TypedArrayName]]
  
+ 跟内存块相关联，下标运算比较特殊，参考：https://www.kancloud.cn/pwstrick/fe-questions/1094984

## 6. Module Namespace Exotic Objects  

模块的namespace对象：特殊的地方非常多，跟一般对象完全不一样，尽量只用于import

## 7. Immutable Prototype Exotic Objects

Object.prototype：作为所有正常对象的默认原型，已经是万物之始，不能再给它设置原型了

```
> Object.setPrototypeOf(Object.prototype,{a:1})

< VM1115:1 Uncaught TypeError: Immutable prototype object '#<Object>' cannot have their prototype set
    at Function.setPrototypeOf (<anonymous>)
```