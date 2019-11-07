# sdtree （scan dir tree）目录树扫描工具

## 功能
* 获取目录树字符串表示，可以附带指定文件注释
* 获取目录树json格式
* 
获取目录树（字符串表示）：
```js
sdtree
│── .gitignore
│── commander
│   └── sdtree.js
│── index.js
│── lib
│   │── buildTreeString.js
│   │── getDirTree.js
│   └── tools.js
│── package-lock.json
│── package.json
│── README.md
└── test
    │── test.js
    │── test.json
    └── test.text

```
获取目录树json：
```js
{
    "sdtree": {
        "name": "sdtree",
        "type": "dir",
        "childs": {
            ".gitignore": {
                "name": ".gitignore",
                "type": "file"
            },
            "commander": {
                "name": "commander",
                "type": "dir",
                "childs": {
                    "sdtree.js": {
                        "name": "sdtree.js",
                        "type": "file"
                    }
                }
            },
            "index.js": {
                "name": "index.js",
                "type": "file"
            },
            "lib": {
                "name": "lib",
                "type": "dir",
                "childs": {
                    "buildTreeString.js": {
                        "name": "buildTreeString.js",
                        "type": "file"
                    },
                    "getDirTree.js": {
                        "name": "getDirTree.js",
                        "type": "file"
                    },
                    "tools.js": {
                        "name": "tools.js",
                        "type": "file"
                    }
                }
            },
            "package-lock.json": {
                "name": "package-lock.json",
                "type": "file"
            },
            "package.json": {
                "name": "package.json",
                "type": "file"
            },
            "README.md": {
                "name": "README.md",
                "type": "file"
            },
            "test": {
                "name": "test",
                "type": "dir",
                "childs": {
                    "test.js": {
                        "name": "test.js",
                        "type": "file"
                    },
                    "test.json": {
                        "name": "test.json",
                        "type": "file"
                    },
                    "test.text": {
                        "name": "test.text",
                        "type": "file"
                    }
                }
            }
        }
    }
}
```


## 命令行用法

首先要安装该工具
> npm install -g git+https://github.com/lilindog/sdtree#master

命令行参数：
>-d, --input    \<dir>        扫描目录路径, 缺省为当前目录<br>
>-o, --output   \<output>     目录树输出文件, 缺省会吧目录树信息打印到屏幕<br>
>-c, --comment  \<comment>    要提取的文件注释名字<br>
>-e, --excludes \<exculudes>  忽略文件/目录; 多个请使用半角逗号分隔，之间不能有空格

示例：<br>
$ sdtree -d E:\Documents\Desktop\sdtree -c summary -e node_modules,.git
```js
正在处理...
处理完成！
目录最大深度:    1层
目录数量:       4个
文件数量:       12个
sdtree
│── .gitignore
│── commander
│   └── sdtree.js
│── index.js
│── lib
│   │── buildTreeString.js
│   │── getDirTree.js
│   └── tools.js
│── package-lock.json
│── package.json
│── README.md
└── test
    │── test.js
    │── test.json
    └── test.text

```
## nodejs调用(api)用法

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