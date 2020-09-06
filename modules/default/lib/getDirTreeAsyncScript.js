const { Tree, Scan: { ScanNode: { types: scanNodeTypes } } } = require("filehelper");
const fs = require("fs");

let maxDeep = 0, fileNum = 0, dirNum = 0, tree = null;

/**
 * 获取指定注释
 * 
 * @param {String} filePtah
 * @return {String}
 */
function getComment (filePath, comment) {
    const 
    str = fs.readFileSync(filePath).toString(),
    reg =  new RegExp(`${comment}\\s([^\\n]+)`);
    let res = reg.exec(str);
    return Array.isArray(res) && res.length >= 2 ? res[1] : "";
}

/**
 * 初始化tree
 */
function init (options) {
    const { comment } = options;
    tree = new Tree({...options, authSkip: false});
    tree.on("step", treeNode => {
        if (treeNode.deep > maxDeep) {
            maxDeep = treeNode.deep;
        }
        if (treeNode.type === scanNodeTypes.FILE) {
            if (comment) {
                const cm = getComment(treeNode.path, comment);
                cm && (treeNode.name += " //" + cm);
            }
            fileNum++;
        }
        if (treeNode.type === scanNodeTypes.DIR) {
            dirNum++;
        }
    });
    tree.on("auth", node => {
        process.send({cmd: "auth", data: node});
    });
}

process.on("message", ({ cmd, data }) => {
    ({
        async exec (data) {
            init(data);
            const json = await tree.parse();
            process.send({cmd: "end", data: {
                tree: json,
                maxDeep,
                fileNum,
                dirNum
            }}, () => process.exit(0));
        },
        resume (isAuthSkip = false) {
            tree.resume(isAuthSkip);
        }
    })[cmd](data);
});
