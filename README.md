# sdtree （scan dir tree）目录树扫描工具

## 功能
* 获取目录树字符串表示，可以附带指定文件注释
* 获取目录树json格式

## 命令行

*首先要安装该工具，执行 npm install sdtree -g*

命令行参数：
>-d, --input    \<dir>        扫描目录路径, 缺省为当前目录<br>
>-o, --output   \<output>     目录树输出文件, 缺省会吧目录树信息打印到屏幕<br>
>-c, --comment  \<comment>    要提取的文件注释名字<br>
>-e, --excludes \<exculudes>  忽略文件/目录; 多个请使用半角逗号分隔，之间不能有空格

示例：<br>
$ sdtree -d E:\Documents\Desktop\sdtree -c summary -e node_modules,.git
```js
正在处理...<br>
处理完成！<br>
目录最大深度:    2层<br>
目录数量:       6个<br>
文件数量:       11个<br>
sdtree<br>
|-- .gitignore<br>
|-- commander<br>
|   ┕-- sdtree.js 命令行处理<br>
|-- doc<br>
|   ┕-- img<br>
|       ┕-- img1.png<br>
|-- index.js commonjs导出模块<br>
|-- lib<br>
|   |-- buildTreeString.js 根据目录树json 生成目录树字符串表示<br>
|   |-- getDirTree.js 获取目录树json结构<br>
|   ┕-- tools.js 工具<br>
|-- package-lock.json<br>
|-- package.json<br>
|-- README.md<br>
┕-- test<br>
    ┕-- test.js 测试<br>
```
## nodejs调用(api)

获取目录树字符串表示<br>
*getTreeStr(path[,options])*<br>
. options {exclude: [], comment: ""}
```js
const
sdtree = require("sdtree"),
str = sdtree.getTreeStr("./dirpath", {exclude:["node_modules"], comment: "summary"});

console.log(str); 
```

获取目录树json结构<br>
*getTreeJson(path[,options])*<br>
. options {exclude: [], comment: ""}
```js
const 
sdtree = require("sdtree"),
res = sdtree.getTreeJSON("./dirpath", {exclude:["node_modules"], comment: "summary"});

console.log(res.tree);
```

>>