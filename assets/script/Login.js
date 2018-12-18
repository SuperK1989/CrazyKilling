var SoundManager = require('SoundManager')
var GlobalManager = require('GlobalManager')
cc.Class({
    extends: cc.Component,

    properties: {
        btn_sound: {
            type: cc.AudioClip,
            default: null,
        },

        node_loading: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.preloadScene("MainScenes", function () {
            cc.log("Next scene preloaded");
        });

        SoundManager.loadSoundEffect("bgm1", true);

    },

    start() {

    },

    gameBegin() {
        cc.audioEngine.play(this.btn_sound, false)
        GlobalManager.getInstance.loadSpite();
        this.node_loading.active = true;


    }

    // update (dt) {},
});
