var SoundManager = require('SoundManager')
var conf = require('initConf')
var GlobalManager = require('GlobalManager')
cc.Class({
    extends: cc.Component,

    properties: {
        collision: cc.BoxCollider,
        boom: cc.ParticleSystem,
        sp_enemy: cc.Sprite,
        nodeCollider: cc.Node,

        pauseFlag: true,
        enemyType: null,
        areaNum: null,

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
        let reFreshX = 667 * Math.random();
        let reFreshY = 750 * Math.random();
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

        let enemyType = type - 1//sprite
        let SpriteEnemy = GlobalManager.getInstance.enemySprite[enemyType];
        this.sp_enemy.spriteFrame = SpriteEnemy;

        let enemy = conf.enemyConfig[type]//enemy value
        this.areaNum = randomAreaNum;
        this.enemyBlood = enemy.blood;
        this.enemySpeed = enemy.speed;

        let fadeIn = cc.fadeIn(0.5);//show
        this.node.runAction(fadeIn);

        this.gamePlay = gamePlay;
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
                    let fadeOut = cc.fadeOut(0.5);
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
                break;
            }
        }

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

            var charactor = this.gamePlay.nodePlayer;
            var charactorPos = charactor.getPosition();
            var turnWorldPos = charactor.parent.convertToWorldSpaceAR(charactorPos);
            var turnPos = this.node.parent.convertToNodeSpaceAR(turnWorldPos);
            var movePos = turnPos.sub(this.node.getPosition());
            var handlePos = movePos.normalize();

            this.node.x += handlePos.x * this.enemyspeed;
            this.node.y += handlePos.y * this.enemyspeed;

        }
    },

    enemyMove() {

    },
});
