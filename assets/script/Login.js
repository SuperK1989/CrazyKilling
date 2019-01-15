var SoundManager = require('./manager/SoundManager')
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

        SoundManager.loadSoundEffect();

        onfire.onmsg("loadSoundFile success", function () {
            SoundManager.playSoundEffect("bgm1", true);
            console.log("playMusic")
        }, this);
        // this.scheduleOnce(callBack => {
        //     SoundManager.loadSoundEffect("bgm1", true);
        // }, 3);

    },

    start() {

    },

    playerLogin() {

        cc.audioEngine.play(this.btn_sound, false)
        let uName = this.userName.string;
        let uPass = this.passWord.string;
        console.log(uName, uPass)
        var data = uName + "&" + uPass;
        gData.DataManager.httpCorl.HttpPost('/login', JSON.stringify(data), this.loginBack);

    },


    loginBack(interFaceHandle, status, responseText) {
        console.log(interFaceHandle, status, responseText);
        if (responseText == "login successfully") {
            gData.UIManager.tipsFly(responseText);
            let winLogin = cc.find("Canvas/Main Camera/bg/login")
            winLogin.active = false;
            return;
        }

        gData.UIManager.tipsFly(responseText);
    },

    signIn() {
        cc.audioEngine.play(this.btn_sound, false)
        gData.UIManager.winManager.openWin("SignIn");

    },


    gameBegin() {
        cc.audioEngine.play(this.btn_sound, false)
        gData.DataManager.GlobalManager.loadSprite();
        gData.DataManager.GlobalManager.loadAnimation();
        this.node_loading.active = true;


    },



    // update (dt) {},
});
