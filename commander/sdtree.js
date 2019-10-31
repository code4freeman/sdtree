#! /usr/bin/env nodeprogram
"use strict"

const path = require("path");
const fs = require("fs");
const p = require('commander');

p
.version("dscan v0.0.1")
.option("-i, --input    <input>", "扫描目录路径")
.option("-o, --output   <output>", "目录树输出文件")
.option("-c, --comment  <comment>", "要提取的文件注释名字")
.option("-e, --excludes <exculudes>", "忽略文件/目录;多个请使用半角逗号分隔，之间不能有空格")
.parse(process.argv);
