#! /usr/bin/env node

const  { cmd } = require("cmdhelper");

[
    require("../modules/default")
].forEach(module => {
    if (!module.name) {
        //。。。这里处理default --v --h 等命令
        cmd(module.descripts, module.action);
    }
    else {
        cmd(module.name, module.descripts, module.action);
    }
});

