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
        tips: cc.Node,

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

        this.tips.zIndex = cc.WinType.System;
    },

    start() {

    },

    playerLogin() {
        cc.audioEngine.play(this.btn_sound, false)
        let uName = this.userName.string;
        let uPass = this.passWord.string;
        if (uName == "" || uPass == "" || uName.length < 5 || uPass.length < 5 || uName.indexOf(' ') != -1 || uPass.indexOf(' ') != -1) {
            gData.UIManager.tipsFly("invalid username or password");
            return;
        }



        var data = uName + "@" + uPass;
        gData.DataManager.httpCorl.HttpPost('/login', JSON.stringify(data), this.loginBack);

    },


    loginBack(interFaceHandle, status, responseText) {
        console.log(interFaceHandle, status, responseText);
        let urlStr = responseText.toString();
        if (urlStr.indexOf("&") == -1) {
            gData.UIManager.tipsFly(responseText);
            return;
        }

        let handleUrl = urlStr.split("&");
        let json = JSON.parse(handleUrl[1]);
        let token = JSON.parse(handleUrl[2]);
        if (handleUrl[0] == "login successfully") {
            gData.UIManager.tipsFly(handleUrl[0]);
            gData.DataManager.playerInfo = json;
            gData.DataManager.token = token;
            console.log(gData.DataManager.playerInfo);
            let winLogin = cc.find("Canvas/Main Camera/bg/login");
            let loginScri = cc.find("Canvas").getComponent("Login");
            loginScri.saveUserLogInfo();

            winLogin.active = false;

            if (gData.DataManager.playerInfo.player_name == '')
                gData.UIManager.winManager.openWin("NickName");
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

    saveUserLogInfo() {
        gData.DataManager.userName = this.userName.string;
        gData.DataManager.passWord = this.passWord.string;
    },

    playerInfoWin() {
        cc.audioEngine.play(this.btn_sound, false);
        gData.UIManager.winManager.openWin("LevelWin");
    },

    rankWin() {
        cc.audioEngine.play(this.btn_sound, false);
        gData.UIManager.winManager.openWin("RankWin");
    }



    // update (dt) {},
});
