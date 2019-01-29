var gData = require("./manager/InitData")
cc.Class({
    extends: cc.Component,

    properties: {
        nickEditBox: cc.EditBox,

    },

    init(winMana) {
        this.winManager = winMana;
    },

    nickNameSignIn() {
        let playerID = gData.DataManager.playerInfo.player_id;
        let playerInfo = gData.DataManager.handlePlayerInfo();
        let data = playerInfo + "#" + playerID + "@" + "player_name" + "=" + this.nickEditBox.string + "#" + gData.DataManager.token;
        gData.DataManager.httpCorl.HttpPost('/updateInfo', JSON.stringify(data), this.loginBack);
        this.winManager.closeWin(this.node.name);
    },

    loginBack(interFaceHandle, status, responseText) {

        cc.director.loadScene("playerLogin", callback => {
            gData.UIManager.tipsFly(responseText);
        });
    },

    start() {

    },

    // update (dt) {},
});
