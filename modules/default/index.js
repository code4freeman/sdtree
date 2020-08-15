const ch = require("cmdhelper");
const path = require("path");
const fs = require("fs");
const { asyncExec: {exec} } = require("../../utils");

module.exports = {
    descripts: [
        "[-d, dir]       string `扫描目录路径, 缺省为当前目录`",
        "[-o, output]    string `目录树输出文件`",
        "[-c, comment]   string `要提取的文件注释名字`",
        "[-e, excludes]  string `忽略文件/目录;多个请使用半角逗号分隔，之间不能有空格`",
        "[-depth, depth] number `扫描深度, 非零整数`"
    ],
    async action (p) {
        const param = {
            dir: process.cwd(),
            output: "",
            comment: "",
            excludes: [],
            depth: -1
        }
        p.dir && (param.dir = p.dir);
        p.output && (param.output = p.output);
        p.comment && (param.comment = p.comment);
        p.excludes && (param.excludes = p.excludes.split("+"));
        p.depth && (param.depth = p.depth);
        
        const { stop:doneLoading }= ch.loading("正在扫描目录...");

        const 
        { tree, maxDeep, fileNum, dirNum } = await exec(path.join(__dirname, "./lib/getDirTreeAsyncScript.js"), param),
        treeStr = await exec(path.join(__dirname, "./lib/buildTreeStringAsyncScript.js"), tree);
        doneLoading("扫描完成 ok");
        
        console.log(`目录最大深度:    ${maxDeep}层`);
        console.log(`目录数量:       ${dirNum}个`);
        console.log(`文件数量:       ${fileNum}个`);
        
        if (!param.output) {
            console.log(treeStr);
        } else {
            fs.writeFileSync(param.output, treeStr);
            console.log(`结果已保存至 ${path.resolve(param.output)}`);
        }
    }
}