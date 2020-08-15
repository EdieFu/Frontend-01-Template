# 整合工具链

### 配置环境

yeoman：  
https://yeoman.io/authoring/index.html  
通过yeoman将component和工具链整合起来

+ 建立toytool文件夹，npm init，协议建议MIT
+ npm install yeoman-generator
+ 建立目录结构toy-tool>generators>app>index.js
```
测试代码：
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
      }
      method1() {
        this.log('method 1 just ran');
      }
};
```
+ npm link
+ yo toytool

templates：  
https://yeoman.io/authoring/file-system.html

+ 建立目录结构generators>app>templates>index.html
```
测试代码：
<html>
  <head>
    <title><%= title %></title>
  </head>
</html>
```
+ yo toytool


### 整合component

+ 在creating模板之前进行npm初始化，即配置package.json  
https://yeoman.io/authoring/dependencies.html
+ tt-demo目录下yo toytool
+ 把component中的createElement，gesture，animation等用yo toytool拷贝至tt-demo
+ webpack-dev-server启动项目
+ npm start
+ 调试build(webpack)命令，安装html-webpack-plugin  
https://webpack.js.org/api/node/#compiler-instance

+ 调试Mocha


# 持续集成

### 环境

VirtualBox免费虚拟机当服务器：
https://www.virtualbox.org/wiki/Downloads  
https://ubuntu.com/download/desktop