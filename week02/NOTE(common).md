## 语言按语法分类

+ 非形式语言
    +  中文，英文  
    > 非严格定义，演化方式自由：
    > 你吃饭了吗？ ——> 吃了吗？

+ 形式语言  
  >乔姆斯基谱系：是计算机科学中刻画形式文法表达能力的一个分类谱系，是由诺姆·乔姆斯基于 1956 年提出的。它包括四个层次：
    + 0型 无限制文法或短语结构文法，包括所有文法
    + 1型 上下文相关文法，生成上下文相关语言
    + 2型 上下文无关文法Context-Free Grammar，生成上下文无关语言
    + 3型 正则文法，生成正则语言   


# 产生式（BNF）
+ 尖括号<>括起来的名称表示语法结构名
+ 语法结构分为基础结构和需要用其他语法结构定义的符合结构 
    + 基础结构：终结符terminals
    + 复合结构：非终结符non-terminals/symbols
    + 引号和中间的字符表示终结符，如'1'
    + ‘()’ 表示优先级 
    + ‘|’ 表示或
    + ‘*’ 表示重复多次
    + ‘+’ 表示至少一次
    + ‘?’ 表示?左边的元素可选，零或一次  

>练习：四则运算产生式（如1+2*3） 
> 
>\<Number> := "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"  
>
>\<DeciamlNumber> := "0" | {{"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"} Number* }  
>
>\<ExpressionPrime> := DeciamlNumber | "(" ExpressionLogical ")" 
>
>\<ExpressionMul> := ExpressionPrime | ExpressionMul "*" ExpressionPrime | ExpressionMul "/" ExpressionPrime   
>
>\<ExpressionAdd> := ExpressionMul | ExpressionAdd "+" ExpressionMul | ExpressionAdd "-" ExpressionMul    
>
>\<ExpressionLogical> := ExpressionAdd | ExpressionLogical "||" ExpressionAdd | ExpressionLogical "&&" ExpressionAdd   

## 通过Production产生式理解乔姆斯基谱系

+ 0型 无限制文法
    +  ? ::= ?  
    >等号左边可以有多个非终结符  
    >\<a> \<b> ::= "c" \<d>  
+ 1型 上下文相关文法
    + ?\<A>? ::= ?\<B>?  
     >只能变中间  
    >"a" \<b> "c" ::= "a" "x" "c" 
+ 2型 上下文无关文法
    + \<A> ::= ?
+ 3型 正则文法
    + \<A> ::= \<A>? 只允许左递归
    + \<A> ::= ?\<A> 错 
    >\<DeciamlNumber> := / 0 | [1-9][0-9]* /


### JS自定义的产生式
>AdditiveExpression :  
   MultiplicativeExpression  
   AdditiveExpression **+** 
 MultiplicativeExpression  
  AdditiveExpression **-** MultiplicativeExpression  

### 现代语言的特征

+ C++：非形式化语言
 
    >C++中，* 可能表示乘号或者指针，具体是哪个，取决于星号前面的标识符是否被声明为类型（声明可能出现在非常前面，语法跟语义相关）

+ VB：1型
 
    >< 可能是小于号，也可能是XML直接量的开始，取决于当前位置是否可以接受XML直接量


+ Python：非形式化语言
 
    >Python中，行首的tab符和空格会根据上一行的行首空白以一定规则被处理成虚拟终结符indent或者dedent

+ Javascript：1型
 
    >JS中，/ 可能是除号，也可能是正则表达式开头，处理方式类似于VB和JSX，字符串模板中也需要特殊处理 }，还有自动插入分号规则。

# 图灵完备性  

## 图灵完备性
  >在可计算性理论里，如果一系列操作数据的规则（如指令集、编程语言、细胞自动机）可以用来模拟单带图灵机，那么它是图灵完全的。这个词源于引入图灵机概念的数学家艾伦·图灵。虽然图灵机会受到储存能力的物理限制，图灵完全性通常指“具有无限存储能力的通用物理机器或编程语言”。
    
+ 命令式
    + goto
    + if 和 while
+ 声明式 —— lambda
    + 递归      

## 动态与静态

+ 动态
    + 在用户的设备/在线服务器上
    + 产品实际运行时
    + Runtime
+ 静态
    + 在程序员的设备上
    + 产品开发时
    + Compiletime      

  >要语言少出bug，就要更静态——静态特性越多，语言更适用于大规模开发。静态里最重要的功能：类型检查  

## 类型系统

+ 动态类型系统与静态类型系统
  
+ 强类型与弱类型
    + String + Number：Number转成String
    + String == BooleanL：先把Boolean转成String
      >弱类型让你开发阶段更爽，写的很随意，但是最后纠错更难；有隐式转换的都是弱类型，如C++，TS

+ （静态类型中的）复合类型
    + 结构体  
      >对象就是结构体，每个属性都可以有一个类型  
       {  
          a:T1  
         b:T2  
        }
    + 函数签名  
      >( T1,T2 ) => T3  
  
+ 子函数
    + 逆变/协变
      >凡是能用Array\<Parent>的地方，都能用Array\<Child>  
      >凡是能用Function\<Child>的地方，都能用Function\<Parent>
  
        
## 一般命令式编程语言

### Atom
+ Identifier：变量名
+ Literal：直接量，3.14/"hello"……

### Expression
+ Atom
+ Operator：加减乘除，括号
+ Punctuator

### Statement
+ Expression
+ Keyword：If，For…… 
+ Punctuator

### Structure
+ Function
+ Class
+ Process
+ Namespace
+ ……

### Program
+ Program
+ Module
+ Package
+ Library
