var GlobalManager = cc.Class({

    properties: {
        dataManager: null,

        loadSpr: 0,
        loadAni: 0,

        enemySprite: [cc.Sprite],
        enemyAni: [cc.AnimationClip],

    },

    ctor(dataManager) {
        this.dataManager = dataManager;
    },

    constructInit(dataManager) {
        this.dataManager = dataManager;
    },

    loadSprite() {
        let self = this
        cc.loader.loadResDir("enemy", cc.SpriteFrame, function (err, Sprites) {
            if (err !== null) {
                console.log(err);
                return;
            }



            self.enemySprite = Sprites;
            self.loadSpr = 1;
            console.log("load SpriteFrame success");
            if (self.loadSpr == 1 && self.loadAni == 1)
                cc.director.loadScene("MainScenes");

        })
    },

    loadAnimation() {
        let self = this;
        cc.loader.loadResDir("enemy", cc.AnimationClip, function (err, AniClips) {
            if (err !== null) {
                console.log(err);
                return;
            }

            self.enemyAni = AniClips;
            self.loadAni = 1;
            console.log("load AnimationClips success");
            if (self.loadSpr == 1 && self.loadAni == 1)
                cc.director.loadScene("MainScenes");

        })
    },


});


module.exports = GlobalManager;