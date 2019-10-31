const sdtree = require("./index");
const fs = require("fs");

let path = "../Tool-Chicken-Chat", options = {comment: "description", exclude: ["icons"]};

fs.writeFileSync("test.text", sdtree.getTreeStr(path, options));
fs.writeFileSync("test.json", JSON.stringify(sdtree.getTreeJson(path, options), null, 4));