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



# 字符串分析算法

## 字典树

+ 大量字符串的完整模式匹配 
+ 如：有海量几十万个字符串，找出最大的前50个
+ 字典树是哈希树的一种
+ 字典树每个节点都有A-Z共26个分支，26个分支可能是空的或有，每一层表示字符串的一位
+ 字典树存储的好处：
    + 首先可以比较字符串的顺序。比如按照字典去找最小或最大的，就一路找最小或最大的分支
    + 若有100种字符串，存1000万个，找出其中出现最多的字符串。只要按Trie方式存，在树的最后的节点补上数量的字段，就可以知道每一个字符串出现多少次了。
    + 用空间换时间复杂度的好结构，可用于排序



## 括号匹配

```
正确可匹配：
 x[{a(b)}c]y 

括号不可匹配：
(a[b)]
```
+ 括号匹配本质上是一种语法的简化版本，单纯通过正则或状态机处理不了
+ LR(0)算法



## KMP 
```
abcdabce m

目标串：abcdabcdabce n
```
+ 长字符串中找子串的基本算法
+ 时间复杂度可以做到 O(m+n)，即字符串过一遍，一定能把子串找出来；写的不好的就是 O(m*n)

```
function find(source, pattern) {
    for(let i = 0; i < source.length; i++) {
        let matched = true;
        for(let j = 0; j < pattern.length; j++) {
            if(source[i + j] !== pattern[j] ) {
                matched = false;
                break;
            }
        }
        if(matched)
            return true;
    }
    return false;
}

find("abcxyz","xy")
复杂度i*j，比较高，虽然方法正确，但一般不用
```

```
高效但错误的解法：
function find(source, pattern) { 
    let j = 0;
    for(let i = 0; i < source.length; i++) {
        console.log(source[i], pattern[j])
        if(source[i] === pattern[j] ) {
            j ++ ;
        } else {
            j = 0;
        }
        
        if(j === pattern.length)
            return true;
    }
    return false;
}   

// find("abcxyz","xy")
// find("abcxxyz","xy") 找不到
// find("abcxxxyz","xy") 奇数可以找到
```

```
改进，但还是有问题 
function find(source, pattern) { 
    let j = 0;
    for(let i = 0; i < source.length; i++) {
        console.log(source[i], pattern[j])
        if(source[i] === pattern[j] ) {
            j ++ ;
        } else {
            j = 0;
            if(source[i] === pattern[j]) {
                j++;
            }
        }       
        if(j === pattern.length)
            return true;
    }
    return false;
}   

// find("abcxxyz","xy") 可以解决
// find("abcabcabe","abcabe") 但是这种找不到
```


## WildCard 通配符算法

+ 长字符串中找子串升级版
+ 在KMP基础上增加了两种通配符
    + *表示若干个任意字符
    + ？表示一个任意字符
+ 时间复杂度也可以做到 O(m+n)

## 正则

+ 字符串通用模式匹配
+ 时间复杂度做不到 O(m+n)

## 状态机

+ 更通用更灵活的字符串分析，手写比例高

## LL LR

+ 字符串多层级结构（语法）分析