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
    function getComment (filePath, comment) {
        const 
        str = fs.readFileSync(filePath).toString(),
        reg =  new RegExp(`${comment}\\s([^\\n]+)`);
        let res = reg.exec(str);
        return Array.isArray(res) && res.length >= 2 ? res[1] : "";
    }

    const tree = new Tree({ dir, excludes, depth });
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
    const json = await tree.parse();
    return {
        tree: json,
        maxDeep,
        fileNum,
        dirNum
    }

});