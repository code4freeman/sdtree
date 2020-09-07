const { Scan: { ScanNode : { types: scanNodeTypes } } } = require("filehelper");

function init (tree, deep = 0, prevs = []) {
    let str = "";
    if (deep === 0) {
        str += tree.name + "\n";
    }
    tree.childs.forEach((node, index) => {
        for (let i = 0; i < deep; i++) {
            str += prevs.includes(i) ? "│   " : "    ";
        }
        if (index < tree.childs.length - 1) {
            str += "├── " + node.name + "\n";
        } else {
            str += "└── " + node.name + "\n";
        }
        if (node.childs && node.childs.length > 0) {
            str += init(node, deep + 1, (index < tree.childs.length - 1 ? [...prevs, deep] : prevs));
        }
    });
    return str;
}

process.on("message", ({cmd, data}) => {
    ({
        exec (data) {
            process.send({cmd: "end", data: init(data)}, () => process.exit(0));
        }
    })[cmd](data);
});