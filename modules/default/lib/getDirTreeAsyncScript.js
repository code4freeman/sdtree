const { asyncExec: {AsyncScript} } = require("../../../utils/index");
const fs = require("fs");
const $path = require("path");

new AsyncScript(params => {
    /**
     * 默认参数配置 
     */
    const defaultOptions = {
        _paths: [],
        exclude: [],
        comment: "",
        tree: {},
        dirNum: 0,
        fileNum: 0,
        maxDeep: 0
    }

    /**
     * 转换目录名
     * 有的时候输入的是根路径，要获取其目录名
     * 
     * @param {String} path 路径或目录名
     * @return {String} 目录名
     */
    function getDirName (path) {
        path = $path.resolve(path);
        if (~path.indexOf("\/")) {
            const arr = path.split("\/");
            return arr[arr.length - 1];
        } else if (~path.indexOf("\\")) {
            const arr = path.split("\\");
            return arr[arr.length - 1];
        } else {
            return path;
        }
    }

    /**
     * 根据当前路径获取tree父节点容器 
     * 
     * @param {Array} keys 路径数组
     * @param {Object} target tree结构
     * @return {Object}
     */
    function getParentNode (keys, target) {
        let node = target;
        for (let i of keys) {
            node = node[getDirName(i)];
            if (node.type === "dir") {
                node = node.childs;
            }
        }
        return node;
    }

    /**
     * 构建节点数据
     * 
     * @param {String} name 节点名字
     * @param {String} type 节点类型
     * @return {Object}
     */
    function buildNode (name, type) {
        switch (type) {
            case "file":
                return {
                    name,
                    type
                }
            break;
            case "dir": 
                return {
                    name,
                    type,
                    childs: {}
                }
            break;
            default: throw `type "${type}" 不存在`;
        }
    }

    /**
     * 获取指定注释
     * 
     * @param {String} filePtah
     * @return {String}
     */
    function getComment (filePtah, comment) {
        const 
        str = fs.readFileSync(filePtah).toString(),
        reg =  new RegExp(`@${comment}\\s{0,}([^\\r\\n]+)(?=[\\r\\n])`, "g");
        let res = reg.exec(str);
        return Array.isArray(res) && res.length > 1 && res[1] && res[1] || "";
    }

    /**
     * 生成return对象
     * 
     * @param {Object} options {exclude:[], comment: ""}
     * @return {Object}
     */
    function buildReturnData (options) {
        const data = {};
        Object.keys(options).forEach(key => {
            if (!~key.indexOf("_")) {
                data[key] = options[key];
            }
        });
        return data;
    }

    /**
     * 扫描指定目录，返回json结构文件
     * 
     * @param {String} dir 要扫描的目录路径
     * @return {Object}
     */
    function getDirTree (dir, options) {

        if (!dir) throw "dir 参数缺失";
        options= Object.assign(defaultOptions, options);

        //最大深度记录,目录数量记录
        options._paths.length > options.maxDeep && options.maxDeep ++;
        options.dirNum ++;

        getParentNode(options._paths, options.tree)[getDirName(dir)] = buildNode(getDirName(dir), "dir");
        options._paths.push(dir);

        const path = options._paths.join("/");

        if (!fs.existsSync(path)) throw `目录"${path}"不存在`;
        if (!fs.statSync(path).isDirectory()) throw `路径"${path}"不是目录`;
        let childs = [];
        try {
            childs = fs.readdirSync(path, {withFileTypes: true});
        } catch(err) {
            if (err.code === "EACCES") console.log(`没有权限访问：${path}`);
            console.log("也可以到 https://github.com/lilindog/sdtree 提issue");
            process.exit();
        }

        childs.forEach(d => {
            if (!options.exclude.includes(d.name)) {

                if (d.isFile()) {
                    options.fileNum ++;
                    const parentNode = getParentNode(options._paths, options.tree);
                    parentNode[d.name] = buildNode(d.name, "file");
                    if (options.comment) {
                        parentNode[d.name].comment = getComment(path + "/" + d.name, options.comment);
                    }
                }
                if (d.isDirectory()) {
                    getDirTree(d.name, options);
                }

            }
        });

        options._paths.pop();

        if (options._paths.length === 0) {
            return buildReturnData(options);
        }
    }

    return getDirTree(params.dir, params.options);

});