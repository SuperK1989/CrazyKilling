
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    init(winManager) {
        this.winManager = winManager;
    },

    closeWin() {
        this.winManager.closeWin(this.node.name);
    },

    start() {

    },

    // update (dt) {},
});
