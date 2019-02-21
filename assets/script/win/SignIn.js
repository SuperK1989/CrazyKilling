var gData = require("./manager/InitData")

cc.Class({
    extends: cc.Component,

    properties: {
        signInName: cc.EditBox,
        signInPass: cc.EditBox,
        blackBg: cc.Button,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad() {

    // },

    onEnable() {
        this.blackBg.interactable = false;

        this.scheduleOnce(callBack => {
            this.blackBg.interactable = true;
        }, 0.5)
    },

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
        if (uName == "" || uPass == "" || uName.length < 5 || uPass.length < 5 || uName.indexOf(' ') != -1 || uPass.indexOf(' ') != -1) {
            gData.UIManager.tipsFly("invalid username or password");
            return;
        }
        console.log(uName, uPass)
        var data = uName + "&" + uPass;
        gData.DataManager.httpCorl.HttpPost('/signin', JSON.stringify(data), this.signInBack);
    },

    signInBack(interFaceHandle, status, responseText) {
        console.log(interFaceHandle, status, responseText);
        gData.UIManager.tipsFly(responseText);
    },

    // update (dt) {},
});
