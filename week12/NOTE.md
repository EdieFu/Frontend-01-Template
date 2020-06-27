# 正则表达式

## 正则相关的API

+ match()  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match  

```
> "abc".match(/a(b)c/);
< 0: "abc"
  1: "b"  //可以匹配到“b”

> "abc".match(/a(b)|c/g)  //支持或，当用了g之后，（b）捕获就没了
< 0: "ab"
  1: "c"

推荐不带g形式的match，可以拆分结构
例如去match一个CSS属性[a=value]
> "[a=value]".match(/\[([^=]+)=([^\]]+)\]/)
< (3) ["[a=value]", "a", "value"]  //通过括号可以把需要的结构全部match出来

> "[a=value]".match(/\[(?:[^=]+)=(?:[^\]]+)\]/)
< ["[a=value]"]  //括号加?:不捕获的匹配

```

+ replace  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace

```
可以传一个函数
> "abc".replace(/a(b)c/, function(str, $1){
      console.log(str. $1);
      return $1 + $1;
  })
< "bb"

即使是字符串也可以不是普通字符串
> "abc".replace(/a(b)c/, "$1$1")
< "bb"
> "abc".replace(/a(b)c/, "$$1$$1")
< "$1$1"
```

+ RegExp  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp

+ exec/lastIndex  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec  

exec正则的精髓所在，可以分析大段的复杂的文本，靠（）和exec可以做词法分析

```
词法分析套路：

let lastIndex = 0; //从哪里开始找
let token;

do{
    token = inputElement.exec(source);
    console.log(token);
}
while(inputElement.lastIndex - lastIndex == token.length)
```




# 使用LL算法构建AST

状态机只能做词法分析，一层的分段，正则也是一样

？解析四则运算，变成一颗AST语法树

## 四则运算

+ TokenNumber：
    + 1 2 3 4 5 6 7 8 9 0 的组合
+ Operator：
    + +、-、*、/ 之一
+ Whitespace：\<sp>
+ LineTerminator：\<LF> \<CR>

```
<Expression> ::=
    <AdditiveExpression><EOF>

<AdditiveExpression> ::=
    <MultiplicativeExpression>
    |<AdditiveExpression><+><MultiplicativeExpression>
    |<AdditiveExpression><-><MultiplicativeExpression>

<MultiplicativeExpression> ::=
    <Number>
    |<MultiplicativeExpression><*><Number>
    |<MultiplicativeExpression></><Number>
```

## LL语法分析

```
<MultiplicativeExpression> ::=
    <Number>
    |<MultiplicativeExpression><*><Number>
    |<MultiplicativeExpression></><Number>

<AdditiveExpression> ::=
    <Number>
    |<MultiplicativeExpression><*><Number>
    |<MultiplicativeExpression></><Number>
    |<AdditiveExpression><+><MultiplicativeExpression>
    |<AdditiveExpression><-><MultiplicativeExpression>
```
