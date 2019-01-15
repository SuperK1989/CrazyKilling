var gData = require("./manager/InitData")

cc.Class({
    extends: cc.Component,

    properties: {
        signInName: cc.EditBox,
        signInPass: cc.EditBox,
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

    comfirmSignin() {
        this.winManager.closeWin(this.node.name);
        let uName = this.signInName.string;
        let uPass = this.signInPass.string;
        console.log(uName, uPass)
        var data = uName + "&" + uPass;
        gData.DataManager.httpCorl.HttpPost('/signin', JSON.stringify(data), this.signInBack);
    },

    signInBack(interFaceHandle, status, responseText) {
        console.log(interFaceHandle, status, responseText);
        gData.UIManager.tipsFly(responseText);
        console.log(responseText + "11111111")
    },

    // update (dt) {},
});
