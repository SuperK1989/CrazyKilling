var uiManager = require("./manager/UIManager")

cc.WinType = {
    Normal: 1,
    Effect: 50,
    Dialog: 100,
    System: 200,  //系统提示
    Alert: 300,   //Tips弹出
}

var WinManager = cc.Class({
    extends: cc.Component,

    ctor() {
        this.openedWin = {};
    },

    openWin(winName) {
        for (let i in this.openedWin) {
            if (!this.openedWin[winName]) {
                let winnode = cc.find("Canvas/Main Camera/bg/" + winName)
                this.openedWin[winName] = true;
                winnode.active = true;
                this.openAction(winnode);
                return;
            }
        }

        var self = this;
        cc.loader.loadRes("./win/" + winName, cc.prefab, function (err, prefab) {
            let winPre = cc.instantiate(prefab);
            let canvas = cc.find("Canvas/Main Camera/bg");
            canvas.addChild(winPre);
            winPre.getComponent(winName).init(self);
            self.openAction(winPre);
            self.openedWin[winName] = true;
        })
    },

    openAction(node) {
        node.setPosition(2000, 0);
        let action = cc.moveTo(0.3, 0, 0)//.easing(cc.easeBackOut());
        node.runAction(action);
    },

    closeWin(winName) {
        var winnode = cc.find("Canvas/Main Camera/bg/" + winName);
        this.closeAction(winnode);

    },

    closeAction(node) {
        this.openedWin[node.name] = false;
        let action = cc.moveTo(0.3, 2000, 0)
        this.scheduleOnce(callBack => {
            node.active = false;
        }, 0.3)
        //.easing(cc.easeBackOut());
        node.runAction(action);
    },




});

module.exports = WinManager;
