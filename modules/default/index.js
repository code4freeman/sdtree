const ch = require("cmdhelper");
const path = require("path");
const fs = require("fs");
const { fork } = require("child_process");

module.exports = {
    descripts: [
        "[-d, dir]       string `扫描目录路径, 缺省为当前目录`",
        "[-o, output]    string `目录树输出文件`",
        "[-c, comment]   string `要提取的文件注释名字`",
        "[-e, excludes]  string `忽略文件/目录;多个请使用+号连接，之间不能有空格`",
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
        p.excludes && (param.excludes = ~p.excludes.indexOf("+") ? p.excludes.split("+") : p.excludes);
        p.depth && (param.depth = p.depth);
        
        let doneLoading = ch.loading("正在扫描目录...").stop;

        const 
        { tree, maxDeep, fileNum, dirNum } = await new Promise((resolve, reject) => {
            const cp = fork(__dirname + "/lib/getDirTreeScript.js");
            let skipAll = false;
            cp.on("message", ({cmd, data}) => {
                ({
                    end (res) {
                        if (!res.tree.name) {
                            res.tree.name = res.tree.path;
                        }
                        resolve(data);
                    },
                    async auth (node) {
                        if (skipAll) return;
                        doneLoading(`目录： "${node.path}" 没有权限，是否跳过？`);
                        const { value } = await ch.select("（上下键选择，回车键确定）", [
                            {label: "跳过当前目录", value: 1},
                            {label: "跳过所有没有权限的目录", value: 2}
                        ]);
                        switch (value) {
                            case 1: 
                                cp.send({cmd: "resume", data: false});
                            break;
                            case 2:
                                skipAll = true;
                                cp.send({cmd: "resume", data: true});
                        }
                        doneLoading = ch.loading("正在扫描目录...").stop;
                    }
                })[cmd](data);
            });
            cp.send({cmd: "exec", data: param});
        }),
        treeStr = await new Promise((resolve, reject) => {
            const cp = fork(__dirname + "/lib/buildTreeStringScript.js");
            cp.on("message", ({cmd, data}) => {
                ({
                    end (data) {
                        resolve(data);
                    }
                })[cmd](data);
            });
            cp.send({cmd: "exec", data: tree});
        });

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