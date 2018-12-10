var SoundManager = cc.Class({
    instance: null,
    audios: null,

    // ctor() {
    //     this.SoundMana = new SoundManager(this);
    // },


    // getInstance() {
    //     if (this.instance == null)
    //         this.instance = new SoundManager;
    //     return this.instance;
    // },

    loadSoundEffect(index, loop) {
        let self = this;
        if (this.audios == null) {
            cc.loader.loadResDir("sound", cc.AudioClip, function (err, audioClips) {
                if (err !== null) {
                    console.log(err);
                    return;
                }
                else
                    console.log("loadSoundFile success");
                self.audios = audioClips
                self.playSoundEffect(index, loop);
            })
        } else {
            this.playSoundEffect(index, loop);
        }


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
