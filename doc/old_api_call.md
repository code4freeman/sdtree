## sdtree nodejs调用(api)用法

在版本2之前提供了api调用，在版本2(含)之后api调用不再维护，也不再新增。    

获取目录树字符串表示   
*getTreeStr(path[,options])*   
. options {exclude: [], comment: ""}
```js
const
sdtree = require("sdtree"),
str = sdtree.getTreeStr("./dirpath", {exclude:["node_modules"], comment: "summary"});

console.log(str); 
```

获取目录树json结构   
*getTreeJson(path[,options])*    
. options {exclude: [], comment: ""}
```js
const 
sdtree = require("sdtree"),
res = sdtree.getTreeJSON("./dirpath", {exclude:["node_modules"], comment: "summary"});

console.log(res.tree);
```
