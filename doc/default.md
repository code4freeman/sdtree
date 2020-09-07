# sdtree 获取目录树用法

## 参数解释
所有参数都为可选
```
[-d, dir]       string `扫描目录路径, 缺省为当前目录`
[-o, output]    string `目录树输出文件`
[-c, comment]   string `要提取的文件注释名字`
[-e, excludes]  string `忽略文件/目录;多个请使用+号连接，之间不能有空格`
[-depth, depth] number `扫描深度, 非零整数`
```

## 示例
基本的用法一看上面的参数解释就很清楚了，这里不做详解。这里讲一些参数解释里不容易看懂的部分。

### 1. 获取目录中文件的指定注释   
比如说你有一个项目，你想提取目录树结构的同时也想提取每个代码文件中的指定注释，那么就可以像下面这么做。
```
sdtree -c @summary 
```
输出示例：    
yourdir    
|-- index.js //入口文件    
|-- test.js //测试代码   

### 2. 忽略指定目录
有的时候生成目录书需要忽略指目录，比如.git、node_modules目录等等，就可以像下面所示这样指定参数来达到。   
```
sdtree -e .git+node_modules
```
就是通过“-e”来指定需要忽略的目录，多个就用“+”连接，但是之间不能有空格；单个不用带“+”号。