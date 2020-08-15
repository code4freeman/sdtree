const { fork } = require("child_process");

class Message {
    constructor (cmd = "", data = {}) {
        this.cmd = cmd;
        this.data = data;
    }
}

class AsyncScript {
    constructor (action) {
        if (!action) return;
        if (typeof action !== "function") throw `参数必须为函数，且要有返回`;
        this._action = action;
        this._startListenMessage();
        process.send(new Message(exec.listenMessageTypes.LOADED));
    }
    async _execAction (data) {
        let res = null;
        try {
            res = await this._action(data);
        } catch(err) {
            throw `AsyncScript 出错：${err}`;
        }
        process.send(new Message(exec.listenMessageTypes.DONE, res));
    }
    _startListenMessage () {
        process.on("message", ({cmd, data}) => {
            switch (cmd) {
                case AsyncScript.listenMessageTypes.ACTION:
                    this._execAction(data);
            }
        });
    }
}
AsyncScript.listenMessageTypes = {
    ACTION: "ACTION"
}

function exec (scriptpath, params = {}, subscribes = {}) {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });

    const cp = fork(scriptpath);
    cp.on("message", ({cmd, data}) => {
        switch (cmd) {
            case exec.listenMessageTypes.LOADED:
                cp.send(new Message(AsyncScript.listenMessageTypes.ACTION, params));
            break;
            case exec.listenMessageTypes.DONE:
                resolve(data);
                cp.kill();
        }
    });
    cp.on("error", err => reject(err));
    
    return promise;
}
exec.listenMessageTypes = {
    LOADED: "LOADED",
    DONE: "DONE"
}

module.exports = { exec, AsyncScript }