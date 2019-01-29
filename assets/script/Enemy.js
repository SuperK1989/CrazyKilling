var SoundManager = require('./manager/SoundManager')
var conf = require('initConf')
var GlobalManager = require('./manager/GlobalManager')
var gData = require("./manager/InitData")
cc.Class({
    extends: cc.Component,

    properties: {
        collision: cc.BoxCollider,
        boom: cc.ParticleSystem,
        sp_enemy: cc.Sprite,
        nodeCollider: cc.Node,
        aniEnemy: cc.Animation,
        aniCoin: cc.Animation,

        pauseFlag: true,
        enemyType: null,
        areaNum: null,

        coinChance: 0.5,

        visibalW: 0,
        visibalH: 0,

        enemyBlood: 10,
        enemyspeed: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.opacity = 0;
        this.collision.enabled = true;
        this.boom.resetSystem();
        let reFreshX = 333 * Math.random();
        let reFreshY = 350 * Math.random();
        let randomPosition = cc.v2(reFreshX, reFreshY)
        this.node.setPosition(randomPosition);
    },

    onEnable: function () {
        cc.director.getCollisionManager().enabled = true;
    },

    onDestroy() {
        cc.director.getCollisionManager().enabled = false;
    },

    start() {

    },

    init(gamePlay, type, randomAreaNum) {

        let enemyType = type.toString();//sprite
        let sprites = gData.DataManager.GlobalManager.enemySprite;
        let anis = gData.DataManager.GlobalManager.enemyAni;

        for (let i = 0; i < sprites.length; i++) {//Sprite
            if (sprites[i].name == enemyType) {
                var spriteEnemy = sprites[i];
                break;
            }
        }

        for (let i = 0; i < anis.length; i++) {//animetion
            if (anis[i].name == enemyType) {
                var aniEnemy = anis[i];
                break;
            }
        }

        if (aniEnemy) {

            this.aniEnemy.addClip(aniEnemy);
            this.aniEnemy.play(enemyType);
        }
        else
            this.sp_enemy = spriteEnemy;


        if (type == 2)
            this.node.scale = 0.5;


        let enemy = conf.enemyConfig[type]//enemy value
        this.areaNum = randomAreaNum;
        this.enemyBlood = enemy.blood;
        this.enemySpeed = enemy.speed;

        let fadeIn = cc.fadeIn(0.5);//show
        this.node.runAction(fadeIn);

        this.gamePlay = gamePlay;
        this.enemyType = type;
        this.toChraPos = this.moveToChractor();
        if (this.toChraPos.x < 0)
            this.node.scaleX = -this.node.scaleX;
        this.visibalW = gamePlay.visibalW;
        this.visibalH = gamePlay.visibalH;


    },

    onCollisionEnter: function (selfCollider, otherCollider) {
        switch (selfCollider.node.name) {
            case "bullet": {
                this.enemyBlood -= 10;
                if (this.enemyBlood <= 0) {
                    this.boom.node.active = true;
                    SoundManager.playSoundEffect("boom1", false);
                    this.node.stopAllActions();
                    this.collision.enabled = false;
                    let fadeOut = cc.fadeOut(1);


                    let randomTemp = Math.random();
                    if (randomTemp < this.coinChance) {
                        this.aniCoin.play("coin");//获得coin
                        this.gamePlay.playerCoin.string = parseInt(this.gamePlay.playerCoin.string) + 10;
                    }

                    this.node.runAction(fadeOut);
                    this.scheduleOnce(callBack => {
                        this.putEnemyBackToPool(this.node)
                        this.node.active = false;
                    }, 1)
                }
                break;
            }

            case "sp_player": {
                let custom = { target: { name: "btn_pause" } }
                this.gamePlay.gamePause(custom);
                this.gamePlay.nodeGameOver.active = true;
                this.gamePlay.gameOverScore.string = this.gamePlay.playerScore.string;
                this.gamePlay.getComponent("Gameplay").unschedule(this.gamePlay.refreshEnemy);

                let playerScore = this.gamePlay.playerScore.string;
                let playerGainCoin = this.gamePlay.playerCoin.string;

                playerScore = parseInt(playerScore);
                playerGainCoin = parseInt(playerGainCoin);

                gData.DataManager.playerInfo.player_coin = playerGainCoin;
                gData.DataManager.playerInfo.player_totalScore = playerScore > gData.DataManager.playerInfo.player_totalScore ? playerScore : gData.DataManager.playerInfo.player_totalScore;

                let playerID = gData.DataManager.playerInfo.player_id;
                let playerInfo = gData.DataManager.handlePlayerInfo();

                let data = playerInfo + "#" + playerID + "@" + "player_coin=" + playerGainCoin + "&" + "player_scoreTotal=" + playerScore + "#" + gData.DataManager.token;

                gData.DataManager.httpCorl.HttpPost('/updateInfo', JSON.stringify(data), this.updateInfo);
                break;
            }
        }

    },

    updateInfo() {
        console.log("update success");
    },

    putEnemyBackToPool(enemy) {
        this.gamePlay.putEnemyToPool(enemy);
        enemy.removeFromParent();
    },

    update(dt) {
        if (this.pauseFlag) {
            let enemyPos = this.node.position;
            enemyPos = this.node.parent.convertToWorldSpaceAR(enemyPos)
            if (enemyPos.y > 2 * this.visibalH || enemyPos.y < 0) {
                this.sp_enemy.enabled = false;
            } else if (enemyPos.x > 2 * this.visibalW || enemyPos.x < 0)
                this.sp_enemy.enabled = false;
            else
                this.sp_enemy.enabled = true;

            this.enemyMove(this.enemyType);

            if (enemyPos.y > 1500 || enemyPos.y < -750) {
                this.putEnemyBackToPool(this.node)
                this.node.active = false;
            } else if (enemyPos.x > 2001 || enemyPos.x < -667) {
                this.putEnemyBackToPool(this.node)
                this.node.active = false;
            }

        }
    },

    enemyMove(type) {
        switch (type) {
            case 1: {
                let handlePos = this.moveToChractor();
                this.node.x += handlePos.x * this.enemyspeed;
                this.node.y += handlePos.y * this.enemyspeed;
                break;
            }

            case 2: {
                this.node.x += this.toChraPos.x * this.enemyspeed;
                this.node.y += this.toChraPos.y * this.enemyspeed;
                break;
            }
        }
    },

    moveToChractor() {
        var charactor = this.gamePlay.nodePlayer;
        var charactorPos = charactor.getPosition();
        var turnWorldPos = charactor.parent.convertToWorldSpaceAR(charactorPos);
        var turnPos = this.node.parent.convertToNodeSpaceAR(turnWorldPos);
        var movePos = turnPos.sub(this.node.getPosition());
        var handlePos = movePos.normalize();
        return handlePos;
    }
});
