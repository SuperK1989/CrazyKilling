var SoundManager = require('./manager/SoundManager')
var GlobalManager = require('./manager/GlobalManager')
var DataManager = require("./manager/DataManager")
cc.Class({
    extends: cc.Component,

    properties: {
        btn_sound: {
            type: cc.AudioClip,
            default: null,
        },

        userName: cc.EditBox,
        passWord: cc.EditBox,

        node_loading: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.preloadScene("MainScenes", function () {
            cc.log("Next scene preloaded");
        });

        console.log(cc.WinResMap)

        // HttpCorl.HttpPost('login/in', JSON.stringify("success!!"), this.LoginBack);
        SoundManager.loadSoundEffect("bgm1", true);

    },

    start() {

    },

    playerLogin() {
        let uName = this.userName.string;
        let uPass = this.passWord.string;
        console.group(uName, uPass)
    },

    LoginBack() {
        console.log("loginBack");
    },


    gameBegin() {
        cc.audioEngine.play(this.btn_sound, false)
        GlobalManager.getInstance.loadSprite();
        GlobalManager.getInstance.loadAnimation();
        this.node_loading.active = true;


    }

    // update (dt) {},
});
