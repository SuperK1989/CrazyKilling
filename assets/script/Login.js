var SoundManager = require('./manager/SoundManager')
var GlobalManager = require('./manager/GlobalManager')
var initData = require("./manager/InitData")
var gData = require("./manager/InitData")
cc.Class({
    extends: cc.Component,

    properties: {
        btn_sound: {
            type: cc.AudioClip,
            default: null,
        },

        winLogin: cc.Node,

        userName: cc.EditBox,
        passWord: cc.EditBox,

        node_loading: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.preloadScene("MainScenes", function () {
            cc.log("Next scene preloaded");
        });

        this.scheduleOnce(callBack => {
            SoundManager.loadSoundEffect("bgm1", true);
        });


    },

    start() {

    },

    playerLogin() {

        let uName = this.userName.string;
        let uPass = this.passWord.string;
        console.log(uName, uPass)
        var data = uName + "&" + uPass;
        gData.DataManager.httpCorl.HttpPost('/login/in', JSON.stringify(data), this.LoginBack);

    },


    LoginBack(interFaceHandle, status, responseText) {
        console.log(interFaceHandle, status, responseText);
        if (responseText == "success") {
            let winLogin = cc.find("Canvas/Main Camera/bg/login")
            winLogin.active = false;
        }
    },

    signIn() {
        initData.UIManager.winManager.openWin("SignIn");
        this.scheduleOnce(callBack => {
            let sign = cc.find("Canvas/Main Camera/bg").getChildByName("SignIn");
            console.log(sign.getPosition());
        }, 1)

    },


    gameBegin() {
        cc.audioEngine.play(this.btn_sound, false)
        GlobalManager.getInstance.loadSprite();
        GlobalManager.getInstance.loadAnimation();
        this.node_loading.active = true;


    }

    // update (dt) {},
});
