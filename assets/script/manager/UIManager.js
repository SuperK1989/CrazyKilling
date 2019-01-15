var winMana = require("./manager/WinManager")

var UIManager = cc.Class({

    properties: {
        winManager: null,
    },

    ctor() {
        this.openedWin = {};
        this.winManager = new winMana;
    },

    tipsFly(strTips) {
        cc.loader.loadRes("./win/flyTips", cc.prefab, function (err, prefab) {
            if (err)
                console.log(err)
            var tipNode = cc.find("Canvas/Main Camera/bg/Tips");
            var tips = cc.instantiate(prefab);
            tipNode.addChild(tips);

            tips.setPosition(0, 0);
            tips.getComponent(cc.Label).string = strTips;

            let action = cc.spawn(cc.moveTo(5, 0, 1000), cc.fadeOut(1.5));
            let fAction = cc.sequence(action, cc.callFunc(function () {
                tips.removeFromParent();
            }, this))

            tips.runAction(fAction);
        })
    },
});

module.exports = UIManager;
