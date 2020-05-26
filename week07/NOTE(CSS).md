# 重学CSS 总论

## 一、CSS语法的研究

CSS2.1的语法  
https://www.w3.org/TR/CSS21/grammar.html#q25.0    
Appendix G.Grammar of CSS 2.1  

https://www.w3.org/TR/css-syntax-3  

### CSS总体结构

CSS语法总体来说分为普通rule和带@的rule，普通rule时平时90%时间使用的，@rule处理一些特殊场景使用。

+ @charset
    + 可理解是过时的属性
    + 写CSS一般写成ASCII兼容，不用超过127的字符，超过127的字符用转义处理 
+ @import
+ rules
    + @media
    + @page（可在做浏览器打印时用）
    + __rule__

> CDO： \<!--  
> CDC： -->

### 二、@规则的研究  
https://developer.mozilla.org/en-US/docs/Web/CSS/At-rule

+ @charset：https://www.w3.org/TR/css-syntax-3/
+ @import：https://www.w3.org/TR/css-cascade-4/
+ @media：https://www.w3.org/TR/css3-conditional/
  > @media和@support来自同一份规范，做mediaquary用
+ @page：https://www.w3.org/TR/css-page-3/
+ @counter-style：https://www.w3.org/TR/css-counter-style-3/
+ @keyframes：https://www.w3.org/TR/css-animations-1/
+ @font-face：https://www.w3.org/TR/css-fonts-3/
+ @supports：https://www.w3.org/TR/css3-conditional/  
  > 检查CSS feature用，但本身兼容性存疑 
+ @namespace：https://www.w3.org/TR/css-namespaces-3/
  

### 三、CSS普通规则的结构 
+ Selector
    +  https://www.w3.org/TR/selectors-3/ 10.1Grammar
    +  https://www.w3.org/TR/selectors-4/ （一般不参考）
       > compound-selector-list 复合选择器是标准4里的说法
    ```
    简单选择器：
      #id
      .cls
      :visited
      ::first-letter
      :not(.cls)
    最复杂的选择器混起来用：
    #id.cls.cls2:visited::first-letter:not(.cls)
    
    simple_selector_sequence：
    div#id.cls.cls2:visited::first-letter:not(.cls)

    combinator: 空格 > + ~  
    html div>div#id.cls.cls2:visited::first-letter:not(.cls)
    ```
+ Key
    + Properties
    + Variables：https://www.w3.org/TR/css-variables/ 兼容性较差
+ Value
    +  https://www.w3.org/TR/css-values-4/

### 初建CSS知识系统

