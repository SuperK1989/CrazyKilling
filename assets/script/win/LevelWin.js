var gData = require("./manager/InitData")
cc.Class({
    extends: cc.Component,

    properties: {
        playerName: cc.Label,
        playerLevel: cc.Label,
        blackBg: cc.Button,
    },

    init(winManager) {
        this.winManager = winManager;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.playerName.string = gData.DataManager.playerInfo.player_name;
        this.playerLevel.string = gData.DataManager.playerInfo.player_level;

    },

    onEnable() {
        this.blackBg.interactable = false;

        this.scheduleOnce(callBack => {
            this.blackBg.interactable = true;
        }, 0.5)
    },

    start() {

    },

    closeWin() {
        this.winManager.closeWin("LevelWin");
    },

    // update (dt) {},
});
