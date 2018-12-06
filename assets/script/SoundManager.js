var SoundManager = cc.Class({
    instance: null,

    getInstance() {
        if (this.instance == null)
            this.instance = new SoundManager;
        return this.instance;
    },

    loadSoundEffect() {
        cc.loader.loadRes("sound", CallBack => {
            console.log("loadSoundFile")
        })
    },

    playSoundEffect(index) {
        switch (index) {
            case "fire": {
                break;
            }
        }
    }

});



module.exports = SoundManager.getInstance;
