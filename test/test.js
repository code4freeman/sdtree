/**
 * @summary 测试 
 */

const sdtree = require("../index");
const fs = require("fs");

let path = "../../sdtree", options = {comment: "", exclude: []};

fs.writeFileSync("test.text", sdtree.getTreeStr(path, options));
fs.writeFileSync("test.json", JSON.stringify(sdtree.getTreeJson(path, options), null, 4));