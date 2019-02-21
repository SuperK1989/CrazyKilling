var gData = require("./manager/InitData")
cc.Class({
    extends: cc.Component,

    properties: {
        singleInfo: cc.Prefab,
        infoContent: cc.Node,
    },

    init(winManager) {
        this.winManager = winManager;

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    onEnable() {
        let data = "";
        if (this.infoContent.children.length == 0)
            gData.DataManager.httpCorl.HttpPost('/getRankInfo', JSON.stringify(data), this.rankInfoData);
    },

    closeWin() {
        this.winManager.closeWin("RankWin");
    },

    rankInfoData(interFaceHandle, status, responseText) {
        let resData = JSON.parse(responseText)
        let rankWin = cc.find("Canvas/Main Camera/bg/RankWin").getComponent("RankWin")

        for (let i = 0; i < resData.length; i++) {
            let preInfo = cc.instantiate(rankWin.singleInfo);
            rankWin.infoContent.addChild(preInfo);
            preInfo.getComponent("Rankinfo").init(resData[i]);
        }
        console.log(resData);
    }

    // update (dt) {},
});
