# Dev工具

## Server

+ build
    + webpack  
      > 支持require，但是推荐使用import

    + babel  
    https://babeljs.io/docs/en/
      > 最典型安装：  
      npm install --save-dev @babel/core @babel/cli @babel/preset-env

    + vue  
    https://github.com/vuejs/vue-next/blob/master/packages/compiler-sfc/package.json  
    @vue/compiler-sfc

    + jsx
    + postcss

+ watch
    + fsevent  
    https://github.com/fsevents/fsevents/  
    监听文件的变化
    
    ```
    const fsevents = require('fsevents');
    const stop = fsevents.watch(__dirname, (path, flags, id) => {
        const info = fsevents.getInfo(path, flags, id);
        console.log(info)
        stop(); 
    }); 
    ```

+ mock  
  https://www.npmjs.com/package/mock

+ http
    + ws
      https://www.npmjs.com/package/http-server

## Client

+ debugger
    + vscode
    + devtool  
    http://develop.google.com/web/tools/chrome-devtools  
    http://chromedevtools.github.io/devtools-protocol/

+ source map  
    http://develop.google.com/web/tools/chrome-devtools/javascript/source-maps


# Test Tool
工程上做单元测试有两个目标：  
+ 自动化的自我评判：写的东西对不对，不靠人肉去判别
+ 管理testcase  

MOCHA：
https://mochajs.org/#installation  

NYC
https://www.npmjs.com/package/nyc  
通过code coverage（一般看行覆盖），来检测单元测试的测试用例和目标代码的覆盖程度，借此来衡量单元测试的编写质量

AVA:
https://github.com/avajs/ava
```
package.json配置：
"ava": {
    "files": [
      "test/*.js"
    ],
    "require": [
      "@babel/register"
    ],
    "babel": {
      "testOptions": {
        "babelrc": true
      }
    }
  }

```