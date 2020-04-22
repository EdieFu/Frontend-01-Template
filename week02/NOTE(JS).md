# ECMA262

## A.1 Lexical Grammar  

### SourceCharacter：     
    SourceCharacter ::
        any Unicode code point
 
+ Unicode 是一个字符集：  
官网：https://home.unicode.org/  

+ code point 码点：一个字符对应到一个正整数上
  
>A对应的码点是65  
>a的码点是97  

+ ASCII字符是计算机领域早期的字符集，共128个。JS使用的字符不是ASCII字符，但是兼容ASCII字符集  
  
***  

#### Unicode资料：  
http://www.fileformat.info/info/unicode/
+ Blocks
    + Basic Latin：ASCII字符兼容部分
        + SPACE (U+0020)
        + LINE FEED (LF) (U+000A)
    + JS代码最好限制在这一部分
    + CJK Unified Ideographs：最常用的中文字符
    + BMP：基本字符平面，即4位16进制能表示的，兼容性很好。JS中 _String.fromCodePoint()_ 和 _String.codePointAt()_ 只能处理这一部分字符


+ Categories
    + Separator, Space

  
***  

### InputElement：  
    InputElement ::
        WhiteSpace
        LineTerminator
        Comment
        Token
    

#### WhiteSpace
  + \<TAB>：字符串"\t"，码点0009
  + \<VT>：字符串"\v"，码点000B
  + \<FF>：码点000C  
  + \<SP>：普通空格，码点0020
  + \<NBSP>：NO-BREAK SPACE，码点00A0
    > a\&nbsp;\&nbsp;\&nbsp;\&nbsp;b  
    > 这种用法是错的 
    > no-break是相较于SP的break(断词)效果的  
    > 使用&nbsp让两个词像一个词，换行时要么全换行要么全不换
  + \<ZWNBSP>：零宽空格，码点FEFF；也叫BOM，Byte Order Mask
  + \<USP>：http://www.fileformat.info/info/unicode/category/Zs/list.htm

> 最佳实践：推荐全部用\<SP>,其他用\u转义  

#### LineTerminator
  + \<LF>：LINE FEED，字符串"\n"，码点000A
    > 正常情况下应统一使用 \n  
  + \<CR>：回车CARRIAGE RETURN，字符串"\r"，码点000D
  + \<LS>：超出ASCII编码之外，不建议用
  + \<PS>：超出ASCII编码之外，不建议用
 
 #### Comment
  + 单行注释：\\\\
  + 多行注释：* 不能\u转义，/* 不嵌套  

 #### Token
  + Punctuator
  + Lieral
  + Identifier
     + 用作变量名的部分identifieReference，不能和keyword重合
        > document.write()中的document；  
        > var a=1中的a；
     + 用作属性的部分，可以和keyword重合
        > document.write()中的write； 
  + Keywords


### Literal类型  

#### Number 
+ IEEE 754 Double Float
    + Sign（1）：符号位，正/负
    + Exponent（11）：科学计数法乘上的部分
    + Fraction（52）：精度部分，值

+ Number Grammar（ECMA11.8.3）
    + DecimalLiteral
        + 0  
        + 0 .
        + . 2
        + 1e3 
        > 0.toString();  
        > 0 .toString();  
        > 由于“0.”是一个合法的整数，所以在词法上优先把“0.”认为是一个整数，所以如果要查97的二进制表示，则需要一个空格：
        > 97 .toString(2)
    + BinaryLiteral
        + 0b111  
    + OctalIntegerLiteral
        + 0o10
    + HexIntegerLiteral
        + 0xFF
    > 最佳实践：  
    > + Safe Integer 安全的整数范围  
        Number.Max_SAFE_INTEGER.toString(16)  
        "1fffffffffffff"  
    > + Float Compare   
        Math.abs(0.1+0.2-0.3)<=Number.EPSILON  
        在银行业务的处理需要注意，怕资损就以“分”为单位处理，多的一分钱在产品上要定义好怎么处理。

#### String  
+ Character
+ Code Point
    + ASCII
    + Unicode
    + UCS：Unicode的BMP范围
    + GB：国标字符范围跟Unicode完全不一样
        + GB2312
        + GBK(GB13000)
        + GB18030 
    + ISO-8859：欧洲字符
    + BIG5  
+ Encoding（码点的存储方式）  
    + UTF
        + UTF-8：以ASCII为主
        + UTF-16：如果用了一堆中文拉丁文西文等
    > JS实际上以UTF-16在内存中存储，故不承认BMP之外的字符，故charCodeAt()和fromCharCode()的性能好于codePointAt()，如果字符串很大，用codePointAt()并不是一个好的选择

+ Grammar（ECMA11.8.4）
    + "abc"
    + 'abc'
    + \`abc\` 反引号，template
  > \r 和\n 的区别

#### Boolean  
+ true  
+ false  
  
#### Object  
#### Null  
#### Undefined  
#### Symbol  
#### 正则表达式直接量

   > 匹配‘a’的正则表达：/a/g  
   >如果前面有一个变量a，就变成除法了：  
   >var a；  
   >a  
   >/a/g  
   >以上表示a除以a除以g  
   >能插除号的地方就是除号，不能插除号就是正则  
   >如以下是正则：   
   >if (a)  
   >/a/g  
   >以下是除法：  
   > (a)  
   >/a/g  

   > 所以规范里用了两部分来定义输入：  
   >   + InputElementDiv
   >   + InputElementRegExp  
   >CommonToken里不包括 / 和 }