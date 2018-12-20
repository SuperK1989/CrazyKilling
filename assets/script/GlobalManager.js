var GlobalManager = cc.Class({
    properties: {
        getInstance: null,

        enemySprite: [cc.Sprite],

    },

    loadSpite() {
        let self = this
        cc.loader.loadResDir("enemy", cc.SpriteFrame, function (err, Sprites) {
            if (err !== null) {
                console.log(err);
                return;
            }

            self.enemySprite = Sprites;
            console.log("load SpriteFrame success");
            cc.director.loadScene("MainScenes");

        })
    },




});

GlobalManager.getInstance = new GlobalManager;
module.exports = GlobalManager;