var SoundManager = cc.Class({
    instance: null,
    audios: null,

    getInstance() {
        if (this.instance == null)
            this.instance = new SoundManager;
        return this.instance;
    },

    loadSoundEffect() {
        let self = this;
        cc.loader.loadResDir("sound", cc.AudioClip, function (err, audioClips) {
            self.audios = audioClips
            if (err !== null)
                return;
            else
                console.log("loadSoundFile success");
        });


    },

    playSoundEffect(index, loop) {
        if (this.audios == null)
            return;
        for (let i = 0; i < this.audios.length; i++) {
            if (this.audios[i].name == index) {
                cc.audioEngine.playEffect(this.audios[i], loop)
            }
        }
    }

});



module.exports = new SoundManager
