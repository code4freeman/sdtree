#! /usr/bin/env node

const { cmd } = require("cmdhelper");
const { version } = require("../package.json");

const 
versionDescript = "[--v, version] `显示当前版本`",
helpDescript    = "[--h, help]    `显示帮助信息`";

[
    require("../modules/default")
].forEach(module => {
    if (!module.name) {
        cmd([versionDescript, helpDescript, ...module.descripts], (p) => {
            if (p.version) {
                console.log(`\n    当前版本：${version}\n`);
            }
            else if (p.help) {
                console.log("\n    " + module.descripts.join("\n    ") + "\n");
            }
            else {
                module.action(p);
            }
        });
    }
    else {
        cmd(module.name, module.descripts, module.action);
    }
});

