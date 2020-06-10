# HTML

## HTML的定义：XML与SGML

### DTD与XML namespace

+ http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd
+ http://www.w3.org/1999/xhtml

```
<!ENTITY nbsp   "&#160;"> <!-- no-break space U+00A0 ISOnum -->

"\u00A0"

注：不要用&nbsp替代空格，会产生排版上的问题，应该使用white space，用下面两种方式：

方法一，用pre：
<pre>a     b</pre>

方法二，用pre-wrap允许软换行
<div style="white-space:pre-wrap;">
a     b
<div>


```
```
> "\u03BB"
< "λ"
> document.body.innerHTML = "&lambda;"
< "&lambda;"
```

必知必会：
+ quot   "\&#34;" quotation mark, U+0022
+ amp   "\&#38;#38;"  ampersand, U+0026
+ lt   "\&#38;#60;" less-than sign, U+003C 
+ gt   "\&#62;" greater-than sign, U+003E 



## HTML标签——语义

例子：  
http://static001.geekbang.org/static/time/quote/World_Wide_Web-Wikipedia.html

html新增结构化标签header，main,footer,aside及文档相关等
+ aside和main是一对，文章主体部分是main，其他的是aside
+ aside不是侧边栏（sidebar），是除了主题外没什么用的东西
+ 本例是单文章页面结构，有些新闻页面是多文章结构，一般用两个article；header/footer是在文章结构里的header/footer
+ main里面可放任何东西，是文章就放article，是导航就放nav。SEO会看main里面的内容，是核心内容。
+ 当标题有多个层级（副标题）时，使用hgroup对一系列h1~h6元素进行分组。
+ 补充说明note没有标签，用div class="note"
+ ul和ol的区别，不是由表现形式是点还是数字决定的。使用list-style改变样式
+ 图和下面的注解：figure/figcaption
+ 一般情况，div+span



## HTML语法

### 合法元素

+ Element:\<tagname>...\</tagname>
+ Text: text
+ Comment: \<!-- comments -->
+ DocumentType: <!Doctype html>
+ ProcessingInstruction: \<?a 1?>
+ CDATA:\<![CDATA[]]>

### 字符引用

+ &#161；
+ \&amp;
+ \&lt;
+ \&gt;
+ \&quot;
