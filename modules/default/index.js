const ch = require("cmdhelper");
const path = require("path");
const fs = require("fs");
const { asyncExec: {exec} } = require("../../utils");

module.exports = {
    descripts: [
        "[-d, dir]      string `扫描目录路径, 缺省为当前目录`",
        "[-o, output]   string `目录树输出文件`",
        "[-c, comment]  string `要提取的文件注释名字`",
        "[-e, excludes] string `忽略文件/目录;多个请使用半角逗号分隔，之间不能有空格`"
    ],
    async action (p) {
        const param = {
            dir: process.cwd(),
            output: "",
            comment: "",
            excludes: []
        }
        p.dir && (param.dir = p.dir);
        p.output && (param.output = p.output);
        p.comment && (param.comment = p.comment);
        p.excludes && (param.excludes = p.excludes.split("+"));
        
        const doneLoading = ch.loading("正在扫描目录...");
        
        const 
        json = await exec("../modules/default/lib/getDirTreeAsyncScript.js", {
            dir: param.dir,
            options: {exclude: param.excludes, comment: param.comment}
        }),
        treeStr = await exec("../modules/default/lib/buildTreeStringAsyncScript.js", json.tree[Object.keys(json.tree)[0]]);
        
        doneLoading("扫描完成 ok");
        
        console.log(`目录最大深度:    ${json.maxDeep}层`);
        console.log(`目录数量:       ${json.dirNum}个`);
        console.log(`文件数量:       ${json.fileNum}个`);
        
        if (!param.output) {
            console.log(treeStr);
        } else {
            fs.writeFileSync(param.output, treeStr);
            console.log(`结果已保存至 ${path.resolve(param.output)}`);
        }
    }
}