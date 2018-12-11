var SoundManager = require('SoundManager')
var GlobalManager = require('GlobalManager')
cc.Class({
    extends: cc.Component,

    properties: {

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
        SoundManager.loadSoundEffect("button", false);
        cc.director.loadScene("MainScenes");
    }

    // update (dt) {},
});
