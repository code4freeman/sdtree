const { asyncExec: {AsyncScript} } = require("../../../utils/index");
const { Tree, Scan: { ScanNode: { types: scanNodeTypes } } } = require("filehelper");
const fs = require("fs");

new AsyncScript(async ({ dir, comment, excludes, depth }) => {

    let maxDeep = 0, fileNum = 0, dirNum = 0;

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

    const tree = new Tree({ dir, excludes, depth });
    tree.on("step", treeNode => {
        if (treeNode.deep > maxDeep) {
            maxDeep = treeNode.deep;
        }
        if (treeNode.type === scanNodeTypes.FILE) {
            comment && (treeNode.name += getComment(treeNode.path, comment));
            fileNum++;
        }
        if (treeNode.type === scanNodeTypes.DIR) {
            dirNum++;
        }
    });
    const json = await tree.parse();
    return {
        tree: json,
        maxDeep,
        fileNum,
        dirNum
    }

});