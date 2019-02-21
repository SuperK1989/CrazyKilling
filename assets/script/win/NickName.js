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
        if (this.nickEditBox.string.indexOf(' ') != -1 || this.nickEditBox.string.length <= 2) {
            gData.UIManager.tipsFly("too short or error");
            return
        }
        gData.DataManager.httpCorl.HttpPost('/updateInfo', JSON.stringify(data), this.loginBack);
        this.winManager.closeWin(this.node.name);
    },

    loginBack(interFaceHandle, status, responseText) {
        if (responseText == 'error occur')
            cc.director.loadScene("playerLogin", callback => {
                gData.UIManager.tipsFly(responseText);
            });
        gData.UIManager.tipsFly(responseText);
        let playerName = responseText.split('!');
        gData.DataManager.playerInfo.player_name = playerName[1];
    },

    start() {

    },

    // update (dt) {},
});
