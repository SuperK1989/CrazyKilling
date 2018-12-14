var SoundManager = require('SoundManager')
var GlobalManager = require('GlobalManager')
cc.Class({
    extends: cc.Component,

    properties: {
        btn_sound: {
            type: cc.AudioClip,
            default: null,
        }
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
        cc.director.loadScene("MainScenes");
    }

    // update (dt) {},
});
