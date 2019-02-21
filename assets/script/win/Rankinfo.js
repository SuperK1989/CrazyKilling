var conf = require('initConf')
cc.Class({
    extends: cc.Component,

    properties: {
        txt_titalName: cc.Label,
        txt_name: cc.Label,
        txt_level: cc.Label,
        txt_score: cc.Label,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    init(data) {
        console.log(data);
        this.txt_titalName.string = conf.levelConfig[data.player_level].levelStatue;
        this.txt_name.string = data.player_name;
        this.txt_level.string = data.player_level;
        this.txt_score.string = data.player_scoreTotal;
    },

    start() {

    },







    // update (dt) {},
});
