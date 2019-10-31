#! /usr/bin/env node
"use strict"

/**
 * @summary 命令行处理 
 */

const path = require("path");
const fs = require("fs");
const p = require('commander');
const getTree = require("../lib/getDirTree");
const buildTree = require("../lib/buildTreeString");
const {print} = require("../lib/tools");

p
.version("dscan v0.0.1")
.option("-i, --input    <input>", "扫描目录路径, 缺省为当前目录")
.option("-o, --output   <output>", "目录树输出文件")
.option("-c, --comment  <comment>", "要提取的文件注释名字")
.option("-e, --excludes <exculudes>", "忽略文件/目录;多个请使用半角逗号分隔，之间不能有空格")
.parse(process.argv);

const param = {
    input: process.cwd(),
    output: "",
    comment: "",
    excludes: []
}

p.input && (param.input = p.input);
p.output && (param.output = p.output);
p.comment && (param.comment = p.comment);
p.excludes && (param.excludes = p.excludes.split(","));

print("正在处理...\n");

const 
json = getTree(param.input, {exclude: param.excludes, comment: param.comment}),
treeStr = buildTree(json.tree[Object.keys(json.tree)[0]]);

print("处理完成！\n");
print(`目录最大深度:    ${json.maxDeep}层\n`);
print(`目录数量:       ${json.dirNum}个\n`);
print(`文件数量:       ${json.fileNum}个\n`);

if (!param.output) {
    print (treeStr);
} else {
    fs.writeFileSync(param.output, treeStr);
    print(`结果已保存至 ${param.output}!`);
}

