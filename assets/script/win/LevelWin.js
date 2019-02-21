var gData = require("./manager/InitData")
var conf = require('initConf')
cc.Class({
    extends: cc.Component,

    properties: {
        playerName: cc.Label,
        playerLevel: cc.Label,
        playerDamage: cc.Label,
        playerSpeed: cc.Label,
        playerFireSpeed: cc.Label,
        playerbestScore: cc.Label,
        playerCoin: cc.Label,
        nextLevelCost: cc.Label,
        blackBg: cc.Button,

        btn_sound: {
            type: cc.AudioClip,
            default: null,
        },
    },

    init(winManager) {
        this.winManager = winManager;
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.playerName.string = gData.DataManager.playerInfo.player_name;
        this.playerLevel.string = gData.DataManager.playerInfo.player_level;

    },

    onEnable() {
        this.blackBg.interactable = false;

        let level = gData.DataManager.playerInfo.player_level;
        this.playerDamage.string = conf.levelConfig[level].damage;
        this.playerSpeed.string = conf.levelConfig[level].speed;
        this.playerFireSpeed.string = 10 - conf.levelConfig[level].fireSpeed * 10;
        this.playerbestScore.string = gData.DataManager.playerInfo.player_scoreTotal;
        this.playerCoin.string = gData.DataManager.playerInfo.player_coin;
        this.nextLevelCost.string = conf.levelConfig[level].cost;

        this.scheduleOnce(callBack => {
            this.blackBg.interactable = true;
        }, 0.5)
    },

    start() {

    },

    levelUp() {
        cc.audioEngine.play(this.btn_sound, false)

        let level = gData.DataManager.playerInfo.player_level;
        let coin = gData.DataManager.playerInfo.player_coin;
        let cost = conf.levelConfig[level].cost;
        let playerInfo = gData.DataManager.handlePlayerInfo();
        let playerID = gData.DataManager.playerInfo.player_id;

        if (coin >= cost) {
            let data = playerInfo + "#" + playerID + "@" + level + "#" + gData.DataManager.token;
            gData.DataManager.httpCorl.HttpPost('/buyItem', JSON.stringify(data), this.buyItemBack);
            return;
        }

        gData.UIManager.tipsFly("not enough coin");
    },

    buyItemBack(interFaceHandle, status, responseText) {
        console.log(responseText);
        if (responseText != 'error occur') {
            let level = gData.DataManager.playerInfo.player_level;
            gData.DataManager.playerInfo.player_coin -= conf.levelConfig[level].cost;
            let newLevel = gData.DataManager.playerInfo.player_level += 1;
            let levelWin = cc.find("Canvas/Main Camera/bg/LevelWin").getComponent('LevelWin');
            levelWin.playerCoin.string = gData.DataManager.playerInfo.player_coin;
            levelWin.playerLevel.string = gData.DataManager.playerInfo.player_level;
            levelWin.playerDamage.string = conf.levelConfig[newLevel].damage;
            levelWin.playerSpeed.string = conf.levelConfig[newLevel].speed;
            levelWin.playerFireSpeed.string = 10 - conf.levelConfig[newLevel].fireSpeed * 10;
            levelWin.nextLevelCost.string = conf.levelConfig[newLevel].cost;
            gData.UIManager.tipsFly(responseText);
        }
    },

    closeWin() {
        this.winManager.closeWin("LevelWin");
    },

    // update (dt) {},
});
